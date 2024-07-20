/**
 * DeVonte' Ellis
 * 7-18-2024
 * profile-component.ts
 */

import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserViewModel } from '../security/registration-model';
import { EmployeesService } from '../employees.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user: UserViewModel
  errorMessage: string
  profileOnSaveError: string
  profileOnSaveSuccess: string
  role: string
  avatarColors: Array<string> =['#5D001E', '#FF0000', '#FF7F00','#004900', '#0000FF', '#4B0082', '#9400D3'] //Avatar Colors
  randomAvatarColor: string

  //form for the profile component with the first and last name fields
  profileForm: FormGroup = this.fb.group({
    firstName: [null, Validators.compose([Validators.required])],
    lastName: [null, Validators.compose([Validators.required])],
  })

  //Injects employeeservice, cookieservice, router, and httpclient
  constructor (private cookieService: CookieService, private employeeService: EmployeesService, private fb: FormBuilder) {
    this.user = {} as UserViewModel //initializes user variable
    this.errorMessage = '' //initializes errorMessage variable
    this.profileOnSaveError = ''
    this.profileOnSaveSuccess = ''
    this.employeeInitials = ''
    this.role = '' //initializes role variable
    this.randomAvatarColor = this.avatarColors[Math.floor(Math.random() * this.avatarColors.length)] //avatar color variable

    const cookie = JSON.parse(this.cookieService.get('session_user')) //parses the cookie

    console.log('cookie', cookie) //logs the cookie

    //call to the get EmployeebyEmpID function in Employee Service
    this.employeeService.getEmployeeByEmpId(cookie.empId).subscribe({
      //on next function for the observable response from the getEmployeeByEmpId function
      next: (res) => {
        this.user = res
        console.log('employee', this.user) //logs employee variable
      },
      error: (err) => {
        console.log(err) // Logging the error
        this.errorMessage = err.message
      },
      complete: () => {
        this.employeeIntials = `${this.user.firstName.charAt(0)}${this.user.lastName.charAT(0)}` //sets the user variable
        this.role = this.user.role.charAt(0).toUpperCase() + this.employeeService.role.slice(1) //sets the role variable

        this.profileForm.controls['firstName'].setValue(this.user.firstName) //sets first name field in the profile form
        this.profileForm.controls['lastName'].setValue(this.user.lastName)  //sets the last name field in the profile form
      }
    })
  }

  //======================Function to Save the changes in the profile form===================================
  saveChanges() {
    const firstName = this.profileForm.controls['firstName'].value
    const lastName = this.profileForm.controls['lastName'].value

    console.log(`firstName: ${firstName}, lastName: ${lastName}`) //logs the first and last name

    //call to the updateProfile function in EmployeeService
    this.employeeService.updateProfile(this.user.email, firstName, lastName).subscribe({
      // on next function for the observable response form the updateProfile function
      next: (res) => {
        console.log(`Response from API call: ${res}`)
        this.user.firstName = firstName
        this.user.lastName = lastName
        this.employeeInitials = `${this.employeeService.firstName.charAt(0)}${this.user.lastName.charAt(0)}`
      },
      //if error occurs in the updateProfile function, then call this function to handle the error
      error: (err) => {
        console.log(err) //logs the error
        this.profileOnSaveError = err.message
      },
      complete: () => {
        this.profileForm.reset() //resets profile form
        this.profileForm.controls['firstName'].setValue(this.user.firstName)
        this.profileForm.controls['lastName'].setValue(this.user.lastName)
      }
    })
  }

  //function that closes & resets the profile form
  close() {
    this.profileForm.reset()
    this.profileForm.controls['firstName'].setValue(this.user.firstName)
    this.profileForm.controls['lastName'].setValue(this.user.lastName)
    this.profileOnSaveError = ''
    this.profileOnSaveSuccess
  }
}
