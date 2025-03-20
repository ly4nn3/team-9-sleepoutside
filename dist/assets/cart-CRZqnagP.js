import{l,g as o,s as i}from"./utils-D_aC85gH.js";class n{constructor(a,r,t){this.productListElement=a,this.cartTotalHolder=r,this.cartTotalElement=t}int(){l();const a=o("so-cart")||[];if(a.length>0){const r=a.map(t=>d(t));this.productListElement.innerHTML=r.join(""),this.cartTotalElement.innerHTML=`<b>Total</b>: $${this.calculateCartTotal(a)}`,this.cartTotalHolder.classList.remove("hide"),document.querySelectorAll(".remove-item").forEach(t=>{t.addEventListener("click",c=>this.removeItemFromCart(c))})}else this.productListElement.innerHTML=m(),this.cartTotalHolder.classList.add("hide")}calculateCartTotal(a){return a.reduce((r,t)=>r+t.FinalPrice,0).toFixed(2)}removeItemFromCart(a){const r=a.target.getAttribute("data-id");let t=o("so-cart")||[];const c=t.findIndex(s=>s.Id===r);c!==-1&&t.splice(c,1),i("so-cart",t),this.int()}}function d(e){return`<li class="cart-card divider" id="${e.Id}">
        <a href="#" class="cart-card__image">
            <img
            src="${e.Image}"
            alt="${e.Name}"
            />
        </a>
        <a href="#">
            <h2 class="card__name">${e.Name}</h2>
        </a>
        <p class="cart-card__color">${e.Colors[0].ColorName}</p>
        <p class="cart-card__quantity">qty: 1</p>
        <p class="cart-card__price">$${e.FinalPrice}</p> 

        <button class="remove-item" data-id="${e.Id}">X</button>    
                    
        </li>`}function m(){return`<div class="empty-cart-holder">
                    <h3>EMPTY CART</h3>
                    <img src="../images/placeholders/empty-cart.gif" alt="empty-cart" />
                </div>`}const p=document.querySelector(".product-list"),u=document.querySelector(".cart-footer"),h=document.querySelector(".cart-total"),T=new n(p,u,h);T.int();
