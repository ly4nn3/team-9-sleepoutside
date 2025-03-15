import tentsData from "../json/tents.json";

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
  }
  async getData() {
    const isNetlify = window.location.hostname.includes('netlify.app');
    
    const products = tentsData.map(item => {
      if (isNetlify) {
        return {
          ...item,
          Image: item.Image.replace('../', '/src/')
        };
      }
      return item;
    });
    return products;
  }
  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }
}
