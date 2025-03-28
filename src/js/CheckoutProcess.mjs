import ShoppingCart from "./ShoppingCart.mjs";
import { getLocalStorage } from "./utils.mjs";

// export default class CheckoutProcess{
//     constructor(){

//     }

//     init(){
//         const cartItems = getLocalStorage("so-cart") || [];
//         console.log(cartItems)
//         const cart = new ShoppingCart()
//         const subtotal= cart.calculateCartTotal(cartItems)
//         this.displayItemSubtotal(subtotal)

//         document.querySelector('#zcode').addEventListener('change', () => {

//             this.displayCharges(cartItems, subtotal)
//         })

//     }

//     displayItemSubtotal(subtotal){

//         //console.log(result)

//         document.querySelector('#subtotal').innerHTML = subtotal

//     }

//     displayCharges(cartItems, subtotal){
//         const tax = (parseFloat(subtotal * 0.06)).toFixed(2)
//         document.querySelector('#tax').innerHTML = tax
//         const shipping = (10 * (cartItems.length/cartItems.length)) + ((cartItems.length - 1) * 2);
//         document.querySelector('#shipping').innerHTML = shipping
//         document.querySelector('#total').innerHTML = (parseFloat(subtotal) + parseFloat(tax) + shipping).toFixed(2)
//     }



// }

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

        //When the zipcode in filled, the other calculations are made;
        const zcode = document.querySelector(`#zcode`);
        zcode.addEventListener('change', () => {this.calculateOrderTotal()})
    }

    calculateItemSummary() {
        // calculate and display the total dollar amount of the items in the cart, and the number of items.

        //Subtotal: takes the list and applies reduce to add all the FinalPrice
        //Calculate
        this.itemTotal = this.list.reduce((acc, current) => acc + current.FinalPrice, 0)
        //Display
        document.querySelector(`${this.outputSelector} #subtotal`).innerHTML = `$${this.itemTotal}`
        document.querySelector(`${this.outputSelector} #num-items`).innerHTML = `${this.list.length}` //number of items

    }

    calculateOrderTotal() {
        // calculate the tax and shipping amounts. Add those to the cart total to figure out the order total
        this.tax = (this.itemTotal * 0.06);
        this.shipping = 10 + (this.list.length - 1) * 2
        this.orderTotal =
            parseFloat(this.itemTotal) +
            parseFloat(this.tax) +
            parseFloat(this.shipping)

        // display the totals.
        this.displayOrderTotals();
    }

    displayOrderTotals() {
        // once the totals are all calculated display them in the order summary page
        //Making a reference to the html elements
        const tax = document.querySelector(`${this.outputSelector} #tax`);
        const shipping = document.querySelector(`${this.outputSelector} #shipping`);
        const total = document.querySelector(`${this.outputSelector} #total`)

        //filling in with information
        tax.innerText = `$${this.tax.toFixed(2)}`;
        shipping.innerText = `$${this.shipping.toFixed(2)}`;
        total.innerText = `$${this.orderTotal.toFixed(2)}`;
        
    }
}


const checkout = new CheckoutProcess('so-cart', '.summary')
checkout.init()
