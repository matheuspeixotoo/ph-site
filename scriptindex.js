window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.getElementById("banner-popup").style.display = "flex";
  }, 2000);
});

function fecharBanner() {
  document.getElementById("banner-popup").style.display = "none";
}
