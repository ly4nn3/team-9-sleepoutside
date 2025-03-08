import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  const currentCartItems = getLocalStorage("so-cart")
    ? getLocalStorage("so-cart")
    : []; // return empty array [] if cart is null.
  // console.log("CURRENT-CART-ITEMS: ", currentCartItems);  // for debugging purpose
  currentCartItems.push(product); // add product to current cart array.
  // console.log("UPDATED-CART-ITEMS: ", currentCartItems);  // for debugging purpose
  setLocalStorage("so-cart", currentCartItems); // store current cart array.
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
