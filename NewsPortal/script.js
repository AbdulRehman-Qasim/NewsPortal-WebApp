const API_KEY = "86b5ff13859644b1834b943b16b58206";
const url = "https://newsapi.org/v2/everything?q=";

let featuredIndex = 0;
let featuredArticles = [];
let autoSlideInterval = null;

// Load default news
window.addEventListener("load", () => fetchNews("Pakistan"));

// Reload function
function reload() {
    window.location.reload();
}

// Fetch news using CORS proxy
async function fetchNews(query) {
    try {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url + query + "&apiKey=" + API_KEY)}`;
        const res = await fetch(proxyUrl);
        const data = await res.json();
        const articles = JSON.parse(data.contents).articles;

        if (!articles || articles.length === 0) {
            document.getElementById("cards-container").innerHTML = "<p style='text-align:center; margin-top:20px;'>No news found.</p>";
            document.getElementById("featured-news")?.remove();
            return;
        }

        bindData(articles);
        showFeaturedNews(articles);
    } catch (err) {
        console.error(err);
        alert("Failed to fetch news. Please try again later.");
    }
}

// Bind news cards
function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const template = document.getElementById("template-news-card");
    cardsContainer.innerHTML = "";

    articles.forEach(article => {
        if (!article.urlToImage) return;
        const cardClone = template.content.cloneNode(true);
        fillData(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

// Fill card data
function fillData(cardClone, article) {
    cardClone.querySelector(".news-img").src = article.urlToImage;
    cardClone.querySelector(".news-title").textContent = article.title;
    cardClone.querySelector(".news-desc").textContent = article.description || "";
    cardClone.querySelector(".news-source").textContent =
        `${article.source.name} · ${new Date(article.publishedAt).toLocaleDateString()}`;

    const categories = ["Finance", "Politics", "Sports", "Technology", "Health"];
    const randomCat = categories[Math.floor(Math.random() * categories.length)];
    cardClone.querySelector(".news-category").textContent = randomCat;

    cardClone.querySelector(".card-header").addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

// Navigation
let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    if (curSelectedNav) curSelectedNav.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav?.classList.add("active");
}

// Search
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value.trim();
    if (!query) return;
    fetchNews(query);
    if (curSelectedNav) curSelectedNav.classList.remove("active");
    curSelectedNav = null;
});

searchText.addEventListener("keydown", e => {
    if (e.key === "Enter") searchButton.click();
});

// Featured News Carousel
function showFeaturedNews(articles) {
    const featuredContainer = document.getElementById("featured-news");
    if (!featuredContainer) return;

    clearInterval(autoSlideInterval); // stop previous interval

    featuredContainer.innerHTML = "";
    featuredArticles = articles.slice(0, 5);

    featuredArticles.forEach((article, index) => {
        const slide = document.createElement("div");
        slide.className = "featured-slide" + (index === 0 ? " active" : "");
        slide.innerHTML = `
            <img src="${article.urlToImage || 'https://via.placeholder.com/1200x300'}" alt="featured">
            <div class="featured-caption">
                <h2>${article.title}</h2>
                <span>${article.source.name}</span>
            </div>
        `;
        slide.addEventListener("click", () => window.open(article.url, "_blank"));
        featuredContainer.appendChild(slide);
    });

    addCarouselButtons();
    startAutoSlide();
}

function addCarouselButtons() {
    const featuredContainer = document.getElementById("featured-news");
    if (!featuredContainer) return;

    const prevBtn = document.createElement("button");
    prevBtn.className = "carousel-btn prev";
    prevBtn.innerHTML = "&#10094;";
    prevBtn.onclick = () => changeSlide(-1);

    const nextBtn = document.createElement("button");
    nextBtn.className = "carousel-btn next";
    nextBtn.innerHTML = "&#10095;";
    nextBtn.onclick = () => changeSlide(1);

    featuredContainer.appendChild(prevBtn);
    featuredContainer.appendChild(nextBtn);
}

function changeSlide(n) {
    const slides = document.querySelectorAll(".featured-slide");
    if (slides.length === 0) return;

    slides[featuredIndex].classList.remove("active");
    featuredIndex = (featuredIndex + n + slides.length) % slides.length;
    slides[featuredIndex].classList.add("active");
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => { changeSlide(1); }, 5000);
}


// script.js

// Mobile dropdown toggle
document.addEventListener("DOMContentLoaded", () => {
    const dropdown = document.querySelector(".nav-item.dropdown");

    if (dropdown) {
        dropdown.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.classList.toggle("open");
        });

        // Close dropdown if clicked outside
        document.addEventListener("click", () => {
            dropdown.classList.remove("open");
        });
    }
});

