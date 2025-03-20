import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { loadHeaderFooter } from "./utils.mjs";

const productCategoryTent = "tents";
const dataSource = new ProductData(productCategoryTent);
const productId = getParam("product");
// console.log(dataSource.findProductById(productId));

loadHeaderFooter();
const product = new ProductDetails(productId, dataSource);
product.init();
