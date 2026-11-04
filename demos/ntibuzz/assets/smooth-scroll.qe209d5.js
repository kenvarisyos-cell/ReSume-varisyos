(function () {
  "use strict";

  if (window.__NTIBUZZ_SMOOTH_SCROLL_BOOTED__) return;
  window.__NTIBUZZ_SMOOTH_SCROLL_BOOTED__ = true;

  var root = document.documentElement;
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  var saveData = navigator.connection && navigator.connection.saveData;
  var excludedPages = ["ot-esign", "ot-monthly-report", "leave-monthly-report", "payroll", "nfc-card"];
  var page = document.body && document.body.dataset ? document.body.dataset.page : "";

  if (reducedMotion || coarsePointer || saveData || excludedPages.indexOf(page) !== -1) {
    root.classList.add("ntb-native-scroll");
    return;
  }

  var ownScript = document.currentScript;
  var ownUrl = ownScript && ownScript.src ? ownScript.src : new URL("assets/smooth-scroll.js", location.href).href;
  var baseUrl = new URL("./", ownUrl);

  function addStylesheet() {
    if (document.querySelector('link[data-ntb-lenis-css]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = new URL("vendor/lenis.css?v=1.3.25", baseUrl).href;
    link.dataset.ntbLenisCss = "1";
    document.head.appendChild(link);
  }

  function start() {
    if (!window.Lenis || window.NTIBuzzSmoothScroll) return;
    var lenis = new window.Lenis({
      autoRaf: true,
      autoToggle: true,
      smoothWheel: true,
      syncTouch: false,
      lerp: 0.09,
      wheelMultiplier: 0.9,
      allowNestedScroll: true,
      anchors: { offset: -16, duration: 1.05 },
      stopInertiaOnNavigate: true
    });
    window.NTIBuzzSmoothScroll = lenis;
    root.classList.add("ntb-smooth-scroll");
    window.dispatchEvent(new CustomEvent("ntibuzz:smooth-ready", { detail: lenis }));
  }

  addStylesheet();
  if (window.Lenis) {
    start();
    return;
  }

  var vendor = document.createElement("script");
  vendor.src = new URL("vendor/lenis.min.js?v=1.3.25", baseUrl).href;
  vendor.defer = true;
  vendor.dataset.ntbLenisJs = "1";
  vendor.addEventListener("load", start, { once: true });
  vendor.addEventListener("error", function () {
    root.classList.add("ntb-native-scroll");
  }, { once: true });
  document.head.appendChild(vendor);
})();
