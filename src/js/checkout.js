import { loadHeaderFooter, alertMessage } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const order = new CheckoutProcess("so-cart", ".summary");
order.init();

// Add event listeners to fire calculateOrderTotal when the user changes the zip code
document
  .querySelector("#zip")
  .addEventListener("blur", order.calculateOrderTotal.bind(order));

// listening for click on the button
document.querySelector("#checkout-button").addEventListener("click", (e) => {
  e.preventDefault(); //prevents page to reload

  const myForm = document.forms["checkout-form"]; //gets the form element

  const validity = myForm.checkValidity(); //validates if any requirement is missing

  //Add more validation feedback to the user...
  const cardNumber = document.querySelector("#cardNumber");
  const expDate = document.querySelector("#expiration");


  if (cardNumber.validity.patternMismatch) alertMessage("Invalid card number!");
  if (expDate.validity.patternMismatch)
    alertMessage("Invalid expiration date!");


  //If any requirement is missing, stops the execution by not calling checkout();
  if (validity) {
    order.checkout();
    myForm.submit(); //submits the form to the url at form.action
    localStorage.clear(); //Clears the localStorage
  } else {
    alertMessage("A value is missing");
  }
});
