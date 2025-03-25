const baseURL = import.meta.env.VITE_SERVER_URL

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor() {}

  async getData(category) {
    try {
      const response = await fetch(`${baseURL}products/search/${category}`);
      if (response.ok) {
        const data = await convertToJson(response);
        return data.Result;
      } else {
        throw new Error(`Fetch Error: {status: ${response.status}}`);
      }
    } catch (err) {
      console.error(err);
    }
  }
  
  async findProductById(id) {
    try {
      const response = await fetch(`${baseURL}product/${id}`);
      if (response.ok) {
        const product = await convertToJson(response);
        // console.log("PROODUCT: ", product);  // for debugging purpose
        return product.Result;
      } else {
        throw new Error(`Fetch Error: {status: ${response.status}}`);
      }
    } catch (err) {
      console.error(err);
    }
  }
}
