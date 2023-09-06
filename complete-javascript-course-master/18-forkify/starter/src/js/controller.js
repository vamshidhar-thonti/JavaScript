import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SECONDS } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    // Gets the hash from the URL
    const id = window.location.hash.slice(1);

    // Gaurd class
    if (!id) return;
    recipeView.renderSpinner();

    // update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // re-render bookmarks selected option when already bookmarked recipe is revisited
    bookmarksView.update(model.state.bookmarks);

    // 1) Loading Recipe
    await model.loadRecipe(id);

    // 2. Rendering Recipe
    recipeView.render(model.state.recipe);
    console.log(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    // Get search query from the search input field
    const query = searchView.getQuery();
    // Gaurd Clause
    if (!query) return;
    resultsView.renderSpinner();

    // Fetch data based on the search query
    await model.loadSearchResult(query);
    // console.log(model.state.search);

    // Reset pageNumber
    model.resetPageNumber();

    // render recipes list
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (page) {
  try {
    // Reassign the current page number in the state
    model.state.search.page = page;

    // Rerender the results based on the page number
    resultsView.render(model.getSearchResultsPage(model.state.search.page));

    // Re-render the pagination buttons based on the current page number
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlServings = function (newServings) {
  try {
    // Update the recipe servings
    model.updateServings(newServings);

    // Update the recipe view
    recipeView.update(model.state.recipe);
  } catch (error) {
    console.log(error);
  }
};

const controlAddBookmark = function () {
  // Add or remove bookmark
  model.modifyBookmark(model.state.recipe);

  // re-render the recipe with bookmark selected icon
  recipeView.update(model.state.recipe);

  // render the bookmarks section
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Showing loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SECONDS * 1000);
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerPagination(controlPagination);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

// Initialzer of the controller and eventListeners
init();
