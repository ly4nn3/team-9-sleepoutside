import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

console.log("main.js is running");

const productListElement = document.querySelector(".product-list");             //Get reference to HTML element

console.log("Checking to see if .product-list exists: ", productListElement);

const tentsData = new ProductData("tents");                                     //Create an instance of ProductData
const tentsList = new ProductList("tents", tentsData, productListElement);      //Create an instance of ProductList

console.log("Checking to see if tentsList is created: ", tentsList);

tentsData.getData()
    .then((data) => {
        console.log("Tents data loaded: ", data);
        console.log("About to call init() on tentsList...");

        if (tentsList) {
            tentsList.init();
            console.log("init() was called in main.js");
        } else {
            console.error("ERROR: tentsList is undefined or null.");
        }

        console.log("Finished calling init()");
    })
    .catch((error) => {
        console.error("ERROR in getData(): ", error);
    });

