document.addEventListener('DOMContentLoaded', function () {
  createBinders();
  queueBooks();
}, false);

const container = document.querySelector('.container');
const main = container.querySelector('.main');
const section = main.querySelector('.section');

window.addEventListener('resize', function () {
  removeBinders();
  createBinders();
  queueBooks();
});

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

const hobbit = new Book('The Hobbit', 'J.R.R. Tolkien', 295, 'have read');
library.push(hobbit);
/* const argh = new Book('The Hobbit', 'J.R.R. Tolkien', 295, 'not read');
library.push(argh);
const why = new Book('The Hobbit', 'J.R.R. Tolkien', 295, 'non read');
library.push(why); */

function getScreenSize() {
  const dimensions = parseInt(getComputedStyle(main).getPropertyValue('--grid-min-size'));
  let width = main.offsetWidth;
  let height = main.offsetHeight;
  const size = Number(dimensions * 10);

  const vertical = Math.floor(width / size);
  const horizontal = Math.floor(height / size);

  // const remain = (vertical * horizontal) % 10;
  const holes = (vertical * horizontal);
  return holes;
}

function createBinders() {
  const numberHoles = getScreenSize();

  for (let index = 0; index < numberHoles; index++) {
    const binder = document.createElement('div');
    section.appendChild(binder).className = 'binder';
    button = createButton();
    binder.appendChild(button);
  };
};

function createButton() {
  const button = document.createElement('button');
  button.className = 'add';
  button.addEventListener('click', () => {
    createForm();
    container.querySelector('div.overlay').addEventListener('click', (event) => {
      if (event.target === container.querySelector('.overlay')) { removeForm(); }
    }, true);
  });
  return button;
}

function removeBinders() {
  const binders = section.querySelectorAll('.binder');
  binders.forEach(binder => {
    binder.remove();
  })
}

function queueBooks() {
  if (Array.isArray(library) && !library.length) return;

  const books = section.querySelectorAll('.binder');

  for (let index = 0; index < books.length; index++) {
    if(!library.hasOwnProperty(index)) break;
    // typeof library[index] === 'undefined'
    books[index].querySelector('button.add').remove();
    const bookTitle = document.createElement('p');
    bookTitle.textContent = library[index].title;
    const bookAuthor = document.createElement('p');
    bookAuthor.textContent = library[index]['author'];
    const bookPages = document.createElement('p');
    bookPages.textContent = library[index]['pages'];
    const bookRead = document.createElement('p');
    bookRead.textContent = library[index]['read'];
    books[index].appendChild(bookTitle);
    books[index].appendChild(bookAuthor);
    books[index].appendChild(bookPages);
    books[index].appendChild(bookRead);

    books[index].classList.add('occupied');
  }
}

function requeueBooks() {
  const binders = section.querySelectorAll('.binder.occupied');
  binders.forEach(binder => {
    const elements = binder.querySelectorAll('p');
    elements.forEach(element => { element.remove(); });
    binder.classList.remove('occupied');
    binder.appendChild(createButton());
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
    checkCheckbox(read);
    const rawBooks = Object.values(form).reduce((obj, field) => { obj[field.name] = field.value; return obj }, {});
    let bookProperties = [];
    Object.entries(rawBooks).forEach(([key, value]) => { if (key !== '') { bookProperties.push(value); } });
    const newBook = new Book(...bookProperties);
    library.push(newBook);
    console.log(library);
    removeForm();
    requeueBooks();
    queueBooks();
  });

  prompt.appendChild(form);
  overlay.appendChild(prompt).className = 'prompt';
  container.appendChild(overlay).className = 'overlay';
  title.focus();
}

function checkCheckbox(input) {
  const read = input;
  read.value = read.checked === true ? 'have read' : 'haven\'t read yet';
}

function setAttributes(elem, attrs) { Object.entries(attrs).forEach(([key, value]) => elem.setAttribute(key, value)); }