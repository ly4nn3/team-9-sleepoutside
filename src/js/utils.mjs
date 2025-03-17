export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  
  // clear the parent element if clear is true
  clear && (parentElement.innerHTML = "");

  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));

}

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

export function renderListWithTemplate(templateFn, parentElement, listData, position = "afterbegin", clear = false) {
  // check clear
  if (clear) parentElement.innerHTML = '';

  // // METHOD 1
  // // loop through product data;
  // // call produtCardTemplate to add the generated HTML template created with template literal to productList Element
  // listData.forEach(data => {
  //   parentElement.innerHTML += templateFn(data);
  // });

  // OR

  // // METHOD 2 (using map - array method)
  // // create a new list modifying product data
  // // loop through the new list append it to productList element using innerHTML
  // const modifiedProductList = listData.map(templateFn);
  // console.log("Modified ProductListData: ", modifiedProductList);  // for testing purpose
  // modifiedProductList.forEach(data => parentElement.innerHTML += data);

  // METHOD 3
  // using the insert adjacentHtml document element method and array map method
  listData.map(templateFn).forEach(dataElement => parentElement.insertAdjacentHTML(position, dataElement));
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
    hasCount.remove();
  }

  if (cartCount > 0) {
    const countSpan = document.createElement("span");
    countSpan.className = "cart-count";
    countSpan.textContent = cartCount;
    cartElement.appendChild(countSpan);
  }
}