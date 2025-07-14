let isDarkTheme = false;
let mobileMenuOpen = false;

const header = document.getElementById('header');
const themeToggle = document.getElementById('themeToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');

const roleDropdown = document.getElementById('roleDropdown');
const periodDropdown = document.getElementById('periodDropdown');
const roleText = document.getElementById('roleText');
const roleIcon = document.getElementById('roleIcon');
const periodText = document.getElementById('periodText');

const mobileRoleDropdown = document.getElementById('mobileRoleDropdown');
const mobilePeriodDropdown = document.getElementById('mobilePeriodDropdown');
const mobileRoleIcon = document.getElementById('mobileRoleIcon');
const mobileRoleText = document.getElementById('mobileRoleText');
const mobilePeriodText = document.getElementById('mobilePeriodText');
const mobileRoleMenu = document.getElementById('mobileRoleMenu');
const mobilePeriodMenu = document.getElementById('mobilePeriodMenu');

const roleDropdownPhone = document.getElementById('roleDropdownPhone');
const periodDropdownPhone = document.getElementById('periodDropdownPhone');
const roleTextPhone = document.getElementById('roleTextPhone');
const roleIconPhone = document.getElementById('roleIconPhone');
const periodTextPhone = document.getElementById('periodTextPhone');

const qrCodeBtn = document.getElementById('qrCodeBtn');
const qrPopupOverlay = document.getElementById('qrPopupOverlay');
const qrPopupClose = document.getElementById('qrPopupClose');
const qrDownloadBtn = document.getElementById('qrDownloadBtn');
const qrShareBtn = document.getElementById('qrShareBtn');
const qrCodeImage = document.getElementById('qrCodeImage');
const qrPlaceholder = document.getElementById('qrPlaceholder');

const passwordBtn = document.getElementById('passwordBtn');
const mobilePasswordBtn = document.getElementById('mobilePasswordBtn');
const passwordPopupOverlay = document.getElementById('passwordPopupOverlay');
const passwordPopupClose = document.getElementById('passwordPopupClose');
const passwordCancelBtn = document.getElementById('passwordCancelBtn');
const passwordSaveBtn = document.getElementById('passwordSaveBtn');
const passwordChangeForm = document.getElementById('passwordChangeForm');
const currentPasswordInput = document.getElementById('currentPassword');
const newPasswordInput = document.getElementById('newPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');

document.addEventListener('DOMContentLoaded', function () {
    initializeEventListeners();
    initializeDropdowns();
    initializeMobileDropdowns();
    initializePhoneDropdowns();
    initializeQRPopup();
    initializePasswordPopup();
    loadUserPreferences();
});

function initializeEventListeners() {
    window.addEventListener('scroll', handleHeaderScroll);

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', openMobileMenu);
    }
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', function (e) {
            if (e.target === mobileOverlay) {
                closeMobileMenu();
            }
        });
    }

    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', function () {
            closeMobileMenu();
        });
    }

    window.addEventListener('resize', function () {
        if (window.innerWidth > 768 && mobileMenuOpen) {
            closeMobileMenu();
        }
    });
}

function initializeDropdowns() {
    if (roleDropdown) {
        const roleTrigger = roleDropdown.querySelector('.dropdown-trigger');
        const roleOptions = roleDropdown.querySelectorAll('.dropdown-option');

        if (roleTrigger) {
            roleTrigger.addEventListener('click', function (e) {
                e.stopPropagation();

                if (roleDropdown.classList.contains('active')) {
                    roleDropdown.classList.remove('active');
                    roleTrigger.classList.remove('active');
                } else {
                    closeAllDropdowns();
                    roleDropdown.classList.add('active');
                    roleTrigger.classList.add('active');
                }
            });
        }

        roleOptions.forEach(option => {
            option.addEventListener('click', function (e) {
                e.stopPropagation();

                roleOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');

                // Actualizar texto e icon
                const newRole = this.getAttribute('data-role');
                const newText = this.querySelector('span').textContent;
                const newIcon = this.querySelector('i').className;

                if (roleText) roleText.textContent = newText;
                if (roleIcon) roleIcon.className = newIcon + ' dropdown-icon';

                syncMobileRole(newRole, newText, newIcon);

                roleDropdown.classList.remove('active');
                if (roleTrigger) roleTrigger.classList.remove('active');

                updateUserEmail(newRole);
            });
        });
    }

    if (periodDropdown) {
        const periodTrigger = periodDropdown.querySelector('.dropdown-trigger');
        const periodOptions = periodDropdown.querySelectorAll('.dropdown-option');

        if (periodTrigger) {
            periodTrigger.addEventListener('click', function (e) {
                e.stopPropagation();

                if (periodDropdown.classList.contains('active')) {
                    periodDropdown.classList.remove('active');
                    periodTrigger.classList.remove('active');
                } else {
                    closeAllDropdowns();
                    periodDropdown.classList.add('active');
                    periodTrigger.classList.add('active');
                }
            });
        }

        periodOptions.forEach(option => {
            option.addEventListener('click', function (e) {
                e.stopPropagation();

                periodOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');

                const newPeriod = this.getAttribute('data-period');
                const newText = this.querySelector('span').textContent;

                if (periodText) periodText.textContent = newText;

                syncMobilePeriod(newPeriod, newText);

                periodDropdown.classList.remove('active');
                if (periodTrigger) periodTrigger.classList.remove('active');
            });
        });
    }
}

function initializeMobileDropdowns() {
    if (mobileRoleDropdown) {
        mobileRoleDropdown.addEventListener('click', function () {
            const wrapper = this.closest('.mobile-dropdown-wrapper');
            if (wrapper) {
                if (wrapper.classList.contains('active')) {
                    wrapper.classList.remove('active');
                } else {
                    closeMobileDropdowns();
                    wrapper.classList.add('active');
                }
            }
        });
    }

    if (mobileRoleMenu) {
        const mobileRoleOptions = mobileRoleMenu.querySelectorAll('.mobile-dropdown-option');
        mobileRoleOptions.forEach(option => {
            option.addEventListener('click', function (e) {
                e.stopPropagation();

                mobileRoleOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                const newRole = this.getAttribute('data-role');
                const newText = this.querySelector('span').textContent;
                const newIcon = this.querySelector('i').className;

                if (mobileRoleText) mobileRoleText.textContent = newText;
                if (mobileRoleIcon) mobileRoleIcon.className = newIcon;

                syncDesktopRole(newRole, newText, newIcon);

                const wrapper = this.closest('.mobile-dropdown-wrapper');
                if (wrapper) wrapper.classList.remove('active');

                updateUserEmail(newRole);
            });
        });
    }

    if (mobilePeriodDropdown) {
        mobilePeriodDropdown.addEventListener('click', function () {
            const wrapper = this.closest('.mobile-dropdown-wrapper');
            if (wrapper) {
                if (wrapper.classList.contains('active')) {
                    wrapper.classList.remove('active');
                } else {
                    closeMobileDropdowns();
                    wrapper.classList.add('active');
                }
            }
        });
    }

    if (mobilePeriodMenu) {
        const mobilePeriodOptions = mobilePeriodMenu.querySelectorAll('.mobile-dropdown-option');
        mobilePeriodOptions.forEach(option => {
            option.addEventListener('click', function (e) {
                e.stopPropagation();

                mobilePeriodOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');

                const newPeriod = this.getAttribute('data-period');
                const newText = this.querySelector('span').textContent;

                if (mobilePeriodText) mobilePeriodText.textContent = newText;

                syncDesktopPeriod(newPeriod, newText);

                const wrapper = this.closest('.mobile-dropdown-wrapper');
                if (wrapper) wrapper.classList.remove('active');
            });
        });
    }

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.mobile-dropdown-wrapper') &&
            !e.target.closest('.dropdown-wrapper') &&
            !e.target.closest('.dropdown-wrapper-phone')) {
            closeMobileDropdowns();
            closeAllDropdowns();
            closeAllPhoneDropdowns();
        }
    });
}

// Inicializar dropdowns de teléfono (left section)
function initializePhoneDropdowns() {
    // Role dropdown phone
    if (roleDropdownPhone) {
        const roleTriggerPhone = roleDropdownPhone.querySelector('.dropdown-trigger');
        const roleOptionsPhone = roleDropdownPhone.querySelectorAll('.dropdown-option');

        if (roleTriggerPhone) {
            roleTriggerPhone.addEventListener('click', function (e) {
                e.stopPropagation();

                // Si ya está activo, cerrarlo
                if (roleDropdownPhone.classList.contains('active')) {
                    roleDropdownPhone.classList.remove('active');
                    roleTriggerPhone.classList.remove('active');
                } else {
                    // Cerrar otros dropdowns y abrir este
                    closeAllPhoneDropdowns();
                    roleDropdownPhone.classList.add('active');
                    roleTriggerPhone.classList.add('active');
                }
            });
        }

        roleOptionsPhone.forEach(option => {
            option.addEventListener('click', function (e) {
                e.stopPropagation();

                // Actualizar selección
                roleOptionsPhone.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');

                // Actualizar texto e icono
                const newRole = this.getAttribute('data-role');
                const newText = this.querySelector('span').textContent;
                const newIcon = this.querySelector('i').className;

                if (roleTextPhone) roleTextPhone.textContent = newText;
                if (roleIconPhone) roleIconPhone.className = newIcon + ' dropdown-icon';

                // Sincronizar con dropdowns del header
                syncHeaderRole(newRole, newText, newIcon);

                // Cerrar dropdown
                roleDropdownPhone.classList.remove('active');
                if (roleTriggerPhone) roleTriggerPhone.classList.remove('active');

                // Actualizar email según rol
                updateUserEmail(newRole);
            });
        });
    }

    // Period dropdown phone
    if (periodDropdownPhone) {
        const periodTriggerPhone = periodDropdownPhone.querySelector('.dropdown-trigger');
        const periodOptionsPhone = periodDropdownPhone.querySelectorAll('.dropdown-option');

        if (periodTriggerPhone) {
            periodTriggerPhone.addEventListener('click', function (e) {
                e.stopPropagation();

                // Si ya está activo, cerrarlo
                if (periodDropdownPhone.classList.contains('active')) {
                    periodDropdownPhone.classList.remove('active');
                    periodTriggerPhone.classList.remove('active');
                } else {
                    // Cerrar otros dropdowns y abrir este
                    closeAllPhoneDropdowns();
                    periodDropdownPhone.classList.add('active');
                    periodTriggerPhone.classList.add('active');
                }
            });
        }

        periodOptionsPhone.forEach(option => {
            option.addEventListener('click', function (e) {
                e.stopPropagation();

                // Actualizar selección
                periodOptionsPhone.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');

                // Actualizar texto
                const newPeriod = this.getAttribute('data-period');
                const newText = this.querySelector('span').textContent;

                if (periodTextPhone) periodTextPhone.textContent = newText;

                // Sincronizar con dropdowns del header
                syncHeaderPeriod(newPeriod, newText);

                // Cerrar dropdown
                periodDropdownPhone.classList.remove('active');
                if (periodTriggerPhone) periodTriggerPhone.classList.remove('active');
            });
        });
    }
}

// Sincronizar rol móvil con escritorio y phone
function syncMobileRole(role, text, iconClass) {
    // Sincronizar con móvil overlay
    if (mobileRoleText) mobileRoleText.textContent = text;
    if (mobileRoleIcon) mobileRoleIcon.className = iconClass;

    // Sincronizar con phone
    if (roleTextPhone) roleTextPhone.textContent = text;
    if (roleIconPhone) roleIconPhone.className = iconClass + ' dropdown-icon';

    // Actualizar selección en móvil overlay
    if (mobileRoleMenu) {
        const mobileOptions = mobileRoleMenu.querySelectorAll('.mobile-dropdown-option');
        mobileOptions.forEach(opt => {
            opt.classList.remove('selected');
            if (opt.getAttribute('data-role') === role) {
                opt.classList.add('selected');
            }
        });
    }

    // Actualizar selección en phone
    if (roleDropdownPhone) {
        const phoneOptions = roleDropdownPhone.querySelectorAll('.dropdown-option');
        phoneOptions.forEach(opt => {
            opt.classList.remove('selected');
            if (opt.getAttribute('data-role') === role) {
                opt.classList.add('selected');
            }
        });
    }
}

// Sincronizar período móvil con escritorio y phone
function syncMobilePeriod(period, text) {
    // Sincronizar con móvil overlay
    if (mobilePeriodText) mobilePeriodText.textContent = text;

    // Sincronizar con phone
    if (periodTextPhone) periodTextPhone.textContent = text;

    // Actualizar selección en móvil overlay
    if (mobilePeriodMenu) {
        const mobileOptions = mobilePeriodMenu.querySelectorAll('.mobile-dropdown-option');
        mobileOptions.forEach(opt => {
            opt.classList.remove('selected');
            if (opt.getAttribute('data-period') === period) {
                opt.classList.add('selected');
            }
        });
    }

    // Actualizar selección en phone
    if (periodDropdownPhone) {
        const phoneOptions = periodDropdownPhone.querySelectorAll('.dropdown-option');
        phoneOptions.forEach(opt => {
            opt.classList.remove('selected');
            if (opt.getAttribute('data-period') === period) {
                opt.classList.add('selected');
            }
        });
    }
}

// Sincronizar rol de escritorio con móvil y phone
function syncDesktopRole(role, text, iconClass) {
    if (roleText) roleText.textContent = text;
    if (roleIcon) roleIcon.className = iconClass + ' dropdown-icon';

    // Actualizar selección en escritorio
    if (roleDropdown) {
        const desktopOptions = roleDropdown.querySelectorAll('.dropdown-option');
        desktopOptions.forEach(opt => {
            opt.classList.remove('selected');
            if (opt.getAttribute('data-role') === role) {
                opt.classList.add('selected');
            }
        });
    }

    // Sincronizar con phone
    if (roleTextPhone) roleTextPhone.textContent = text;
    if (roleIconPhone) roleIconPhone.className = iconClass + ' dropdown-icon';

    // Actualizar selección en phone
    if (roleDropdownPhone) {
        const phoneOptions = roleDropdownPhone.querySelectorAll('.dropdown-option');
        phoneOptions.forEach(opt => {
            opt.classList.remove('selected');
            if (opt.getAttribute('data-role') === role) {
                opt.classList.add('selected');
            }
        });
    }
}

// Sincronizar período de escritorio con móvil y phone
function syncDesktopPeriod(period, text) {
    if (periodText) periodText.textContent = text;

    // Actualizar selección en escritorio
    if (periodDropdown) {
        const desktopOptions = periodDropdown.querySelectorAll('.dropdown-option');
        desktopOptions.forEach(opt => {
            opt.classList.remove('selected');
            if (opt.getAttribute('data-period') === period) {
                opt.classList.add('selected');
            }
        });
    }

    // Sincronizar con phone
    if (periodTextPhone) periodTextPhone.textContent = text;

    // Actualizar selección en phone
    if (periodDropdownPhone) {
        const phoneOptions = periodDropdownPhone.querySelectorAll('.dropdown-option');
        phoneOptions.forEach(opt => {
            opt.classList.remove('selected');
            if (opt.getAttribute('data-period') === period) {
                opt.classList.add('selected');
            }
        });
    }
}

// Sincronizar rol del phone con header
function syncHeaderRole(role, text, iconClass) {
    if (roleText) roleText.textContent = text;
    if (roleIcon) roleIcon.className = iconClass + ' dropdown-icon';

    // Actualizar selección en header
    if (roleDropdown) {
        const headerOptions = roleDropdown.querySelectorAll('.dropdown-option');
        headerOptions.forEach(opt => {
            opt.classList.remove('selected');
            if (opt.getAttribute('data-role') === role) {
                opt.classList.add('selected');
            }
        });
    }

    // Sincronizar también con móvil si existe
    if (mobileRoleText) mobileRoleText.textContent = text;
    if (mobileRoleIcon) mobileRoleIcon.className = iconClass;

    // Actualizar selección en móvil
    if (mobileRoleMenu) {
        const mobileOptions = mobileRoleMenu.querySelectorAll('.mobile-dropdown-option');
        mobileOptions.forEach(opt => {
            opt.classList.remove('selected');
            if (opt.getAttribute('data-role') === role) {
                opt.classList.add('selected');
            }
        });
    }
}

// Sincronizar período del phone con header
function syncHeaderPeriod(period, text) {
    if (periodText) periodText.textContent = text;

    // Actualizar selección en header
    if (periodDropdown) {
        const headerOptions = periodDropdown.querySelectorAll('.dropdown-option');
        headerOptions.forEach(opt => {
            opt.classList.remove('selected');
            if (opt.getAttribute('data-period') === period) {
                opt.classList.add('selected');
            }
        });
    }

    // Sincronizar también con móvil si existe
    if (mobilePeriodText) mobilePeriodText.textContent = text;

    // Actualizar selección en móvil
    if (mobilePeriodMenu) {
        const mobileOptions = mobilePeriodMenu.querySelectorAll('.mobile-dropdown-option');
        mobileOptions.forEach(opt => {
            opt.classList.remove('selected');
            if (opt.getAttribute('data-period') === period) {
                opt.classList.add('selected');
            }
        });
    }
}

// Cerrar todos los dropdowns de escritorio
function closeAllDropdowns() {
    if (roleDropdown) {
        roleDropdown.classList.remove('active');
        const roleTrigger = roleDropdown.querySelector('.dropdown-trigger');
        if (roleTrigger) roleTrigger.classList.remove('active');
    }
    if (periodDropdown) {
        periodDropdown.classList.remove('active');
        const periodTrigger = periodDropdown.querySelector('.dropdown-trigger');
        if (periodTrigger) periodTrigger.classList.remove('active');
    }
}

// Cerrar todos los dropdowns móviles (overlay)
function closeMobileDropdowns() {
    const mobileWrappers = document.querySelectorAll('.mobile-dropdown-wrapper');
    mobileWrappers.forEach(wrapper => {
        wrapper.classList.remove('active');
    });
}

// Cerrar todos los dropdowns del teléfono
function closeAllPhoneDropdowns() {
    if (roleDropdownPhone) {
        roleDropdownPhone.classList.remove('active');
        const roleTriggerPhone = roleDropdownPhone.querySelector('.dropdown-trigger');
        if (roleTriggerPhone) roleTriggerPhone.classList.remove('active');
    }
    if (periodDropdownPhone) {
        periodDropdownPhone.classList.remove('active');
        const periodTriggerPhone = periodDropdownPhone.querySelector('.dropdown-trigger');
        if (periodTriggerPhone) periodTriggerPhone.classList.remove('active');
    }
}

// Actualizar email del usuario según el rol
function updateUserEmail(role) {
    const institutionalEmail = document.getElementById('institutionalEmail');

    let email = '';
    switch (role) {
        case 'estudiante':
            email = 'estudiante@universidad.edu';
            break;
        case 'profesor':
            email = 'profesor@universidad.edu';
            break;
        case 'administrativo':
            email = 'admin@universidad.edu';
            break;
    }

    if (institutionalEmail) {
        institutionalEmail.textContent = email;
    }
}

// Header scroll effect
function handleHeaderScroll() {
    if (header) {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}

// Toggle theme
function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    const html = document.documentElement;

    if (isDarkTheme) {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        html.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }

    updateThemeIcons();

    // Animación del botón
    if (themeToggle) {
        themeToggle.style.transform = 'scale(0.9) rotate(180deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
    }
}

// Actualizar iconos del tema
function updateThemeIcons() {
    if (themeToggle) {
        const desktopIcon = themeToggle.querySelector('i');
        if (desktopIcon) {
            desktopIcon.className = isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    if (mobileThemeToggle) {
        const mobileThemeOption = mobileThemeToggle.querySelector('.mobile-option-subtitle');
        const mobileThemeIcon = mobileThemeToggle.querySelector('i:last-child');

        if (mobileThemeOption) {
            mobileThemeOption.textContent = isDarkTheme ? 'Oscuro' : 'Claro';
        }
        if (mobileThemeIcon) {
            mobileThemeIcon.className = isDarkTheme ? 'fas fa-toggle-on' : 'fas fa-toggle-off';
        }
    }
}

// Abrir menú móvil
function openMobileMenu() {
    mobileMenuOpen = true;
    if (mobileOverlay) {
        mobileOverlay.classList.add('active');
    }
    if (mobileMenuBtn) {
        mobileMenuBtn.classList.add('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-times';
        }
    }

    document.body.style.overflow = 'hidden';
    closeAllDropdowns();
}

// Cerrar menú móvil
function closeMobileMenu() {
    mobileMenuOpen = false;
    if (mobileOverlay) {
        mobileOverlay.classList.remove('active');
    }
    if (mobileMenuBtn) {
        mobileMenuBtn.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-bars';
        }
    }

    document.body.style.overflow = '';
}

// Cargar preferencias del usuario
function loadUserPreferences() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        isDarkTheme = false; // Set to false first so toggleTheme() will set it to true
        toggleTheme();
    }
}

// ====================================
// QR POPUP FUNCTIONS
// ====================================

// Inicializar QR popup
function initializeQRPopup() {
    // Abrir popup
    if (qrCodeBtn) {
        qrCodeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            openQRPopup();
        });
    }

    // Cerrar popup
    if (qrPopupClose) {
        qrPopupClose.addEventListener('click', closeQRPopup);
    }

    // Cerrar popup al hacer clic en el overlay
    if (qrPopupOverlay) {
        qrPopupOverlay.addEventListener('click', function (e) {
            if (e.target === qrPopupOverlay) {
                closeQRPopup();
            }
        });
    }

    // Botón descargar
    if (qrDownloadBtn) {
        qrDownloadBtn.addEventListener('click', downloadQRCode);
    }

    // Botón compartir
    if (qrShareBtn) {
        qrShareBtn.addEventListener('click', shareQRCode);
    }

    // Cerrar con tecla Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && qrPopupOverlay && qrPopupOverlay.classList.contains('active')) {
            closeQRPopup();
        }
    });
}

// Abrir QR popup
function openQRPopup() {
    if (qrPopupOverlay) {
        qrPopupOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Animación de entrada
        setTimeout(() => {
            const popup = qrPopupOverlay.querySelector('.qr-popup');
            if (popup) {
                popup.style.transform = 'scale(1) translateY(0)';
            }
        }, 10);
    }
}

// Cerrar QR popup
function closeQRPopup() {
    if (qrPopupOverlay) {
        qrPopupOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Descargar QR code
function downloadQRCode() {
    // Aquí puedes implementar la lógica de descarga
    // Por ahora solo mostramos un alert
    alert('Función de descarga - Aquí implementarás la descarga del QR');

    // Ejemplo de implementación cuando tengas la imagen:
    /*
    const link = document.createElement('a');
    link.download = 'qr-code-estudiante.png';
    link.href = qrCodeImage.src;
    link.click();
    */
}

// Compartir QR code
function shareQRCode() {
    // Verificar si el navegador soporta Web Share API
    if (navigator.share) {
        navigator.share({
            title: 'Mi Código QR de Estudiante',
            text: 'Código QR de identificación estudiantil',
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback - copiar al portapapeles o mostrar opciones
        alert('Función de compartir - Aquí implementarás las opciones de compartir');
    }
}

// Función para mostrar la imagen del QR cuando la tengas
function showQRImage(imageSrc) {
    if (qrCodeImage && qrPlaceholder) {
        qrCodeImage.src = imageSrc;
        qrCodeImage.style.display = 'block';
        qrPlaceholder.style.display = 'none';
    }
}

// ====================================
// PASSWORD POPUP FUNCTIONS
// ====================================

// Inicializar Password popup
function initializePasswordPopup() {
    // Abrir popup desde desktop
    if (passwordBtn) {
        passwordBtn.addEventListener('click', function (e) {
            e.preventDefault();
            openPasswordPopup();
        });
    }

    // Abrir popup desde mobile
    if (mobilePasswordBtn) {
        mobilePasswordBtn.addEventListener('click', function (e) {
            e.preventDefault();
            openPasswordPopup();
            closeMobileMenu(); // Cerrar el menú móvil
        });
    }

    // Cerrar popup
    if (passwordPopupClose) {
        passwordPopupClose.addEventListener('click', closePasswordPopup);
    }

    if (passwordCancelBtn) {
        passwordCancelBtn.addEventListener('click', closePasswordPopup);
    }

    // Cerrar popup al hacer clic en el overlay
    if (passwordPopupOverlay) {
        passwordPopupOverlay.addEventListener('click', function (e) {
            if (e.target === passwordPopupOverlay) {
                closePasswordPopup();
            }
        });
    }

    // Toggle password visibility
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            const icon = this.querySelector('i');

            if (targetInput.type === 'password') {
                targetInput.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                targetInput.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });

    // Password validation
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', validatePassword);
    }

    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', validateConfirmPassword);
    }

    // Form submission
    if (passwordChangeForm) {
        passwordChangeForm.addEventListener('submit', handlePasswordChange);
    }

    // Cerrar con tecla Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && passwordPopupOverlay && passwordPopupOverlay.classList.contains('active')) {
            closePasswordPopup();
        }
    });
}

// Abrir Password popup
function openPasswordPopup() {
    if (passwordPopupOverlay) {
        passwordPopupOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Limpiar formulario
        if (passwordChangeForm) {
            passwordChangeForm.reset();
        }
        clearPasswordErrors();
        resetPasswordValidation();

        // Focus en primer input
        setTimeout(() => {
            if (currentPasswordInput) {
                currentPasswordInput.focus();
            }
        }, 300);
    }
}

// Cerrar Password popup
function closePasswordPopup() {
    if (passwordPopupOverlay) {
        passwordPopupOverlay.classList.remove('active');
        document.body.style.overflow = '';

        // Limpiar formulario después de cerrar
        setTimeout(() => {
            if (passwordChangeForm) {
                passwordChangeForm.reset();
            }
            clearPasswordErrors();
            resetPasswordValidation();
        }, 300);
    }
}

// Validar nueva contraseña
function validatePassword() {
    const password = newPasswordInput.value;
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password)
    };

    // Actualizar indicadores visuales
    updateRequirement('req-length', requirements.length);
    updateRequirement('req-uppercase', requirements.uppercase);
    updateRequirement('req-lowercase', requirements.lowercase);
    updateRequirement('req-number', requirements.number);

    // Actualizar estilo del input
    const allValid = Object.values(requirements).every(req => req);
    if (password.length > 0) {
        newPasswordInput.className = `password-input ${allValid ? 'success' : 'error'}`;
    } else {
        newPasswordInput.className = 'password-input';
    }

    // Validar confirmación si ya hay texto
    if (confirmPasswordInput.value) {
        validateConfirmPassword();
    }

    return allValid;
}

// Validar confirmación de contraseña
function validateConfirmPassword() {
    const password = newPasswordInput.value;
    const confirm = confirmPasswordInput.value;
    const errorElement = document.getElementById('confirmPasswordError');

    if (confirm.length === 0) {
        confirmPasswordInput.className = 'password-input';
        errorElement.classList.remove('show');
        return false;
    }

    if (password === confirm) {
        confirmPasswordInput.className = 'password-input success';
        errorElement.classList.remove('show');
        return true;
    } else {
        confirmPasswordInput.className = 'password-input error';
        errorElement.textContent = 'Las contraseñas no coinciden';
        errorElement.classList.add('show');
        return false;
    }
}

// Actualizar requisito de contraseña
function updateRequirement(reqId, isValid) {
    const element = document.getElementById(reqId);
    if (element) {
        const icon = element.querySelector('i');
        if (isValid) {
            element.classList.add('valid');
            icon.className = 'fas fa-check';
        } else {
            element.classList.remove('valid');
            icon.className = 'fas fa-times';
        }
    }
}

// Limpiar errores
function clearPasswordErrors() {
    const errors = document.querySelectorAll('.password-error');
    errors.forEach(error => error.classList.remove('show'));

    const inputs = document.querySelectorAll('.password-input');
    inputs.forEach(input => {
        input.className = 'password-input';
    });
}

// Reset validación
function resetPasswordValidation() {
    const requirements = ['req-length', 'req-uppercase', 'req-lowercase', 'req-number'];
    requirements.forEach(reqId => {
        updateRequirement(reqId, false);
    });
}

// Manejar cambio de contraseña
function handlePasswordChange(e) {
    e.preventDefault();

    const currentPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validaciones
    if (!currentPassword) {
        showPasswordError('currentPasswordError', 'La contraseña actual es requerida');
        return;
    }

    if (!validatePassword()) {
        showPasswordError('newPasswordError', 'La nueva contraseña no cumple con los requisitos');
        return;
    }

    if (!validateConfirmPassword()) {
        return;
    }

    // Mostrar loading
    passwordSaveBtn.classList.add('loading');
    passwordSaveBtn.disabled = true;
    passwordSaveBtn.innerHTML = '<i class="fas fa-spinner"></i>Guardando...';

    // Simular llamada al servidor
    setTimeout(() => {
        // Aquí implementarías la lógica real de cambio de contraseña
        console.log('Cambiando contraseña...', {
            currentPassword,
            newPassword
        });

        // Simular éxito
        alert('¡Contraseña cambiada exitosamente!');
        closePasswordPopup();

        // Reset loading
        passwordSaveBtn.classList.remove('loading');
        passwordSaveBtn.disabled = false;
        passwordSaveBtn.innerHTML = '<i class="fas fa-save"></i>Guardar Cambios';
    }, 2000);
}

// Mostrar error de contraseña
function showPasswordError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

// Datos de módulos organizados por rol
const modulesData = {
    estudiante: {
        title: "Panel de Estudiante",
        subtitle: "Accede a tus materias, calificaciones y servicios estudiantiles",
        icon: "fas fa-user-graduate",
        priority: [
            {
                id: "mis-materias",
                title: "Mis Materias",
                description: "Notas y asistencia del período actual",
                icon: "fas fa-book-open"
            },
            {
                id: "mis-horarios",
                title: "Mis Horarios",
                description: "Horarios de clases programados",
                icon: "fas fa-calendar-alt"
            },
            {
                id: "record-academico",
                title: "Récord Académico",
                description: "Historial completo de notas",
                icon: "fas fa-chart-line"
            },
            {
                id: "mis-finanzas",
                title: "Mis Finanzas",
                description: "Pagos y facturas pendientes",
                icon: "fas fa-credit-card"
            }
        ],
        modules: [
            {
                id: "solicitudes-secretaria",
                title: "Solicitudes a Secretaría",
                description: "Realiza solicitudes generales a secretaría docente",
                icon: "fas fa-file-alt",
                category: "academico"
            },
            {
                id: "cursos-escuelas",
                title: "Cursos y Escuelas",
                description: "Registro en cursos y escuelas complementarias",
                icon: "fas fa-graduation-cap",
                category: "academico"
            },
            {
                id: "mi-malla",
                title: "Mi Malla Curricular",
                description: "Ver cumplimiento de malla curricular",
                icon: "fas fa-sitemap",
                category: "academico"
            },
            {
                id: "matriculacion",
                title: "Matriculación",
                description: "Proceso de matriculación online",
                icon: "fas fa-user-plus",
                category: "academico"
            },
            {
                id: "becas",
                title: "Becas",
                description: "Historial de becas y nuevas postulaciones",
                icon: "fas fa-award",
                category: "financiero"
            },
            {
                id: "evaluacion-profesores",
                title: "Evaluación de Profesores",
                description: "Evalúa el desempeño de tus docentes",
                icon: "fas fa-star",
                category: "evaluacion"
            },
            {
                id: "encuestas",
                title: "Encuestas",
                description: "Responder encuestas institucionales",
                icon: "fas fa-poll",
                category: "general"
            },
            {
                id: "votaciones",
                title: "Votaciones",
                description: "Participar en votaciones de autoridades",
                icon: "fas fa-vote-yea",
                category: "general"
            },
            {
                id: "actualizacion-datos",
                title: "Actualización de Datos",
                description: "Actualizar información personal",
                icon: "fas fa-user-edit",
                category: "general"
            }
        ]
    },
    profesor: {
        title: "Panel de Profesor",
        subtitle: "Gestiona tus clases, calificaciones y actividades académicas",
        icon: "fas fa-chalkboard-teacher",
        modules: [
            {
                id: "mis-clases",
                title: "Mis Clases",
                description: "Planificación de clases según horarios y materias",
                icon: "fas fa-chalkboard",
                category: "academico",
                priority: true
            },
            {
                id: "calificaciones",
                title: "Calificaciones",
                description: "Gestión de calificaciones de estudiantes",
                icon: "fas fa-clipboard-list",
                category: "academico",
                priority: true
            },
            {
                id: "mi-cronograma",
                title: "Mi Cronograma",
                description: "Cronograma detallado de materias",
                icon: "fas fa-calendar-week",
                category: "academico",
                priority: true
            },
            {
                id: "asistencias",
                title: "Asistencias",
                description: "Registro de asistencia a clases",
                icon: "fas fa-user-check",
                category: "academico"
            },
            {
                id: "mis-horarios-prof",
                title: "Mis Horarios",
                description: "Horarios de clases asignadas",
                icon: "fas fa-clock",
                category: "academico"
            },
            {
                id: "autoevaluacion",
                title: "Autoevaluación",
                description: "Proceso de autoevaluación docente",
                icon: "fas fa-user-circle",
                category: "evaluacion"
            },
            {
                id: "pares-directivos",
                title: "Evaluación de Pares",
                description: "Evaluación de pares y directivos",
                icon: "fas fa-users",
                category: "evaluacion"
            },
            {
                id: "convocatorias-vinculacion",
                title: "Convocatorias Vinculación",
                description: "Proyectos de vinculación con la sociedad",
                icon: "fas fa-handshake",
                category: "investigacion"
            },
            {
                id: "convocatorias-proyectos",
                title: "Convocatorias Investigación",
                description: "Proyectos de investigación disponibles",
                icon: "fas fa-flask",
                category: "investigacion"
            },
            {
                id: "titulos-experiencia",
                title: "Títulos y Experiencia",
                description: "Registro de títulos y experiencia laboral",
                icon: "fas fa-certificate",
                category: "personal"
            },
            {
                id: "encuestas-prof",
                title: "Encuestas",
                description: "Responder encuestas institucionales",
                icon: "fas fa-poll",
                category: "general"
            },
            {
                id: "votaciones-prof",
                title: "Votaciones",
                description: "Participar en votaciones de autoridades",
                icon: "fas fa-vote-yea",
                category: "general"
            },
            {
                id: "actualizacion-datos-prof",
                title: "Actualización de Datos",
                description: "Actualizar información personal",
                icon: "fas fa-user-edit",
                category: "general"
            }
        ]
    },
    administrativo: {
        title: "Panel Administrativo",
        subtitle: "Administra todos los aspectos del sistema académico",
        icon: "fas fa-user-tie",
        categories: [
            {
                id: "gestion-academica",
                title: "Gestión Académica",
                description: "Administración de aspectos académicos",
                icon: "fas fa-graduation-cap",
                modules: [
                    {
                        id: "mallas",
                        title: "Mallas Curriculares",
                        description: "Gestión de mallas curriculares",
                        icon: "fas fa-sitemap"
                    },
                    {
                        id: "asignaturas",
                        title: "Asignaturas",
                        description: "Configuración de asignaturas",
                        icon: "fas fa-book"
                    },
                    {
                        id: "configuracion-cursos",
                        title: "Configuración de Cursos",
                        description: "Configuración de cursos y escuelas",
                        icon: "fas fa-cog"
                    },
                    {
                        id: "horarios-clases",
                        title: "Horarios de Clases",
                        description: "Configuración de horarios de niveles",
                        icon: "fas fa-calendar-alt"
                    },
                    {
                        id: "niveles-academicos",
                        title: "Niveles Académicos",
                        description: "Gestión de niveles y materias",
                        icon: "fas fa-layer-group"
                    },
                    {
                        id: "registro-calificaciones",
                        title: "Registro de Calificaciones",
                        description: "Gestión del período de calificaciones",
                        icon: "fas fa-clipboard-list"
                    },
                    {
                        id: "periodos-academicos",
                        title: "Períodos Académicos",
                        description: "Administración de períodos lectivos",
                        icon: "fas fa-calendar-week"
                    },
                    {
                        id: "carreras-programas",
                        title: "Carreras y Programas",
                        description: "Gestión de oferta académica",
                        icon: "fas fa-university"
                    }
                ]
            },
            {
                id: "gestion-institucional",
                title: "Gestión Institucional",
                description: "Administración institucional y recursos humanos",
                icon: "fas fa-building",
                modules: [
                    {
                        id: "institucion",
                        title: "Institución",
                        description: "Datos generales de la institución",
                        icon: "fas fa-university"
                    },
                    {
                        id: "talento-humano",
                        title: "Talento Humano",
                        description: "Gestión de recursos humanos",
                        icon: "fas fa-users"
                    },
                    {
                        id: "crm",
                        title: "CRM",
                        description: "Customer Relationship Management",
                        icon: "fas fa-user-friends"
                    },
                    {
                        id: "matriculas",
                        title: "Matrículas",
                        description: "Gestión de matrículas de estudiantes",
                        icon: "fas fa-user-plus"
                    },
                    {
                        id: "inscripciones",
                        title: "Inscripciones",
                        description: "Registro de nuevos estudiantes",
                        icon: "fas fa-user-check"
                    },
                    {
                        id: "profesores-admin",
                        title: "Profesores",
                        description: "Registro y gestión de profesores",
                        icon: "fas fa-chalkboard-teacher"
                    },
                    {
                        id: "estadisticas",
                        title: "Estadísticas",
                        description: "Estadísticas administrativas y académicas",
                        icon: "fas fa-chart-bar"
                    },
                    {
                        id: "elecciones",
                        title: "Elecciones",
                        description: "Gestión de procesos electorales",
                        icon: "fas fa-vote-yea"
                    }
                ]
            },
            {
                id: "gestion-financiera",
                title: "Gestión Financiera",
                description: "Administración de aspectos financieros",
                icon: "fas fa-dollar-sign",
                modules: [
                    {
                        id: "costos",
                        title: "Costos",
                        description: "Gestión de costos de programas",
                        icon: "fas fa-tags"
                    },
                    {
                        id: "finanzas",
                        title: "Finanzas",
                        description: "Gestión de facturas y cobros",
                        icon: "fas fa-calculator"
                    },
                    {
                        id: "bancos",
                        title: "Bancos",
                        description: "Administración de entidades financieras",
                        icon: "fas fa-university"
                    },
                    {
                        id: "depositos-estudiantes",
                        title: "Depósitos de Estudiantes",
                        description: "Gestión de depósitos estudiantiles",
                        icon: "fas fa-piggy-bank"
                    },
                    {
                        id: "convenios-pago",
                        title: "Convenios de Pago",
                        description: "Administración de convenios de pago",
                        icon: "fas fa-handshake"
                    },
                    {
                        id: "facturas",
                        title: "Facturas",
                        description: "Gestión de facturación",
                        icon: "fas fa-file-invoice"
                    }
                ]
            },
            {
                id: "bienestar-estudiantil",
                title: "Bienestar Estudiantil",
                description: "Gestión del bienestar estudiantil",
                icon: "fas fa-heart",
                modules: [
                    {
                        id: "estudiantes-beca",
                        title: "Estudiantes con Beca",
                        description: "Gestión de estudiantes becados",
                        icon: "fas fa-award"
                    },
                    {
                        id: "bienestar-perfiles",
                        title: "Perfiles Socioeconómicos",
                        description: "Gestión de perfiles socioeconómicos",
                        icon: "fas fa-user-friends"
                    }
                ]
            },
            {
                id: "investigacion",
                title: "Investigación",
                description: "Gestión de proyectos de investigación",
                icon: "fas fa-flask",
                modules: [
                    {
                        id: "convocatorias-investigacion",
                        title: "Convocatorias",
                        description: "Gestión de convocatorias de investigación",
                        icon: "fas fa-bullhorn"
                    },
                    {
                        id: "proyectos-investigacion",
                        title: "Proyectos de Investigación",
                        description: "Seguimiento de proyectos",
                        icon: "fas fa-project-diagram"
                    },
                    {
                        id: "presupuesto-proyectos",
                        title: "Presupuesto de Proyectos",
                        description: "Gestión de presupuestos",
                        icon: "fas fa-money-bill-wave"
                    }
                ]
            },
            {
                id: "practicas-vinculacion",
                title: "Prácticas y Vinculación",
                description: "Gestión de prácticas y vinculación",
                icon: "fas fa-handshake",
                modules: [
                    {
                        id: "vinculacion-sociedad",
                        title: "Vinculación con la Sociedad",
                        description: "Administración de proyectos de vinculación",
                        icon: "fas fa-hands-helping"
                    },
                    {
                        id: "practicas-profesionales",
                        title: "Prácticas Profesionales",
                        description: "Gestión de prácticas y pasantías",
                        icon: "fas fa-briefcase"
                    },
                    {
                        id: "empresas",
                        title: "Empresas",
                        description: "Gestión de convenios con empresas",
                        icon: "fas fa-building"
                    }
                ]
            }
        ]
    }
};

// Variables globales para el contenido principal
let currentRole = 'estudiante';
let filteredModules = [];
let searchTerm = '';
let activeFilter = 'todos';

// Función principal para renderizar el contenido
function renderMainContent(role = currentRole) {
    currentRole = role;
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;

    const data = modulesData[role];
    if (!data) return;

    // Limpiar contenido anterior
    mainContent.innerHTML = '';

    // Crear header del contenido
    const header = createContentHeader(data);
    mainContent.appendChild(header);

    // Crear filtros de búsqueda
    if (role !== 'administrativo') {
        const filters = createContentFilters(role);
        mainContent.appendChild(filters);
    }

    // Renderizar según el tipo de rol
    if (role === 'estudiante') {
        renderStudentContent(mainContent, data);
    } else if (role === 'profesor') {
        renderProfessorContent(mainContent, data);
    } else if (role === 'administrativo') {
        renderAdminContent(mainContent, data);
    }
}

// Crear header del contenido
function createContentHeader(data) {
    const header = document.createElement('div');
    header.className = 'content-header';

    header.innerHTML = `
                <h1 class="content-title">
                    <span class="role-badge">
                        <i class="${data.icon}"></i>
                        ${data.title}
                    </span>
                </h1>
                <p class="content-subtitle">${data.subtitle}</p>
            `;

    return header;
}

// Crear filtros de búsqueda
function createContentFilters(role) {
    const filters = document.createElement('div');
    filters.className = 'content-filters';

    const categories = getUniqueCategories(role);

    filters.innerHTML = `
                <div class="filter-tag active" data-filter="todos">
                    <i class="fas fa-th-large"></i>
                    Todos los Módulos
                </div>
                ${categories.map(cat => `
                    <div class="filter-tag" data-filter="${cat.id}">
                        <i class="${cat.icon}"></i>
                        ${cat.name}
                    </div>
                `).join('')}
            `;

    // Agregar event listeners
    setTimeout(() => {
        const filterTags = filters.querySelectorAll('.filter-tag');

        filterTags.forEach(tag => {
            tag.addEventListener('click', () => handleFilterClick(tag));
        });
    }, 100);

    return filters;
}

// Obtener categorías únicas según el rol
function getUniqueCategories(role) {
    const data = modulesData[role];
    if (!data.modules) return [];

    const categories = new Set();
    data.modules.forEach(module => {
        if (module.category) {
            categories.add(module.category);
        }
    });

    const categoryMap = {
        'academico': { id: 'academico', name: 'Académico', icon: 'fas fa-graduation-cap' },
        'financiero': { id: 'financiero', name: 'Financiero', icon: 'fas fa-dollar-sign' },
        'evaluacion': { id: 'evaluacion', name: 'Evaluación', icon: 'fas fa-star' },
        'investigacion': { id: 'investigacion', name: 'Investigación', icon: 'fas fa-flask' },
        'personal': { id: 'personal', name: 'Personal', icon: 'fas fa-user' },
        'general': { id: 'general', name: 'General', icon: 'fas fa-cog' }
    };

    return Array.from(categories).map(cat => categoryMap[cat]).filter(Boolean);
}

// Renderizar contenido para estudiantes
function renderStudentContent(container, data) {
    // Sección de módulos prioritarios
    if (data.priority) {
        const prioritySection = document.createElement('div');
        prioritySection.className = 'priority-section';

        prioritySection.innerHTML = `
                    <h2 class="priority-title">
                        <i class="fas fa-star"></i>
                        Accesos Rápidos
                    </h2>
                    <div class="priority-grid">
                        ${data.priority.map(module => `
                            <div class="priority-card" onclick="openModule('${module.id}')">
                                <h4>${module.title}</h4>
                                <p>${module.description}</p>
                            </div>
                        `).join('')}
                    </div>
                `;

        container.appendChild(prioritySection);
    }

    // Sección de todos los módulos
    const modulesSection = document.createElement('div');
    modulesSection.innerHTML = `
                <h2 class="priority-title">
                    <i class="fas fa-th-large"></i>
                    Todos los Módulos
                </h2>
                <div class="modules-grid" id="modulesGrid">
                    ${renderModules(data.modules)}
                </div>
            `;

    container.appendChild(modulesSection);
    filteredModules = data.modules;
}

// Renderizar contenido para profesores
function renderProfessorContent(container, data) {
    const priorityModules = data.modules.filter(m => m.priority);
    const regularModules = data.modules.filter(m => !m.priority);

    // Módulos prioritarios
    if (priorityModules.length > 0) {
        const prioritySection = document.createElement('div');
        prioritySection.className = 'priority-section';

        prioritySection.innerHTML = `
                    <h2 class="priority-title">
                        <i class="fas fa-star"></i>
                        Módulos Principales
                    </h2>
                    <div class="priority-grid">
                        ${priorityModules.map(module => `
                            <div class="priority-card" onclick="openModule('${module.id}')">
                                <h4>${module.title}</h4>
                                <p>${module.description}</p>
                            </div>
                        `).join('')}
                    </div>
                `;

        container.appendChild(prioritySection);
    }

    // Resto de módulos
    const modulesSection = document.createElement('div');
    modulesSection.innerHTML = `
                <h2 class="priority-title">
                    <i class="fas fa-th-large"></i>
                    Otros Módulos
                </h2>
                <div class="modules-grid" id="modulesGrid">
                    ${renderModules(regularModules)}
                </div>
            `;

    container.appendChild(modulesSection);
    filteredModules = data.modules;
}

// Renderizar contenido para administrativos
function renderAdminContent(container, data) {
    if (!data.categories) return;

    data.categories.forEach(category => {
        const categorySection = document.createElement('div');
        categorySection.className = 'category-section';

        categorySection.innerHTML = `
                    <div class="category-header">
                        <div class="category-icon">
                            <i class="${category.icon}"></i>
                        </div>
                        <div class="category-info">
                            <h3>${category.title}</h3>
                            <p>${category.description}</p>
                        </div>
                    </div>
                    <div class="modules-grid">
                        ${renderModules(category.modules)}
                    </div>
                `;

        container.appendChild(categorySection);
    });
}

// Renderizar módulos individuales
function renderModules(modules) {
    return modules.map(module => `
                <div class="module-card" onclick="openModule('${module.id}')">
                    <div class="module-header">
                        <div class="module-icon">
                            <i class="${module.icon}"></i>
                        </div>
                        <div class="module-info">
                            <h3>${module.title}</h3>
                            <p>${module.description}</p>
                        </div>
                    </div>
                    <div class="module-actions">
                        <button class="module-btn module-btn-primary" onclick="event.stopPropagation(); openModule('${module.id}')">
                            <i class="fas fa-arrow-right"></i>
                            Acceder
                        </button>
                        <button class="module-btn module-btn-secondary" onclick="event.stopPropagation(); showModuleInfo('${module.id}')">
                            <i class="fas fa-info-circle"></i>
                            Info
                        </button>
                    </div>
                </div>
            `).join('');
}

// Manejar búsqueda
function handleSearch(event) {
    searchTerm = event.target.value.toLowerCase();
    filterModules();
}

// Manejar clic en filtros
function handleFilterClick(clickedTag) {
    // Remover clase active de todos los filtros
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.classList.remove('active');
    });

    // Agregar clase active al filtro clickeado
    clickedTag.classList.add('active');

    // Actualizar filtro activo
    activeFilter = clickedTag.getAttribute('data-filter');
    filterModules();
}

// Filtrar módulos
function filterModules() {
    const data = modulesData[currentRole];
    if (!data.modules) return;

    let modules = data.modules;

    // Filtrar por categoría
    if (activeFilter !== 'todos') {
        modules = modules.filter(module => module.category === activeFilter);
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
        modules = modules.filter(module =>
            module.title.toLowerCase().includes(searchTerm) ||
            module.description.toLowerCase().includes(searchTerm)
        );
    }

    // Actualizar grid de módulos
    const modulesGrid = document.getElementById('modulesGrid');
    if (modulesGrid) {
        modulesGrid.innerHTML = renderModules(modules);
    }

    filteredModules = modules;
}

// Abrir módulo
function openModule(moduleId) {
    // console.log(`Abriendo módulo: ${moduleId}`);

    // Aquí implementarías la lógica para navegar al módulo específico
    // Por ejemplo, cambiar la URL o cargar contenido dinámico

    // Simulación de feedback visual
    const moduleCard = event?.target?.closest?.('.module-card') ||
        event?.target?.closest?.('.priority-card');

    if (moduleCard) {
        moduleCard.style.transform = 'scale(0.95)';
        setTimeout(() => {
            moduleCard.style.transform = '';
        }, 150);
    }

    // Mostrar notificación temporal
    // showNotification(`Accediendo a ${moduleId}...`);
}

// Mostrar información del módulo
function showModuleInfo(moduleId) {
    // console.log(`Mostrando información del módulo: ${moduleId}`);

    // Aquí podrías mostrar un modal con información detallada
    // showNotification(`Información del módulo ${moduleId}`);
}

// Mostrar notificación
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Función para sincronizar con el cambio de rol del navbar
function updateMainContentRole(newRole) {
    renderMainContent(newRole);
}

// Integración con el sistema existente de dropdowns
function integrateWithExistingSystem() {
    // Observar cambios en el rol del navbar
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                const roleText = document.getElementById('roleText');
                if (roleText) {
                    const currentText = roleText.textContent.toLowerCase();
                    let newRole = 'estudiante';

                    if (currentText.includes('profesor')) {
                        newRole = 'profesor';
                    } else if (currentText.includes('administrativo')) {
                        newRole = 'administrativo';
                    }

                    if (newRole !== currentRole) {
                        updateMainContentRole(newRole);
                    }
                }
            }
        });
    });

    // Observar cambios en el texto del rol
    const roleText = document.getElementById('roleText');
    if (roleText) {
        observer.observe(roleText, {
            childList: true,
            characterData: true,
            subtree: true
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    renderMainContent('estudiante');

    integrateWithExistingSystem();

    window.updateMainContentRole = updateMainContentRole;
});

window.renderMainContent = renderMainContent;
window.openModule = openModule;
window.showModuleInfo = showModuleInfo;