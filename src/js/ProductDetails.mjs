import { setLocalStorage, getLocalStorage, updateCartCount, generateBreadcrumb } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // Fetch product details
    this.product = await this.dataSource.findProductById(this.productId);
    
    // Add breadcrumb
    if (this.product.Category) {
      const mainElement = document.querySelector("main");
      const breadcrumbContainer = document.createElement("div");
      breadcrumbContainer.innerHTML = generateBreadcrumb(this.product.Category);
      mainElement.insertAdjacentElement("afterbegin", breadcrumbContainer);
    }

    // Render product details
    this.renderProductDetails("main");
    
    // Add event listener for Add to Cart button
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addToCart.bind(this));
  }

  addToCart() {
    const currentCartItems = getLocalStorage("so-cart") || []; // return empty array [] if cart is null.
      // console.log("CURRENT-CART-ITEMS: ", currentCartItems);  // for debugging purpose
      currentCartItems.push(this.product); // add product to current cart array.
      // console.log("UPDATED-CART-ITEMS: ", currentCartItems);  // for debugging purpose
      setLocalStorage("so-cart", currentCartItems); // store current cart array.
      updateCartCount();
  }
  
  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    
    element.insertAdjacentHTML(
      "beforeend",
      productDetailsTemplate(this.product)
    );
  }
}

function productDetailsTemplate(product) {
  return `<section class="product-detail"> 
    <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img
      class="divider"
      src="${product.Images.PrimaryLarge}"
      alt="${product.NameWithoutBrand}"
    />
    <div class="product-discount">
      <del><b>Price:</b> $${product.SuggestedRetailPrice}</del>
      <span class="spacing"> - </span>
      <span><b>Discount:</b> ${((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice * 100).toFixed(0)}%</span>
    </div>
    <p class="product-card__price"><b>Final Price: </b>$${product.FinalPrice}</p>
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description">
    ${product.DescriptionHtmlSimple}
    </p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div></section>`;
}