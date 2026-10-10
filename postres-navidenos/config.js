// Configuración de "Postres Navideños". Cambia aquí el enlace de pago si lo cambias en Hotmart.
window.SITE_CONFIG = {
    LINK_HOTMART: "https://pay.hotmart.com/F107895415M",
    MAILERLITE_ACTION: "https://assets.mailerlite.com/jsonp/2665092/forms/200921641156347487/subscribe"
};
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.js-checkout').forEach(function (a) { a.href = window.SITE_CONFIG.LINK_HOTMART; });
});
