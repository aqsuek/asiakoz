(function () {
  "use strict";

  function gapPx(carousel) {
    var cs = window.getComputedStyle(carousel);
    var g = cs.gap || cs.columnGap;
    var n = parseInt(g, 10);
    return isNaN(n) ? 20 : n;
  }

  function initWrap(wrap) {
    var carousel = wrap.querySelector(".videos-carousel");
    var prevBtn = wrap.querySelector(".video-carousel-prev");
    var nextBtn = wrap.querySelector(".video-carousel-next");
    var dotsWrap = wrap.querySelector(".video-carousel-dots");
    if (!carousel || !prevBtn || !nextBtn || !dotsWrap) return;
    var cards = carousel.querySelectorAll(".video-card");
    var count = cards.length;
    if (count === 0) return;

    dotsWrap.innerHTML = "";
    for (var i = 0; i < count; i++) {
      var dot = document.createElement("span");
      dot.setAttribute("data-index", String(i));
      if (i === 0) dot.classList.add("active");
      dotsWrap.appendChild(dot);
    }
    var dots = dotsWrap.querySelectorAll("span");

    function cardStep() {
      var g = gapPx(carousel);
      return cards[0] ? cards[0].offsetWidth + g : 400;
    }

    function scrollToIndex(idx) {
      idx = Math.min(Math.max(0, idx), count - 1);
      var step = cardStep();
      carousel.scrollTo({ left: idx * step, behavior: "smooth" });
      dots.forEach(function (d, i) {
        d.classList.toggle("active", i === idx);
      });
    }

    function updateDots() {
      var step = cardStep();
      if (step <= 0) return;
      var idx = Math.round(carousel.scrollLeft / step);
      idx = Math.min(Math.max(0, idx), count - 1);
      dots.forEach(function (d, i) {
        d.classList.toggle("active", i === idx);
      });
    }

    carousel.addEventListener("scroll", updateDots);
    prevBtn.addEventListener("click", function () {
      var step = cardStep();
      var idx = Math.floor(carousel.scrollLeft / step + 0.01);
      scrollToIndex(idx - 1);
    });
    nextBtn.addEventListener("click", function () {
      var step = cardStep();
      var idx = Math.floor(carousel.scrollLeft / step + 0.01);
      scrollToIndex(idx + 1);
    });
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        scrollToIndex(i);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".videos-wrap--with-nav").forEach(function (w) {
      initWrap(w);
    });
  });
})();
