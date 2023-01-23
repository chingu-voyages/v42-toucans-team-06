const queryElement = document.querySelector(".query")
const excludeCategories = ["religion", "political", "explicit"]
const results = document.querySelector(".results")
const cursor = document.createElement("span")
const columnLeft = document.querySelector(".column-left")
cursor.setAttribute('id', 'cursor')


  const buttonsResponse = createButtons(excludeCategories, columnLeft)
  buttonsResponse.then(buttons => console.log(buttons))
  buttonsResponse.then(buttons => {
    buttons.forEach(button => {
      button.addEventListener("click", e => {
        getChuckNorrisQuote(e);
        for(let i = 0; i < buttons.length; i++){
          buttons[i].classList.remove("active")
        }
        e.target.classList.add("active")
      })
    })
  })


  async function createButtons(excludeCategories, domElement) {
    const response = await fetch('https://api.chucknorris.io/jokes/categories');
    const data = await response.json();
    const categories = data.filter(category => !excludeCategories.includes(category));
  
    categories.forEach(category => {
      const button = document.createElement("button");
      button.innerHTML = category;
      button.className = "btn"
      domElement.appendChild(button)
    });

    const buttons = document.querySelectorAll("body > main > aside > button")
    return buttons
  }


let index = 0; // For the anti-spam system
let previousJoke;
function getChuckNorrisQuote(e) {
  
    if(index === 0) {
      // Here we gonna add just a ForEach and retrieve the value of button
        const category = e.target.textContent
        fetch(`https://api.chucknorris.io/jokes/random?category=${category}`)
        .then(response => response.json())
        .then(data => {
          if(previousJoke === data.value){
            console.log("same joke fetched again, fetching new one")
            getChuckNorrisQuote();
          }else{
            console.log(data.value)
            previousJoke = data.value
            document.querySelector(".results").textContent = ""
            cursor.remove()
            typewriter(data.value, 0)
          }
            
        })
        .catch(error => console.log(error));
    }

    
}

  function typewriter(text, i) {
    if(i < text.length) {
        results.textContent += text[i]
        index = i;
        results.appendChild(cursor);
        setTimeout(() => typewriter(text, i + 1), 40);
    } else {
        results.appendChild(cursor);
        index = 0; // For the anti-spam system
    }
}



  

  

  
  

  

