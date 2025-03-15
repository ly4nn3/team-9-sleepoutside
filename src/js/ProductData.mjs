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

    const isNetlify = window.location.hostname.includes("netlify.app");
    
    if (isNetlify) {
      // for Netlify
      this.path = `/src/json/${this.category}.json`;
    } else {
      // for localhost
      this.path = `../json/${this.category}.json`;
    }
    console.log("Full path:", this.path);
  }
  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => data);
  }
  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }
}
