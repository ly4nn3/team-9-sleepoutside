import ShoppingCart from "./ShoppingCart.mjs";

// get elements
const productListElement = document.querySelector(".product-list");
const cartTotalHolder = document.querySelector(".cart-footer");
const cartTotalElement = document.querySelector(".cart-total");

const shoppingCart = new ShoppingCart(
  productListElement,
  cartTotalHolder,
  cartTotalElement,
);
shoppingCart.init();
