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
        if (event.target === container.querySelector('.overlay')) { removeForm(); } }, true);
    });
  });
}

function removeForm() {
  container.removeChild(container.querySelector('.overlay'));
}

function createForm() {
  const overlay = document.createElement('div');
  const prompt = document.createElement('div');
  const label = document.createElement('h2');

  label.appendChild(document.createTextNode('New Book:'));
  prompt.appendChild(label);
  const form = document.createElement('form');
  setAttributes(form, { method: 'post', id: 'Books' });

  const titleLabel = document.createElement('label');
  titleLabel.appendChild(document.createTextNode('Title:'));
  const title = document.createElement('input');
  setAttributes(title, { type: 'text', id: 'title', name: 'title' });
  titleLabel.appendChild(title);
  const authorLabel = document.createElement('label');
  authorLabel.appendChild(document.createTextNode('Author:'));
  const author = document.createElement('input');
  setAttributes(author, { type: 'text', id: 'author', name: 'author' });
  authorLabel.appendChild(author);
  const pagesLabel = document.createElement('label');
  pagesLabel.appendChild(document.createTextNode('Pages:'));
  const pages = document.createElement('input');
  setAttributes(pages, { type: 'number', id: 'pages', name: 'pages' });
  pagesLabel.appendChild(pages);
  const readLabelSection = document.createElement('div');
  const readLabel = document.createElement('label');
  readLabel.appendChild(document.createTextNode('Have you read it before?:'));
  setAttributes(readLabel, { for: 'read' });
  const checkbox = document.createElement('div');
  checkbox.className = 'checkbox';
  const read = document.createElement('input');
  setAttributes(read, { type: 'checkbox', id: 'read', name: 'read' });
  const readCheck = document.createElement('label');
  readCheck.className = 'readCheck';
  setAttributes(readCheck, { for: 'read' });
  checkbox.appendChild(read);
  checkbox.appendChild(readCheck);
  readLabelSection.className = 'reading';
  readLabelSection.appendChild(readLabel);
  readLabelSection.appendChild(checkbox);
  const submit = document.createElement('button');
  setAttributes(submit, { type: 'submit', form: 'Books', formaction: 'post' });
  submit.textContent = 'Submit';

  form.appendChild(titleLabel);
  form.appendChild(authorLabel);
  form.appendChild(pagesLabel);
  form.appendChild(readLabelSection);
  form.appendChild(submit);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  submit.addEventListener('click', () => {
    const rawBooks = Object.values(form).reduce((obj, field) => { obj[field.name] = field.value; return obj }, {});
    let bookProperties = [];
    Object.entries(rawBooks).forEach(([key, value]) => { if(key !== '') { bookProperties.push(value); } });
    console.log(bookProperties);
    
    const newBook = new Book(...bookProperties);
    library.push(newBook);
    console.log(library);
    removeForm();
  });

  overlay.appendChild(prompt).className = 'prompt';
  container.appendChild(overlay).className = 'overlay';
  prompt.appendChild(form);
  title.focus();
}

let library = [];

class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = function () {
      return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read}`;
    }
  }
}

const hobbit = new Book('The Hobbit', 'J.R.R. Tolkien', 295, 'on');
library.push(hobbit);

function setAttributes(elem, attrs) { Object.entries(attrs).forEach(([key, value]) => elem.setAttribute(key, value)); }