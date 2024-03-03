import {initSlider} from "./slider.js";
import "base.scss"

document.addEventListener("DOMContentLoaded", function() {
  initSlider();
  selectActualCategory();
  checkQuantityGoods();
  getBooks();
}); 

//_______________________________________
function selectActualCategory () {
categoryItems.forEach(item => {
  item.addEventListener("click", () => {
      books.innerHTML = ""; // очищаем ранее загруженные книги
      removeActiveCategory(); // очищаем выбранную ранее категорию
      item.classList.add("nav-categories__item--active"); 
      category = item.innerHTML;
      addActualCategory();
      saveActualCategory();
      getBooks(); 
  });
});
}

function addActualCategory() {
  localStorage.setItem("actualCategory", category);   
}

function saveActualCategory() {
  if (localStorage.getItem("actualCategory")) {
    category = localStorage.getItem("actualCategory");
  } else {
    localStorage.setItem("actualCategory", category); 
  }
}

function checkQuantityGoods() {
  quantityGoodsNumber.innerHTML =  localStorage.getItem("countGoods");

  if(quantityGoodsNumber.innerHTML >= 1) {
    quantityGoods.style.display = "block";
  } else {
    quantityGoods.style.display = "none";
  } 
}

let quantityGoods = document.querySelector(".quantityGoods");
let quantityGoodsNumber = document.querySelector(".quantityGoods__number");

let categoryItems = document.querySelectorAll(".nav-categories__item");

function removeActiveCategory() {
  document.querySelector(".nav-categories__item--active").classList.remove("nav-categories__item--active");
}

let indexItem = 0;
let startIndex = 0;
let indexBooksArray = [];
let category = "Architecture";
const apiKey = "AIzaSyA1Cmeh7H_dL8q8XuybP3IH6jzbHjOuGNU";

let books = document.querySelector(".books");

function getBooks() {
indexItem++;
const localIndexItem = localStorage.getItem("indexBook");
const parseIndexBook = JSON.parse(localIndexItem);

fetch(`https://www.googleapis.com/books/v1/volumes?q="subject:${category}"&key=${apiKey}&printType=books&startIndex=${startIndex}&maxResults=6&langRestrict=en`)
  .then(response => response.json())
  .then(data => {
    for (let book of data.items) {
      const bookItem = `
                      <div class="book" data-index=${book.id}>
                        <img class="book-cover" src=${book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : "../img/noCoverBook.svg"} alt="book-cover"/>
                        <div class="book-information" >
                          <span class="book-author">${book.volumeInfo.authors}</span>
                          <h2 class="book-title">${book.volumeInfo.title}</h2>
                          <div class="rating">
                            <div class="rating-items">
                              <img src=${book.volumeInfo.averageRating > 0 ? "../img/star_filled.svg" : "../img/star.svg"}  alt="rating" width="12" height="12"/>
                              <img src=${book.volumeInfo.averageRating > 1 ? "../img/star_filled.svg" : "../img/star.svg"}  alt="rating" width="12" height="12"/>
                              <img src=${book.volumeInfo.averageRating > 2 ? "../img/star_filled.svg" : "../img/star.svg"}  alt="rating" width="12" height="12"/>
                              <img src=${book.volumeInfo.averageRating > 3 ? "../img/star_filled.svg" : "../img/star.svg"}  alt="rating" width="12" height="12"/>
                              <img src=${book.volumeInfo.averageRating > 4 ? "../img/star_filled.svg" : "../img/star.svg"}  alt="rating" width="12" height="12"/>
                            </div>
                            <span class="review">${book.volumeInfo.ratingsCount ? book.volumeInfo.ratingsCount + ` ${book.volumeInfo.ratingsCount === 1 ? "review" : "reviews"}` : ""}</span>               
                          </div>
                          <p class="book-description">${book.volumeInfo.description || ""}</p>
                          <span class="book-price">${book.saleInfo.listPrice ? "$" + book.saleInfo.listPrice.amount : ""}</span>
                          <button class="button book-buy">Buy now</button>
                        </div>
                      </div>
                      `;
      books.innerHTML += bookItem;
    }

    const loadButton = document.createElement("button");
    loadButton.classList.add("button", "load-button");
    loadButton.innerHTML = "Load more";
    books.append(loadButton);
    
    loadButton.addEventListener("click", () => {
      startIndex += 6;
      getBooks();
      loadButton.classList.add("hidden");
    }); 

    let bookBuy = document.querySelectorAll(".book-buy");
    bookBuy.forEach(button => {
      const indexBook = button.closest(".book").dataset.index;
      button.addEventListener("click", () => {     
        if (button.innerHTML == "Buy now") {
          button.innerHTML = "IN THE CART";
          indexBooksArray.push(indexBook);
          quantityGoodsNumber.innerHTML = Number(quantityGoodsNumber.innerHTML) + 1;

          if(quantityGoodsNumber.innerHTML > 0) {
            quantityGoods.style.display = "block";
          } else {
            quantityGoods.style.display = "none";
          } 

          const stringIndexBook = JSON.stringify(indexBooksArray);
          localStorage.setItem("indexBook", stringIndexBook);

          addCountGoods();
          saveCountGoods();
        } else {
          button.innerHTML = "Buy now";
          const localIndexItem = localStorage.getItem("indexBook");
            if (localIndexItem) {
              const parseIndexBook = JSON.parse(localIndexItem);
              indexBooksArray = parseIndexBook.filter(item => item !== indexBook);
            }
          quantityGoodsNumber.innerHTML = Number(quantityGoodsNumber.innerHTML) - 1;

          if(quantityGoodsNumber.innerHTML > 0) {
            quantityGoods.style.display = "block";
          } else {
            quantityGoods.style.display = "none";
          } 

          addCountGoods();
          saveCountGoods();
        }

        const stringIndexBook = JSON.stringify(indexBooksArray);
        localStorage.setItem("indexBook", stringIndexBook);
      });

      if (parseIndexBook) {
        for (indexItem = 0; indexItem < parseIndexBook.length; indexItem++) {
          if (indexBook === parseIndexBook[indexItem]) {
            button.innerHTML = "In the cart";
            indexBooksArray = parseIndexBook;
          }
        }
      }
    });

    function addCountGoods() {
      localStorage.setItem("countGoods", quantityGoodsNumber.innerHTML); // переписываем первоначально заданное значение
    }
    
    function saveCountGoods()  {
      if (localStorage.getItem("countGoods")) {
        quantityGoodsNumber.innerHTML = localStorage.getItem("countGoods"); // если значение есть, считываем его
      } else {
        localStorage.setItem("countGoods", quantityGoodsNumber.innerHTML); // если изначально счетчик пуст, записываем значение
      }
    }
  });
}