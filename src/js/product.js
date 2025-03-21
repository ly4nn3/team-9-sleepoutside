import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

const dataSource = new ProductData();
const productId = getParam("product");
// console.log(dataSource.findProductById(productId));

loadHeaderFooter();
const product = new ProductDetails(productId, dataSource);
product.init();
