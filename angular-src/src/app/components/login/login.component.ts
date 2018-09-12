import { Component, OnInit } from '@angular/core';
import { NgFlashMessageService } from 'ng-flash-messages';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: String;
  password: String;

  constructor(
    public authService: AuthService,
    public router: Router,
    private ngFlashMessageService: NgFlashMessageService
  ) { }

  ngOnInit() {
  }

  onLoginSubmit(){
    const user = {
      username: this.username,
      password: this.password
    }

    this.authService.loginUser(user).subscribe(data =>{
      if(data.success){
        this.authService.storeUserData(data.token, data.user);
        this.ngFlashMessageService.showFlashMessage({messages:["You are logged in"], timeout: 500, type: 'success'});
        this.router.navigate(['/dashboard']);
      } else {
        this.ngFlashMessageService.showFlashMessage({messages:["Unable to log in"], timeout: 3000, type: 'danger'});
        this.router.navigate(['/login']);
      }
    });


  }

}
