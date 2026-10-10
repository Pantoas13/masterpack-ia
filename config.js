// ============================================================
//  CONFIGURACIÓN ÚNICA DEL EMBUDO "MASTER PACK IA"
//  Cambia los datos AQUÍ y se actualizan todas las páginas.
// ============================================================
window.MP_CONFIG = {
    // Enlace de pago de Hotmart del producto "100 Prompts de IA para Emprender" (ID 8663986)
    // Hotmart > Productos > tu producto > Enlaces > Página de pago
    LINK_HOTMART: "https://pay.hotmart.com/X107900745K",

    // Tu WhatsApp con código de país, solo números (ej.: Colombia 57..., Polonia 48...)
    WHATSAPP: "",

    // Tu enlace para afiliados de Hotmart (déjalo vacío para ocultar el botón)
    LINK_AFILIADOS: "",

    // Formulario de MailerLite "Master Pack IA - 15 Prompts gratis" (ya conectado)
    MAILERLITE_ACTION: "https://assets.mailerlite.com/jsonp/2665092/forms/200916227701343422/subscribe"
};

// ---- No hace falta tocar nada debajo de esta línea ----
document.addEventListener('DOMContentLoaded', function () {
    var C = window.MP_CONFIG;
    var pagoListo = C.LINK_HOTMART && C.LINK_HOTMART.indexOf('TU_CODIGO') === -1;
    document.querySelectorAll('.js-checkout').forEach(function (a) {
        a.href = pagoListo ? C.LINK_HOTMART : 'index.html#oferta';
    });
    document.querySelectorAll('.js-whatsapp').forEach(function (a) {
        if (!C.WHATSAPP) { a.style.display = 'none'; return; }
        var txt = encodeURIComponent(a.getAttribute('data-texto') || 'Hola, tengo una consulta sobre el Master Pack de Prompts');
        a.href = 'https://wa.me/' + C.WHATSAPP.replace(/\D/g, '') + '?text=' + txt;
    });
    document.querySelectorAll('.js-afiliados').forEach(function (a) {
        if (!C.LINK_AFILIADOS) { a.style.display = 'none'; return; }
        a.href = C.LINK_AFILIADOS;
    });
});
