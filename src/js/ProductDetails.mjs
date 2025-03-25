import { setLocalStorage, getLocalStorage, updateCartCount } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // Fetch product details
    this.product = await this.dataSource.findProductById(this.productId);
    
    // Render product details
    this.renderProductDetails("main");
    
    // Add event listener for Add to Cart button
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addToCart.bind(this));
  }

  addToCart() {
    let currentCartItems = getLocalStorage("so-cart") || []; // return empty array [] if cart is null.
      
      //filter out any invalid enteries just in case
      currentCartItems = currentCartItems.filter(item => item && item.Id);

      //check if a duplicate item is already in the cart
      const existingItem = currentCartItems.find(item => item.Id === this.product.Id);

      if (existingItem) {
        //make sure quantity exists before updating
        if (!existingItem.quantity) {
          existingItem.quantity = 1;
        }
        existingItem.quantity += 1;
      } else {
        //if duplicate item is not already in cart, then add it with quantity = 1
        const newProduct = { ...this.product, quantity: 1};
        
        currentCartItems.push(newProduct); // add product to current cart array.
      }

      console.log("Cart Items: ", currentCartItems);
      setLocalStorage("so-cart", currentCartItems); // store current cart array.
      updateCartCount();
  }
  
  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    element.insertAdjacentHTML(
      "afterBegin",
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
    <p class="product-card__price">$${product.FinalPrice}</p>
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description">
    ${product.DescriptionHtmlSimple}
    </p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div></section>`;
}