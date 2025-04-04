import ExternalServices from "./ExternalServices.mjs";
import {
  alertMessage,
  getLocalStorage,
  removeAllAlert,
  setLocalStorage,
} from "./utils.mjs";

const services = new ExternalServices();

// takes the items currently stored in the cart (localstorage) and returns them in a simplified form.
function packageItems(items) {
  // convert the list of products from localStorage to the simpler form required for the checkout process.
  const simplifiedList = items.map(
    ({ Id: id, Name: name, FinalPrice: price, quantity }) => ({
      id,
      name,
      price,
      quantity,
    }),
  );

  // An Array.map would be perfect for this process.
  return simplifiedList;
}

// takes a form element and returns an object where the key is the "name" of the form input.
function formDataToJSON(formElement) {
  const formData = new FormData(formElement),
    convertedJSON = {};

  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

// packageItems(getLocalStorage("so-cart"));  // for testing purpose

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    // calculate and display the total dollar amount of the items in the cart, and the number of items.

    //Subtotal: takes the list and applies reduce to add all the FinalPrice
    //Calculate
    this.itemTotal = this.list.reduce(
      //accumulator + (price * quantity), starting at 0
      (acc, current) => acc + current.FinalPrice,
      0,
    );
    //Display
    document.querySelector(`${this.outputSelector} #subtotal`).innerHTML =
      `$${this.itemTotal.toFixed(2)}`;
    document.querySelector(`${this.outputSelector} #num-items`).innerHTML =
      `${this.list.length}`; //number of items
  }

  calculateOrderTotal() {
    // calculate the tax and shipping amounts. Add those to the cart total to figure out the order total
    this.tax = this.itemTotal * 0.06;
    this.shipping = 10 + (this.list.length - 1) * 2;
    this.orderTotal =
      parseFloat(this.itemTotal) +
      parseFloat(this.tax) +
      parseFloat(this.shipping);

    // display the totals.
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    // once the totals are all calculated display them in the order summary page
    //Making a reference to the html elements
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const total = document.querySelector(`${this.outputSelector} #total`);

    //filling in with information
    tax.innerText = `$${this.tax.toFixed(2)}`;
    shipping.innerText = `$${this.shipping.toFixed(2)}`;
    total.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout() {
    // get the form element data by the form name
    const form = document.forms["checkout-form"];

    // convert the form data to a JSON order object using the formDataToJSON function
    // in case of form missing
    if (form) {
      const formData = formDataToJSON(form);
      // assign the correct format of expiration data
      const expiration = formData.expiration;
      const [year, month] = expiration.split("-").map(Number);
      // console.log("Year: ", String(year).slice(-2), "Month: ", month);  // for testing purpose
      formData.expiration = `${month}/${String(year).slice(-2)}`;
      // populate the JSON order object with the order Date, orderTotal, tax, shipping, and list of items
      formData.orderDate = new Date().toISOString();
      formData.orderTotal = this.orderTotal;
      formData.tax = this.tax;
      formData.shipping = this.shipping;
      formData.items = packageItems(this.list);
      // console.log("FORM DATA: ", formData);  // for testing purpose

      try {
        const response = await services.checkout(formData);
        // console.log(response);
        if (response.orderId) {
          // clear storage
          setLocalStorage("so-cart", []);
          // clear form
          Object.keys(formData).forEach((key) => {
            if (form.elements[`${key}`]) {
              form.elements[`${key}`].value = "";
            }
          });

          const urlParam = encodeURI(
            `name=${formData.fname}&msg=${response.message}`,
          );
          open(`../checkout/success.html?${urlParam}`, "_self");
        }
      } catch (err) {
        console.error(err); // for debugging purpose
        // remove all previous alerts
        removeAllAlert(true);
        // get adn display error messages
        Object.values(err.message).forEach((errorMsg) => {
          alertMessage(errorMsg, false);
        });
      }
    } else {
      console.error("Form not found");
    }
  }
}
