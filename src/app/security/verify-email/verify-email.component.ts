/**
 * Author: Evelyn Zepeda
 * Date: 7/14/24
 * Title: verify-email.component.ts
 * Description: The .ts file to verify the email.
 */

import { SecurityService } from './../security.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})

// Exporting the verifyEmailComponent class
export class VerifyEmailComponent {

  errorMessage: string // error message variable
  isLoading: boolean = false // loading variable

  //email form group for the verify email form
  emailForm: FormGroup = this.fb.group({
    email: [null, Validators.compose([Validators.required, Validators.email])]
  })

  //constructor with form builder, router and the security service
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private SecurityService: SecurityService
  ) {
    this.errorMessage = ''
  }

  // The verifyEmail function to verify the email address entered by the user
  verifyEmail() {
    this.isLoading = true // set the isLoading variable to true

    //get the email from the form
    const email = this.emailForm.controls['email'].value //


    // Call the securityService verifyEmail function to verify the email address
    this.SecurityService.verifyEmail(email).subscribe({

      // If the email address is found, navigate to the verify security questions page
      next: (res) => {

        console.log(res)
        this.router.navigate(['security/verify-security-questions'], { queryParams: {email}, skipLocationChange: true})

      },

      // If there is an error, log the error the console
      error: (err) => {


        console.log('Server Error from verifyEmail Call: ', err)

        // If the error status is 404, assign the error message
        if (err.status === 404) {
          this.errorMessage = 'The email address you entered was not found.'
          return
        }

        // If the error status is 500, assign the error message
        this.errorMessage = 'There was a problem verifying your email address. Please contact the system administrator.'
        this.isLoading = false
      },

      // If the call is complete, set the isLoading variable to false
      complete: () => {
        this.isLoading = false
      }
    })
  }
}
