import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgFlashMessageService } from 'ng-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public router: Router,
    private ngFlashMessageService: NgFlashMessageService
  ) {}

  ngOnInit() {
  }

  onLogOutClick(){
    this.authService.logOutUser();
    this.ngFlashMessageService.showFlashMessage({messages:["You are logged out"], type: 'success'});
    this.router.navigate(['/login']);
    return false;
  }
}
