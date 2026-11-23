/* Calculadoras de soldadura · fórmulas
 * © 2026 Iván Camilo Cuéllar Campo. Todos los derechos reservados (ver herramientas/LICENCIA.md).
 * Las mismas fórmulas las usan las páginas y las pruebas (prueba.js). Resultados orientativos:
 * manda siempre la WPS (especificación del procedimiento) y la norma aplicable.
 */
(function (root) {
  var DENSIDAD = { acero: 7.85, inox: 7.9, aluminio: 2.7 };        // g/cm3 = mg/mm3
  // Factor de eficiencia térmica k según EN ISO 1011-1 / ISO/TR 17671-1
  var K_PROCESO = { saw: 1.0, smaw: 0.8, mig: 0.8, fcaw: 0.8, tig: 0.6, plasma: 0.6 };
  // Rendimiento de depósito típico (kg de metal depositado / kg de consumible)
  var RENDIMIENTO = { smaw: 0.60, mig: 0.95, fcaw: 0.85, saw: 0.99, tig: 0.98 };

  function num(x) { var n = parseFloat(String(x).replace(',', '.')); return isFinite(n) ? n : NaN; }

  // Aporte térmico (kJ/mm) = k · U(V) · I(A) · 60 / (1000 · v(mm/min))
  function aporteTermico(proceso, voltios, amperios, velocidadMmMin) {
    var k = K_PROCESO[proceso];
    if (!k || !(velocidadMmMin > 0)) return NaN;
    var energia = voltios * amperios * 60 / (1000 * velocidadMmMin);   // energía del arco kJ/mm
    return { energiaArco: energia, aporte: energia * k, k: k };
  }

  // Carbono equivalente IIW: C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15
  function carbonoEquivalente(c) {
    var v = function (k) { return num(c[k]) || 0; };
    var ce = v('C') + v('Mn') / 6 + (v('Cr') + v('Mo') + v('V')) / 5 + (v('Ni') + v('Cu')) / 15;
    var nivel, consejo;
    if (ce <= 0.40) { nivel = 'baja'; consejo = 'Buena soldabilidad. Normalmente no hace falta precalentar en espesores normales.'; }
    else if (ce <= 0.45) { nivel = 'media'; consejo = 'Soldabilidad aceptable. Puede hacer falta precalentar en espesores gruesos o con hidrógeno alto: usa consumibles de bajo hidrógeno.'; }
    else if (ce <= 0.60) { nivel = 'alta'; consejo = 'Riesgo de fisuración en frío. Suele hacer falta precalentar (orientativo 100-200 °C) y consumibles de bajo hidrógeno.'; }
    else { nivel = 'muy alta'; consejo = 'Soldabilidad difícil. Precalentamiento alto, control de temperatura entre pasadas y posible tratamiento posterior. Sigue la WPS.'; }
    return { ce: ce, nivel: nivel, consejo: consejo };
  }

  // Sección de soldadura (mm2)
  function seccionAngulo(garganta) { return garganta * garganta; }            // a = garganta; cateto z = a·√2 → z²/2 = a²
  function seccionV(espesor, separacion, talon, anguloTotal) {
    var h = Math.max(espesor - talon, 0);
    return separacion * espesor + h * h * Math.tan((anguloTotal / 2) * Math.PI / 180);
  }

  // Peso de metal depositado y consumible necesario
  function pesoSoldadura(seccionMm2, longitudM, material, proceso, sobreespesorPct) {
    var dens = DENSIDAD[material] || DENSIDAD.acero;
    var rend = RENDIMIENTO[proceso] || 1;
    var seccion = seccionMm2 * (1 + (sobreespesorPct || 0) / 100);
    var kgMetal = seccion * longitudM * 1000 * dens / 1e6;    // mm2 · mm · mg/mm3 → mg → kg
    return { seccion: seccion, kgPorMetro: seccion * dens / 1000, kgMetal: kgMetal, kgConsumible: kgMetal / rend, rendimiento: rend };
  }

  // Tasa de depósito MIG/MAG o FCAW (kg/h) desde la velocidad del hilo
  function tasaDeposito(diametroMm, velocidadHiloMMin, material, proceso) {
    var dens = DENSIDAD[material] || DENSIDAD.acero;
    var gPorMetro = Math.PI * diametroMm * diametroMm / 4 * dens;            // mm2 · 1000 mm · mg/mm3 / 1000 → g/m
    var kgHoraHilo = gPorMetro * velocidadHiloMMin * 60 / 1000;
    var rend = RENDIMIENTO[proceso] || RENDIMIENTO.mig;
    return { gPorMetro: gPorMetro, kgHoraHilo: kgHoraHilo, kgHoraDepositado: kgHoraHilo * rend };
  }

  // Tiempo y coste de una soldadura
  function costeSoldadura(o) {
    var horasArco = o.kgMetal / o.tasaKgH;
    var horasTotales = horasArco / (o.factorMarcha / 100);
    var kgConsumible = o.kgMetal / (o.rendimiento || 1);
    var litrosGas = (o.caudalGas || 0) * horasArco * 60;
    var c = {
      consumible: kgConsumible * o.precioConsumible,
      gas: litrosGas / 1000 * (o.precioGasM3 || 0),
      manoObra: horasTotales * o.precioHora
    };
    c.total = c.consumible + c.gas + c.manoObra;
    return { horasArco: horasArco, horasTotales: horasTotales, kgConsumible: kgConsumible, litrosGas: litrosGas, coste: c };
  }

  // Consumo de gas de protección
  function consumoGas(caudalLMin, minutosArco, litrosBotella, barBotella) {
    var litros = caudalLMin * minutosArco;
    var capacidad = litrosBotella * barBotella;   // aproximación de gas ideal (litros a presión atmosférica)
    return { litros: litros, capacidad: capacidad, botellas: capacidad > 0 ? litros / capacidad : NaN,
             minutosPorBotella: caudalLMin > 0 ? capacidad / caudalLMin : NaN };
  }

  // Amperaje orientativo para electrodo revestido (SMAW): 30-50 A por mm de diámetro
  function amperajeElectrodo(diametroMm) {
    return { min: Math.round(diametroMm * 30), tipico: Math.round(diametroMm * 40), max: Math.round(diametroMm * 50) };
  }

  var API = { DENSIDAD: DENSIDAD, K_PROCESO: K_PROCESO, RENDIMIENTO: RENDIMIENTO, num: num,
    aporteTermico: aporteTermico, carbonoEquivalente: carbonoEquivalente, seccionAngulo: seccionAngulo,
    seccionV: seccionV, pesoSoldadura: pesoSoldadura, tasaDeposito: tasaDeposito, costeSoldadura: costeSoldadura,
    consumoGas: consumoGas, amperajeElectrodo: amperajeElectrodo };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Soldadura = API;
})(this);
