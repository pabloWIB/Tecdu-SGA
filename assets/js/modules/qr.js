/**
 * Generador de códigos QR.
 *
 * Implementación propia de ISO/IEC 18004 en modo byte con corrección de
 * errores nivel M, versiones 1 a 10 (hasta 213 bytes de carga útil).
 * No depende de ninguna librería externa.
 */
(function (root) {
  "use strict";

  var MODE_BYTE = 4;
  var MODE_ECI = 7;
  var ECI_UTF8 = 26;
  var PAD_BYTES = [0xec, 0x11];

  /* Estructura de bloques por versión, nivel de corrección M.
     [codewords de corrección por bloque, bloques g1, datos g1, bloques g2, datos g2] */
  var EC_BLOCKS = {
    1: [10, 1, 16, 0, 0],
    2: [16, 1, 28, 0, 0],
    3: [26, 1, 44, 0, 0],
    4: [18, 2, 32, 0, 0],
    5: [24, 2, 43, 0, 0],
    6: [16, 4, 27, 0, 0],
    7: [18, 4, 31, 0, 0],
    8: [22, 2, 38, 2, 39],
    9: [22, 3, 36, 2, 37],
    10: [26, 4, 43, 1, 44]
  };

  /* Coordenadas centrales de los patrones de alineación. */
  var ALIGNMENT = {
    1: [],
    2: [6, 18],
    3: [6, 22],
    4: [6, 26],
    5: [6, 30],
    6: [6, 34],
    7: [6, 22, 38],
    8: [6, 24, 42],
    9: [6, 26, 46],
    10: [6, 28, 50]
  };

  var MAX_VERSION = 10;

  /* ---------- Aritmética en GF(256), polinomio primitivo 0x11d ---------- */

  var EXP = new Uint8Array(512);
  var LOG = new Uint8Array(256);

  (function buildTables() {
    var x = 1;
    var i;
    for (i = 0; i < 255; i++) {
      EXP[i] = x;
      LOG[x] = i;
      x <<= 1;
      if (x & 0x100) {
        x ^= 0x11d;
      }
    }
    for (i = 255; i < 512; i++) {
      EXP[i] = EXP[i - 255];
    }
  })();

  function gfMul(a, b) {
    if (a === 0 || b === 0) {
      return 0;
    }
    return EXP[LOG[a] + LOG[b]];
  }

  /* Polinomio generador de grado `degree`, coeficientes de mayor a menor. */
  function generatorPoly(degree) {
    var poly = [1];
    for (var d = 0; d < degree; d++) {
      var next = new Array(poly.length + 1);
      for (var k = 0; k < next.length; k++) {
        next[k] = 0;
      }
      for (var i = 0; i < poly.length; i++) {
        next[i] ^= poly[i];
        next[i + 1] ^= gfMul(poly[i], EXP[d]);
      }
      poly = next;
    }
    return poly;
  }

  /* Resto de la división del mensaje por el polinomio generador. */
  function errorCorrection(data, ecLength) {
    var gen = generatorPoly(ecLength);
    var rem = new Array(ecLength);
    var i;
    var j;
    for (i = 0; i < ecLength; i++) {
      rem[i] = 0;
    }
    for (i = 0; i < data.length; i++) {
      var factor = data[i] ^ rem[0];
      rem.shift();
      rem.push(0);
      for (j = 0; j < ecLength; j++) {
        rem[j] ^= gfMul(gen[j + 1], factor);
      }
    }
    return rem;
  }

  /* ---------- Codificación de datos ---------- */

  function toUtf8Bytes(text) {
    var bytes = [];
    for (var i = 0; i < text.length; i++) {
      var code = text.charCodeAt(i);
      if (code < 0x80) {
        bytes.push(code);
      } else if (code < 0x800) {
        bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
      } else if (code >= 0xd800 && code <= 0xdbff && i + 1 < text.length) {
        var pair = 0x10000 + ((code - 0xd800) << 10) + (text.charCodeAt(++i) - 0xdc00);
        bytes.push(
          0xf0 | (pair >> 18),
          0x80 | ((pair >> 12) & 0x3f),
          0x80 | ((pair >> 6) & 0x3f),
          0x80 | (pair & 0x3f)
        );
      } else {
        bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
      }
    }
    return bytes;
  }

  function dataCapacity(version) {
    var spec = EC_BLOCKS[version];
    return spec[1] * spec[2] + spec[3] * spec[4];
  }

  function charCountBits(version) {
    return version < 10 ? 8 : 16;
  }

  /* Los bytes no ASCII solo se interpretan como UTF-8 si el símbolo declara
     explícitamente el ECI 26; sin él, los lectores asumen ISO-8859-1. */
  function needsEci(bytes) {
    for (var i = 0; i < bytes.length; i++) {
      if (bytes[i] > 0x7f) {
        return true;
      }
    }
    return false;
  }

  function headerBits(version, eci) {
    return (eci ? 12 : 0) + 4 + charCountBits(version);
  }

  function pickVersion(byteLength, eci) {
    for (var v = 1; v <= MAX_VERSION; v++) {
      var available = dataCapacity(v) * 8 - headerBits(v, eci);
      if (byteLength * 8 <= available) {
        return v;
      }
    }
    return null;
  }

  function buildDataCodewords(bytes, version, eci) {
    var bits = [];

    function push(value, length) {
      for (var i = length - 1; i >= 0; i--) {
        bits.push((value >>> i) & 1);
      }
    }

    if (eci) {
      push(MODE_ECI, 4);
      push(ECI_UTF8, 8);
    }
    push(MODE_BYTE, 4);
    push(bytes.length, charCountBits(version));
    for (var i = 0; i < bytes.length; i++) {
      push(bytes[i], 8);
    }

    var capacityBits = dataCapacity(version) * 8;
    push(0, Math.min(4, capacityBits - bits.length));
    while (bits.length % 8 !== 0) {
      bits.push(0);
    }

    var codewords = [];
    for (i = 0; i < bits.length; i += 8) {
      var byte = 0;
      for (var b = 0; b < 8; b++) {
        byte = (byte << 1) | bits[i + b];
      }
      codewords.push(byte);
    }

    var pad = 0;
    while (codewords.length < dataCapacity(version)) {
      codewords.push(PAD_BYTES[pad++ % 2]);
    }
    return codewords;
  }

  /* Reparte los datos en bloques, añade corrección e intercala el resultado. */
  function interleave(codewords, version) {
    var spec = EC_BLOCKS[version];
    var ecLength = spec[0];
    var blocks = [];
    var offset = 0;
    var i;
    var b;

    function take(count, size) {
      for (var n = 0; n < count; n++) {
        blocks.push(codewords.slice(offset, offset + size));
        offset += size;
      }
    }

    take(spec[1], spec[2]);
    take(spec[3], spec[4]);

    var ecBlocks = blocks.map(function (block) {
      return errorCorrection(block, ecLength);
    });

    var result = [];
    var maxData = Math.max(spec[2], spec[4]);
    for (i = 0; i < maxData; i++) {
      for (b = 0; b < blocks.length; b++) {
        if (i < blocks[b].length) {
          result.push(blocks[b][i]);
        }
      }
    }
    for (i = 0; i < ecLength; i++) {
      for (b = 0; b < ecBlocks.length; b++) {
        result.push(ecBlocks[b][i]);
      }
    }
    return result;
  }

  /* ---------- Información de formato y versión ---------- */

  /* BCH(15,5) con generador 0x537, enmascarado con 0x5412. Nivel M = 0b00. */
  function formatBits(mask) {
    var data = (0x00 << 3) | mask;
    var rem = data;
    for (var i = 0; i < 10; i++) {
      rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    }
    return (((data << 10) | rem) ^ 0x5412) & 0x7fff;
  }

  /* BCH(18,6) con generador 0x1f25. Solo a partir de la versión 7. */
  function versionBits(version) {
    var rem = version;
    for (var i = 0; i < 12; i++) {
      rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    }
    return ((version << 12) | rem) & 0x3ffff;
  }

  /* ---------- Construcción de la matriz ---------- */

  function Matrix(version) {
    this.version = version;
    this.size = version * 4 + 17;
    this.modules = [];
    this.functional = [];
    for (var r = 0; r < this.size; r++) {
      var row = [];
      var flags = [];
      for (var c = 0; c < this.size; c++) {
        row.push(0);
        flags.push(false);
      }
      this.modules.push(row);
      this.functional.push(flags);
    }
  }

  Matrix.prototype.set = function (row, col, dark, isFunctional) {
    if (row < 0 || row >= this.size || col < 0 || col >= this.size) {
      return;
    }
    this.modules[row][col] = dark ? 1 : 0;
    if (isFunctional) {
      this.functional[row][col] = true;
    }
  };

  Matrix.prototype.drawFinder = function (row, col) {
    for (var r = -1; r <= 7; r++) {
      for (var c = -1; c <= 7; c++) {
        var distance = Math.max(Math.abs(r - 3), Math.abs(c - 3));
        this.set(row + r, col + c, distance <= 1 || distance === 3, true);
      }
    }
  };

  Matrix.prototype.drawAlignment = function (row, col) {
    for (var r = -2; r <= 2; r++) {
      for (var c = -2; c <= 2; c++) {
        var distance = Math.max(Math.abs(r), Math.abs(c));
        this.set(row + r, col + c, distance !== 1, true);
      }
    }
  };

  Matrix.prototype.drawFunctionPatterns = function () {
    var size = this.size;
    var i;
    var j;

    this.drawFinder(0, 0);
    this.drawFinder(0, size - 7);
    this.drawFinder(size - 7, 0);

    for (i = 8; i < size - 8; i++) {
      this.set(6, i, i % 2 === 0, true);
      this.set(i, 6, i % 2 === 0, true);
    }

    var centers = ALIGNMENT[this.version];
    for (i = 0; i < centers.length; i++) {
      for (j = 0; j < centers.length; j++) {
        var overlapsFinder =
          (i === 0 && j === 0) ||
          (i === 0 && j === centers.length - 1) ||
          (i === centers.length - 1 && j === 0);
        if (!overlapsFinder) {
          this.drawAlignment(centers[i], centers[j]);
        }
      }
    }

    /* Módulo oscuro fijo. */
    this.set(size - 8, 8, true, true);

    /* Reserva de las dos copias de la información de formato.
       El índice 6 se omite: pertenece a los patrones de sincronización. */
    for (i = 0; i <= 8; i++) {
      if (i !== 6) {
        this.set(8, i, false, true);
        this.set(i, 8, false, true);
      }
    }
    for (i = 0; i < 8; i++) {
      this.set(size - 1 - i, 8, false, true);
      this.set(8, size - 1 - i, false, true);
    }
    this.set(size - 8, 8, true, true);

    /* Reserva de la información de versión. */
    if (this.version >= 7) {
      for (i = 0; i < 18; i++) {
        var a = size - 11 + (i % 3);
        var b = Math.floor(i / 3);
        this.set(a, b, false, true);
        this.set(b, a, false, true);
      }
    }
  };

  Matrix.prototype.drawFormatInfo = function (mask) {
    var bits = formatBits(mask);
    var size = this.size;
    var i;

    /* Los 15 bits se colocan empezando por el más significativo. */
    function bit(index) {
      return ((bits >>> (14 - index)) & 1) === 1;
    }

    for (i = 0; i <= 5; i++) {
      this.set(8, i, bit(i), true);
    }
    this.set(8, 7, bit(6), true);
    this.set(8, 8, bit(7), true);
    this.set(7, 8, bit(8), true);
    for (i = 9; i < 15; i++) {
      this.set(14 - i, 8, bit(i), true);
    }

    /* Segunda copia: bits 0-6 bajo el localizador inferior izquierdo,
       bits 7-14 a la derecha de la fila 8. */
    for (i = 0; i < 7; i++) {
      this.set(size - 1 - i, 8, bit(i), true);
    }
    for (i = 7; i < 15; i++) {
      this.set(8, size - 15 + i, bit(i), true);
    }
    this.set(size - 8, 8, true, true);
  };

  Matrix.prototype.drawVersionInfo = function () {
    if (this.version < 7) {
      return;
    }
    var bits = versionBits(this.version);
    var size = this.size;
    for (var i = 0; i < 18; i++) {
      var dark = ((bits >>> i) & 1) === 1;
      var a = size - 11 + (i % 3);
      var b = Math.floor(i / 3);
      this.set(a, b, dark, true);
      this.set(b, a, dark, true);
    }
  };

  /* Recorrido en zigzag de derecha a izquierda, saltando la columna 6. */
  Matrix.prototype.placeData = function (codewords) {
    var size = this.size;
    var bitIndex = 0;
    var totalBits = codewords.length * 8;
    var upward = true;
    var col;
    var row;

    for (col = size - 1; col >= 1; col -= 2) {
      if (col === 6) {
        col = 5;
      }
      for (var step = 0; step < size; step++) {
        row = upward ? size - 1 - step : step;
        for (var c = 0; c < 2; c++) {
          var current = col - c;
          if (this.functional[row][current]) {
            continue;
          }
          var dark = false;
          if (bitIndex < totalBits) {
            dark = ((codewords[bitIndex >>> 3] >>> (7 - (bitIndex & 7))) & 1) === 1;
            bitIndex++;
          }
          this.modules[row][current] = dark ? 1 : 0;
        }
      }
      upward = !upward;
    }
  };

  function maskCondition(mask, row, col) {
    switch (mask) {
      case 0:
        return (row + col) % 2 === 0;
      case 1:
        return row % 2 === 0;
      case 2:
        return col % 3 === 0;
      case 3:
        return (row + col) % 3 === 0;
      case 4:
        return (Math.floor(row / 2) + Math.floor(col / 3)) % 2 === 0;
      case 5:
        return ((row * col) % 2) + ((row * col) % 3) === 0;
      case 6:
        return (((row * col) % 2) + ((row * col) % 3)) % 2 === 0;
      default:
        return (((row + col) % 2) + ((row * col) % 3)) % 2 === 0;
    }
  }

  Matrix.prototype.applyMask = function (mask) {
    for (var row = 0; row < this.size; row++) {
      for (var col = 0; col < this.size; col++) {
        if (!this.functional[row][col] && maskCondition(mask, row, col)) {
          this.modules[row][col] ^= 1;
        }
      }
    }
  };

  var FINDER_RUN = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];

  function matchesFinderRun(line, start) {
    for (var i = 0; i < FINDER_RUN.length; i++) {
      if (line[start + i] !== FINDER_RUN[i]) {
        return false;
      }
    }
    return true;
  }

  function matchesFinderRunReversed(line, start) {
    for (var i = 0; i < FINDER_RUN.length; i++) {
      if (line[start + i] !== FINDER_RUN[FINDER_RUN.length - 1 - i]) {
        return false;
      }
    }
    return true;
  }

  Matrix.prototype.penalty = function () {
    var size = this.size;
    var score = 0;
    var dark = 0;
    var row;
    var col;
    var i;

    function scoreLine(line) {
      var total = 0;
      var runLength = 1;
      for (var k = 1; k < line.length; k++) {
        if (line[k] === line[k - 1]) {
          runLength++;
        } else {
          if (runLength >= 5) {
            total += 3 + (runLength - 5);
          }
          runLength = 1;
        }
      }
      if (runLength >= 5) {
        total += 3 + (runLength - 5);
      }
      for (k = 0; k + FINDER_RUN.length <= line.length; k++) {
        if (matchesFinderRun(line, k) || matchesFinderRunReversed(line, k)) {
          total += 40;
        }
      }
      return total;
    }

    for (row = 0; row < size; row++) {
      score += scoreLine(this.modules[row]);
    }
    for (col = 0; col < size; col++) {
      var column = [];
      for (row = 0; row < size; row++) {
        column.push(this.modules[row][col]);
      }
      score += scoreLine(column);
    }

    for (row = 0; row < size - 1; row++) {
      for (col = 0; col < size - 1; col++) {
        var value = this.modules[row][col];
        if (
          value === this.modules[row][col + 1] &&
          value === this.modules[row + 1][col] &&
          value === this.modules[row + 1][col + 1]
        ) {
          score += 3;
        }
      }
    }

    for (row = 0; row < size; row++) {
      for (col = 0; col < size; col++) {
        dark += this.modules[row][col];
      }
    }
    var percent = (dark * 100) / (size * size);
    score += Math.floor(Math.abs(percent - 50) / 5) * 10;

    return score;
  };

  /* ---------- API pública ---------- */

  /**
   * Codifica un texto y devuelve la matriz de módulos.
   * @param {string} text
   * @returns {{version:number, size:number, modules:number[][]}}
   */
  function encode(text) {
    if (typeof text !== "string" || text.length === 0) {
      throw new Error("El contenido del código QR no puede estar vacío.");
    }

    var bytes = toUtf8Bytes(text);
    var eci = needsEci(bytes);
    var version = pickVersion(bytes.length, eci);
    if (version === null) {
      throw new Error(
        "El contenido supera los " + dataCapacity(MAX_VERSION) + " bytes admitidos."
      );
    }

    var codewords = interleave(buildDataCodewords(bytes, version, eci), version);

    var matrix = new Matrix(version);
    matrix.drawFunctionPatterns();
    matrix.drawVersionInfo();
    matrix.placeData(codewords);

    var bestMask = 0;
    var bestScore = Infinity;
    for (var mask = 0; mask < 8; mask++) {
      matrix.applyMask(mask);
      matrix.drawFormatInfo(mask);
      var score = matrix.penalty();
      if (score < bestScore) {
        bestScore = score;
        bestMask = mask;
      }
      matrix.applyMask(mask);
    }

    matrix.applyMask(bestMask);
    matrix.drawFormatInfo(bestMask);

    return {
      version: matrix.version,
      size: matrix.size,
      mask: bestMask,
      modules: matrix.modules
    };
  }

  /**
   * Dibuja el código en un canvas, ajustado a la densidad de pantalla.
   * @param {HTMLCanvasElement} canvas
   * @param {string} text
   * @param {{size?:number, margin?:number, dark?:string, light?:string}} [options]
   */
  function render(canvas, text, options) {
    var settings = options || {};
    var code = encode(text);
    var margin = settings.margin === undefined ? 4 : settings.margin;
    var cssSize = settings.size || 200;
    var ratio = root.devicePixelRatio || 1;
    var total = code.size + margin * 2;
    var scale = Math.max(1, Math.floor((cssSize * ratio) / total));
    var pixels = total * scale;

    canvas.width = pixels;
    canvas.height = pixels;
    canvas.style.width = cssSize + "px";
    canvas.style.height = cssSize + "px";

    var context = canvas.getContext("2d");
    context.fillStyle = settings.light || "#ffffff";
    context.fillRect(0, 0, pixels, pixels);
    context.fillStyle = settings.dark || "#000000";

    for (var row = 0; row < code.size; row++) {
      for (var col = 0; col < code.size; col++) {
        if (code.modules[row][col]) {
          context.fillRect((col + margin) * scale, (row + margin) * scale, scale, scale);
        }
      }
    }

    return code;
  }

  root.TecduQR = {
    encode: encode,
    render: render
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
