import {
  setLocalStorage,
  getLocalStorage,
  updateCartCount,
  generateBreadcrumb,
  animateCart,
  alertMessage,
} from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;

    this.cartElement = null;
    this.addToCartBtn = null;
    // console.log("in product detail page");
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

    // get rendered elements
    this.cartElement = document.querySelector(".cart"); // gotten from header
    this.addToCartBtn = document.querySelector("#addToCart");

    // Add event listener for Add to Cart button
    this.addToCartBtn.addEventListener("click", this.addToCart.bind(this));
  }

  async addToCart() {
    // console.log("Animating cart"); // for debugging purpose
    const animated = await animateCart(
      this.addToCartBtn,
      this.cartElement,
      this.product.Images.PrimarySmall,
    ); // display animation completely before updating count
    // console.log("Animated: ", animated); // for testing purpose

    if (animated) {
      // console.log("Completed animate cart"); // for testing purpose
      let currentCartItems = getLocalStorage("so-cart") || []; // return empty array [] if cart is null.

      //filter out any invalid entries just in case
      currentCartItems = currentCartItems.filter((item) => item && item.Id);

      //check if a duplicate item is already in the cart
      const existingItem = currentCartItems.find(
        (item) => item.Id === this.product.Id,
      );

      if (existingItem) {
        //make sure quantity exists before updating
        if (!existingItem.Quantity) {
          existingItem.Quantity = 1;
        }
        existingItem.Quantity += 1;
        // update final price
        existingItem.FinalPrice =
          existingItem.ListPrice * existingItem.Quantity;
      } else {
        //if duplicate item is not already in cart, then add it with quantity = 1
        const newProduct = { ...this.product, Quantity: 1 };
        currentCartItems.push(newProduct); // add product to current cart array.
      }

      // console.log("Cart Items: ", currentCartItems);
      setLocalStorage("so-cart", currentCartItems); // store current cart array.
      updateCartCount();

      // display alert
      alertMessage("Item added to cart!", false, 2000);
    } else {
      // console.log("Animate Cart Error!");
    }
  }

  renderProductDetails(selector) {
    const element = document.querySelector(selector);

    element.insertAdjacentHTML(
      "beforeend",
      productDetailsTemplate(this.product),
    );
  }
}

function productDetailsTemplate(product) {
  return `<section class="product-detail">
    <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <div class="discount-label"><span>Discount: -$${(product.SuggestedRetailPrice - product.FinalPrice).toFixed(2)}</span></div> 
    <img
      class="divider"
      src="${product.Images.PrimaryLarge}"
      alt="${product.NameWithoutBrand}"
    />
    <div class="product-discount">
      <del><b>Price:</b> $${product.SuggestedRetailPrice}</del>
      <span class="spacing"> - </span>
      <span><b>Discount:</b> ${(((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100).toFixed(0)}%</span>
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
