// Détection de la langue du navigateur
const lang = navigator.language || navigator.userLanguage;

// Contenus FR / EN
const texts = {
  fr: {
    subtitle: "Ingénieur logiciel · intelligence artificielle · Jeu vidéo",
    aboutTitle: "À propos",
    aboutText: "Étudiant ingénieur en informatique (ENSICAEN), spécialisation image, son et intelligence artificielle. Intéressé par le développement de jeux vidéo, les moteurs graphiques et les algorithmes de rendu temps réel.",
    projectsTitle: "Projets & liens",
    itchDesc: "Prototypes et jeux finalisés sous Godot / Unity",
    shaderDesc: "Expérimentations graphiques et rendu temps réel",
    githubDesc: "C++, C#, JavaScript",
    contactTitle: "Contact",
    contactText: "nonofr80@hotmail.fr<br>Caen, France",
    footer: "© 2026 — Noé Freville"
  },
  en: {
    subtitle: "Software engineer · AI · Game development",
    aboutTitle: "About",
    aboutText: "Computer engineering student (ENSICAEN), specialized in image, sound and artificial intelligence. Interested in game development, graphics engines, and real-time rendering algorithms.",
    projectsTitle: "Projects & Links",
    itchDesc: "Prototypes and finished games under Godot / Unity",
    shaderDesc: "Graphic experiments and real-time rendering",
    githubDesc: "C++, C#, JavaScript",
    contactTitle: "Contact",
    contactText: "nonofr80@hotmail.fr<br>Caen, France",
    footer: "© 2026 — Noé Freville"
  }
};

// Choisir la langue (FR par défaut)
const t = lang.startsWith("en") ? texts.en : texts.fr;

// Remplacement du contenu
document.documentElement.lang = lang.startsWith("en") ? "en" : "fr";

document.getElementById("subtitle").innerHTML = t.subtitle;
document.getElementById("about-title").innerHTML = t.aboutTitle;
document.getElementById("about-text").innerHTML = t.aboutText;
document.getElementById("projects-title").innerHTML = t.projectsTitle;
document.getElementById("itch-desc").innerHTML = t.itchDesc;
document.getElementById("shader-desc").innerHTML = t.shaderDesc;
document.getElementById("github-desc").innerHTML = t.githubDesc;
document.getElementById("contact-title").innerHTML = t.contactTitle;
document.getElementById("contact-text").innerHTML = t.contactText;
document.getElementById("footer-text").innerHTML = t.footer;
