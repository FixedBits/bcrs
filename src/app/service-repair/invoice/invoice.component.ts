import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../order';
import { FormBuilder } from '@angular/forms';
import { InvoiceService } from '../invoice.service';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent {

  order: Order; // order object for the Order class from order.ts
  isLoading: boolean;
  id: string; //the order id
  errorMessage: string; //error message variable


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService,
    private cookieService: CookieService) {


    this.order = {} as Order; // instantiate a new order object
    this.isLoading = true;
    this.id = this.route.snapshot.queryParamMap.get('id') ??''; // returns the id
    this.errorMessage = '';


    console.log('this.id before ngOnInit:',this.id)
    }

    ngOnInit() {
      // Call API to get invoice by Id.
      this.invoiceService.getInvoice(this.id).subscribe({
        next: (invoice: any) => {
          // set Order values to values obtain for invoice with matching id in database
          this.order = invoice;
          this.isLoading = false;
        },
        error: (err) => {
          if (err.status === 404) {
            this.errorMessage = `Invoice #${this.id} does not exist in our records. Please try again or contact customer service.`
          }
          //Set error handing for if no security questions are found, or if the email was not found
          console.error('Could not get invoice! Please try again.', err)
        }, complete: () => {
          this.isLoading =false
      }
    });
      }
      // Create a function to allow user to print invoice page.
      printInvoice() {
        window.print();
      }

    }