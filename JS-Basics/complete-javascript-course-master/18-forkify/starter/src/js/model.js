import { API_URL, RESULTS_PER_PAGE, API_KEY } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  let { recipe } = data.data; // destructuring the recipe keyword
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), // If recipe.key is falsy, nothing happens, else the object destructured and added as a new key value pair.
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
    // console.log(state.recipe);
  } catch (error) {
    throw error;
  }
};

export const loadSearchResult = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.query = query;
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (error) {
    throw error;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity =
      (ingredient.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

export const resetPageNumber = function () {
  state.search.page = 1;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const modifyBookmark = function (recipe) {
  // Push to state's bookmarks array
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) {
    // Toggle bookmark
    if (Object.keys(state.recipe).includes('bookmarked'))
      state.recipe.bookmarked = !state.recipe.bookmarked;
    // Mark current recipe as bookmarked
    else state.recipe.bookmarked = true;
  }

  // Remove from bookmarks array if boorkmarked is false
  if (!state.recipe.bookmarked) {
    state.bookmarks = state.bookmarks.filter(rec => rec.id !== recipe.id);
  }

  persistBookmarks();
};

const init = function () {
  const storage = JSON.parse(localStorage.getItem('bookmarks'));
  if (storage) {
    state.bookmarks = storage;
  }
};

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

export const uploadRecipe = async function (newRecipe) {
  try {
    let ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1])
      .map(entry => {
        const ingArr = entry[1].replaceAll(' ', '').split(',');
        const [quantity, unit, description] = ingArr;

        if (ingArr.length !== 3)
          throw new Error(
            'Wrong Ingredient format, please use the correct format'
          );

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: newRecipe.cookingTime,
      servings: newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

    state.recipe = createRecipeObject(data);
    modifyBookmark(state.recipe);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

clearBookmarks();
init();
