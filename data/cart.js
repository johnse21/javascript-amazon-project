export const cart = [];

export function addToCart(productId){
  let matchingItem;

  cart.forEach((cartItem) => {
    if(cartItem.productId === productId){
      matchingItem = cartItem;
    }
  });

  let quantity = Number(document.querySelector(`.js-qty-selector-${productId}`).value);

  if(matchingItem){
    matchingItem.quantity += quantity;

  }else{
    cart.push({
      productId,
      quantity
    });

  }
}