// Configuración de "Huellitas Gourmet". Cambia aquí el enlace de pago si lo cambias en Hotmart.
window.SITE_CONFIG = {
    LINK_HOTMART: "https://pay.hotmart.com/S107899213R",
    MAILERLITE_ACTION: "https://assets.mailerlite.com/jsonp/2665092/forms/200921657229968665/subscribe"
};
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.js-checkout').forEach(function (a) { a.href = window.SITE_CONFIG.LINK_HOTMART; });
});
