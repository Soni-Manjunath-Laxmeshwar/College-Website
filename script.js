const homepageContent = {
  slides: [
    {
      kicker: "Admissions · 2026–27",
      title: "Build a future<br><em>that moves India.</em>",
      copy: "An education that puts curiosity in motion, connects learning to the real world, and gives every ambition room to grow.",
      primary: "Explore admissions",
      primaryLink: "#admissions",
      secondary: "Discover programmes",
      secondaryLink: "#programmes",
      image: "https://agadiengcollege.com/wp-content/uploads/2023/10/cse1.jpg",
    },
    {
      kicker: "Campus bulletin",
      title: "Big ideas deserve<br><em>a bigger stage.</em>",
      copy: "Follow the people, projects, competitions and conversations shaping life across our campus.",
      primary: "View latest updates",
      primaryLink: "#events",
      secondary: "Explore campus life",
      secondaryLink: "#campus",
      image: "https://agadiengcollege.com/wp-content/uploads/2023/10/eee2.jpg",
    },
    {
      kicker: "Learn · Make · Lead",
      title: "Engineering minds<br><em>for what’s next.</em>",
      copy: "With focused mentoring and a practical learning culture, students are ready to create impact from the very beginning.",
      primary: "Find your programme",
      primaryLink: "#programmes",
      secondary: "Why SKSVMACET",
      secondaryLink: "#about",
      image: "https://agadiengcollege.com/wp-content/uploads/2023/10/ise1.jpg",
    },
  ],
  events: [
    {
      type: "Admissions",
      date: "2026–27",
      title: "Take the first step towards an engineering career.",
      link: "#admissions",
      action: "Explore admissions",
    },
    {
      type: "Campus updates",
      date: "New",
      title: "Every achievement, event and notice in one place.",
      link: "#all-updates",
      action: "See all updates",
    },
    {
      type: "Student life",
      date: "Discover",
      title: "Make more of your college experience, every day.",
      link: "#campus",
      action: "Explore campus life",
    },
  ],
};

async function loadContentFromDatabase() {
  try {
    const response = await fetch("/api/content", { headers: { Accept: "application/json" } });
    if (!response.ok) return;
    const content = await response.json();
    if (Array.isArray(content.slides) && content.slides.length) homepageContent.slides = content.slides;
    if (Array.isArray(content.events) && content.events.length) homepageContent.events = content.events;
  } catch {
    // Static hosting keeps the built-in content as a graceful fallback.
  }
}

const slidesContainer = document.querySelector(".hero__slides");
const heroKicker = document.querySelector("#hero-kicker");
const heroTitle = document.querySelector("#hero-title");
const heroCopy = document.querySelector("#hero-copy");
const heroPrimary = document.querySelector("#hero-primary-link");
const heroSecondary = document.querySelector("#hero-secondary-link");
const heroCounter = document.querySelector("#hero-counter");
const dots = [...document.querySelectorAll(".hero-dot")];
let currentSlide = 0;
let slideTimer;

function renderSlides() {
  homepageContent.slides.forEach((slide, index) => {
    const element = document.createElement("div");
    element.className = `hero__slide${index === 0 ? " is-active" : ""}`;
    element.style.backgroundImage = `url("${slide.image}")`;
    slidesContainer.appendChild(element);
  });
}

function showSlide(index) {
  currentSlide = (index + homepageContent.slides.length) % homepageContent.slides.length;
  const slide = homepageContent.slides[currentSlide];
  const slideElements = [...document.querySelectorAll(".hero__slide")];
  slideElements.forEach((element, elementIndex) => element.classList.toggle("is-active", elementIndex === currentSlide));
  dots.forEach((dot, dotIndex) => {
    const active = dotIndex === currentSlide;
    dot.classList.toggle("is-active", active);
    dot.setAttribute("aria-selected", active);
  });
  heroKicker.textContent = slide.kicker;
  heroTitle.innerHTML = slide.title;
  heroCopy.textContent = slide.copy;
  heroPrimary.href = slide.primaryLink;
  heroPrimary.innerHTML = `${slide.primary} <span aria-hidden="true">↗</span>`;
  heroSecondary.href = slide.secondaryLink;
  heroSecondary.innerHTML = `${slide.secondary} <span aria-hidden="true">→</span>`;
  heroCounter.textContent = String(currentSlide + 1).padStart(2, "0");
}

function restartSlider() {
  window.clearInterval(slideTimer);
  slideTimer = window.setInterval(() => showSlide(currentSlide + 1), 6500);
}

function renderEvents() {
  const list = document.querySelector("#event-list");
  homepageContent.events.forEach((event) => {
    const card = document.createElement("article");
    card.className = "event-card";
    card.innerHTML = `
      <div class="event-card__meta"><span></span>${event.type} · ${event.date}</div>
      <h3>${event.title}</h3>
      <a class="event-card__link" href="${event.link}">${event.action} <span aria-hidden="true">→</span></a>
    `;
    list.appendChild(card);
  });
}

await loadContentFromDatabase();
renderSlides();
renderEvents();
dots.forEach((dot, index) => dot.addEventListener("click", () => { showSlide(index); restartSlider(); }));
restartSlider();

const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
menuButton.addEventListener("click", () => {
  const open = menuButton.classList.toggle("is-open");
  mainNav.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
  menuButton.setAttribute("aria-expanded", open);
});
mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  menuButton.classList.remove("is-open");
  mainNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  menuButton.setAttribute("aria-expanded", "false");
}));

document.querySelector("#year").textContent = new Date().getFullYear();
