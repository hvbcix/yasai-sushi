/*
  ============================================================
  YASAI SUSHI – DANE STRONY
  ============================================================
  To jedyny plik, który trzeba edytować przy codziennych zmianach.

  • Nowe menu?  Podmień plik  menu/menu.pdf  (zachowaj tę samą nazwę)
                i zmień poniżej "menuAktualizacja".
  • Zmiana godzin, telefonu, linków – edytuj wartości poniżej.
  • Puste pole ("") = element zostaje ukryty na stronie.
  • Edytuj tylko tekst między cudzysłowami.
  ============================================================
*/

window.YASAI = {
  nazwa: "Yasai Sushi",
  telefon: "+48 533 103 119",
  email: "",

  adres: {
    ulica: "ul. Przykładowa 1",
    kod: "62-050",
    miasto: "Mosina",
  },

  // Co wyszukać na mapie. Puste = sam adres. Gdy restauracja będzie miała
  // wizytówkę w Google, wpisz np. "Yasai Sushi Mosina".
  mapa: "",

  // Kolejność: poniedziałek … niedziela. Format "12:00–21:00" albo "" (= zamknięte).
  godziny: [
    "12:00–21:00",
    "12:00–21:00",
    "12:00–21:00",
    "12:00–21:00",
    "12:00–22:00",
    "12:00–22:00",
    "13:00–21:00",
  ],

  menuPdf: "menu/menu.pdf",
  menuAktualizacja: "październik 2026",

  // Linki do zamówień online. Puste = przycisk się nie pokaże.
  zamowienia: {
    pyszne: "",
    glovo: "",
    wolt: "",
    wlasny: "",
  },

  social: {
    facebook: "",
    instagram: "",
    tiktok: "",
  },

  dowoz: "Dowozimy na terenie Mosiny i okolic. Zapytaj o zasięg przy zamówieniu.",

  // Pasek na górze strony. Pusty tekst = pasek ukryty.
  // Na telefonie widać tylko część przed " – ", więc najważniejsze pisz na początku.
  ogloszenie: {
    etykieta: "Praca",
    tekst: "Szukamy Sushi Mastera – dołącz do nas",
    link: "#praca",
  },

  // Sekcja "Praca". false = sekcja ukryta.
  rekrutacja: true,
};
