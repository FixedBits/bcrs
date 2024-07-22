// Imports
import { Component, OnInit } from '@angular/core';
import { UserService } from '../users.service';
import { CookieService } from 'ngx-cookie-service';

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
  message: string = '';

  constructor(private UserService: UserService, private cookieService: CookieService) { }

  // Get the users info
  ngOnInit() {
    const userId = this.cookieService.get('userId');
    this.UserService.getUser(userId).subscribe(user => {
      this.user = user;
      this.originalUser = { ...user };
    });
  }

  //function to save user data
  toggleEdit() {
    if (this.isEditing) {
      this.saveProfile();
    } else {
      this.originalUser = { ...this.user };
    }
    this.isEditing = !this.isEditing;
  }

  //closes the edit mode
  cancelEdit() {
    this.user = { ...this.originalUser };
    this.isEditing = false;
  }


  getLastLoggedIn() {
    if (this.user && this.user.lastLoggedIn) {
      const date = new Date(this.user.lastLoggedIn);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    }
    return 'N/A';
  }

  selectedFile: File | null = null;

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }


  onUploadButtonClicked() {
    if (this.selectedFile) {
      this.UserService.uploadProfilePicture(this.user._id, this.selectedFile).subscribe(response => {
        console.log(response);

        this.user.profilePicture = response.profilePicture;
        this.message = 'Profile picture uploaded successfully!';
      }, error => {
        // Shows an error message
        console.error(error);
        this.message = error.error.error;
      });
    }
  }

//saves the profile
  saveProfile() {
    this.UserService.updateUser(this.user._id, this.user).subscribe(() => {
      this.message = 'Profile saved';
    }, error => {
      this.message = 'Profile save failed';
    });
  }

}