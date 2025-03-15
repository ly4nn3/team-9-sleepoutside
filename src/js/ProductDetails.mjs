import { setLocalStorage } from "./utils.mjs";

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
    this.renderProductDetails();
    
    // Add event listener for Add to Cart button
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addToCart.bind(this));
  }

  addToCart() {
    setLocalStorage(this.product.Id, this.product) || [];
  }

  renderProductDetails() {
    // console.log("About to render product:", this.product);
    const productElement = document.querySelector(".product-detail");
    
    const isNetlify = window.location.hostname.includes('netlify.app');
    const imagePath = isNetlify 
      ? `/src${this.product.Image.replace('..', '')}`
      : this.product.Image;
    
    console.log("Original image path:", this.product.Image);
    console.log("Modified image path:", imagePath);

    productElement.innerHTML = `
      <h3>${this.product.Brand.Name}</h3>
      <h2 class="divider">${this.product.NameWithoutBrand}</h2>
      <img
        class="divider"
        src="${imagePath}"
        alt="${this.product.Name}"
      />
      <p class="product-card__price">$${this.product.ListPrice}</p>
      <p class="product__color">${this.product.Colors[0].ColorName}</p>
      <p class="product__description">
        ${this.product.DescriptionHtmlSimple}
      </p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
      </div>
    `;
  }
}