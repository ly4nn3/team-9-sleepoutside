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

export function renderWithTemplate(template, parentElement, callback, data) {
  parentElement.innerHTML = template;
  if (callback) {
    if (data) {
      callback(data);
    } else {
      callback();
    }
  }
}

export async function loadTemplate(path) {
  try {
    const response = await fetch(path);
    if (response.ok) {
      const data = await response.text();
      return data;
    }

    throw new Error(`Fetch Error: ${response.status}`);
  } catch(err) {
    console.error(err);
  }
}

export async function loadHeaderFooter() {
  // get parent element
  const parentHeader = document.getElementById('main-header');
  const parentFooter = document.getElementById('footer');

  // get path
  const headerPath = "/partials/header.html";
  const footerPath = "/partials/footer.html"

  // get template
  const header = await loadTemplate(headerPath);
  // console.log(header)  // for testing purpose
  const footer = await loadTemplate(footerPath);
  
  // render template
  renderWithTemplate(header, parentHeader, updateCartCount);
  renderWithTemplate(footer, parentFooter);
}

export function getCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);    //fix cart bag qty to reflect correct total of items
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