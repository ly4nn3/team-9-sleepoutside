import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

const productId = getParam("product");
const dataSource = new ProductData();
// console.log(dataSource.findProductById(productId));

const product = new ProductDetails(productId, dataSource);
product.init();

loadHeaderFooter();
