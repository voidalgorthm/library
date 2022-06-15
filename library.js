document.addEventListener('DOMContentLoaded', function () {
  createBinders();
  queueBooks();
}, false);

const container = document.querySelector('.container');
const main = container.querySelector('.main');
const section = main.querySelector('.section');

window.addEventListener('resize', function () {
  removeBinders();
  recalibrateBinders();
  queueBooks();
});

let isModify = false;
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

const potterphilostone = new Book('Harry Potter and the Philosopher\'s Stone', 'J. K. Rowling', 766, 'on');
const hobbit = new Book('The Hobbit', 'J.R.R. Tolkien', 295, 'off');
library.push(hobbit);
library.push(potterphilostone);

const getScreenSize = () => {
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

function recalibrateBinders() {
  if ((section.querySelectorAll('.binder').length - 1) > library.length) return;

  let add = 1;
  if (library.length >= section.querySelectorAll('.binder').length) {
    add = library.length - section.querySelectorAll('.binder').length;
    add += 1;
  }
  console.log(add);

  for (let index = 1; index <= add; index++) {
    const binder = document.createElement('div');
    button = addButton();
    binder.appendChild(button);
    section.appendChild(binder).className = 'binder';
  }
}

function createBinders() {
  const spaces = getScreenSize();
  for (let index = 0; index < spaces; index++) {
    const binder = document.createElement('div');
    button = addButton();
    binder.appendChild(button);
    section.appendChild(binder).className = 'binder';
  }
};

function removeBinders() {
  const binders = section.querySelectorAll('.binder');
  binders.forEach(binder => {
    binder.remove();
  })
}

const addButton = () => {
  const button = document.createElement('button');
  button.className = 'add';
  button.addEventListener('click', () => {
    requeueBooks();
    queueBooks();
    createForm();
  });
  return button;
}

function requeueBooks() {
  const binders = section.querySelectorAll('.binder.occupied');
  binders.forEach(binder => {
    const elements = binder.querySelectorAll('div');
    elements.forEach(element => { element.remove(); });
    binder.classList.remove('occupied');
    binder.appendChild(addButton());
  });
}

const updateRead = (button) => {
  button.style.backgroundColor = button.value === 'on'
    ? getComputedStyle(main).getPropertyValue('--valid-theme-bgcolor')
    : getComputedStyle(main).getPropertyValue('--invalid-theme-bgcolor');
}

function queueBooks() {
  if (Array.isArray(library) && !library.length) return;

  console.log(library);
  const books = section.querySelectorAll('.binder');

  for (let index = 0; index < books.length; index++) {
    if (!library.hasOwnProperty(index)) break;
    books[index].querySelector('button.add').remove();
    const bookTitle = document.createElement('div');
    bookTitle.className = 'booktitle';
    bookTitle.textContent = library[index].title;
    const bookAuthor = document.createElement('div');
    bookAuthor.textContent = `by ${library[index]['author']}`;
    const bookPages = document.createElement('div');
    bookPages.textContent = `${library[index]['pages']} pages`;
    const bookRead = document.createElement('div');
    const readButton = document.createElement('button');
    readButton.className = 'switch';
    setAttributes(readButton, { type: 'button', id: 'readbutton', name: 'readbutton' });
    readButton.textContent = valueToReadable(library[index]['read']);
    readButton.value = library[index]['read'];
    updateRead(readButton);

    readButton.addEventListener('click', () => {
      readButton.value = (readButton.value === 'on') ? 'off' : 'on';
      library[index]['read'] = (library[index]['read'] === 'on') ? 'off' : 'on';
      updateRead(readButton);
      readButton.textContent = valueToReadable(readButton.value);
    });
    bookRead.appendChild(readButton);

    const bookControls = document.createElement('div');
    bookControls.className = 'bookcontrol';

    const bookEdit = document.createElement('button');
    bookEdit.className = 'control';
    setAttributes(bookEdit, { type: 'button', id: 'bookEdit', name: 'bookEdit' });
    bookEdit.textContent = 'Edit';
    bookEdit.addEventListener('click', () => {
      isModify = true;
      const edit = library[index];
      getBookDetails(edit, index);
      requeueBooks();
      queueBooks();
    });

    const bookRemove = document.createElement('button');
    bookRemove.className = 'control';
    setAttributes(bookRemove, { type: 'button', id: 'bookRemove', name: 'bookRemove' });
    bookRemove.textContent = 'Remove';
    bookRemove.addEventListener('click', () => {
      library.splice(index, 1);
      requeueBooks();
      queueBooks();
      console.log(library);
    });

    bookControls.appendChild(bookEdit);
    bookControls.appendChild(bookRemove);

    books[index].appendChild(bookTitle);
    books[index].appendChild(bookAuthor);
    books[index].appendChild(bookPages);
    books[index].appendChild(bookRead);
    books[index].appendChild(bookControls);

    books[index].classList.add('occupied');
  }
}

const getBookDetails = (book, index) => {
  createForm(index);
  const form = container.querySelector('.overlay').querySelector('.prompt').querySelector('form');
  const inputs = form.querySelectorAll('label > input, div.reading > div.checkbox > input');
  inputs.forEach(input => {
    Object.entries(book).forEach(([key, val]) => {
      if (key === input.id) {
        if (key === 'read') input.checked = readableToCheck(val);
        else input.value = val;
      }
    });
  });
}

const getBookData = (form) => {
  const rawBooks = Object.values(form).reduce((obj, field) => { obj[field.name] = field.value; return obj }, {});
  let bookProperties = [];
  Object.entries(rawBooks).forEach(([key, value]) => { if (key !== '') { bookProperties.push(value); } });
  return bookProperties;
}

function removeForm() {
  container.removeChild(container.querySelector('.overlay'));
}

function createForm(index) {
  const overlay = document.createElement('div');
  overlay.addEventListener('click', (event) => { if (event.target === overlay) { removeForm(); } });
  const prompt = document.createElement('div');
  const label = document.createElement('h2');

  label.appendChild(document.createTextNode('New Book:'));
  prompt.appendChild(label);
  const form = document.createElement('form');
  setAttributes(form, { method: 'post', id: 'booksForm' });

  const titleLabel = document.createElement('label');
  titleLabel.appendChild(document.createTextNode('Title:'));
  const title = document.createElement('input');
  setAttributes(title, { type: 'text', id: 'title', name: 'title', autocomplete: 'off' });
  const titleSpan = document.createElement('span');
  titleLabel.appendChild(title);
  titleLabel.appendChild(titleSpan);
  const authorLabel = document.createElement('label');
  authorLabel.appendChild(document.createTextNode('Author:'));
  const author = document.createElement('input');
  setAttributes(author, { type: 'text', id: 'author', name: 'author', autocomplete: 'off' });
  const authorSpan = document.createElement('span');
  authorLabel.appendChild(author);
  authorLabel.appendChild(authorSpan);
  const pagesLabel = document.createElement('label');
  pagesLabel.appendChild(document.createTextNode('Pages:'));
  const pages = document.createElement('input');
  setAttributes(pages, { type: 'number', id: 'pages', name: 'pages', autocomplete: 'off' });
  const pagesSpan = document.createElement('span');
  pagesLabel.appendChild(pages);
  pagesLabel.appendChild(pagesSpan);
  const readLabelSection = document.createElement('div');
  const readLabel = document.createElement('label');
  readLabel.appendChild(document.createTextNode('Have you read it before?:'));
  setAttributes(readLabel, { for: 'read' });
  const checkbox = document.createElement('div');
  checkbox.className = 'checkbox';
  const read = document.createElement('input');
  setAttributes(read, { type: 'checkbox', id: 'read', name: 'read', autocomplete: 'off' });
  const readCheck = document.createElement('label');
  readCheck.className = 'readCheck';
  setAttributes(readCheck, { for: 'read' });
  checkbox.appendChild(read);
  checkbox.appendChild(readCheck);
  readLabelSection.className = 'reading';
  readLabelSection.appendChild(readLabel);
  readLabelSection.appendChild(checkbox);
  const submit = document.createElement('button');
  setAttributes(submit, { type: 'submit', form: 'booksForm', formaction: 'post' });
  submit.textContent = isModify === true ? 'Save' : 'Submit';

  form.appendChild(titleLabel);
  form.appendChild(authorLabel);
  form.appendChild(pagesLabel);
  form.appendChild(readLabelSection);
  form.appendChild(submit);

  validateAfter(form);

  submit.addEventListener('click', () => {
    read.value = checkToValue(read.checked);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let validTitle = checkTitle(), validAuthor = checkAuthor(), validPages = checkPages();
    let validForm = validTitle && validAuthor && validPages;

    if (!validForm) form.querySelector('input.error').focus();

    if (validForm) {
      const rawBook = getBookData(form);
      const newBook = new Book(...rawBook);
      isModify === true ? library.splice(index, 1, newBook) : library.push(newBook);
      // library.splice(index, 1);
      removeForm();
      recalibrateBinders();
      requeueBooks();
      queueBooks();
      isModify = false;
    }
  });

  prompt.appendChild(form);
  overlay.appendChild(prompt).className = 'prompt';
  container.appendChild(overlay).className = 'overlay';
  title.focus();
}

const validateAfter = (form) => {
  const inputs = form.querySelectorAll('label > input');
  inputs.forEach(input => {
    input.addEventListener('focusout', (event) => {
      switch (event.target.id) {
        case 'title':
          checkTitle();
          break;
        case 'author':
          checkAuthor();
          break;
        case 'pages':
          checkPages();
          break;
      }
    })
  });
}

const isRequired = value => value === '' ? false : true;
const isBetween = (length, min, max) => length < min || length > max ? false : true;

const checkTitle = () => {
  const titleInput = document.querySelector('#title');
  let valid = false;
  const min = 1,
    max = 200;
  const title = titleInput.value.trim();

  if (!isRequired(title)) {
    showError(titleInput, 'Title cannot be blank.');
  } else if (!isBetween(title.length, min, max)) {
    showError(titleInput, `Title must be between ${min} and ${max} characters.`)
  } else {
    showSuccess(titleInput);
    valid = true;
  }
  return valid;
};

const checkAuthor = () => {
  const authorInput = document.querySelector('#author');
  let valid = false;
  const min = 1,
    max = 200;
  const author = authorInput.value.trim();

  if (!isRequired(author)) {
    showError(authorInput, 'Author cannot be blank.');
  } else if (!isBetween(author.length, min, max)) {
    showError(authorInput, `Author must be between ${min} and ${max} characters.`)
  } else {
    showSuccess(authorInput);
    valid = true;
  }
  return valid;
};

const checkPages = () => {
  const pagesInput = document.querySelector('#pages');
  let valid = false;
  const min = 1,
    max = 10000;
  const pages = pagesInput.value.trim();

  if (!isRequired(pages)) {
    showError(pagesInput, 'Pages cannot be blank.');
  } else if (!isBetween(pages, min, max)) {
    showError(pagesInput, `Pages must be between the numbers of ${min} and ${max}.`)
  } else {
    showSuccess(pagesInput);
    valid = true;
  }
  return valid;
};

const showError = (input, message) => {
  const formField = input.parentElement;
  input.classList.remove('success');
  input.classList.add('error');

  const error = formField.querySelector('span');
  error.textContent = message;
};

const showSuccess = (input) => {
  const formField = input.parentElement;
  input.classList.remove('error');
  input.classList.add('success');

  const error = formField.querySelector('span');
  error.textContent = '';
}

function checkToValue(status) {
  return status === true ? 'on' : 'off';
}

function valueToReadable(status) {
  return status === 'on' ? 'have read' : 'haven\'t read yet';
}

function readableToCheck(status) {
  return status === 'on' ? true : false;
};

function setAttributes(elem, attrs) { Object.entries(attrs).forEach(([key, value]) => elem.setAttribute(key, value)); }