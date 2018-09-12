import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  name: String;
  username: String;
  email: String;
  password: String;

  constructor(
    private validateService:ValidateService,
    private ngFlashMessageService: NgFlashMessageService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onRegisterSubmit(){
    const user = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password
    }

    // validate all fields
    if(!this.validateService.validateRegistration(user)){
      this.ngFlashMessageService.showFlashMessage({messages:["Please fill in all fields"], timeout: 3000, type: 'danger'});
      return false;
    }
    // validate email
    if(!this.validateService.validateEmail(user.email)){
      this.ngFlashMessageService.showFlashMessage({messages:["Please use valid email"], timeout: 3000, type: 'danger'});
      return false;
    }
    // successful registration
    this.authService.registerUser(user).subscribe(data =>{
      if(data.success){
        this.ngFlashMessageService.showFlashMessage({messages:["You are registered"], type: 'success'});
        this.router.navigate(['/login']);
      } else {
        this.ngFlashMessageService.showFlashMessage({messages:["Something went wrong"], timeout: 3000, type: 'danger'});
        this.router.navigate(['/register']);
      }
    })
  }

}
