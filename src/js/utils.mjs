// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

export function renderListWithTemplate(
  templateFn, parentElement, list, position = "afterbegin", clear = false) {
    const htmlStrings = list.map(templateFn);
    if (clear) {
      parentElement.innerHTML = "";
    }
    parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function getCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  return cartItems.length;
}

export function updateCartCount() {
  const cartCount = getCartCount();
  const cartElement = document.querySelector(".cart");

  const hasCount = cartElement.querySelector(".cart-count");
  if (hasCount) {
    existingCount.remove();
  }

  if (cartCount > 0) {
    const countSpan = document.createElement("span");
    countSpan.className = "cart-count";
    countSpan.textContent = cartCount;
    cartElement.appendChild(countSpan);
  }
}