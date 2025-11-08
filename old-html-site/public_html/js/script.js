'use strict';

const icon1 = document.getElementById('nav-icon1');
const body = document.querySelector('body');
const hambSpan = document.querySelectorAll('.span');
const navMobile = document.querySelector('.nav__mobile');
const navMobileLinks = document.querySelectorAll('.nav__link');

navMobileLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('active');
    icon1.classList.remove('open');
    spanBg();
    body.classList.remove('stop-scroll');
  });
});

// Hamburger
icon1.addEventListener('click', () => {
  icon1.classList.toggle('open');
  navMobile.classList.toggle('active');
  body.classList.toggle('stop-scroll');
  spanBg();
});

function spanBg() {
  hambSpan.forEach((span) => {
    if (span.classList.contains('black')) {
      span.classList.remove('black');
    } else {
      span.classList.add('black');
    }
  });
}

const dropdownBtn = document.querySelector('.nav__dropdown-btn');
const dropdownMenu = document.querySelector('.nav__dropdown');
const dropDownnBtnArrow = document.querySelector('.nav__dropdown-btn::after');

dropdownBtn.addEventListener('click', () => {
  dropdownMenu.classList.toggle('nav__dropdown--active');
});

document.addEventListener('click',  (e) => {
  if (e.target !== dropdownBtn && e.target !== dropdownMenu) {
    dropdownMenu.classList.remove('nav__dropdown--active');
  }
});
