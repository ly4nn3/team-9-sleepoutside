import{g as r,s as d,u as o,a as s,l as c}from"./utils-D_aC85gH.js";import{P as i}from"./ProductData-Dx0C3TkS.js";class n{constructor(a,e){this.productId=a,this.product={},this.dataSource=e}async init(){this.product=await this.dataSource.findProductById(this.productId),this.renderProductDetails("main"),document.getElementById("addToCart").addEventListener("click",this.addToCart.bind(this))}addToCart(){const a=r("so-cart")||[];a.push(this.product),d("so-cart",a),o()}renderProductDetails(a){document.querySelector(a).insertAdjacentHTML("afterBegin",u(this.product))}}function u(t){return`<section class="product-detail"> 
    <h3>${t.Brand.Name}</h3>
    <h2 class="divider">${t.NameWithoutBrand}</h2>
    <img
      class="divider"
      src="${t.Image}"
      alt="${t.NameWithoutBrand}"
    />
    <p class="product-card__price">$${t.FinalPrice}</p>
    <p class="product__color">${t.Colors[0].ColorName}</p>
    <p class="product__description">
    ${t.DescriptionHtmlSimple}
    </p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${t.Id}">Add to Cart</button>
    </div></section>`}const l="tents",p=new i(l),m=s("product");c();const h=new n(m,p);h.init();
