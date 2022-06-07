document.addEventListener('DOMContentLoaded', function () {
  createHoles();
  addBook();
}, false);

const container = document.querySelector('.container');

const main = container.querySelector('.main');
const section = main.querySelector('.section');

window.addEventListener('resize', function () {
  removeHoles();
  createHoles();
  addBook();
});

function createHoles() {
  const dimensions = parseInt(getComputedStyle(main).getPropertyValue('--grid-min-size'));
  let width = main.offsetWidth;
  let height = main.offsetHeight;
  const size = Number(dimensions * 10);

  const vertical = Math.floor(width / size);
  const horizontal = Math.floor(height / size);

  // const remain = (vertical * horizontal) % 10;
  const holes = (vertical * horizontal);
  console.log(holes);

  for (let index = 0; index < holes; index++) {
    const hole = document.createElement('div');
    section.appendChild(hole).className = 'hole';
    const button = document.createElement('button');
    hole.appendChild(button).className = 'add';
  };
};

function removeHoles() {
  const holes = section.querySelectorAll('.hole');
  holes.forEach(hole => {
    hole.remove();
  })
}

function addBook() {
  const holes = section.querySelectorAll('.hole');
  holes.forEach(hole => {
    hole.querySelector('button.add').addEventListener('click', () => {
      createForm();
      container.querySelector('div.overlay').addEventListener('click', (event) => {
        if (event.target === container.querySelector('.overlay')) {
          container.removeChild(container.querySelector('.overlay'));
        }
      }, true);
    });
  });
}

function createForm() {
  const overlay = document.createElement('div');
  const prompt = document.createElement('div');
  const label = document.createElement('h2');
  label.appendChild(document.createTextNode('New Book:'));
  prompt.appendChild(label);

  const form = document.createElement('form');
  setAttributes(form, { method: 'post', action: '', name: 'add_book', target: '_self' });

  const titleLabel = document.createElement('label');
  titleLabel.appendChild(document.createTextNode('Title:'));
  const title = document.createElement('input');
  setAttributes(title, { type: 'text', id: 'title', name: 'book_title' });
  titleLabel.appendChild(title);

  const authorLabel = document.createElement('label');
  authorLabel.appendChild(document.createTextNode('Author:'));
  const author = document.createElement('input');
  setAttributes(author, { type: 'text', id: 'author', name: 'book_author' });
  authorLabel.appendChild(author);
  const pagesLabel = document.createElement('label');
  pagesLabel.appendChild(document.createTextNode('Pages:'));
  const pages = document.createElement('input');
  setAttributes(pages, { type: 'number', id: 'pages', name: 'book_pages' });
  pagesLabel.appendChild(pages);
  const readLabelSection = document.createElement('div');
  const readLabel = document.createElement('label');
  readLabel.appendChild(document.createTextNode('Have you read it before?:'));
  setAttributes(readLabel, { for: 'read' });
  const read = document.createElement('input');
  setAttributes(read, { type: 'checkbox', id: 'read', name: 'book_read' });
  const readCheck = document.createElement('label');
  setAttributes(readCheck, { for: 'read' });

  readLabelSection.className = 'reading';
  readLabelSection.appendChild(readLabel);
  readLabelSection.appendChild(read);
  readLabelSection.appendChild(readCheck);
  const submit = document.createElement('button');
  submit.textContent = 'Submit';

  form.appendChild(titleLabel);
  form.appendChild(authorLabel);
  form.appendChild(pagesLabel);
  form.appendChild(readLabelSection);
  form.appendChild(submit);
  prompt.appendChild(form);

  overlay.appendChild(prompt).className = 'prompt';
  container.appendChild(overlay).className = 'overlay';
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

function setAttributes(elem, attrs) { Object.entries(attrs).forEach(([key, value]) => elem.setAttribute(key, value)); }