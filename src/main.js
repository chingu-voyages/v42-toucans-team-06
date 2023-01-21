const queryElement = document.querySelector(".query")
const excludeCategories = ["religion", "political", "explicit"]
const options = createSelect(excludeCategories, queryElement)
const results = document.querySelector(".results")
const cursor = document.createElement("span")
cursor.setAttribute('id', 'cursor')


  async function createSelect(excludeCategories, domElement) {
    const response = await fetch('https://api.chucknorris.io/jokes/categories');
    const data = await response.json();
    const categories = data.filter(category => !excludeCategories.includes(category));
  
    // create the select element
    const select = document.createElement("select");
    select.setAttribute("Id", "category");
  
    // create and append the options
    categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.text = category;
      select.appendChild(option);
    });
  
    // append the select element to the body
    domElement.appendChild(select);
    const table = document.querySelectorAll("body > main > div.query-container > form > select")
    console.log(table)
    return table
  }


let index = 0; // For the anti-spam system
function getChuckNorrisQuote() {
    if(index === 0) {
        const category = document.getElementById("category").value
        fetch(`https://api.chucknorris.io/jokes/random?category=${category}`)
        .then(response => response.json())
        .then(data => {
            console.log(data.value)
            document.querySelector(".results").textContent = "";
            cursor.remove();
            typewriter(data.value, 0);
        })
        .catch(error => console.log(error));
    }
}

  const button = document.querySelector("button[type=submit]")
  button.addEventListener("click", getChuckNorrisQuote)


  function typewriter(text, i) {
    if(i < text.length) {
        results.textContent += text[i]
        index = i;
        results.appendChild(cursor);
        setTimeout(() => typewriter(text, i + 1), 50);
    } else {
        results.appendChild(cursor);
        index = 0; // For the anti-spam system
    }
}



  

  

  
  

  

