import { setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
        // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
        try {
            const productData = await this.dataSource.findProductById(this.productId);

            this.renderProductDetails(productData);
        } catch (error) {
            console.error("Error: ", error);
        }
        // the product details are needed before rendering the HTML

        // once the HTML is rendered, add a listener to the Add to Cart button
        // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on 'this' to understand why.

        document.getElementById("addToCart")
            .addEventListener("click", this.addToCart.bind(this));
    }

    addProductToCart(product) {
        const currentCartItems = getLocalStorage("so-cart")
          ? getLocalStorage("so-cart")
          : []; // return empty array [] if cart is null.
        // console.log("CURRENT-CART-ITEMS: ", currentCartItems);  // for debugging purpose
        currentCartItems.push(product); // add product to current cart array.
        // console.log("UPDATED-CART-ITEMS: ", currentCartItems);  // for debugging purpose
        setLocalStorage("so-cart", currentCartItems); // store current cart array.
    }

    renderProductDetails(product) {
        const productElement = document.querySelector(".product-detail")

        productElement.innerHTML = `
            <h3>${productData.Brand.Name}</h3>

            <h2 class="divider">${productData.NameWithoutBrand}</h2>

        <img class="divider"
            src="${this.productData.Image}"
            alt="${productData.name}" />

        <p class="product-card__price">$${productData.ListPrice}</p>

        <p class="product__color">${productData.Colors.ColorName}</p>

        <p class="product__description">
            ${productData.DescriptionHtmlSimple}
        </p>

        <div class="product-detail__add">
            <button id="addToCart" data-id="${productData.Id}">Add to Cart</button>
        </div>
    </section>
        `
    }
}