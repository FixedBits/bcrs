
/**
 * DeVonte' Ellis
 * verify-security-questions
 * 7-14-24
 */

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from '../security.service';
import { FormBuilder, FormGroup, SelectControlValueAccessor, Validators } from '@angular/forms';
import { selectedSecurityQuestionsModel } from '../security-questions-model';

@Component({
  selector: 'app-verify-security-questions',
  templateUrl: './verify-security-questions.component.html',
  styleUrls: ['./verify-security-questions.component.css']
})
export class VerifySecurityQuestionsComponent {
  selectedSecurityQuestions: selectedSecurityQuestionsModel[] // security questions model array
  email: string
  errorMessage: string
  isLoadingLabels: boolean
  isLoadingSubmit: boolean
  question1: string
  question2: string
  question3: string

  //angular form group for the security questions form
  sqForm: FormGroup = this.fb.group({
    answer1: [null, Validators.compose([Validators.required])],
    answer2: [null, Validators.compose([Validators.required])],
    answer3: [null, Validators.compose([Validators.required])]
  }) //end sqForm

  //constructor with route, router, security device and form builder parameters
  constructor (
    private route: ActivatedRoute,
    private router: Router,
    private securityService: SecurityService,
    private fb: FormBuilder){


  this.selectedSecurityQuestions = [] //initialize the selected Security questions array
  this.question1 = '' //initialize question 1
  this.question2 = ''
  this.question3 = ''
  this.errorMessage = ''
  this.isLoadingLabels = true
  this.isLoadingSubmit = false
  this.email = this.route.snapshot.queryParamMap.get('email') ?? ''
  console.log('Email Address:', this.email)


  //if no email address is found, redirect to forgot password page.
  if (!this.email) {
    this.router.navigate(['/security/forgot-password'])
    return
  } //end if

  this.securityService.findSelectedSecurityQuestions(this.email).subscribe({
    next: (data: any) => {
      this.selectedSecurityQuestions = data.selectedSecurityQuestions
      console.log('Users selected security questions', this.selectedSecurityQuestions)
    },
    //if there is an error, log it to the console
    error: (err) => {
      console.log('Server Error from findSelectedSecurityQuestions Call:', err)

      //if error is 404, email address wasn't found
      if (err.status === 404) {
        this.errorMessage = "the email address you entered wasn't found"
        return
      } else {
        //if the error status is not 404, there was a server error
        this.errorMessage = 'there was a problem verifying your security questions. Please try again'
      }// end if
      this.isLoadingLabels = false //set the is loading variable to false
    },
    //once the observable is complete, assign the questions to the variables
    complete: () => {
      this.question1 = this.selectedSecurityQuestions[0].question
      this.question2 = this.selectedSecurityQuestions[1].question
      this.question3 = this.selectedSecurityQuestions[2].question

      this.isLoadingLabels = false
    }//end complete
  }) //end subscribe
  }// end constructor

  //local security questions array
  verifySecurityQuestions() {
    this.isLoadingSubmit = true
    console.log(this.sqForm.value)

    //local security questions array and answers

    let securityQuestions = [
      {
        question: this.question1,
        answer: this.sqForm.controls['answer1'].value
      },
      {
        question: this.question2,
        answer: this.sqForm.controls['answer2'].value
      },
      {
      question: this.question3,
      answer: this.sqForm.controls['answer3'].value
      }
    ] //end security questions

    console.log('Employee provided security questions', securityQuestions)

    //call security service verifySecurity questions
    this.securityService.verifySecurityQuestions(this.email, securityQuestions).subscribe({


      //if the observable is successful, navigate to reset password page
      next: (res) => {
        console.log('Response from verifySecurityQuestions Call', res)
        this.router.navigate(['/security/reset-password'], { queryParams: { email: this.email }, skipLocationChange: true })
      },


      //if there is an error, log it to the console
      error: (err) => {
        if (err.error.message) {
          this.errorMessage = err.error.message
          console.error('Server Error from verifySecurityQuestions Call:', err.error.message)
          return
        } else {
          console.error('Server Error from verifySecurityQuestions Call:', err)
          this.errorMessage = 'There was a problem verifying your security questions. Please try again'
          this.isLoadingSubmit = false //set the isLoading variable to false
        } //end else
      },
      complete: () => {
        this.isLoadingSubmit = false
      }
    })
  }
}
