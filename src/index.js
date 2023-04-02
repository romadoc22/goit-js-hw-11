import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '34776135-c2da03be0c2ba8614e7d82d4c';
const BASE_URL = 'https://pixabay.com/api/';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});

const refs = {
  formEl: document.querySelector('#search-form'),
  cardEl: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
refs.loadMoreBtn.style.display = 'none';
console.log(refs.loadMoreBtn);

let searchQuerry = '';
let currentPage = 1;

refs.formEl.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  resetPage();
  e.preventDefault();
  clearContainer();
  searchQuerry = e.currentTarget.elements.searchQuery.value.trim();
  const url = `${BASE_URL}?key=${API_KEY}&q=${searchQuerry}&type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${currentPage}`;
  if (searchQuerry === '') {
    refs.loadMoreBtn.style.display = 'none';
    Notiflix.Notify.failure('Enter something.');
  } else {
    fetchImage(url).then(cards => {
      if (cards.hits.length === 0) {
        refs.loadMoreBtn.style.display = 'none';
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.success(`Hooray! We found ${cards.totalHits} images.`);
      }
    });
  }
}

async function fetchImage(url) {
  try {
    const response = await axios(url);
    const cards = response.data;
    refs.cardEl.insertAdjacentHTML('beforeend', renderCards(cards));
    currentPage += 1;
    refs.loadMoreBtn.style.display = 'block';
    return cards;
  } catch {
    refs.loadMoreBtn.style.display = 'none';
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

function onLoadMore() {
  refs.loadMoreBtn.style.display = 'none';
  lightbox.refresh();
  const url = `${BASE_URL}?key=${API_KEY}&q=${searchQuerry}&type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${currentPage}`;
  fetchImage(url);
}

function renderCards(cards) {
  return cards.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
<a class='gallery__link' href='${largeImageURL}'><img class='gallery__image' src="${webformatURL}" alt="${tags}" loading="lazy" width='360' height='260'/></a>
<div class="info">
  <p class="info-item">
    <b>Likes:${likes}</b>
  </p>
  <p class="info-item">
    <b>Views:${views}</b>
  </p>
  <p class="info-item">
    <b>Comments:${comments}</b>
  </p>
  <p class="info-item">
    <b>Downloads:${downloads}</b>
  </p>
</div>
</div>`;
      }
    )

    .join('');
}

function clearContainer() {
  refs.cardEl.innerHTML = '';
}

function resetPage() {
  currentPage = 1;
}
// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });
