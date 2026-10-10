// Configuración de "Controla tu Negocio". Cambia aquí el enlace de pago si lo cambias en Hotmart.
window.SITE_CONFIG = {
    LINK_HOTMART: "https://pay.hotmart.com/L107899327C",
    MAILERLITE_ACTION: "https://assets.mailerlite.com/jsonp/2665092/forms/200921660251965227/subscribe"
};
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.js-checkout').forEach(function (a) { a.href = window.SITE_CONFIG.LINK_HOTMART; });
});
