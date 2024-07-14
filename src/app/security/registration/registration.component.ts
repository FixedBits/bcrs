
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../security.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RegistrationModel } from '../registration-model';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  // Variables for the register component
  // These variables must be assigned in the constructor
  securityQuestions: string[];
  qArr1: string[];
  qArr2: string[];
  qArr3: string[];

  employee: RegistrationModel // creating the employee variable
  errorMessage: string // creating the error message variable

  // Register form group with form builder and validators
  registerForm: FormGroup = this.fb.group({
    email: [null, Validators.compose([Validators.required, Validators.email])],
    password: [null, Validators.compose([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$')])],
    firstName: [null, Validators.compose([Validators.required])],
    lastName: [null, Validators.compose([Validators.required])],
    question1: [null, Validators.compose([Validators.required])],
    answer1: [null, Validators.compose([Validators.required])],
    question2: [null, Validators.compose([Validators.required])],
    answer2: [null, Validators.compose([Validators.required])],
    question3: [null, Validators.compose([Validators.required])],
    answer3: [null, Validators.compose([Validators.required])]

  })

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private securityService: SecurityService,
  ) {




    // An array of security questions
    this.securityQuestions= [
      "What is your favorite food?",
      "What city were you born in?",
      "What is the name of your first pet?",
    ]

    this.qArr1 =this.securityQuestions // initialize the first array of questions to the security questions array
    this.qArr2 = [] // initialize the second array of questions to an empty array
    this.qArr3 = [] // initialize the third array of questions to an empty array

    this.employee = {} as RegistrationModel // initialize the user to an empty object
    this.errorMessage = '' // initialize the error message to an empty string

  }

  ngOnInit(): void {
    // Subscribe to the value changes of question 1
    this.registerForm.get('question1')?.valueChanges.subscribe(val => {
      console.log('Value changed from question 1', val)
      this.qArr2 = this.qArr1.filter(q => q !== val) // filter the first array of questions to remove the selected question
    })

    // Subscribe to the value changes of question 2
    this.registerForm.get('question2')?.valueChanges.subscribe(val => {
      console.log('Value changed from question 2', val)
      this.qArr3 = this.qArr2.filter(q => q !== val) // filter the second array of questions to remove the second question
    })

  }





    // Register function that takes in no parameters and returns nothing
    // This function registers a new user and navigates to the signin page
    register() {
      // set the employee object to the values of the register form
      this.employee= {
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value,
        firstName: this.registerForm.get('firstName')?.value,
        lastName: this.registerForm.get('lastName')?.value,

        selectedSecurityQuestions: [
          {
            question: this.registerForm.get('question1')?.value,
            answer: this.registerForm.get('answer1')?.value
          },
          {
            question: this.registerForm.get('question2')?.value,
            answer: this.registerForm.get('answer2')?.value
          },
          {
            question: this.registerForm.get('question3')?.value,
            answer: this.registerForm.get('answer3')?.value
          }
        ]
      }

      console.log('Registering new user', this.employee); //log the employee to the console

      // Call the register function from the security service and subscribe to the result
      this.securityService.registration(this.employee).subscribe({
        next: (result) => {
          console.log('Result from Register API call: ', result) // log the results to the console
          this.router.navigate(['/security/signin']) // navigate to the signin page
        },
        error: (err) => {
          if (err.error.message) {
            console.log('db error: ', err.error.message) // log the error message to the console
            this.errorMessage = err.error.message // set the error message to the error message from the API
          } else {
            this.errorMessage = 'Something went wrong. Please contact the system administrator.'
          }
        }
      })
    }
  }


