// Octopus Law — site interactions

(function () {
  const EMAIL = "info@octopus.law";

  /* ------------------------------------------------------------ */
  /* Mobile menu                                                  */
  /* ------------------------------------------------------------ */
  function initMobileMenu() {
    const hamburger = document.querySelector(".nav__hamburger");
    const overlay = document.querySelector(".mobile-menu");
    const close = document.querySelector(".mobile-menu__close");
    if (!hamburger || !overlay) return;

    const open = () => {
      overlay.classList.add("is-open");
      document.body.style.overflow = "hidden";
    };
    const shut = () => {
      overlay.classList.remove("is-open");
      document.body.style.overflow = "";
    };

    hamburger.addEventListener("click", open);
    if (close) close.addEventListener("click", shut);

    overlay.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        // delay so the navigation/smooth-scroll feels intentional
        setTimeout(shut, 80);
      });
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") shut();
    });
  }

  /* ------------------------------------------------------------ */
  /* Reveal on scroll                                             */
  /* ------------------------------------------------------------ */
  function initReveal() {
    const targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    // index for stagger groups
    document.querySelectorAll(".stagger").forEach(group => {
      [...group.children].forEach((child, i) => {
        child.style.setProperty("--i", i);
      });
    });

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    targets.forEach(t => io.observe(t));
  }

  /* ------------------------------------------------------------ */
  /* Hero ready (image scale-in)                                  */
  /* ------------------------------------------------------------ */
  function initHero() {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    requestAnimationFrame(() => hero.classList.add("is-ready"));
  }

  /* ------------------------------------------------------------ */
  /* Smooth anchor scroll with nav offset                         */
  /* ------------------------------------------------------------ */
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener("click", e => {
        const id = link.getAttribute("href");
        if (id === "#" || id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const navH = window.matchMedia("(max-width: 1100px)").matches ? 100 : 210;
        const y = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: y, behavior: "smooth" });
      });
    });
  }

  /* ------------------------------------------------------------ */
  /* Form — open mail client with prefilled body                  */
  /* ------------------------------------------------------------ */
  function initForm() {
    const form = document.querySelector("#request-form, form.request-form");
    if (!form) return;
    form.addEventListener("submit", e => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get("name") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const brief = (data.get("brief") || "").toString().trim();

      const subject = encodeURIComponent(`New enquiry — ${name || "Private client"}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nBrief:\n${brief}\n\n—\nSent via octopus.law`
      );
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;

      const status = form.querySelector(".form-status");
      if (status) status.textContent = "Opening your mail client…";
    });
  }

  /* ------------------------------------------------------------ */
  /* Parallax tilt on hero image                                  */
  /* ------------------------------------------------------------ */
  function initParallax() {
    const layers = document.querySelectorAll("[data-parallax]");
    if (!layers.length) return;
    let raf = null;
    const onScroll = () => {
      const y = window.scrollY;
      layers.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        el.style.transform = `translate3d(0, ${y * speed}px, 0) scale(${1 + Math.min(0.05, y * 0.00008)})`;
      });
      raf = null;
    };
    window.addEventListener("scroll", () => {
      if (!raf) raf = requestAnimationFrame(onScroll);
    }, { passive: true });
  }

  /* ------------------------------------------------------------ */
  /* Init                                                         */
  /* ------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    initHero();
    initMobileMenu();
    initReveal();
    initAnchors();
    initForm();
    initParallax();
  });
})();
