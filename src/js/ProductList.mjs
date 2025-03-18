import { renderListWithTemplate } from "./utils.mjs";

export default class ProductList {
    constructor(category, dataSource, listElement) {            //Save parameters to class properties for using later
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async renderList() {
        const list = await this.dataSource.getData();

        console.log("Full Product List from JSON: ", list)

        const excludedTents = ["989CG", "880RT"];
        const filteredList = list.filter(product => !excludedTents.includes(product.Id));

        renderListWithTemplate(productCardTemplate, this.listElement, filteredList, "afterbegin");
    }

    async init() {                                              //Get product data, debugging message
        console.log("Product data loaded: ", await this.dataSource.getData());
        await this.renderList();
    }

}

function productCardTemplate(product) {
    return `<li class="product-card">
        <a href="product_pages/?product=${product.Id}">
            <img src="${product.Image}" alt="Image of ${product.Name}">
            <h2 class="card__brand">${product.Brand.Name}</h2>
            <h3 class="card__name">${product.NameWithoutBrand}</h3>
            <p class="product-card__price">$${product.FinalPrice || "N/A"}</p>
        </a>
  </li>`;
}
