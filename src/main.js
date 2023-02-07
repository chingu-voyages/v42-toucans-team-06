const queryElement = document.querySelector(".query");
const excludeCategories = ["religion", "political", "explicit"];
const results = document.querySelector(".results");
const cursor = document.createElement("span");
const columnLeft = document.querySelector(".column-left");
cursor.setAttribute("id", "cursor");

const buttonsResponse = createButtons(excludeCategories, columnLeft);
buttonsResponse.then((buttons) => console.log(buttons));
buttonsResponse.then((buttons) => {
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      getChuckNorrisQuote(e);
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
    // Here we gonna add just a ForEach and retrieve the value of button
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

// ------ RATING STARS --------//

// ------ 10 BEST RATED QUOTES MODAL --------//
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
// CLOSE MODAL WINDOW CLICK OUTSIDE

let modalBody = document.getElementsByClassName("modal-body");
const modalHeader = document.getElementsByClassName("modal-header");

modalBody.style.height = modalCard.style.height - modalHeader.style.height;
