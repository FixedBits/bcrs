// Imports
import { Component, OnInit } from '@angular/core';
import { UserService } from '../users.service';
import { CookieService } from 'ngx-cookie-service';
import { userInterface } from '../models/user-interface';

@Component({
  selector: 'app-my-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class MyProfileComponent implements OnInit {

  // Variables
  user: any;
  isEditing = false;
  originalUser: any;
  message: string = '';  // Initialize the 'message' property

  constructor(private UserService: UserService, private cookieService: CookieService) { }

  // Get the user's information
  ngOnInit() {
    const userId = this.cookieService.get('userId');
    this.UserService.getUser(userId).subscribe(user => {
      this.user = user;
      this.originalUser = { ...user };
    });
  }

  // Toggle the edit mode
  toggleEdit() {
    if (this.isEditing) {
      this.saveProfile();
    } else {
      this.originalUser = { ...this.user }; // save the current user data before entering edit mode
    }
    this.isEditing = !this.isEditing;
  }

  // Cancel the edit mode
  cancelEdit() {
    this.user = { ...this.originalUser }; // restore the original user data
    this.isEditing = false;
  }

  selectedFile: File | null = null;

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  // Save the user's profile
  saveProfile() {
    this.UserService.updateUser(this.user._id, this.user).subscribe(() => {
      this.message = 'Profile saved';
    }, error => {
      this.message = 'Profile save failed';
    });
  }

}