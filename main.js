(function () {
  const D = window.YASAI;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const setText = (sel, value) => $$(sel).forEach((el) => (el.textContent = value));

  const telDigits = D.telefon.replace(/\D/g, "");
  const telIntl = "+" + (D.telefon.trim().startsWith("+") ? telDigits : "48" + telDigits);
  const telHref = "tel:" + telIntl;
  $$("[data-tel]").forEach((a) => (a.href = telHref));
  setText("[data-tel-text]", D.telefon);
  setText("[data-name]", D.nazwa);
  setText("[data-street]", D.adres.ulica);
  setText("[data-city]", `${D.adres.kod} ${D.adres.miasto}`);
  setText("[data-city-only]", D.adres.miasto);
  setText("[data-year]", new Date().getFullYear());
  setText("[data-menu-date]", D.menuAktualizacja);
  if (D.dowoz) setText("[data-dowoz]", D.dowoz);

  $$("[data-menu-link]").forEach((a) => (a.href = D.menuPdf));

  if (D.email) {
    const a = $("[data-email]");
    a.href = "mailto:" + D.email;
    a.textContent = D.email;
    $("[data-email-wrap]").hidden = false;
  }

  if (!D.rekrutacja) $$("[data-if-rekrutacja]").forEach((el) => el.remove());

  const announce = $("[data-announce]");
  if (D.ogloszenie && D.ogloszenie.tekst && sessionStorage.getItem("announce-closed") !== D.ogloszenie.tekst) {
    const [main, ...rest] = D.ogloszenie.tekst.split(" – ");
    const textEl = $("[data-announce-text]");
    textEl.textContent = main;
    if (rest.length) {
      const extra = document.createElement("span");
      extra.className = "announce__extra";
      extra.textContent = " – " + rest.join(" – ");
      textEl.appendChild(extra);
    }
    const tag = $("[data-announce-tag]");
    if (D.ogloszenie.etykieta) tag.textContent = D.ogloszenie.etykieta;
    else tag.remove();
    $("[data-announce-link]").href = D.ogloszenie.link || "#";
    announce.hidden = false;
    $(".announce__close").addEventListener("click", () => {
      announce.hidden = true;
      sessionStorage.setItem("announce-closed", D.ogloszenie.tekst);
    });
  }

  const apps = Object.entries(D.zamowienia || {}).filter(([, url]) => url);
  $$("[data-app]").forEach((a) => {
    const url = D.zamowienia[a.dataset.app];
    if (url) a.href = url;
    else a.remove();
  });
  if (apps.length) $("[data-apps]").hidden = false;

  const socialLabels = { facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok" };
  const socials = $("[data-socials]");
  Object.entries(D.social || {}).forEach(([key, url]) => {
    if (!url) return;
    const a = document.createElement("a");
    a.className = "chip";
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = socialLabels[key] || key;
    socials.appendChild(a);
  });

  const q = encodeURIComponent(D.mapa || `${D.adres.ulica}, ${D.adres.kod} ${D.adres.miasto}`);
  $("[data-map]").src = `https://www.google.com/maps?q=${q}&output=embed`;
  $("[data-route]").href = `https://www.google.com/maps/dir/?api=1&destination=${q}`;

  // Godziny: indeks 0 = poniedziałek
  const days = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];
  const now = new Date();
  const today = (now.getDay() + 6) % 7;
  const table = $("[data-hours]");
  days.forEach((day, i) => {
    const tr = document.createElement("tr");
    if (i === today) tr.className = "is-today";
    tr.innerHTML = `<th>${day}</th><td>${D.godziny[i] || "nieczynne"}</td>`;
    table.appendChild(tr);
  });

  const parseRange = (s) => {
    const m = (s || "").match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/);
    if (!m) return null;
    return [m[1] * 60 + +m[2], m[3] * 60 + +m[4]];
  };
  const status = $("[data-status]");
  const range = parseRange(D.godziny[today]);
  const mins = now.getHours() * 60 + now.getMinutes();
  if (range && mins >= range[0] && mins < range[1]) {
    status.innerHTML = `<span class="dot dot--open"></span>Otwarte dziś do ${D.godziny[today].split(/[–-]/)[1].trim()}`;
  } else if (range && mins < range[0]) {
    status.innerHTML = `<span class="dot"></span>Zamknięte · otwieramy dziś o ${D.godziny[today].split(/[–-]/)[0].trim()}`;
  } else {
    const next = D.godziny[(today + 1) % 7];
    status.innerHTML = `<span class="dot"></span>Zamknięte` + (next ? ` · jutro od ${next.split(/[–-]/)[0].trim()}` : "");
  }

  const dayCodes = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const ld = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: D.nazwa,
    servesCuisine: ["Sushi", "Japanese"],
    telephone: telIntl,
    menu: new URL(D.menuPdf, location.href).href,
    address: {
      "@type": "PostalAddress",
      streetAddress: D.adres.ulica,
      postalCode: D.adres.kod,
      addressLocality: D.adres.miasto,
      addressCountry: "PL",
    },
    openingHours: D.godziny
      .map((h, i) => (h ? `${dayCodes[i]} ${h.replace("–", "-")}` : null))
      .filter(Boolean),
  };
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(ld);
  document.head.appendChild(script);

  const header = $("[data-header]");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const burger = $("[data-burger]");
  const nav = $("[data-nav]");
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open);
  });
  $$("a", nav).forEach((a) => a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  $$(".section, .feature").forEach((el) => {
    el.classList.add("reveal");
    io.observe(el);
  });
})();
