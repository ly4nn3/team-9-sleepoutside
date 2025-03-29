import { checkRegex, loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const order = new CheckoutProcess("so-cart", ".summary");
order.init();

// Add event listeners to fire calculateOrderTotal when the user changes the zip code
document
  .querySelector("#zip")
  .addEventListener("blur", order.calculateOrderTotal.bind(order));

// validate card number
const cardNumberInput = document.getElementById("cardNumber");
const cardNumberReg =
  /^(?:\d{16}|4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/;
cardNumberInput.addEventListener("change", () => {
  checkRegex(cardNumberInput, cardNumberReg, "Valid", "Invalid Card Number");
});

// validate expiring date
const expirationDateInput = document.getElementById("expiration");
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 2).padStart(2, "0"); // Ensure the digits are 2
const minDate = `${year}-${month}`; // ensure that the min month is not less than the current month
expirationDateInput.min = minDate;
// console.log("MIN-DATE: ", minDate);  // for testing purpose

// listening for click on the button
document
  .querySelector("#checkout-button")
  .addEventListener("click", async (e) => {
    e.preventDefault();

    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm.checkValidity()) {
      order.checkout();
    } else {
      checkoutForm.reportValidity();
    }
  });
