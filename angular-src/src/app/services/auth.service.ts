import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token: any;
  user: any;

  constructor(public http:Http) { }

  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('users/register', user, {headers: headers})
      .pipe(map(res => res.json()));
  }

  loginUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('users/authenticate', user, {headers: headers})
      .pipe(map(res => res.json()));
  }

  storeUserData(token, user){
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.token = token;
    this.user = user;
  }

  logOutUser(){
    this.user = null;
    this.token = null;
    localStorage.clear();
  }

  getUserProfile(){
    let headers = new Headers();
    this.getToken();
    headers.append('Authorization', this.token);
    headers.append('Content-Type', 'application/json');
    return this.http.get('users/profile', {headers: headers})
      .pipe(map(res => res.json()));
  }

  getToken(){
    const token = localStorage.getItem('id_token');
    this.token = token;
  }

  public loggedIn(){
    if (localStorage.id_token == undefined){
      return false;
    } else {
      const helper = new JwtHelperService();
      return !helper.isTokenExpired(localStorage.id_token);
    }
  }

}
