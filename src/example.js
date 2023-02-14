import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;
const inputSearchEl = document.getElementById('search-box');
const listCountryEl = document.querySelector('.country-list');
const infoCountryEl = document.querySelector('.country-info');


inputSearchEl.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry(e) {
    const nameCountry = e.target.value.trim();
    if (nameCountry === '') {
        clearMarkup();
        return;
    };
    
    fetchCountries(nameCountry)
    .then(data => {
        const countCountry = data.length;

        if (countCountry > 10) {
            clearMarkup();
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        }
        else if (countCountry >= 2 && countCountry <= 10) { renderListCountry(data) }
        else { renderCountry(data) };
    })
    .catch(catchEror);

};

function renderListCountry(data) {

    const listCountry = data.map(country => {
        const { name: { common: nameCountry },
            flags: { svg: flagCountry, alt: textFlag } } = country;
        
        return `<li class="country-item">
                    <img width = "50" src=${flagCountry} alt="${textFlag}" />
                    <h2 class="country-name">${nameCountry}</h2>
                </li>`
    }).join('');

    clearMarkup();    
    listCountryEl.innerHTML = listCountry;
};

function renderCountry(data) {
    const infoCountry = data.map(country => {
        const {
            name: { common: nameCountry },
            flags: { svg: flagCountry, alt: textFlag },
            languages,
            population,
            capital
        } = country;
    
        return `<div class="base-info">
                    <img width = "70" src=${flagCountry} alt="${textFlag}" />
                    <h2 class="name-country">${nameCountry}</h2>
                </div>
                <ul class="list-param">
                    <li class="item-param"><span class="name-param">Capital: </span>${capital.join(', ')}</li>
                    <li class="item-param"><span class="name-param">Population: </span>${population}</li>
                    <li class="item-param"><span class="name-param">Languages: </span>${Object.values(languages).join(', ')}</li>
                </ul>`
    }).join('');

    clearMarkup();    
    infoCountryEl.innerHTML = infoCountry;
};

function catchEror() {
    clearMarkup();
    Notiflix.Notify.failure('Oops, there is no country with that name');
};

function clearMarkup() {
    infoCountryEl.innerHTML = '';
    listCountryEl.innerHTML = '';   
};
