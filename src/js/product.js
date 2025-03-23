import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { loadHeaderFooter } from "./utils.mjs";

const dataSource = new ProductData();
const productId = getParam("product");
// console.log("Product Id: ", productId);  // for testing purpose
// console.log(dataSource.findProductById(productId));

const product = new ProductDetails(productId, dataSource);
product.init();

loadHeaderFooter();
