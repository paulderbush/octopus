// Octopus Law — site interactions

(function () {
  // Replace with the access key from web3forms.com (sent to info@octopus.law)
  const WEB3FORMS_KEY = "YOUR_ACCESS_KEY_HERE";

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
  /* Form — send via Web3Forms to info@octopus.law                */
  /* ------------------------------------------------------------ */
  function initForm() {
    const form = document.querySelector("#request-form, form.request-form");
    if (!form) return;

    form.addEventListener("submit", async e => {
      e.preventDefault();

      const status = form.querySelector(".form-status");
      const btn = form.querySelector(".submit-btn");

      const data = new FormData(form);
      const name  = (data.get("name")  || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const brief = (data.get("brief") || "").toString().trim();

      if (!name || !email || !brief) {
        if (status) {
          status.textContent = "Please fill in all fields.";
          status.style.color = "#e07070";
        }
        return;
      }

      if (btn) { btn.disabled = true; btn.style.opacity = "0.6"; }
      if (status) { status.textContent = "Sending…"; status.style.color = ""; }

      const page = document.title.replace(" - Octopus Law", "").replace("Octopus Law - ", "").trim();

      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `New enquiry from ${name || "Private client"} — ${page}`,
            name,
            email,
            message: brief,
            from_name: "Octopus Law Website"
          })
        });

        const json = await res.json();

        if (json.success) {
          if (status) {
            status.textContent = "Your message has been sent. We will be in touch shortly.";
            status.style.color = "";
          }
          form.reset();
        } else {
          throw new Error(json.message || "Submission failed");
        }
      } catch (err) {
        if (status) {
          status.textContent = "Something went wrong. Please email us directly at info@octopus.law";
          status.style.color = "#e07070";
        }
        console.error("Form error:", err);
      } finally {
        if (btn) { btn.disabled = false; btn.style.opacity = ""; }
      }
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
