import kajuKatli from "../assets/images/kaju.png";
import rasmalai from "../assets/images/rasmalai.jpg";
import chamcham from "../assets/images/chamcham.jpg";
import gulabJamun from "../assets/images/hero.jpg";

import samosa from "../assets/images/samosa.jpg";
import snacks from "../assets/images/snacks.jpg";
import fastfood from "../assets/images/fastfood.jpg";
import beverages from "../assets/images/beverages.jpg";

const products = [

  // =========================
  // SWEETS
  // =========================

  {
    id: 1,
    name: "Kaju Katli",
    category: "Sweets",
    price: 1100,
    unit: "Kg",
    image: kajuKatli,
    rating: 5,
    description: "Premium kaju sweets made with pure desi ghee."
  },

  {
    id: 2,
    name: "Rasmalai",
    category: "Sweets",
    price: 40,
    unit: "Piece",
    image: rasmalai,
    rating: 5,
    description: "Soft rasmalai dipped in rich saffron milk."
  },

  {
    id: 3,
    name: "Cham Cham",
    category: "Sweets",
    price: 400,
    unit: "Kg",
    image: chamcham,
    rating: 5,
    description: "Fresh Bengali cham cham prepared daily."
  },

  {
    id: 4,
    name: "Gulab Jamun",
    category: "Sweets",
    price: 25,
    unit: "Piece",
    image: gulabJamun,
    rating: 5,
    description: "Hot and juicy gulab jamun with rich sugar syrup."
  },


  // =========================
  // SNACKS
  // =========================

  {
    id: 5,
    name: "Samosa",
    category: "Snacks",
    price: 20,
    unit: "Piece",
    image: samosa,
    rating: 5,
    description: "Fresh crispy samosa served hot."
  },

  {
    id: 6,
    name: "Snacks Special",
    category: "Snacks",
    price: 80,
    unit: "Plate",
    image: snacks,
    rating: 5,
    description: "Fresh and delicious snacks prepared daily."
  },


  // =========================
  // FAST FOOD
  // =========================

  {
    id: 7,
    name: "Veg Fast Food",
    category: "Fast Food",
    price: 120,
    unit: "Plate",
    image: fastfood,
    rating: 5,
    description: "Delicious freshly prepared vegetarian fast food."
  },

  {
    id: 8,
    name: "Special Fast Food",
    category: "Fast Food",
    price: 150,
    unit: "Plate",
    image: fastfood,
    rating: 5,
    description: "Hot and tasty fast food made fresh to order."
  },


  // =========================
  // BEVERAGES
  // =========================

  {
    id: 9,
    name: "Cold Beverage",
    category: "Beverages",
    price: 40,
    unit: "Glass",
    image: beverages,
    rating: 5,
    description: "Refreshing chilled beverage served fresh."
  },

  {
    id: 10,
    name: "Special Beverage",
    category: "Beverages",
    price: 60,
    unit: "Glass",
    image: beverages,
    rating: 5,
    description: "Refreshing special beverage from Shree Ladli."
  }

];

export default products;