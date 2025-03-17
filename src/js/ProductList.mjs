// use strict
import { renderListWithTemplate } from "./utils.mjs";

export default class ProductList {
    // constructor for geting parameter in a class
    constructor(category, dataSource, listElement) {
        this.category = category;  // store the category of product
        this.dataSource = dataSource;  // get the source of the data i.e the path to the data
        this.listElement = listElement;  // holds the document element to be used in pupulating the data
    }

    // init needed for initial call after instantiating a class
    async init() {
        const productsData = await this.dataSource.getData();  // get product data (a list of product data)
        // console.log('Category: ', this.category);  // for testing purpose
        // console.log(`${this.category} Data: `, productsData);  // for testing purpose
        this.renderList(productsData);  // render (display) product on page
    }

    // renderList to rendering (i.e displaying) product in the page
    renderList(productListData) {
        renderListWithTemplate(productCardTemplate, this.listElement, productListData);
    }
}


/***********************************
************ TEMPLATES *************
***********************************/
function productCardTemplate(product) {

    let productTemplate = "";

    if (!(product.SuggestedRetailPrice > product.FinalPrice))
    {
        //This is the template for products whose Retail Price is the same as the Final Price
        productTemplate = `<li class="product-card">
                                <a href="product_pages/?product=${product.Id}">
                                    <img
                                        src="${product.Image}"
                                        alt="${product.Name}"
                                    />
                                    <h3 class="card__brand">${product.Brand.Name}</h3>
                                    <h2 class="card__name">${product.NameWithoutBrand}</h2>
                                    <p class="product-card__price">$${product.ListPrice}</p>
                                </a>
                            </li>`;
    } else {
        //This is the template for products whose Retail Price is less from the Final Price
        productTemplate = `<li class="product-card">
                                <a href="product_pages/?product=${product.Id}">
                                <div class="discount-label"><span>Discount</span></div>
                                    <img
                                        src="${product.Image}"
                                        alt="${product.Name}"
                                    />
                                    <h3 class="card__brand">${product.Brand.Name}</h3>
                                    <h2 class="card__name">${product.NameWithoutBrand}</h2>
                                    <small><del>$${product.SuggestedRetailPrice}</del> <span class="discount-price">- Save ${((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice * 100).toFixed(0)}%</span> </small>
                                    <p class="product-card__price">$${product.ListPrice}</p>
                                </a>
                            </li>`;
    }

    return productTemplate;
}