import { Notify } from 'notiflix';
import SimpleLightbox from "simplelightbox";
import { fetchImges } from './fetchImges.js';
import './css/styles.css';
import "simplelightbox/dist/simple-lightbox.min.css";

let incrementPage = 1;
let totalHits = 0;
let inputData = null;

Notify.init({
  timeout: 2000,
  clickToClose: true,
});

const galleryEl = document.querySelector('.gallery');
const formEl = document.getElementById('search-form');
const btnLoadMoreEl = document.querySelector('.load-more');

formEl.addEventListener('submit', onSearch);

async function onSearch(e) {
    e.preventDefault();
    
    btnLoadMoreEl.classList.add('is-hidden');
    galleryEl.innerHTML = "";
    incrementPage = 1;
    totalHits = 0;

    inputData = e.currentTarget.searchQuery.value.trim();
    const fetch = await fetchImges(inputData, incrementPage);

    if (fetch.totalHits !== 0) {
        Notify.info(`Hooray! We found ${fetch.totalHits} images.`);
    };

    onValidationTotalImg(fetch);
    btnLoadMoreEl.addEventListener('click', onLoadMore);
};

async function onLoadMore() {
    incrementPage += 1;
    const fetch = await fetchImges(inputData, incrementPage);

    onValidationTotalImg(fetch);
};

function onMarkupGallery(imgArray) {
    const markupGallery = imgArray.map(({ webformatURL, tags, likes, views, comments, downloads, largeImageURL }) => {
    return `<div class="photo-card">
                <a class="gallery__item" href="${largeImageURL}">
                    <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy"/>
                    <div class="info">
                    <p class="info-item">
                        <b>Likes:</b>${likes}
                    </p>
                    <p class="info-item">
                        <b>Views</b>${views}
                    </p>
                    <p class="info-item">
                        <b>Comments</b>${comments}
                    </p>
                    <p class="info-item">
                        <b>Downloads</b>${downloads}
                    </p>
                    </div>
                </a>
            </div>`
    }).join('');

    galleryEl.insertAdjacentHTML('beforeend', markupGallery);
    
    const lightbox = new SimpleLightbox('.gallery a', {
        captionDelay: 250,
        captions: true,
        captionsData: 'alt',
    }).refresh();

    onScroll()
};

const onValidationTotalImg = (data) => {

    if (data.hits.length === 0) {
        Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
        return;
    };

    totalHits += data.hits.length;

    if (data.totalHits === totalHits) {
        btnLoadMoreEl.classList.add('is-hidden');
        Notify.info(`Were sorry, but you've reached the end of search results.`);
    } else {
        btnLoadMoreEl.classList.remove('is-hidden');
    };

    onMarkupGallery(data.hits);
  };

function onScroll() {
    if (incrementPage < 2) {
        return
    };
    const cardHeight = galleryEl.firstElementChild.getBoundingClientRect();
    window.scrollBy({
        top: cardHeight.height * 2.5,
        behavior: "smooth",
    });
};