import {
  loadHeaderFooter,
  getLocalStorage,
  setLocalStorage,
  alertMessage,
  updateWishlistCount,
  LargePopUp,
} from "./utils.mjs";
export default class ShoppingCart {
  constructor(productListElement, cartTotalHolder, cartTotalElement) {
    this.productListElement = productListElement;
    this.cartTotalHolder = cartTotalHolder;
    this.cartTotalElement = cartTotalElement;
  }

  init() {
    loadHeaderFooter(); // required to update cart count
    const cartItems = getLocalStorage("so-cart") || []; // return empty array [] if cart is null.
    console.log(cartItems);

    // render cart items or display empty
    // console.log(cartItems.length);
    if (cartItems.length > 0) {
      // render cart items
      const htmlItems = cartItems.map((item) => cartItemTemplate(item));
      this.productListElement.innerHTML = htmlItems.join("");
      // display cart total
      /*this.cartTotalElement.insertAdjacentText(
                "beforeend",
                this.calculateCartTotal(cartItems),
                );*/
      // correctly update the total price
      this.cartTotalElement.innerHTML = `<b>Total</b>: $${this.calculateCartTotal(cartItems)}`;
      this.cartTotalHolder.classList.remove("hide");

      //attached event listeners to remove buttons
      document.querySelectorAll(".remove-item").forEach((button) => {
        button.addEventListener("click", (event) =>
          this.removeItemFromCart(event),
        );
      });

      // wishlist button
      document.querySelectorAll(".add-to-wishlist").forEach((button) => {
        button.addEventListener("click", (event) => this.moveToWishlist(event));
      });
    } else {
      // display empty
      this.productListElement.innerHTML = cartEmptyTemplate();
      // hide total when empty
      this.cartTotalHolder.classList.add("hide");
    }
  }

  calculateCartTotal(cartItems) {
    return cartItems
      .reduce((total, item) => total + item.FinalPrice, 0)
      .toFixed(2); // change parameter from price to item so it replaces instead of appending and fix decimal to 2 places
  }

  // function to remove an item from the cart
  removeItemFromCart(event) {
    const productId = event.target.getAttribute("data-id");
    let cartItems = getLocalStorage("so-cart") || [];

    // filter out the item to remove it
    //cartItems = cartItems.filter(item => item.Id !== productId);

    // find the index of the first item with the matching ID
    const indexToRemove = cartItems.findIndex((item) => item.Id === productId);

    // if found, remove only one of that item
    if (indexToRemove !== -1) {
      cartItems.splice(indexToRemove, 1);
    }

    // update local storage
    setLocalStorage("so-cart", cartItems);

    // remove item from view
    this.init();
  }

  moveToWishlist(event) {
    // console.log("Wishlist button clicked");
    const productId = event.target.getAttribute("data-id");
    // console.log("Product ID:", productId);
    const cart = getLocalStorage("so-cart") || [];
    const wishlist = getLocalStorage("so-wishlist") || [];

    const item = cart.find((item) => item.Id === productId);
    // console.log("Item found:", item);

    if (item) {
      const existingWishListItem = wishlist.find(
        (wishlistItem) => wishlistItem.Id === productId,
      );

      if (!existingWishListItem) {
        // Add to wishlist
        wishlist.push(item);
        setLocalStorage("so-wishlist", wishlist);

        event.target.textContent = "❤️";
        updateWishlistCount();

        // Create and show confirmation popup
        const popup = new LargePopUp();
        const contentElement = document.createElement("div");
        contentElement.className = "wishlist-confirmation";
        contentElement.innerHTML = `
          <div class="wishlist-popup-content">
            <p>Item added to wishlist!</p>
            <p>Would you like to remove it from cart?</p>
            <div class="wishlist-confirmation__buttons">
              <button class="btn-remove">Remove</button>
              <button class="btn-cancel">Cancel</button>
            </div>
          </div>
        `;

        // Add event listeners
        contentElement
          .querySelector(".btn-remove")
          .addEventListener("click", () => {
            this.removeItemFromCart({
              target: { getAttribute: () => productId },
            });
            popup.close();
            alertMessage("Item removed from cart!", false, 2000);
          });

        contentElement
          .querySelector(".btn-cancel")
          .addEventListener("click", () => {
            popup.close();
            alertMessage("Item kept in cart!", false, 2000);
          });

        popup.display(contentElement);
        alertMessage("Item added to wishlist!", false, 2000);
      } else {
        alertMessage("Item already in wishlist!", false, 2000);
      }
    }
  }
}

/**********************************
 ************ TEMPLATES ************
 **********************************/
// display cart items                   // shows item details in div to adjust in css
function cartItemTemplate(item) {
  // wishlist heart state
  const wishlist = getLocalStorage("so-wishlist") || [];
  const isInWishlist = wishlist.some(
    (wishlistItem) => wishlistItem.Id === item.Id,
  );
  const heartSymbol = isInWishlist ? "❤️" : "🤍";
  const wishlistClass = isInWishlist
    ? "add-to-wishlist in-wishlist"
    : "add-to-wishlist";

  return `<li class="cart-card divider" id="${item.Id}">
        <a href="#" class="cart-card__image">
            <img
            src="${item.Images.PrimarySmall}"
            alt="${item.Name}"
            />
        </a>
        <a href="#">
            <h2 class="card__name">${item.Name}</h2>
        </a>
        <p class="cart-card__color">${item.Colors[0].ColorName}</p>

        <div class="cart-card_details">
            <p class="cart-card__quantity">qty:${item.Quantity || 1}</p>
            <p class="cart-card__price">Price: $${item.ListPrice}</p>            
            <p class="cart-card__price">Total: $${item.FinalPrice.toFixed(2)}</p>
        </div>

        <div class="cart-card__actions">
          <button class="add-to-wishlist" data-id="${item.Id}">${heartSymbol}</button>
          <button class="remove-item" data-id="${item.Id}">X</button>    
        </div>     
        </li>`; // ^--created X button next to each item in cart for item removal; adjusted to show actual qty and total price
  // ^--added wishlist button
}

// display empty cart
function cartEmptyTemplate() {
  const empty = `<div class="empty-cart-holder">
                    <h3>EMPTY CART</h3>
                    <img src="../images/placeholders/empty-cart.gif" alt="empty-cart" />
                </div>`;
  return empty;
}
