import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BlogpostService {

  post: any;

  constructor(public http:Http) { }

  createUserPost(post){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('blogposts', post, {headers: headers})
      .pipe(map(res => res.json()));
  }

  getAllUserPosts(){
    return this.http.get('blogposts/all')
      .pipe(map(res => res.json()));
  }

  deleteUserPost(postId){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete('blogposts/'+postId, {headers: headers})
      .pipe(map(res => res.json()));
  }

  getUserPost(postId){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('blogposts/'+postId, {headers: headers})
      .pipe(map(res => res.json()));
  }

  updateUserPost(postId, post){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('blogposts/'+postId, post, {headers: headers})
      .pipe(map(res => res.json()));
  }
}
