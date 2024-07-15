/**
 * DeVonte Ellis
 * 7-14-24
 * Title: reset-password.component.ts
 */

//imports
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SecurityService } from '../security.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  errorMessage: string //variable for the error message
  email: string //variable for the email address
  isLoading: boolean = false //the loading variable

  //change password form
  changePasswordForm: FormGroup = this.fb.group({
    password: [null, Validators.compose([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z](?=.[A-Z])(?=.*[a-zA-Z]).{8,}$')])] //password field
  })

  constructor (private fb: FormBuilder, private SecurityService: SecurityService, private route: ActivatedRoute, private router: Router) {
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '' //get the email address from the query string
    this.errorMessage = '' //initialize error message variable

    //if no email address is found, redirect to the forgot password page
    if (!this.email) {
      console.log('Sorry. No email address was found')
      this.router.navigate(['/security/sign-in'])
    } //end of if statement
  } //end of the constructor

  changePassword() {
    this.isLoading = true //sets isLoading variable to true

    const password = this.changePasswordForm.controls['password'].value //gets the password from the form

    this.SecurityService.changePassword(this.email, password).subscribe({
      next: (data) => {
        console.log(data)
        this.router.navigate(['/security/sign-in']) //redirects to sign in page
      },
      error: (err) => {
        console.log(err)
        this.errorMessage = err //assigns the error message
        this.isLoading = false //sets isLoading variable to false
      },
      complete: () => {
        this.isLoading = false //sets the isLoading variable to false
      }
    })
  }
}