import { Component } from '@angular/core';
import { Product} from './product';
import { MenuService } from './menu.service';
import { Order } from './order';
import { Router } from '@angular/router';


@Component({
  selector: 'app-service-repair',
  templateUrl: './service-repair.component.html',
  styleUrls: ['./service-repair.component.css']
})
export class ServiceRepairComponent {


  products: Array<Product>; // a variable that contains an array of products from product.ts imported above
  order: Order // order object from order.ts imported above

  constructor(private menuService: MenuService, private router: Router){

    this.products = this.menuService.getProducts() // call getProducts function from menu.service.ts
    this.order = new Order() // a new order object is created from order.ts

    console.log('Product Listing: ', this.products); // log the products array to the console

  } // constructor ends

  // a function that generates a new order and logs it to the console
  generateOrder() {
    console.log('Order:', this.order); // log the order
    console.log('Products', this.products) // add product to order

    // loop over the products array and add checked products to the order object
  for (let product of this.products) {
    // check if product is checked by the user
    if(product.checked) {
      this.order.menuItems.push(product) // add product to order
    } //end of if statement
  } // end of for loop

  console.log('Ordered Items:', this.order.menuItems) // log ordered items to the console
  console.log('Order Parts:', this.order.parts) // logs the parts

  console.log('Order Labor', this.order.parts) // logs the labor

  console.log('Order Total:', this.order.getOrderTotal()) // log the order total

  this.order.orderTotal = parseFloat(this.order.getOrderTotal()) // set orderTotal to the order's total

  console.log('Order', this.order) // log order to the console

  // navigate to the invoice page
  this.router.navigate(['./invoice'], { queryParams: { order: JSON.stringify(this.order)}}) // ensure router is imported from angular and not express

  }
}
