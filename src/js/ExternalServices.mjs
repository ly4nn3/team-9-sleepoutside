const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  const response = await res.json();
  console.log("Response: ", response);  // for debugging purpose
  if (res.ok) {
    return response;
  } else {
    throw ({ error: "serviceError", message: response })
  }
}

export default class ExternalServices {
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

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    return await fetch(`${baseURL}checkout/`, options).then(convertToJson);
  }
}
