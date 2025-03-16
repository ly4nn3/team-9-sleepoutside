// use strict
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { updateCartCount } from "./utils.mjs";

const productCategoryTents = "tents";
const productTentsData = new ProductData(productCategoryTents);
const productTentsListElement = document.querySelector(".product-list");

const productList = new ProductList(
  productCategoryTents,
  productTentsData,
  productTentsListElement,
);
productList.init();

updateCartCount();
