'use strict';

const querySize = new XMLHttpRequest();
const sizeTag = document.getElementById('sizeSwatch');
let currentSize, currentColor;
querySize.open('GET', 'https://neto-api.herokuapp.com/cart/sizes');
querySize.addEventListener('load', onLoadSize);
querySize.send();

function onLoadSize(event) {
  if (event.currentTarget.status === 200) {

    try {
      const sizes = JSON.parse(event.currentTarget.responseText);
      let count = 0;

      for (const size of sizes) {
        let el = document.createElement('div');
        el.dataset.value = size.type;
        el.classList.add('swatch-element');
        el.classList.add('plain');
        el.classList.add(size.type);

        if (size.isAvailable) {
          el.setAttribute('available', '');
        } else {
          el.classList.add('soldout');
        }

        sizeTag.appendChild(el);

        let el1 = document.createElement('input');
        el1.id = 'swatch-' + count.toString() + '-' + size.type;
        el1.type = 'radio';
        el1.name = 'size';
        el1.value = size.type;

        if (!size.isAvailable) {
          el1.setAttribute('disabled', '');
        }

        if (localStorage.size && el1.id === localStorage.size) {
          el1.setAttribute('checked', '');
          currentSize = el1;
        }

        el.appendChild(el1);

        el1 = document.createElement('label');
        el1.for = 'swatch-' + count.toString() + '-' + size.type;
        el1.textContent = size.title;

        if (size.isAvailable) {
          el1.addEventListener('click', (event) => {
            const input = document.getElementById(event.currentTarget.for);

            if (currentSize) {
              currentSize.removeAttribute('checked');
            }

            input.setAttribute('checked', '');
            localStorage.size = event.currentTarget.for;
            currentSize = input;
          });
        }

        el.appendChild(el1);

        let el2 = document.createElement('img');
        el2.classList.add('crossed-out');
        el2.src = "https://neto-api.herokuapp.com/hj/3.3/cart/soldout.png?10994296540668815886";
        el1.appendChild(el2);
        count++;
      }
    } catch (e) {}
  }
}

const queryColor = new XMLHttpRequest();
const colorTag = document.getElementById('colorSwatch');
queryColor.open('GET', 'https://neto-api.herokuapp.com/cart/colors');
queryColor.addEventListener('load', onLoadColor);
queryColor.send();

function onLoadColor(event) {

  if (event.currentTarget.status === 200) {
    try {
      const colors = JSON.parse(event.currentTarget.responseText);
      let count = 0;

      for (const color of colors) {
        let el = document.createElement('div');
        el.dataset.value = color.code;
        el.classList.add('swatch-element');
        el.classList.add('color');
        el.classList.add(color.code);

        if (color.isAvailable) {
          el.setAttribute('available', '');
        } else {
          el.classList.add('soldout');
        }

        colorTag.appendChild(el);

        let el1 = document.createElement('div');
        el1.classList.add('tooltip');
        el1.textContent = color.title;
        el.appendChild(el1);

        el1 = document.createElement('input');
        el1.quickbeam = 'color';
        el1.id = 'swatch-' + count.toString() + '-' + color.code;
        el1.type = 'radio';
        el1.name = 'color';
        el1.value = color.code;

        if (!color.isAvailable) {
          el1.setAttribute('disabled', '');
        }

        if (localStorage.color && el1.id === localStorage.color) {
          el1.setAttribute('checked', '');
          currentColor = el1;
        }

        el.appendChild(el1);

        el1 = document.createElement('label');
        el1.for = 'swatch-' + count.toString() + '-' + color.code;
        el1.style.borderColor = color.code;

        if (color.isAvailable) {
          el1.addEventListener('click', (event) => {
            const input = document.getElementById(event.currentTarget.for);

            if (currentColor) {
              currentColor.removeAttribute('checked');
            }

            input.setAttribute('checked', '');
            localStorage.color = event.currentTarget.for;
            currentColor = input;
          });
        }

        el.appendChild(el1);

        let el2 = document.createElement('span');
        el2.style.backgroundColor = color.code;
        el1.appendChild(el2);

        el2 = document.createElement('img');
        el2.classList.add('crossed-out');
        el2.src = "https://neto-api.herokuapp.com/hj/3.3/cart/soldout.png?10994296540668815886";
        el1.appendChild(el2);
        count++;
      }
    } catch (e) {}
  }
}

const queryBusket = new XMLHttpRequest();
const busketTag = document.getElementById('quick-cart');
queryBusket.open('GET', 'https://neto-api.herokuapp.com/cart');
queryBusket.addEventListener('load', onLoadBusket);
queryBusket.send();

const form = document.getElementById('AddToCartForm');

form.addEventListener('submit', (event) => onLoadBusket(form.dataset.productId, 'add'));
document.querySelector('#quick-cart').addEventListener('click',  (event) => onLoadBusket(form.dataset.productId, 'del'))

function onLoadBusket(id, reg) {
  event.preventDefault();
  let priceBusket = 0;

  try {
    let query;

    if (id && reg === 'add') {
      query = new XMLHttpRequest();
      query.open('POST', 'https://neto-api.herokuapp.com/cart');
      const formData = new FormData(event.currentTarget);
      formData.append('productId', id);
      query.addEventListener('load', (event) => onLoadBusketAddDel(id, 'add', formData));
      query.send(formData);
      event.stopPropagation();
    } else if (id && reg === 'del' && event.target.classList.contains('quick-cart-product-remove') && event.target.classList.contains('remove')) {
      query = new XMLHttpRequest();
      query.open('POST', 'https://neto-api.herokuapp.com/cart/remove');
      const formData = new FormData();
      formData.append('productId', id);
      query.addEventListener('load', (event) => onLoadBusketAddDel(id, 'del', formData));
      query.send(formData);
      event.stopPropagation();
    } else {
      if (event.currentTarget.status === 200) {
        const products = JSON.parse(event.currentTarget.responseText);

        for (const product of products) {
          priceBusket += createProduct(product);
        }

        createBusket(priceBusket);
      }
    }
  } catch (e) {}
}

function onLoadBusketAddDel(id, reg, formData) {

  if (event.currentTarget.error) {

  } else if (reg === 'add') {
    let price = 0;
    formData.append('id', id);
    formData.append('title', document.querySelector('.product-detail h1').textContent);
    formData.append('price', document.getElementById('price-preview').textContent.match(/\d+[/.]\d+/g).join());
    let image = document.getElementById('big-image').style.backgroundImage.toString();
    image = image.substr(image.indexOf('"') + 1);
    image = image.substr(0, image.indexOf('?'));
    formData.append('pic', image);

    if (document.getElementById('quick-cart-product-'+id.toString())) {
      document.getElementById('quick-cart-product-count-'+id.toString()).textContent = Number(document.getElementById('quick-cart-product-count-'+id.toString()).textContent) + 1;
      price = Number(document.querySelector('#quick-cart-product-'+id.toString()+' .s1').textContent.substr(1));
    } else {
      const obj = {};
      for(const [k, v] of formData) {
        obj[k] = v;
      }
      createProduct(obj);
      price = Number(obj.price);
    }

    document.getElementById('quick-cart-pay').classList.add('open');
    document.getElementById('quick-cart-price').textContent = '$' + (Number(document.getElementById('quick-cart-price').textContent.substr(1)) + price).toString();
  } else if (reg === 'del') {
    let quantity = document.getElementById('quick-cart-product-count-'+id.toString());
    const price = Number(document.querySelector('#quick-cart-product-'+id.toString()+' .s1').textContent.substr(1));

    if ((Number(quantity.textContent) - 1) === 0) {
      document.getElementById('quick-cart').removeChild(document.getElementById('quick-cart-product-'+id.toString()));
    } else {
      quantity.textContent = Number(quantity.textContent) - 1;
    }

    document.getElementById('quick-cart-price').textContent = '$' + (Number(document.getElementById('quick-cart-price').textContent.substr(1)) - price).toString();

    if (document.getElementById('quick-cart-price').textContent === '$0') {
      document.getElementById('quick-cart-pay').classList.remove('open');
    }
  }

}

function createProduct(product) {
  let el = document.createElement('div');
  el.classList.add('quick-cart-product');
  el.classList.add('quick-cart-product-static');
  el.id = 'quick-cart-product-' + product.id.toString();
  el.style.opacity = 1;
  const productPrice = Number(product.price) * Number(product.quantity);
  busketTag.appendChild(el);

  let el1 = document.createElement('div');
  el1.classList.add('quick-cart-product-wrap');
  el.appendChild(el1);

  let el2 = document.createElement('img');
  el2.src = product.pic;
  el2.title = product.title;
  el1.appendChild(el2);

  el2 = document.createElement('span');
  el2.classList.add('s1');
  el2.style.backgroundColor = '#000';
  el2.style.opacity = '.5';
  el2.textContent = '$' + product.price.toString();
  el1.appendChild(el2);

  el2 = document.createElement('span');
  el2.classList.add('s2');

  el1 = document.createElement('span');
  el1.classList.add('count');
  el1.classList.add('hide');
  el1.classList.add('fadeUp');
  el1.id = 'quick-cart-product-count-' + product.id.toString();
  el1.textContent = product.quantity;
  el.appendChild(el1);

  el1 = document.createElement('span');
  el1.classList.add('quick-cart-product-remove');
  el1.classList.add('remove');
  el1.dataset.id = product.id.toString();
  el.appendChild(el1);
  return productPrice;
}

function createBusket(priceBusket) {
  let el = document.createElement('a');
  el.id = 'quick-cart-pay';
  el.quickbeam = 'cart-pay';
  el.classList.add('cart-ico');

  if (priceBusket !== 0) {
    el.classList.add('open');
  }

  busketTag.appendChild(el);

  let el1 = document.createElement('span');
  el.appendChild(el1);

  let el2 = document.createElement('strong');
  el2.classList.add('quick-cart-text');
  el2.textContent = 'Оформить заказ<br>';
  el1.appendChild(el2);

  el2 = document.createElement('span');
  el2.id = 'quick-cart-price';
  el2.textContent = '$' + (Math.round(priceBusket * 100) / 100).toString();
  el1.appendChild(el2);
}