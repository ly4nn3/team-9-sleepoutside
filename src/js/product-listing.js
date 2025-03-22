// use strict
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const productCategory = getParam("category");
const dataSource = new ProductData();
const productListElement = document.querySelector(".product-list");

const productList = new ProductList(
  productCategory,
  dataSource,
  productListElement,
);
productList.init();
