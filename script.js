/* =========================================================
   MADEIRAS MUELLER — script.js
   Versão corrigida e defensiva
   ========================================================= */

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* =========================================================
   ANO DO FOOTER
   ========================================================= */
const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* =========================================================
   MENU MOBILE
   ========================================================= */
const burger = document.getElementById("burger");
const drawer = document.getElementById("drawer");

function closeDrawer() {
  if (!burger || !drawer) return;

  drawer.classList.remove("is-open");
  burger.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";

  setTimeout(function () {
    if (!drawer.classList.contains("is-open")) {
      drawer.hidden = true;
    }
  }, 400);
}

if (burger && drawer) {
  burger.addEventListener("click", function () {
    const open = burger.getAttribute("aria-expanded") === "true";

    if (open) {
      closeDrawer();
    } else {
      drawer.hidden = false;

      requestAnimationFrame(function () {
        drawer.classList.add("is-open");
      });

      burger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
  });

  drawer.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeDrawer);
  });

  document.addEventListener("keydown", function (event) {
    if (
      event.key === "Escape" &&
      drawer.classList.contains("is-open")
    ) {
      closeDrawer();
    }
  });
}

/* =========================================================
   ANIMAÇÕES DE ENTRADA
   ========================================================= */
const revealEls = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window && !reduceMotion) {
  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealEls.forEach(function (el) {
    io.observe(el);
  });
} else {
  revealEls.forEach(function (el) {
    el.classList.add("is-in");
  });
}

/* =========================================================
   NAV + PROGRESSO + WHATSAPP FLUTUANTE + PARALLAX
   ========================================================= */
const nav = document.getElementById("nav");
const hero = document.getElementById("hero");
const progressBar = document.getElementById("progressBar");
const heroMedia = document.querySelector(".hero__media");
const wfloat = document.querySelector(".wfloat");

const parallaxEls = Array.prototype.slice.call(
  document.querySelectorAll("[data-speed]")
);

let lastY = window.scrollY;
let ticking = false;

function onFrame() {
  const y = window.scrollY;
  const vh = window.innerHeight;

  /* NAV */
  if (nav) {
    const heroH = hero ? hero.offsetHeight : vh;

    nav.classList.toggle(
      "is-solid",
      y > heroH - 90
    );

    const drawerOpen =
      drawer && drawer.classList.contains("is-open");

    if (
      y > heroH &&
      y > lastY + 6 &&
      !drawerOpen
    ) {
      nav.classList.add("is-hidden");
    } else if (y < lastY - 6) {
      nav.classList.remove("is-hidden");
    }
  }

  lastY = y;

  /* BARRA DE PROGRESSO */
  if (progressBar) {
    const max =
      document.documentElement.scrollHeight - vh;

    progressBar.style.width =
      (max > 0 ? (y / max) * 100 : 0) + "%";
  }

  /* WHATSAPP FLUTUANTE */
  if (wfloat) {
    wfloat.classList.toggle(
      "is-visible",
      y > vh * 0.75
    );
  }

  /* PARALLAX */
  if (!reduceMotion) {
    if (heroMedia && y < vh * 1.2) {
      heroMedia.style.transform =
        "translate3d(0," +
        (y * 0.22).toFixed(2) +
        "px,0)";
    }

    for (let i = 0; i < parallaxEls.length; i++) {
      const el = parallaxEls[i];
      const rect = el.getBoundingClientRect();

      if (
        rect.bottom < -200 ||
        rect.top > vh + 200
      ) {
        continue;
      }

      const speed =
        parseFloat(el.getAttribute("data-speed")) || 0;

      const delta =
        (rect.top + rect.height / 2 - vh / 2) *
        -speed;

      el.style.transform =
        "translate3d(0," +
        Math.max(-60, Math.min(60, delta)).toFixed(2) +
        "px,0)";
    }
  }

  ticking = false;
}

function requestFrame() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(onFrame);
  }
}

window.addEventListener(
  "scroll",
  requestFrame,
  { passive: true }
);

window.addEventListener(
  "resize",
  requestFrame
);

requestFrame();

/* =========================================================
   VÍDEO — FALLBACK SE O MP4 NÃO CARREGAR
   ========================================================= */
const film = document.querySelector(".film");
const filmVideo = document.getElementById("filmVideo");

function useFallback() {
  if (film) {
    film.classList.add("no-video");
  }
}

if (filmVideo) {
  const source = filmVideo.querySelector("source");

  if (source) {
    source.addEventListener("error", useFallback);
  }

  filmVideo.addEventListener("error", useFallback);

  filmVideo.addEventListener(
    "loadeddata",
    function () {
      if (film) {
        film.classList.remove("no-video");
      }

      const play = filmVideo.play();

      if (play && play.catch) {
        play.catch(function () {});
      }
    }
  );

  setTimeout(function () {
    if (filmVideo.readyState === 0) {
      useFallback();
    }
  }, 2500);
}

/* =========================================================
   SCROLL SUAVE PARA LINKS INTERNOS
   ========================================================= */
document
  .querySelectorAll('a[href^="#"]')
  .forEach(function (link) {
    link.addEventListener(
      "click",
      function (event) {
        const id = link.getAttribute("href");

        if (!id || id.length < 2) {
          return;
        }

        const target = document.querySelector(id);

        if (!target) {
          return;
        }

        event.preventDefault();

        window.scrollTo({
          top:
            target.getBoundingClientRect().top +
            window.scrollY -
            10,
          behavior: reduceMotion ? "auto" : "smooth"
        });
      }
    );
  });
