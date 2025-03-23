// use strict
import { renderListWithTemplate } from "./utils.mjs";

export default class ProductList {
    // constructor for geting parameter in a class
    constructor(category, dataSource, sortElement, listElement) {
        this.category = category;  // store the category of product
        this.dataSource = dataSource;  // get the source of the data i.e the path to the data
        this.sortElement = sortElement;  // for sorting data
        this.listElement = listElement;  // holds the document element to be used in pupulating the data
    }

    // init needed for initial call after instantiating a class
    async init() {
        // set category title
        const categoryTitle = document.getElementById("products-category-title");
        categoryTitle.innerHTML = this.category;
        // fetch category products data
        const productsData = await this.dataSource.getData(this.category);  // get product data (a list of product data)
        // console.log('Category: ', this.category);  // for testing purpose
        // console.log(`${this.category} Data: `, productsData);  // for testing purpose
        this.sortList(productsData);

        //initialize the search function
        searchProduct();
    }

    // renderList to rendering (i.e displaying) product in the page
    renderList(productListData) {
        renderListWithTemplate(productCardTemplate, this.listElement, productListData, undefined, true);
    }

    sortList(productsData) {
        const sortValues = ["most-recent", "product(a-z)", "product(z-a)", "brand(a-z)", "brand(z-a)", "low-highest", "highest-to-low"];

        // SPECIFIC FUNCTIONS
        // create and add sort options to sortElement
        const createOptions = () => {
            // option most recent sort
            const optionMostRecent = document.createElement("option");
            optionMostRecent.textContent = "Most Recent";
            optionMostRecent.value = sortValues[0];
            this.sortElement.appendChild(optionMostRecent);

            // option name (a-z) sorting
            const optionAtoZ = document.createElement("option");
            optionAtoZ.textContent = "Product-Name (A-Z)";
            optionAtoZ.value = sortValues[1];
            this.sortElement.appendChild(optionAtoZ);

            // option name (z-a) sorting
            const optionZtoA = document.createElement("option");
            optionZtoA.textContent = "Product-Name (Z-A)";
            optionZtoA.value = sortValues[2];
            this.sortElement.appendChild(optionZtoA);

            // option brand-name (a-z) sorting
            const optionBrandAtoZ = document.createElement("option");
            optionBrandAtoZ.textContent = "Brand-Name (A-Z)";
            optionBrandAtoZ.value = sortValues[3];
            this.sortElement.appendChild(optionBrandAtoZ);

            // option brand-name (z-a) sorting
            const optionBrandZtoA = document.createElement("option");
            optionBrandZtoA.textContent = "Brand-Name (Z-A)";
            optionBrandZtoA.value = sortValues[4];
            this.sortElement.appendChild(optionBrandZtoA);

            // option price (low-highest) sorting
            const optionPriceLtoH = document.createElement("option");
            optionPriceLtoH.textContent = "Price ($) (Lowest - Highest)";
            optionPriceLtoH.value = sortValues[5];
            this.sortElement.appendChild(optionPriceLtoH);

            // option price (highest-lowest) sorting
            const optionPriceHtoL = document.createElement("option");
            optionPriceHtoL.textContent = "Price ($) (Highest - Lowest)";
            optionPriceHtoL.value = sortValues[6];
            this.sortElement.appendChild(optionPriceHtoL);
        }

        // sort and render list by selected option
        const sortByOption = (selectedOption) => {
            // console.log("Sort Option: ", selectedOption);  // for testing purpose
            
            // create a copy of the original list
            const sortList = productsData.slice();

            // sort according to selected sort option
            switch (selectedOption) {
                case sortValues[0]:
                    // sort by most recent (newly added product - to last)
                    sortList.reverse();
                    break;
                case sortValues[1]:
                    // sort by alphabet (a-z)
                    sortList.sort((a, b) => {
                        let first = a.NameWithoutBrand.toLowerCase();
                        let second = b.NameWithoutBrand.toLowerCase();
                        if (first > second) return -1;
                        if (first < second) return 1;
                        return 0;
                    });
                    break;
                case sortValues[2]:
                    // sort by alphabet (z-a)
                    sortList.sort((a, b) => {
                        let first = a.NameWithoutBrand.toLowerCase();
                        let second = b.NameWithoutBrand.toLowerCase();
                        if (first > second) return 1;
                        if (first < second) return -1;
                        return 0;
                    });
                    break;
                case sortValues[3]:
                    // sort by alphabet (z-a)
                    sortList.sort((a, b) => {
                        let first = a.Name.toLowerCase();
                        let second = b.Name.toLowerCase();
                        if (first > second) return -1;
                        if (first < second) return 1;
                        return 0;
                    });
                    break;
                case sortValues[4]:
                    // sort by alphabet (z-a)
                    sortList.sort((a, b) => {
                        let first = a.Name.toLowerCase();
                        let second = b.Name.toLowerCase();
                        if (first > second) return 1;
                        if (first < second) return -1;
                        return 0;
                    });
                    break;
                case sortValues[5]:
                    // sort by price (lowest - highest)
                    sortList.sort((a, b) => b.FinalPrice - a.FinalPrice);
                    break;
                case sortValues[6]:
                    // sort by price (highest - lowest)
                    sortList.sort((a, b) => a.FinalPrice - b.FinalPrice);
                    break;
                default:
                    // default sort
            }


            // console.log("Sorting List: ", sortList);  // for debugging purpose
            // Sort and Render List
            this.renderList(sortList)  // render (display) product on page
        }

        // create and add sort options to display
        createOptions();  // add sort options

        // initial sort and render list
        sortByOption(this.sortElement.value);  // initialy sort and render list by the default option

        // ADD LISTENER
        this.sortElement.addEventListener("change", ()=> {
            sortByOption(this.sortElement.value);
        })
    }

}

//Function to search among the products displayed in the page
function searchProduct(){
    //Waits until the user types something in the search bar
    document.getElementById('search-bar').addEventListener('keyup', event => {
        //Loops through all the products displayed in the page
        document.querySelectorAll('.product-card').forEach(card => {
            //Gets the name and brand in a single string
            const productInfo = ` ${card.querySelector('.card__name').textContent.toLowerCase()} ${card.querySelector('.card__brand').textContent.toLowerCase()} `;

            //Gets what the user typed in the search bar
            const userInput = event.target.value.toLowerCase().trim();
            
            //If what the user typed is not included in this string, the product gets the .filter class (display:none). It also makes sure that the search bar is not empty
            if (!productInfo.includes(userInput) && userInput !== ''){
                card.classList.add('filter')
            } else {
                card.classList.remove('filter')
            }
        })
    })
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
                                <a href="/product_pages/?product=${product.Id}">
                                    <img
                                        src="${product.Images.PrimaryMedium}"
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
                                <a href="/product_pages/?product=${product.Id}">
                                <div class="discount-label"><span>Discount</span></div>
                                    <img
                                        src="${product.Images.PrimaryMedium}"
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