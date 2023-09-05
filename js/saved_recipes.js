import { getTime } from "./module.js";


// Function to get user rating from local storage
function getUserRating(recipeId) {
  const userRatingKey = `user-rating-${recipeId}`;
  return parseFloat(localStorage.getItem(userRatingKey)) || 0;
}

// Function to update and display user rating
function updateUserRating(recipeId, rating) {
  const userRatingKey = `user-rating-${recipeId}`;
  localStorage.setItem(userRatingKey, rating);
}


const savedRecipes = Object.keys(window.localStorage).filter(item => {
  return item.startsWith("cookio-recipe");
});

const $savedRecipeContainer = document.querySelector("[data-saved-recipe-container]");

$savedRecipeContainer.innerHTML = `<h2 class="headline-small section-title">All Saved Recipes</h2>`;
const $gridList = document.createElement("div");
$gridList.classList.add("grid-list");

if (savedRecipes.length) {
  savedRecipes.map((savedRecipe, index) => {

    const {
      recipe: {
        image,
        label: title,
        totalTime: cookingTime,
        uri
      }
    } = JSON.parse(window.localStorage.getItem(savedRecipe));

    const recipeId = uri.slice(uri.lastIndexOf("_") + 1);
    const isSaved = window.localStorage.getItem(`cookio-recipe${recipeId}`);

    const $card = document.createElement("div");
    $card.classList.add("card");
    $card.style.animationDelay = `${100 * index}ms`;

    $card.innerHTML = `
      <figure class="card-media img-holder">
        <img src="${image}" width="195" height="195" loading="lazy" alt="${title}"
          class="img-cover">
      </figure>

      <div class="card-body">

        <h3 class="title-small">
          <a href="./detail.html?recipe=${recipeId}" class="card-link">${title ?? "Untitled"}</a>
        </h3>

        <div class="meta-wrapper">

          <div class="meta-item">
            <span class="material-symbols-outlined" aria-hidden="true">schedule</span>

            <span class="label-medium">${getTime(cookingTime).time || "<1"} ${getTime(cookingTime).timeUnit}</span>
          </div>

          <button class="icon-btn has-state ${isSaved ? "saved" : "removed"}" aria-label="Add to saved recipes" onclick="saveRecipe(this, '${recipeId}')">
            <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>

            <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
          </button>

        </div>

      </div>
    `;

    // Add event listeners for star rating
    const starIcons = $card.querySelectorAll(".meta-item:last-child .material-symbols-outlined");
    starIcons.forEach((star, starIndex) => {
      star.addEventListener("click", () => {
        const newRating = starIndex + 1; // Rating is 1 to 5
        updateUserRating(recipeId, newRating);
        updateStarRating(userRating.toFixed(1), newRating);
      });
    });

    $gridList.appendChild($card);

  });
} else {
  $savedRecipeContainer.innerHTML += `<p class="body-large">You haven't saved any recipes yet!</p>`;
}

$savedRecipeContainer.appendChild($gridList);

// Function to update star rating display
function updateStarRating(oldRating, newRating) {
  const userRatingValues = document.querySelectorAll(".user-rating-value");
  userRatingValues.forEach(userRatingValue => {
    if (oldRating !== newRating) {
      userRatingValue.textContent = newRating;
    }
  });
}