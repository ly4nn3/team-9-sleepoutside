import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || []; // return empty array [] if cart is null.
  // console.log(cartItems);

  // get product list element
  const productListElement = document.querySelector(".product-list");

  // render cart items or display empty
  // console.log(cartItems.length);
  if (cartItems.length > 0) {
    // render cart items
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    productListElement.innerHTML = htmlItems.join("");
  } else {
    // display empty
    productListElement.innerHTML = cartEmptyTemplate();
  }
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

// display empty cart
function cartEmptyTemplate() {
  const empty = `<div class="empty-cart-holder">
                    <h3>EMPTY CART</h3>
                    <img src="../images/placeholders/empty-cart.gif" alt="empty-cart" />
                </div>`;
  return empty;
}

renderCartContents();
