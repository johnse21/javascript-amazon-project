import { cart, addToCart, countCheckoutItems } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/util.js";

let productsHTML = '';
products.forEach((product) => {
  productsHTML += `
  <div class="product-container">
    <div class="product-image-container">
      <img class="product-image"
        src="${product.image}">
    </div>

    <div class="product-name limit-text-to-2-lines">
      ${product.name}
    </div>

    <div class="product-rating-container">
      <img class="product-rating-stars"
        src="images/ratings/rating-${product.rating.stars * 10}.png">
      <div class="product-rating-count link-primary">
        ${product.rating.count}
      </div>
    </div>

    <div class="product-price">
      $${formatCurrency(product.priceCents)}
    </div>

    <div class="product-quantity-container">
      <select class="js-qty-selector-${product.id}">
        <option selected value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>
    </div>

    <div class="product-spacer"></div>

    <div class="added-to-cart js-added-to-cart-${product.id}">
      <img src="images/icons/checkmark.png">
      Added
    </div>

    <button class="add-to-cart-button button-primary js-add-to-cart"
      data-product-id="${product.id}">
      Add to Cart
    </button>
  </div>
  `;
});

document.querySelector('.js-products-grid').innerHTML = productsHTML;

const cartQtyDisp = document.querySelector('.js-cart-qty-disp');
cartQtyDisp.innerHTML = countCheckoutItems();

function updateCartQty(productId){
  let cartQty = 0;
  cart.forEach((cartItem) => {
    cartQty += cartItem.quantity;
  });

  cartQtyDisp.innerHTML = cartQty;

  const addToCartMsg = document.querySelector(`.js-added-to-cart-${productId}`);
  addToCartMsg.classList.add('added-to-cart-show');

  let intervalId;

  intervalId = setInterval(()=>{
    addToCartMsg.classList.remove('added-to-cart-show');

    clearTimeout(intervalId);
  }, 2000);
}

const allAddToCartBtn = document.querySelectorAll('.js-add-to-cart');

allAddToCartBtn.forEach((button) => {
  button.addEventListener('click', ()=>{
    const {productId} = button.dataset;
    addToCart(productId);
    updateCartQty(productId);
  });
});


