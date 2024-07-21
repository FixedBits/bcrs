import { Product } from "./product";

export class Order {
  menuItems: Array<Product>; //menuItems array of Product import
  id: number; // for the orderId
  email: string;
  firstName: string;
  lastName: string;
  date: string;
  parts: number;
  labor: number;
  orderTotal: number;

  constructor() {
    // initializing the variables and array
    this.menuItems = [];
    this.email = '';
    this.firstName = '';
    this.lastName = '';
    this.labor = 0;
    this.parts = 0;
    this.orderTotal = 0;

    // generate a random order number between 10000 and 99999
    this.id = Math.floor(Math.random() * 90000) + 10000;

    // get the current date
    this.date = new Date().toLocaleDateString()

  }

  // A function that returns the order total of the products
  getOrderTotal(){
    let total = 0; //initializing the order total and setting it at 0 to begin with
    let laborTotal = 0;

    for (let product of this.menuItems) {
      total += product.price; // add product price to the total
      laborTotal = this.labor * 50;
    } // end of for loop

      console.log('Menu Items Total: ', total) // log the subtotal to the console
      console.log('Labor Total:', laborTotal)
      // add parts and labor to the total
      total = total + laborTotal


      console.log('Total before parseFloat: ', total)
      console.log('Labor after parseFloat', laborTotal)
      total = total + parseFloat(this.parts.toString());

      console.log('Total after parts and labor: ', total)

      console.log('Total: ', total)

      return total.toFixed(2) // return total

  }
}