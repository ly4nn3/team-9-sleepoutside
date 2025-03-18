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

export function renderListWithTemplate (
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {

  if (!["beforebegin", "afterbegin", "beforeend", "afterend"].includes(position)) {
    console.error(`ERROR: Invalid position '${position}' for insertAdjacentHTML.`);
    position = "afterbegin";
  }

  if (clear) {
    parentElement.innerHTML = "";                           // clear out any existing content if needed
  }
  const htmlStrings = list.map(templateFn).join("");        //generate html from list
  parentElement.insertAdjacentHTML(position, htmlStrings);  //insert into DOM
}