export default class NewsApiService {
  constructor() {
    this.findQuery = '';
    this.page = 1;
  }
  fetchArticles() {
    const apiKey = '34786929-2a8eb0507aebd7b127a0a58b0';
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${this.findQuery}&per_page=40&page=${this.page}&image_type=photo&orientation=horizontal&safesearch=true`;

    return fetch(url)
      .then(response => response.json())
      .then(({ hits }) => {
        return hits;
      });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.findQuery;
  }

  set query(newQuery) {
    this.findQuery = newQuery;
  }
}
