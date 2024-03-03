export let images = [{
    url: "../img/banner1.png",
  
  }, {
    url: "../img/banner2.png",
   
  }, {
    url: "../img/banner3.png",
  }];

export function initSlider() {
    let sliderImages = document.querySelector(".slider__images");
    let sliderDots = document.querySelector(".slider__dots");
    
    initImages();
    initDots();
    initAutoplay();
      
    function initImages() {
        images.forEach((image, index) => {
        let imageDiv = `<div class="image n${index} ${index === 0? "active" : ""}" style="background-image:url(${images[index].url});" data-index="${index}"></div>`;
        sliderImages.innerHTML += imageDiv;
        });
    }
  
    function initDots() {
        images.forEach((image, index) => {
        let dot = `<div class="slider__dots-item n${index} ${index === 0? "active" : ""}" data-index="${index}"></div>`;
        sliderDots.innerHTML += dot;
        });
        sliderDots.querySelectorAll(".slider__dots-item").forEach(dot => {
          dot.addEventListener("click", function() {
              moveSlider(this.dataset.index);
          });
        });
    }
  
    function moveSlider(num) {
      sliderImages.querySelector(".active").classList.remove("active");
      sliderImages.querySelector(".n" + num).classList.add("active");
  
      sliderDots.querySelector(".active").classList.remove("active");
      sliderDots.querySelector(".n" + num).classList.add("active");
    }
  
    function initAutoplay() {
      setInterval(() => {
        let curNumber = +sliderImages.querySelector(".active").dataset.index;
        let nextNumber = curNumber === images.length - 1? 0 : curNumber + 1;
        moveSlider(nextNumber);
        }, 5000);
      }  
  }