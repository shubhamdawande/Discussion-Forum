import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(public http:Http) {}

  private socket = io();

  joinRoom(data){
      this.socket.emit('join',data);
  }

  newUserJoined(){
      let observable = new Observable<{user:String, message:String}>(observer=>{
          this.socket.on('new user joined', (data)=>{
            observer.next(data);
          });
          return () => {this.socket.disconnect();}
      });
      return observable;
  }


  leaveRoom(data){
      this.socket.emit('leave',data);
  }

  userLeftRoom(){
      let observable = new Observable<{user:String, message:String}>(observer=>{
          this.socket.on('left room', (data)=>{
              observer.next(data);
          });
          return () => {this.socket.disconnect();}
      });

      return observable;
  }

  sendMessage(data)
  {
      this.socket.emit('message',data);
  }

  newMessageReceived(){
      let observable = new Observable<{user:String, message:String}>(observer=>{
          this.socket.on('new message', (data)=>{
              observer.next(data);
          });
          return () => {this.socket.disconnect();}
      });

      return observable;
  }

  getAllUsernames(){
    return this.http.get('users/all')
      .pipe(map(res => res.json()));
  }

}
