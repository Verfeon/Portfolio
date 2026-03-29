const lang = navigator.language;

const cv_link = document.querySelector("#cv-link") as HTMLAnchorElement;
cv_link.href = `${import.meta.env.BASE_URL}assets/CV.pdf`; 

const texts = {
  fr: {
    subtitle: "Ingénieur logiciel · intelligence artificielle · Jeu vidéo",
    aboutTitle: "À propos",
    aboutText: "Étudiant ingénieur en développement logiciel (ENSICAEN). Passionné par les jeux vidéos.",
    projectsTitle: "Projets & liens",
    itchLink: '<i class="fa-brands fa-itch-io"></i> itch.io — Jeux publiés',
    itchDesc: "Prototypes et jeux finalisés sous Godot / Unity",
    shaderLink: `<img src="${import.meta.env.BASE_URL}assets/shadertoy.png" alt="icone Shadertoy"> Shadertoy — Shaders GLSL`,
    shaderDesc: "Expérimentations graphiques et rendu temps réel",
    githubLink: '<i class="fa-brands fa-github"></i> GitHub — Code',
    githubDesc: "C++, C#, JavaScript",
    linkedinLink: '<i class="fa-brands fa-linkedin"></i> LinkedIn — Profil professionnel',
    linkedinDesc: "Expériences et compétences",
    CVLink: '<i class="fa-solid fa-file-pdf"></i> Télécharger mon CV',
    contactTitle: "Contact",
    contactText: "nonofr80@hotmail.fr<br>Caen, France",
    footer: "© 2026 — Noé Freville"
  },
  en: {
    subtitle: "Software engineer · AI · Game development",
    aboutTitle: "About",
    aboutText: "Software engineering student (ENSICAEN). Passionate about video games.",
    projectsTitle: "Projects & Links",
    itchLink: '<i class="fa-brands fa-itch-io"></i> itch.io — Published games',
    itchDesc: "Prototypes and finished games under Godot / Unity",
    shaderLink: `<img src="${import.meta.env.BASE_URL}assets/shadertoy.png" alt="Shadertoy icon"> Shadertoy — GLSL Shaders`,
    shaderDesc: "Graphic experiments and real-time rendering",
    githubLink: '<i class="fa-brands fa-github"></i> GitHub — Code',
    githubDesc: "C++, C#, JavaScript",
    linkedinLink: '<i class="fa-brands fa-linkedin"></i> LinkedIn — Professional profile',
    linkedinDesc: "Experiences and skills",
    CVLink: '<i class="fa-solid fa-file-pdf"></i> Download my CV',
    contactTitle: "Contact",
    contactText: "nonofr80@hotmail.fr<br>Caen, France",
    footer: "© 2026 — Noé Freville"
  }
};

const t = lang.startsWith("en") ? texts.en : texts.fr;

document.documentElement.lang = lang.startsWith("en") ? "en" : "fr";

document.getElementById("subtitle")!.innerHTML = t.subtitle;
document.getElementById("about-title")!.innerHTML = t.aboutTitle;
document.getElementById("about-text")!.innerHTML = t.aboutText;
document.getElementById("projects-title")!.innerHTML = t.projectsTitle;
document.getElementById("itch-link")!.innerHTML = t.itchLink;
document.getElementById("itch-desc")!.innerHTML = t.itchDesc;
document.getElementById("shader-link")!.innerHTML = t.shaderLink;
document.getElementById("shader-desc")!.innerHTML = t.shaderDesc;
document.getElementById("github-link")!.innerHTML = t.githubLink;
document.getElementById("github-desc")!.innerHTML = t.githubDesc;
document.getElementById("linkedin-link")!.innerHTML = t.linkedinLink;
document.getElementById("linkedin-desc")!.innerHTML = t.linkedinDesc;
document.getElementById("cv-link")!.innerHTML = t.CVLink;
document.getElementById("contact-title")!.innerHTML = t.contactTitle;
document.getElementById("contact-text")!.innerHTML = t.contactText;
document.getElementById("footer-text")!.innerHTML = t.footer;
