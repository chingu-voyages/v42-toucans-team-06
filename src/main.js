const queryElement = document.querySelector(".query");
const excludeCategories = ["religion", "political", "explicit"];
const results = document.querySelector(".results");
const cursor = document.createElement("span");
const columnLeft = document.querySelector(".column-left");
cursor.setAttribute("id", "cursor");

const modal = document.querySelector(".modal-body");
const ratedQuotes = JSON.parse(localStorage.getItem("ChuckNorrisQuotes")) || [];

//  COMPLETE THE TOP 10
for (let i = 0; i < ratedQuotes.length; i++) {
  const bestQuote = document.createElement("p");
  bestQuote.classList.add("best-quote");
  bestQuote.textContent = ratedQuotes[i].quote;
  modal.appendChild(bestQuote);
}

const buttonsResponse = createButtons(excludeCategories, columnLeft);
buttonsResponse.then((buttons) => console.log(buttons));
buttonsResponse.then((buttons) => {
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      getChuckNorrisQuote(e);
      createRateComponent();
    });
  });
});

async function createButtons(excludeCategories, domElement) {
  const response = await fetch("https://api.chucknorris.io/jokes/categories");
  const data = await response.json();
  const categories = data.filter(
    (category) => !excludeCategories.includes(category)
  );

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.innerHTML = capitalizeFirstLetter(category);
    button.className = "btn";
    domElement.appendChild(button);
  });

  const buttons = document.querySelectorAll("body > main > aside > button");
  return buttons;
}

let index = 0; // For the anti-spam system
let previousJoke;
function getChuckNorrisQuote(e) {
  if (index === 0) {
    const category = e.target.textContent.toLowerCase();
    fetch(`https://api.chucknorris.io/jokes/random?category=${category}`)
      .then((response) => response.json())
      .then((data) => {
        if (previousJoke === data.value) {
          console.log("same joke fetched again, fetching new one");
          getChuckNorrisQuote();
        } else {
          console.log(data.value);
          previousJoke = data.value;
          document.querySelector(".results").textContent = "";
          cursor.remove();
          typewriter(data.value, 0);
        }
      })
      .catch((error) => console.log(error));
  }
}

function typewriter(text, i) {
  if (i < text.length) {
    results.textContent += text[i];
    index = i;
    results.appendChild(cursor);
    setTimeout(() => typewriter(text, i + 1), 40);
  } else {
    results.appendChild(cursor);
    index = 0; // For the anti-spam system
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// ------ ASIDE MENU --------//
const asideMenu = document.getElementById("aside");
const colRight = document.getElementById("column-right");
const arrowIconLeft = document.getElementById("arrow-left");
const arrowIconRight = document.getElementById("arrow-right");

// TOGGLE ASIDE MENU + SWITCH ARROW SVG
if (asideMenu) {
  asideMenu.addEventListener("click", () => {
    asideMenu.classList.toggle("close");
    arrowIconRight.classList.toggle("open");
    arrowIconLeft.classList.toggle("open");
  });
}

// ------ FAVOURITE QUOTES MODAL --------//
const quotesBtn = document.getElementById("modalBtn");
const closeBtn = document.getElementById("closeBtn");
const modalCard = document.getElementById("modal");
const quoteBox = document.getElementById("bestQuoteBox");

// OPEN MODAL WINDOW
quotesBtn.onclick = function () {
  modalCard.style.display = "block";
};
// CLOSE MODAL WINDOW WITH BUTTON
closeBtn.onclick = function () {
  modalCard.style.display = "none";
};

// CREATE RATE COMPONENT

function createRateComponent() {
  const quoteCard = document.querySelector(".quote-card");
  const ratingLine = document.createElement("p");
  ratingLine.classList.add("rate-quote-line", "font-lato");
  ratingLine.innerHTML = "Rate this quote ";

  for (let j = 1; j <= 5; j++) {
    const star = document.createElement("i");
    star.classList.add("fa-solid", "fa-star", "star", `star${j}`);
    star.dataset.value = j;
    ratingLine.appendChild(star);
  }

  quoteCard.appendChild(ratingLine);
  if (quoteCard.children.length > 2 && quoteCard.contains(ratingLine)) {
    quoteCard.removeChild(quoteCard.lastElementChild.previousElementSibling);
  }

  const stars = ratingLine.querySelectorAll(".star");

  // FOR THE SELECTION OF STAR
  function selectStar(e) {
    const selectedValue = e.target.getAttribute("data-value");
    for (let star of stars) {
      star.classList.remove("selected");
      if (star.getAttribute("data-value") <= selectedValue) {
        star.classList.add("selected");
      }

      if (star.getAttribute("data-value") > selectedValue) {
        star.classList.remove("hover");
      }
    }
  }

  stars.forEach((star) => {
    star.addEventListener("click", selectStar);
  });

  // FOR THE HOVER EFFECT
  for (let i = 0; i < stars.length; i++) {
    stars[i].addEventListener("mouseover", function (e) {
      for (let j = 0; j <= i; j++) {
        stars[j].classList.add("hover");
      }
    });

    stars[i].addEventListener("mouseout", function (e) {
      for (let j = 0; j <= i; j++) {
        if (!stars[j].classList.contains("selected")) {
          stars[j].classList.remove("hover");
        }
      }
    });
  }

  // THE RATING SYSTEM

  const modal = document.querySelector(".modal-body");
  if (stars) {
    stars.forEach((star) => {
      star.addEventListener("click", () => {
        const quotes =
          JSON.parse(localStorage.getItem("ChuckNorrisQuotes")) || [];

        console.log("avant:");
        console.log(quotes);
        const ratedQuotes = rateAndStock(quotes, star.dataset.value);

        //  UPDATE THE TOP 10
        modal.innerHTML = "";
        for (let i = 0; i < ratedQuotes.length; i++) {
          const bestQuote = document.createElement("p");
          bestQuote.classList.add("best-quote");
          bestQuote.textContent = ratedQuotes[i].quote;
          modal.appendChild(bestQuote);
        }
      });
    });
  }

  const results = document.querySelector(".results");
  function sortQuotes(quotes, rate) {
    console.log("ggg");
    console.log(quotes);

    const existingQuote = quotes.find(
      (q) => q.quote === results.textContent && q.rating !== rate
    );

    if (existingQuote) {
      console.log(existingQuote);
      existingQuote.rating = rate;
      return quotes;
    } else {
      quotes.push({ rating: rate, quote: results.textContent });
      quotes.sort((a, b) => {
        return b.rating - a.rating;
      });
      console.log("slice: " + quotes);
      return quotes.slice(0, 10);
    }
  }

  function rateAndStock(quotes, rate) {
    quotes = sortQuotes(quotes, rate);
    console.log("test: " + quotes);
    localStorage.setItem("ChuckNorrisQuotes", JSON.stringify(quotes));
    const ratedQuotes =
      JSON.parse(localStorage.getItem("ChuckNorrisQuotes")) || [];
    console.log(ratedQuotes);
    return ratedQuotes;
  }
}
