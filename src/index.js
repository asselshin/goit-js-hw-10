import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import {fetchCountries} from './js/fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

input.style.borderColor = "blue";
input.addEventListener('input', debounce((ev) => {

    const countryIn = input.value.trim();    
    
    const url = `https://restcountries.com/v3.1/name/${countryIn}?fields=name,capital,population,flags,languages`;
    
    if (countryIn === "") {
        clearHtml();
        return;
    } else if (ev.inputType === "deleteContentBackward" && countryIn === "") {
        clearHtml();
        return;
    };
    
    fetchCountries(url)
        .then((countries) => {
            if (countries.length === 1) {
                countryList.innerHTML = "";
                const result = countries.map((country) => {
                    return createInfo(country);
                }).join('');
                return countryInfoEl.innerHTML = result;
            } else if (countries.length < 10 && countries.length >= 2) {
                countryInfoEl.innerHTML = "";
                const result = countries.map(country => {
                    const { flags, name } = country;
                    return createListItem(flags.svg, flags.alt, name.official);
                }).join("");
                return countryList.innerHTML = result;
            } else if (countries.length > 10) {
                Notiflix.Notify.info(
                    'Too many matches found. Please enter a more specific name.'
                );
                clearHtml();
                return;
            }
        }).catch((error) => {
            if (error.message === "404") {
                clearHtml();
                
                return Notiflix.Notify.failure(
                'Oops, there is no country with that name'
                );
            }
            console.log(error);
        });
}, DEBOUNCE_DELAY));
    
function createInfo(data) {
    const { flags, name, capital, population, languages } = data;

    return `<img src='${flags.svg}' alt='${flags.alt}' width = 50px>
    <h1>  ${name.official}</h1>
    <ul>
    <li><b>Capital:</b> ${capital}</li>
    <li><b>Population:</b> ${population} </li>
    <li><b>Languages:</b> ${Object.values(languages)} </li>    
    </ul>`;
};    

function createListItem(source, description, countryName) {
    return `<li><img src='${source}' alt='${description}' width=30px/> ${countryName} </li>`;
};

function clearHtml() {
  countryList.innerHTML = '';
  countryInfoEl.innerHTML = '';
};