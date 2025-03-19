import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || []; // return empty array [] if cart is null.
  // console.log(cartItems);

  // get product list and total element
  const productListElement = document.querySelector(".product-list");
  const cartTotalHolder = document.querySelector(".cart-footer");
  const cartTotalElement = document.querySelector(".cart-total");

  // render cart items or display empty
  // console.log(cartItems.length);
  if (cartItems.length > 0) {
    // render cart items
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    productListElement.innerHTML = htmlItems.join("");
    // display cart total
    /*cartTotalElement.insertAdjacentText(
      "beforeend",
      calculateCartTotal(cartItems),
    );*/
    // correctly update the total price
    cartTotalElement.innerHTML = `<b>Total</b>: $${calculateCartTotal(cartItems)}`;
    cartTotalHolder.classList.remove("hide");

    //attached event listeners to remove buttons
    document.querySelectorAll(".remove-item").forEach((button) => {           
      button.addEventListener("click", removeItemFromCart);
    });

  } else {
    // display empty
    productListElement.innerHTML = cartEmptyTemplate();
    // hide total when empty
    cartTotalHolder.classList.add("hide");
  }
}

function calculateCartTotal(cartItems) {
  return cartItems.reduce((total, item) => total + item.FinalPrice, 0).toFixed(2);   // change parameter from price to item so it replaces instead of appending and fix decimal to 2 places
}

// function to remove an item from the cart
function removeItemFromCart(event) {
  const productId = event.target.getAttribute("data-id");
  let cartItems = getLocalStorage("so-cart") || [];

  // filter out the item to remove it
  //cartItems = cartItems.filter(item => item.Id !== productId);

  // find the index of the first item with the matching ID
  const indexToRemove = cartItems.findIndex(item=> item.Id === productId);

  // if found, remove only one of that item
  if (indexToRemove !== -1) {
    cartItems.splice(indexToRemove, 1);
  }

  // update local storage
  setLocalStorage("so-cart", cartItems);

  // re-render the cart
  renderCartContents();
}

/**********************************
 ************ TEMPLATES ************
 **********************************/
// display cart items
function cartItemTemplate(item) {
  return `<li class="cart-card divider">
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

  <button class="remove-item" data-id="${item.Id}">X</button>    
            
</li>`;     // ^--created X button next to each item in cart for item removal

  //return newItem;
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
