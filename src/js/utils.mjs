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
  templateFn,
  parentElement,
  listData,
  position = "afterbegin",
  clear = false,
) {
  // check clear
  if (clear) parentElement.innerHTML = "";

  listData
    .map(templateFn)
    .forEach((dataElement) =>
      parentElement.insertAdjacentHTML(position, dataElement),
    );
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
  } catch (err) {
    console.error(err);
  }
}

export async function loadHeaderFooter() {
  // get parent element
  const parentHeader = document.getElementById("main-header");
  const parentFooter = document.getElementById("footer");

  // get path
  const headerPath = "/partials/header.html";
  const footerPath = "/partials/footer.html";

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
  return cartItems.reduce((total, item) => total + (item.Quantity || 1), 0); //fix cart bag qty to reflect correct total of items
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

export function generateBreadcrumb(
  category,
  productCount = null,
  isCategory = false,
) {
  if (!category || typeof category !== "string") {
    console.warn("Invalid catgory provided: ", category);
    return "";
  }

  try {
    const trimmedCategory = category.trim();

    if (trimmedCategory === "") {
      console.warn("Empty category provided: ", category);
      return "";
    }

    const formattedCategory =
      trimmedCategory.charAt(0).toUpperCase() + trimmedCategory.slice(1);

    let countText = "";
    if (productCount !== null) {
      const count = Number(productCount);
      if (isNaN(count) || count < 0) {
        console.warn("Invalid product count provided: ", productCount);
        countText = "";
      } else {
        countText = `▶ (${count} items)`;
      }
    }

    // linking based on active page
    const categoryDisplay = isCategory
      ? formattedCategory
      : `<a href="/product_listing/?category=${trimmedCategory}" class="breadcrumb-link">${formattedCategory}</a>`;

    return `
      <nav aria-label="breadcrumb" class="breadcrumb">
        ${categoryDisplay} 
        ${countText ? `<span class="breadcrumb-count">${countText}</span>` : ""}
      </nav>
    `;
  } catch (err) {
    console.error("Error generating breadcrumb: ", err);
    return "";
  }
}

export async function animateCart(
  addBtnElement,
  cartElement,
  productImagePath,
) {
  return new Promise((resolve, reject) => {
    const cartAnimate = document.createElement("div");
    cartAnimate.setAttribute("class", "cartAnimate");
    cartAnimate.style.zIndex = "2";
    const image = document.createElement("img");
    image.src = productImagePath;
    image.alt = "product image";
    cartAnimate.appendChild(image);

    const main = document.querySelector("main");
    main.appendChild(cartAnimate); // add element to document

    // console.log("ADD BTN ELEMENT: ", addBtnElement);  // for testing purpose
    // console.log("CART ELEMENT: ", cartElement);  // for testing purpose

    // get the position of add to cart btn and cart
    const addBtnPosition = addBtnElement.getBoundingClientRect();
    const cartPosition = cartElement.getBoundingClientRect();

    // set start postion movement at addBtnPostion
    cartAnimate.style.position = "absolute";
    // check screen size
    if (window.innerWidth > 650) {
      cartAnimate.style.left = addBtnPosition.left + 90 + "px";
      cartAnimate.style.top = addBtnPosition.top + 150 + "px";
    } else {
      cartAnimate.style.left = addBtnPosition.left + 50 + "px";
      cartAnimate.style.top = addBtnPosition.top + 180 + "px";
    }

    // start smooth transition movement
    const duration = 3;
    cartAnimate.style.transition = `transform ${duration}s ease, width .5s, height .5s`;
    cartAnimate.style.transform = `translate(${cartPosition.left - addBtnPosition.left}px, ${cartPosition.top - addBtnPosition.top}px)`;

    setTimeout(() => {
      cartAnimate.style.width = "0";
      cartAnimate.style.height = "0";
      setTimeout(() => {
        if (main.removeChild(cartAnimate)) {
          // remove element;
          resolve(true);
        } else {
          reject(false);
        }
      }, 500);
    }, duration * 400);
  });
}

export function checkRegex(inputElement, regex, validMsg="Valid", failMsg="Invalid input") {
    if (regex.test(inputElement.value)) {
        inputElement.title = validMsg;
        inputElement.setCustomValidity("");
        return true;
    } else {
        inputElement.setCustomValidity(failMsg);
        inputElement.focus();
        inputElement.title = failMsg;
        return false;
    }
}

export function alertMessage(message, scroll=true, disapear=5000) {
    const fixedAlertsHolderId = "#fixed-alerts-holder";  // use for holder non-scrolling alert

    const alertHolder = document.createElement("div");
    alertHolder.setAttribute("class", "alertHolder");

    const alertCloseBtn = document.createElement("button");
    alertCloseBtn.setAttribute("class", "alertCloseBtn");
    alertCloseBtn.innerHTML = "⨉";
    alertCloseBtn.addEventListener("click", ()=> {
      scroll ? document.body.removeChild(alertHolder) : document.querySelector(fixedAlertsHolderId).removeChild(alertHolder);
    })

    const alertMsgHolder = document.createElement("span");
    alertMsgHolder.innerHTML = message;

    // append elements
    alertHolder.appendChild(alertMsgHolder);
    alertHolder.appendChild(alertCloseBtn);

    if (scroll) {
        document.querySelector("main").insertAdjacentElement("beforebegin", alertHolder);
        window.scrollTo({ top: 0, behavior: "smooth"});
    } else {
        document.querySelector(fixedAlertsHolderId).appendChild(alertHolder);
    }

    // remove error withing some time
    if (typeof(disapear) == "number" && disapear != null) {
        setTimeout(() => {
            const animationTime = 2;
            alertHolder.style.transition = `opacity ${animationTime}s`;
            alertHolder.style.opacity = "0";
            setTimeout(() => {
              if (scroll) {
                if (document.body.contains(alertHolder)) document.body.removeChild(alertHolder);
              } else {
                if (document.querySelector(fixedAlertsHolderId).contains(alertHolder)) document.querySelector(fixedAlertsHolderId).removeChild(alertHolder);
              }
            }, animationTime * 1000);
        }, disapear);
    }
}

export function removeAllAlert(fixedAlert=true) {
  const alertHolderClass = ".alertHolder";
    const fixedAlertsHolderId = "#fixed-alerts-holder";  // use for holder non-scrolling alert
    document.querySelectorAll(alertHolderClass).forEach(alert => {
      if (fixedAlert) {
        document.querySelector(fixedAlertsHolderId).removeChild(alert);
      } else {
        document.body.removeChild(alert)
      }
    })
}

// LARGE DISPLAY POPUP
export class LargePopUp {
    constructor() {
        this.isClosed = true;
        this.mainFrame = document.createElement("div");
        this.screen = document.createElement("div");
        this.closeBtn = document.createElement("button");

        this.init();
    }

    init() {
        // SET ATTRIBUTES
        this.mainFrame.setAttribute("class", "largePopUpMainFrame");
        this.screen.setAttribute("class", "largePopUpScreen");
        this.closeBtn.setAttribute("class", "largePopUpCloseBtn");
        this.closeBtn.innerHTML = "⨉";

        // SET LISTENERS
        // close with closeBtn
        this.closeBtn.addEventListener("click", ()=> {
            this.close();
        })

        // close with escape key press
        document.addEventListener("keyup", (event) => {
            if (event.key == "Escape") {
                this.close();
            }
        })

        // close screen on screen click outside content
        this.screen.addEventListener("click", (event)=> {
            if (this.screen.children[0]) {
                const contentHolder = this.screen.children[0];
                // get contetHolder boundary
                const boundary = contentHolder.getBoundingClientRect();
                const isInBoundry = (
                  event.clientX >= boundary.left &&
                  event.clientX <= boundary.right &&
                  event.clientY >= boundary.top &&
                  event.clientY <= boundary.bottom
                );

                if (!isInBoundry) {
                    this.close();
                }
            }
        })

        // APPEND ELEMENTS
        this.mainFrame.appendChild(this.screen);
        this.mainFrame.appendChild(this.closeBtn);
    }

    display(htmlElement_or_template) {
        if (typeof(htmlElement_or_template) == "object") {
            // add content to screen
            this.screen.appendChild(htmlElement_or_template);
        } else {
            this.screen.innerHTML = htmlElement_or_template
        }

        // add main frame to display
        document.body.prepend(this.mainFrame);

        // update isClosed
        this.isClosed = false;
    }

    close() {
        if (!this.isClosed) {
            if (document.body.contains(this.mainFrame)) {
                document.body.removeChild(this.mainFrame);
                // update isClosed
                this.isClosed = true;
                return true;
            }
        }

        return false;
    }
}
