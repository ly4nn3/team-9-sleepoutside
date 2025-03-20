import{r,l as c}from"./utils-D_aC85gH.js";import{P as l}from"./ProductData-Dx0C3TkS.js";class n{constructor(e,s,i){this.category=e,this.dataSource=s,this.listElement=i}async init(){const e=await this.dataSource.getData();this.renderList(e)}renderList(e){r(d,this.listElement,e)}}function d(a){let e="";return a.SuggestedRetailPrice>a.FinalPrice?e=`<li class="product-card">
                                <a href="product_pages/?product=${a.Id}">
                                <div class="discount-label"><span>Discount</span></div>
                                    <img
                                        src="${a.Image}"
                                        alt="${a.Name}"
                                    />
                                    <h3 class="card__brand">${a.Brand.Name}</h3>
                                    <h2 class="card__name">${a.NameWithoutBrand}</h2>
                                    <small><del>$${a.SuggestedRetailPrice}</del> <span class="discount-price">- Save ${((a.SuggestedRetailPrice-a.FinalPrice)/a.SuggestedRetailPrice*100).toFixed(0)}%</span> </small>
                                    <p class="product-card__price">$${a.ListPrice}</p>
                                </a>
                            </li>`:e=`<li class="product-card">
                                <a href="product_pages/?product=${a.Id}">
                                    <img
                                        src="${a.Image}"
                                        alt="${a.Name}"
                                    />
                                    <h3 class="card__brand">${a.Brand.Name}</h3>
                                    <h2 class="card__name">${a.NameWithoutBrand}</h2>
                                    <p class="product-card__price">$${a.ListPrice}</p>
                                </a>
                            </li>`,e}const t="tents",o=new l(t),m=document.querySelector(".product-list"),h=new n(t,o,m);c();h.init();
