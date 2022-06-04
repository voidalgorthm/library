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
  const dimensions = parseInt(getComputedStyle(main).getPropertyValue('--grid-min-size'));
  const size = Number(dimensions * 10);

  const vertical = Math.floor(width / size) - 2;
  const horizontal = Math.floor(height / size) - 2;

  const remain = (vertical * horizontal) % 10;
  const holes = (vertical * horizontal) + (10 - remain);

  for (let index = 0; index < holes; index++) {
    let hole = document.createElement('div');
    section.appendChild(hole).className = 'hole';
    let button = document.createElement('button');
    hole.appendChild(button).className = 'add';
  };
};

function removeHoles() {
  const holes = section.querySelectorAll('.hole');
  holes.forEach(hole => {
    hole.remove();
  })
}

let library = [];

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

