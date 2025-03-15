import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  //asks for all the objects in the localStorage and returns an array (or array like object) so htmlItems can iterate over it.
  //If there isn't and item in localStorage, the array is returned empty.
  const cartItems = Object.keys(localStorage).map((key) =>
    getLocalStorage(key),
  );

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
