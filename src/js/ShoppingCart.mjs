import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { loadHeaderFooter } from "./utils.mjs";

export default class ShoppingCart {
    constructor(productListElement, cartTotalHolder, cartTotalElement) {
        this.productListElement = productListElement;
        this.cartTotalHolder = cartTotalHolder;
        this.cartTotalElement = cartTotalElement;
    }

    init() {
        loadHeaderFooter();  // load the header and footer of the page
        const cartItems = getLocalStorage("so-cart") || []; // return empty array [] if cart is null.
        // console.log(cartItems);
        
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
                    button.addEventListener("click", (event) => this.removeItemFromCart(event));
                });
        
        } else {
                // display empty
                this.productListElement.innerHTML = cartEmptyTemplate();
                // hide total when empty
                this.cartTotalHolder.classList.add("hide");
        }
    }
    
    calculateCartTotal(cartItems) {
        return cartItems.reduce((total, item) => total + item.FinalPrice, 0).toFixed(2);   // change parameter from price to item so it replaces instead of appending and fix decimal to 2 places
    }
    
    // function to remove an item from the cart
    removeItemFromCart(event) {
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

        // remove item from view
        this.init();
    }
}  
  
/**********************************
************ TEMPLATES ************
**********************************/
// display cart items
function cartItemTemplate(item) {
    return `<li class="cart-card divider" id="${item.Id}">
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
}

// display empty cart
function cartEmptyTemplate() {
    const empty = `<div class="empty-cart-holder">
                    <h3>EMPTY CART</h3>
                    <img src="../images/placeholders/empty-cart.gif" alt="empty-cart" />
                </div>`;
    return empty;
}