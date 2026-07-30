/* ============================================================
   ПРИБОР ЗАМЕРА СМОУКА — один файл на весь сайт.
   Одинаков для любой страны: меняются только два значения ниже.

   METRIKA_ID — номер счётчика Яндекс.Метрики. Нужен, если трафик
                идёт из Яндекс.Директа. 0 = выключено.
   GA4_ID     — идентификатор потока Google Analytics 4, вид
                "G-XXXXXXXXXX". Нужен, если трафик из Google Ads.
                "" = выключено.

   Можно включить одно, другое или оба сразу. Больше в коде страниц
   ничего менять не надо: имена целей от страны не зависят.

     cta_click      клик по главной кнопке
     payment_click  клик по кнопке оплаты
     lead_submit    заявка отправлена (ловится на thanks.html)
     form_fallback  клик по ссылке «форма не открылась» (диагностика)

   Пока оба значения пустые, страницы работают, но пишут в консоль
   браузера, что замер не собирается.
   ============================================================ */

var SMOKE = {
  METRIKA_ID: 111163305,
  GA4_ID: ""
};

(function () {
  function warn(m) { try { console.error("[smoke] " + m); } catch (e) {} }
  function note(m) { try { console.log("[smoke] " + m); } catch (e) {} }

  if (SMOKE.METRIKA_ID) {
    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date();
      for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
      k = e.createElement(t); a = e.getElementsByTagName(t)[0];
      k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
    })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
    try {
      ym(SMOKE.METRIKA_ID, "init", { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true });
    } catch (e) { warn("Метрика не инициализировалась: " + e); }
  }

  if (SMOKE.GA4_ID) {
    var s = document.createElement("script");
    s.async = 1;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(SMOKE.GA4_ID);
    (document.head || document.documentElement).appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag("js", new Date());
    gtag("config", SMOKE.GA4_ID);
  }

  if (!SMOKE.METRIKA_ID && !SMOKE.GA4_ID) {
    warn("аналитика не подключена: визиты и цели НЕ собираются. Впишите METRIKA_ID или GA4_ID в smoke.js");
  }

  /* Единая точка отправки цели. Вызывается из onclick на страницах.
     Никогда не бросает исключение: сломанный счётчик не должен ломать сайт. */
  window.track = function (goal) {
    try { if (SMOKE.METRIKA_ID && window.ym) { ym(SMOKE.METRIKA_ID, "reachGoal", goal); } } catch (e) {}
    try { if (SMOKE.GA4_ID && window.gtag) { gtag("event", goal); } } catch (e) {}
    note("цель: " + goal);
  };
})();
