'use strict';

const buttons = document.querySelector('.wrap-btns');
const count = document.querySelector('#counter');

buttons.addEventListener('click', done);

if (localStorage.count) {
  count.textContent = localStorage.count
} else {
  localStorage.count = '0';
  count.textContent = '0';
}

function done(event) {
  let result = Number(localStorage.count);

  switch (event.target.id) {
    case 'increment':
      result++;
      break;
    case 'decrement':
      if (result === 0) {
        result = 0;
      } else {
        result--;
      }
      break;
    case 'reset':
      result = 0;
  }

  localStorage.count = result;
  count.textContent = localStorage.count;
}
