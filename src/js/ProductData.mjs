function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    this.path = `../json/${this.category}.json`;
    console.log("Full path:", this.path);
  }
  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => data);
  }
  async findProductById(id) {
    console.log("Searching for ID:", id);
    const products = await this.getData();
    console.log("All products:", products);
    const product = products.find((item) => item.Id === id);
    console.log("Found product:", product);
    return product;
  }
}
