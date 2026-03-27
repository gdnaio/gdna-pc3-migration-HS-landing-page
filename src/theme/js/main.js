// g/d/n/a PC3 Migration Landing Page
// Minimal JS — most interactivity handled by HubSpot CMS
document.addEventListener("DOMContentLoaded", function () {
  var skipLink = document.querySelector('.sr-only[href="#main-content"]');
  if (skipLink) {
    skipLink.addEventListener("click", function (e) {
      e.preventDefault();
      var main = document.getElementById("main-content");
      if (main) {
        main.setAttribute("tabindex", "-1");
        main.focus();
      }
    });
  }
});
