(function () {
  if (window.__lclNormalNavigation) return;
  window.__lclNormalNavigation = true;

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a");
    if (!link || link.target === "_blank" || link.origin !== window.location.origin) return;

    var href = link.getAttribute("href");
    if (!href || href.charAt(0) !== "/") return;

    event.preventDefault();
    window.location.assign(href);
  }, true);
})();
