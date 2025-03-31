import { getLocalStorage, setLocalStorage, loadHeaderFooter, alertMessage, updateWishlistCount, updateCartCount } from "./utils.mjs";

export default class Wishlist {
    constructor(listElement, footerElement) {
        this.listElement = listElement;
        this.footerElement = footerElement;
    }

    async init() {
        const wishlistItems = getLocalStorage("so-wishlist") || [];
        this.renderWishlist(wishlistItems);
    }

    renderWishlist(wishlistItems) {
        if (wishlistItems.length === 0) {
            this.listElement.innerHTML = `<li class="empty-list">
                <h2>Your wishlist is empty</h2>
                <img src="../images/placeholders/wishlist.gif" alt="empty wishlist" width="300px" height="300px" />
            </li>`
            this.footerElement.classList.add("hide");
        } else {
            this.listElement.innerHTML = wishlistItems.map((item) => this.wishlistItemTemplate(item)).join("");
            this.footerElement.classList.remove("hide");

            document.querySelectorAll(".move-to-cart").forEach((button) => {
                button.addEventListener("click", (event) => this.moveToCart(event));
            })

            document.querySelectorAll(".remove-item").forEach((button) => {
                button.addEventListener("click", (event) => this.removeFromWishlist(event));
            })
        }
    }

    wishlistItemTemplate(item) {
        return `<li class="cart-card divider" id="${item.Id}">
            <a href="#" class="cart-card__image">
                <img src="${item.Images.PrimarySmall}" alt="${item.Name}" />
            </a>
            <a href="#">
                <h2 class="card__name">${item.Name}</h2>
            </a>
            <p class="cart-card__color">${item.Colors[0].ColorName}</p>
            <div class="cart-card_details">
            <p class="cart-card__price">Price: $${item.FinalPrice}</p>
            </div>
            <div class="cart-card__actions">
                <button class="move-to-cart" data-id="${item.Id}">Move to Cart</button>
                <button class="remove-item" data-id="${item.Id}">X</button>
            </div>
        </li>`;
    }

    moveToCart(event) {
        const productId = event.target.dataset.id;
        const wishlist = getLocalStorage("so-wishlist") || [];
        const cart = getLocalStorage("so-cart") || [];

        const item = wishlist.find(item => item.Id === productId);
        if (item) {
            const existingCartItem = cart.find(cartItem => cartItem.Id === productId);
        
            if (existingCartItem) {
                // Update quantity if item exists
                existingCartItem.Quantity = (existingCartItem.Quantity || 1) + 1;
                existingCartItem.FinalPrice = existingCartItem.ListPrice * existingCartItem.Quantity;
            } else {
                cart.push({ ...item, Quantity: 1 });
            }
        
            setLocalStorage("so-cart", cart);

            const newWishlist = wishlist.filter(item => item.Id !== productId);
            setLocalStorage("so-wishlist", newWishlist);

            updateWishlistCount();
            updateCartCount();

            this.renderWishlist(newWishlist);
            alertMessage("Item moved to cart!", false, 2000);
        }
    }

    removeFromWishlist(event) {
        const productId = event.target.dataset.id;
        const wishlist = getLocalStorage("so-wishlist") || [];

        const newWishlist = wishlist.filter(item => item.Id !== productId);
        setLocalStorage("so-wishlist", newWishlist);

        updateWishlistCount();

        this.renderWishlist(newWishlist);
        alertMessage("Item removed from wishlist!", false, 2000);
    }
}

const wishlist = new Wishlist(
    document.querySelector(".product-list"),
    document.querySelector(".wishlist-footer")
);

loadHeaderFooter().then(() => wishlist.init());