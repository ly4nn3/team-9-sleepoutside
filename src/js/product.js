import { getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const dataSource = new ExternalServices();
const productId = getParam("product");
// console.log("Product Id: ", productId);  // for testing purpose
// console.log(dataSource.findProductById(productId));

const product = new ProductDetails(productId, dataSource);
product.init();
