import { cart, removeFromCart, countCheckoutItems, updateCartQty } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/util.js";

let cartSummmaryHTML = '';

cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    products.forEach((product) => {

      let matchingProduct;

      if (product.id === productId){
        matchingProduct = product;

        cartSummmaryHTML += `
        <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
          <div class="delivery-date">
            Delivery date: Tuesday, June 21
          </div>
  
          <div class="cart-item-details-grid">
            <img class="product-image"
              src="${matchingProduct.image}">
  
            <div class="cart-item-details">
              <div class="product-name">
              ${matchingProduct.name}
              </div>
              <div class="product-price">
                $${formatCurrency(matchingProduct.priceCents)}
              </div>
              <div class="product-quantity">
                <span>
                  Quantity: 
                  <span class="quantity-label js-qty-lbl-${matchingProduct.id}">
                    ${cartItem.quantity}
                  </span>
                </span>
                <span class="update-quantity-link link-primary js-update-qty-btn"
                  data-product-id="${matchingProduct.id}">
                  Update
                </span>
                <input class="qty-input js-qty-input-${matchingProduct.id}"> 
                <span class="link-primary 
                  save-qty-link js-save-input-${matchingProduct.id}">Save</span>
                <span class="delete-quantity-link link-primary js-delete-qty-btn"
                  data-product-id="${matchingProduct.id}">
                  Delete
                </span>
              </div>
            </div>
  
            <div class="delivery-options">
              <div class="delivery-options-title">
                Choose a delivery option:
              </div>
              <div class="delivery-option">
                <input type="radio" checked
                  class="delivery-option-input"
                  name="delivery-option-${matchingProduct.id}">
                <div>
                  <div class="delivery-option-date">
                    Tuesday, June 21
                  </div>
                  <div class="delivery-option-price">
                    FREE Shipping
                  </div>
                </div>
              </div>
              <div class="delivery-option">
                <input type="radio"
                  class="delivery-option-input"
                  name="delivery-option-${matchingProduct.id}">
                <div>
                  <div class="delivery-option-date">
                    Wednesday, June 15
                  </div>
                  <div class="delivery-option-price">
                    $4.99 - Shipping
                  </div>
                </div>
              </div>
              <div class="delivery-option">
                <input type="radio"
                  class="delivery-option-input"
                  name="delivery-option-${matchingProduct.id}">
                <div>
                  <div class="delivery-option-date">
                    Monday, June 13
                  </div>
                  <div class="delivery-option-price">
                    $9.99 - Shipping
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        `
      }
    
      
    });
});

renderCheckoutDisplay();

const orderSummary = document.querySelector('.js-order-summary');
orderSummary.innerHTML = cartSummmaryHTML;

const updateQtyBtns = document.querySelectorAll('.js-update-qty-btn');
updateQtyBtns.forEach((link) => {

  const prodId = link.dataset.productId;
  const qtyLbl = document.querySelector(`.js-qty-lbl-${prodId}`);
  const qtyInput = document.querySelector(`.js-qty-input-${prodId}`);
  const saveQtyBtn = document.querySelector(`.js-save-input-${prodId}`);
  
  saveQtyBtn.addEventListener('click', () => {
    if(isQtyInputValid(qtyInput.value)){
      updateCartQty(prodId, qtyInput.value);
        
      qtyInput.classList.remove('is-editing-qty');
      saveQtyBtn.classList.remove('is-editing-qty');
      link.classList.remove('hide-update-btn');
      qtyLbl.classList.remove('hide-update-btn');
  
      qtyLbl.innerHTML = qtyInput.value;
      renderCheckoutDisplay();
    }
  });

  link.addEventListener('click', () => {
    if(!qtyInput.classList.contains('is-editing-qty')){
      qtyInput.classList.add('is-editing-qty');
      saveQtyBtn.classList.add('is-editing-qty');
      link.classList.add('hide-update-btn');
      qtyLbl.classList.add('hide-update-btn');
    }
  });
});

const deleteQtyBtns = document.querySelectorAll('.js-delete-qty-btn');
deleteQtyBtns.forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);
    renderCheckoutDisplay();

    const itemToBeRemoved = document.querySelector(`.js-cart-item-container-${productId}`);
    itemToBeRemoved.remove();
  });
});

function renderCheckoutDisplay(){
  const checkoutDisp = document.querySelector('.js-checkout-disp');

  let totalCheckedOutItems = Number(countCheckoutItems());

  if(totalCheckedOutItems === 0)
    checkoutDisp.innerHTML = `No item`;
  else if(totalCheckedOutItems === 1)
    checkoutDisp.innerHTML = `1 item`;
  else if(totalCheckedOutItems > 1)
    checkoutDisp.innerHTML = `${totalCheckedOutItems} items`;

  calculateOrder();
}

function isQtyInputValid(qtyInput){
  if((qtyInput).trim() !== '' && Number(qtyInput) >= 0 && Number(qtyInput) < 1000){
    return true;
  }
  return false;

}

function calculateOrder(){

  const itemCntSumLbl = document.querySelector('.js-item-count-lbl');  
  itemCntSumLbl.innerHTML = `Items (${countCheckoutItems()})`;

  const itemTotalSumLbl = document.querySelector('.js-item-total-lbl');
  let totalSum = 0;
  let totalShippingFee = 0;

  cart.forEach((item) => {
    products.forEach((product) => {
      if(item.productId === product.id){
        totalSum += product.priceCents * item.quantity;
        totalShippingFee += 115;
      }
    });
  });
  itemTotalSumLbl.innerHTML = `$${(totalSum / 100).toFixed(2)}`;

  const shippingFeeLbl = document.querySelector('.js-shipping-fee-lbl');
  shippingFeeLbl.innerHTML = `$${totalShippingFee / 100}`;

  const itemNoTaxLbl = document.querySelector('.js-item-notax-lbl');
  let withShippingFee = totalSum + totalShippingFee;
  itemNoTaxLbl.innerHTML = `$${withShippingFee / 100}`;

  const itemTaxSumLbl = document.querySelector('.js-tax-lbl');
  let rate = 0.1;
  let tax = withShippingFee * rate;
  itemTaxSumLbl.innerHTML = `$${(tax / 100).toFixed(2)}`;

  const orderTotalSumLbl = document.querySelector('.js-order-total-lbl');
  let totalWShipAndTax = (withShippingFee + tax) / 100;
  orderTotalSumLbl.innerHTML = `$${(totalWShipAndTax).toFixed(2)}`;
  
}