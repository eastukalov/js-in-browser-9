'use strict';

document.querySelector('.sign-in-htm').addEventListener('submit', done);
document.querySelector('.sign-up-htm').addEventListener('submit', done);

function done(event) {
  event.preventDefault();
  let reg = '';
  const query = new XMLHttpRequest();

  if (event.currentTarget.classList.contains('sign-in-htm')) {
    reg = 'in';
    query.open('POST', 'https://neto-api.herokuapp.com/signin');
  } else {
    reg = 'out';
    query.open('POST', 'https://neto-api.herokuapp.com/signup');
  }

  const output = event.currentTarget.querySelector('.error-message');
  query.setRequestHeader('Content-Type', 'application/json');

  const formData = new FormData(event.currentTarget);
  let json = {};

  for(const [k, v] of formData) {
    json[k] = v;
  }

  query.addEventListener('load', (event) => onLoad(output, reg));
  query.send(JSON.stringify(json));
}

function onLoad(output, reg) {
  try {
    const result = JSON.parse(event.currentTarget.responseText);

    if (result.error) {
      output.value = result.message;
    } else {
      if (reg === 'in') {
        output.value = 'Пользователь ' + result.name + ' успешно авторизован';
      } else {
        output.value = 'Пользователь ' + result.name + ' успешно зарегистрирован';
      }
    }

  } catch (e) {}

}