import {
  getLocalStorage,
  setLocalStorage,
  loadHeaderFooter,
  alertMessage,
  updateWishlistCount,
  updateCartCount,
} from "./utils.mjs";

export default class Wishlist {
  constructor(listElement, footerElement) {
    this.listElement = listElement;
    this.footerElement = footerElement;
  }

  async init() {
    try {
      const wishlistItems = getLocalStorage("so-wishlist") || [];
      this.renderWishlist(wishlistItems);
    } catch (error) {
      alertMessage(
        "Error loading wishlist. Please refresh the page.",
        false,
        3000,
      );
    }
  }

  renderWishlist(wishlistItems) {
    try {
      if (wishlistItems.length === 0) {
        this.listElement.innerHTML = `<li class="empty-list">
                    <h2>Your wishlist is empty</h2>
                    <img src="../images/placeholders/wishlist.gif" alt="empty wishlist" width="300px" height="300px" />
                </li>`;
        this.footerElement.classList.add("hide");
      } else {
        this.listElement.innerHTML = wishlistItems
          .map((item) => this.wishlistItemTemplate(item))
          .join("");
        this.footerElement.classList.remove("hide");

        document.querySelectorAll(".move-to-cart").forEach((button) => {
          button.addEventListener("click", (event) => this.moveToCart(event));
        });

        document.querySelectorAll(".remove-item").forEach((button) => {
          button.addEventListener("click", (event) =>
            this.removeFromWishlist(event),
          );
        });
      }
    } catch (error) {
      alertMessage(
        "Error displaying items. Please refresh the page.",
        false,
        3000,
      );
    }
  }

  wishlistItemTemplate(product) {
    return `<li class="cart-card divider" id="${product.Id}">
            <a href="#" class="cart-card__image">
                <img src="${product.Images.PrimarySmall}" alt="${product.Name}" />
            </a>
            <a href="#">
                <h2 class="card__name">${product.Name}</h2>
            </a>
            <p class="cart-card__color">${product.Colors[0].ColorName}</p>
            <div class="cart-card_details">
            <p class="cart-card__price">Price: $${product.FinalPrice}</p>
            </div>
            <div class="cart-card__actions">
                <button class="move-to-cart" data-id="${product.Id}">Move to Cart</button>
                <button class="remove-item" data-id="${product.Id}">X</button>
            </div>
        </li>`;
  }

  moveToCart(event) {
    try {
      const productId = event.target.dataset.id;
      const wishlistItems = getLocalStorage("so-wishlist") || [];
      const cart = getLocalStorage("so-cart") || [];

      const productToMove = wishlistItems.find((item) => item.Id === productId);
      if (productToMove) {
        const existingCartItem = cart.find(
          (cartItem) => cartItem.Id === productId,
        );

        if (existingCartItem) {
          // Update quantity if item exists
          existingCartItem.Quantity = (existingCartItem.Quantity || 1) + 1;
          existingCartItem.FinalPrice =
            existingCartItem.ListPrice * existingCartItem.Quantity;
        } else {
          cart.push({ ...productToMove, Quantity: 1 });
        }

        setLocalStorage("so-cart", cart);

        const newWishlist = wishlistItems.filter(
          (item) => item.Id !== productId,
        );
        setLocalStorage("so-wishlist", newWishlist);

        updateWishlistCount();
        updateCartCount();

        this.renderWishlist(newWishlist);

        if (!document.querySelector("#fixed-alerts-holder")) {
          const alertsHolder = document.createElement("div");
          alertsHolder.id = "fixed-alerts-holder";
          document.body.prepend(alertsHolder);
        }

        alertMessage("Item moved to cart!", false, 2000);
      }
    } catch (error) {
      alertMessage(
        "Failed to move item to cart. Please try again.",
        false,
        3000,
      );
    }
  }

  removeFromWishlist(event) {
    try {
      const productId = event.target.dataset.id;
      const wishlistItems = getLocalStorage("so-wishlist") || [];

      const newWishlist = wishlistItems.filter((item) => item.Id !== productId);
      setLocalStorage("so-wishlist", newWishlist);

      updateWishlistCount();

      this.renderWishlist(newWishlist);

      if (!document.querySelector("#fixed-alerts-holder")) {
        const alertsHolder = document.createElement("div");
        alertsHolder.id = "fixed-alerts-holder";
        document.body.prepend(alertsHolder);
      }

      alertMessage("Item removed from wishlist!", false, 2000);
    } catch (error) {
      alertMessage(
        "Failed to remove item from wishlist. Please try again.",
        false,
        3000,
      );
    }
  }
}

const wishlist = new Wishlist(
  document.querySelector(".product-list"),
  document.querySelector(".wishlist-footer"),
);

loadHeaderFooter().then(() => wishlist.init());
