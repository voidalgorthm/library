document.addEventListener('DOMContentLoaded', function () {
  createHoles();
}, false);

const container = document.querySelector('.container');

const main = container.querySelector('.main');
const section = main.querySelector('.section');

let width = main.offsetWidth;
let height = main.offsetHeight;

window.addEventListener('resize', function() {
  removeHoles();
  createHoles();
} );
  

function createHoles() {
  const vertical = Math.floor(width / 100) - 2;
  const horizontal = Math.floor(height / 100) - 2;

  const remain = (vertical * horizontal) % 10;
  const holes = (vertical * horizontal) + (10 - remain);

  for (let index = 0; index < holes; index++) {
    let hole = document.createElement('div');
    section.appendChild(hole).className = "hole";
  };
};

function removeHoles() {
  const holes = section.querySelectorAll('.hole');
  holes.forEach(hole => {
    hole.remove();
  })
}

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = function () {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read}`;
  }
}

const hobbit = new Book('The Hobbit', 'J.R.R. Tolkien', 295, 'not read yet');

console.log(hobbit.info());

