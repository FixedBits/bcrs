import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SecurityService } from '../security.service';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

  errorMessage: string
  isLoading: boolean = false

  /**
   * FormBuilder or 'fb' is a service that helps streamline the creation of form controls and groups.
   * instead of typing 'FormControl', and 'FormGroup' the 'FormBuilder provides methods like 'group()' to make the process easier.
   *
   * FormGroup
   */

  signinForm = this.fb.group({
    //signinForm manages the email and password fields
    /**The fields are initialized with null which represents their initial value and keeps field empty by default
     * Validators is a set of built-in validators to validate form controls
     * For example, in the following the email field uses Validators.required so that the field cannot be left empty as well as providing a valid email format
     * the password field uses the required option as well and a pattern that enforces a complicated password to be entered
     */
    email: [null, Validators.compose([Validators.required, Validators.email])],
    //For the password pattern a regular expression is used or a string. If a string is passed the ^ character is placed at the beginning of the string and the $ is placed at the end
    password: [null, Validators.compose([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$')])]
  })


  //The constructor uses dependency injection to bring in several services that the component will use.
  constructor(
    /**
     * 'FormBuilder' dependency is a service used to create form controls in a more concise and readable way. It provides methods such as group() to quickly set up a
     * form with initial values and validators.
     * The 'Router' service is used for navigating to different routes within the angular application after successfully signing in. The user can navigate to another route such as the home page.
     * 'CookieService' is used to handle browser cookies and provides methods to get, set, and delete cookies. After successfully signing in an authentication token might be stored in a cookie for session management.
     */
    private fb: FormBuilder,
    private router: Router,
    private cookieService: CookieService,
    private secService: SecurityService,
    private route: ActivatedRoute
  ){
    this.errorMessage = ''
  }

  signIn() {
    this.isLoading = true; //sets isLoading to true to display the loading spinner
    console.log('Sign in Form:', this.signinForm.value)


    let email = this.signinForm.controls['email'].value; //get the email from the signin form
    let password = this.signinForm.controls['password'].value; // get the password from the signin form

    if (!email || !password) {
      this.errorMessage = 'Please provide an email address and password.';
      this.isLoading = false; // hides the loading spinner
      return;
    }

    this.secService.signIn(email, password).subscribe({
      next: (user: any) => {
        console.log('User:', user);

        // create the sessionCookie object with the employee's full name and role properties from the Security API
        const sessionCookie = {
          fullName: `${user.firstName} ${user.lastName}`,
          role: user.role,
          email: user.email,

        }

        //gives user two session cookies to name and Id
        this.cookieService.set('session_user', JSON.stringify(sessionCookie), 1); // sets the session_user cookie

        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/'; //if there is no return url redirect the user to the homepage
        this.isLoading = false;

        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isLoading = false;

        console.log('err', err)

        if(err.error.status === 401) {
          //to set the value of the error message
          this.errorMessage = 'Invalid email and/or password. Please try again.'
          return
          }
        }
      })
    }
  }

