import axios from 'axios';
import base from './base-url';
import buildCard from './render-cards';
import buildNotFind from './render-on-not-found';
import pagination from './pagination';
import screenWidth from './random-coctails';
import renderBtn from './renderPaginationBtn';
import {
  galleryList,
  paginationContainer,
  STORAGE_KEY,
  changeCoctails,
  page,
} from './changeCoctails';

const searfchDeskFormRef = document.querySelector('.header__search');
const searfchTabletFormRef = document.querySelector('.header__search.tablet');
const searfchMobileFormRef = document.querySelector('.header__search.mobile-form');
const searchInputRef = document.querySelector('.header__input');
const numbersContainer = document.querySelector('.numbers-container');

searfchDeskFormRef.addEventListener('submit', onSubmit);

if(searfchTabletFormRef){
  searfchTabletFormRef.addEventListener('submit', onSubmit);
}

if(searfchMobileFormRef){
  searfchMobileFormRef.addEventListener('submit', onSubmit);
}

if (paginationContainer) {
  paginationContainer.style.display = 'none';
  paginationContainer.addEventListener('click', changeCoctails);
}

async function searchFetch(name) {
  const url = `${base}search.php?s=${name}`;
  try {
    const { data } = await axios.get(`${url}`);
    return data;
  } catch ({ response: { status } }) {
    return status;
  }
}

async function onSubmit(e) {
  e.preventDefault();
  galleryList.innerHTML = '';
  numbersContainer.innerHTML = '';
  console.log(e);
  const { drinks } = await searchFetch(e.target[0].value.trim());
  if (drinks.length <= screenWidth()) {
    paginationContainer.style.display = 'none';
  }
  if (drinks === null) {
    paginationContainer.style.display = 'none';
    buildNotFind();
    return;
  }

  const coctailData = pagination(drinks);
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(coctailData));
  if (sessionStorage.getItem(STORAGE_KEY)) {
    const coctailDataParse = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    const keys = Object.keys(coctailDataParse);
    const renderDots = keys.length > 3;
    for (let i = 1; i <= keys.length; i++) {
      renderBtn(i);
      if (i === 3 && renderDots) {
        renderBtn('...');
        break;
      }
    }
    if (keys.length > 4) {
      renderBtn(keys.length);
    }
    paginationContainer.style.display = 'flex';
    numbersContainer.firstElementChild.classList.add('active');
  }

  buildCard(coctailData[page]);
}
