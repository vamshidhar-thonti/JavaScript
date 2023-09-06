import View from './view';
import icons from 'url:../../img/icons.svg'; // Parcel v2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (event) {
      const btn = event.target.closest('.btn--inline');

      if (!btn) return;

      const goto = Number(btn.dataset.goto);
      handler(goto);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const nextPage = this._data.page + 1;
    const previousPage = this._data.page - 1;

    // Page 1, and there are other pages
    if (this._data.page === 1 && numPages > 1) {
      return `
      <button data-goto="${nextPage}" class="btn--inline pagination__btn--next">
        <span>Page ${nextPage}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
      `;
    }

    // Page 1, and there are NO other pages
    if (numPages === 1) return '';

    // Last page
    if (this._data.page === numPages) {
      return `
      <button data-goto="${previousPage}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${previousPage}</span>
      </button>
      `;
    }

    // Some other page
    if (this._data.page > 1 && this._data.page < numPages) {
      return `
      <button data-goto="${previousPage}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${previousPage}</span>
      </button>
      <button data-goto="${nextPage}" class="btn--inline pagination__btn--next">
        <span>Page ${nextPage}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
      `;
    }
  }
}

export default new PaginationView();
