const express = require('express');
let cors = require('cors');
const { resolve } = require('path');

const app = express();
app.use(cors());
const port = 3000;

app.use(express.static('static'));

//server side Values
let taxRate = 5; // 5%
let discountPerentage = 10; //10%
let loyaltyRate = 2; //2 points per $1

app.get('/cart-total', (req, res) => {
  let newItemPrice = parseFloat(req.query.newItemPrice);
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(getCartTotal(newItemPrice, cartTotal));
});
function getCartTotal(newItemPrice, cartTotal) {
  if (cartTotal >= 0) {
    return (newItemPrice + cartTotal).toString();
  }
}

app.get('/membership-discount', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let isMember = req.query.isMember;
  res.send(discountedFinalPrice(cartTotal, isMember));
});
function discountedFinalPrice(cartTotal, isMember) {
  if (isMember === 'true') {
    return (cartTotal - cartTotal * (discountPerentage / 100)).toString();
  } else return cartTotal.toString();
}

//Endpoint 3 : Calculate tax on the cart total
app.get('/calculate-tax', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(calculateTax(cartTotal));
});
function calculateTax(cartTotal) {
  return (cartTotal * (taxRate / 100)).toString();
}

//Endpoint 4 : Estimate delivery time based on shipping method
app.get('/estimate-delivery', (req, res) => {
  let shippingMethod = req.query.shippingMethod;
  let distance = parseFloat(req.query.distance);
  res.send(estimatedDeliveryTime(shippingMethod, distance));
});
function estimatedDeliveryTime(shippingMethod, distance) {
  if (shippingMethod.toLowerCase() === 'standard') {
    return (distance / 50).toString();
  } else if (shippingMethod.toLowerCase() === 'express') {
    return (distance / 100).toString();
  } else return 'Invalid shippingMethod';
}

//Endpoint 5 : Calculate the shipping cost based on weight and distance
app.get('/shipping-cost', (req, res) => {
  let weight = parseFloat(req.query.weight);
  let distance = parseFloat(req.query.distance);
  res.send(calculateShippingCost(weight, distance));
}); ///shipping-cost?weight=2&distance=600
function calculateShippingCost(weight, distance) {
  return (weight * distance * 0.1).toString();
}

//Endpoint 6 : Calculate loyalty points earned from a purchase
app.get('/loyalty-points', (req, res) => {
  let purchaseAmount = parseFloat(req.query.purchaseAmount);
  res.send(calculateLoyaltyPoints(purchaseAmount));
}); // /loyalty-points?purchaseAmount=3600
function calculateLoyaltyPoints(purchaseAmount) {
  return (purchaseAmount * loyaltyRate).toString();
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
