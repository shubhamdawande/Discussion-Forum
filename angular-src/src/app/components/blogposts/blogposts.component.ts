import { Component, OnInit } from '@angular/core';
import { BlogpostService } from '../../services/blogpost.service';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-blogposts',
  templateUrl: './blogposts.component.html',
  styleUrls: ['./blogposts.component.css']
})

export class BlogpostsComponent implements OnInit {

  // post properties
  title: String;
  info: String;
  posts: any;
  postId: String;
  user: any;

  // chat properties
  targetUsername: String = null;
  room:String;
  userStatus: Boolean = false;
  messageText:String;
  messageArray:Array<{user:String,message:String}> = [];
  usersList:any;

  constructor(
    public blogpostService:BlogpostService,
    public authService:AuthService,
    public chatService:ChatService
  ) { }

  ngOnInit() {
    // for handling posts
    this.getAllPosts();
    this.authService.getUserProfile().subscribe(profile => {
      this.user = profile.user;
    });

    // for handling chats
    this.getAllUsersList();

    this.chatService.newUserJoined()
    .subscribe(data=> this.messageArray.push(data));

    this.chatService.userLeftRoom()
    .subscribe(data=>this.messageArray.push(data));

    this.chatService.newMessageReceived()
    .subscribe(data=>this.messageArray.push(data));
  }

  // chat box pop up
  openForm() {
    document.getElementById("myForm").style.display = "block";
    document.getElementById("offlineToggle").style.background = "green";
    this.userStatus = true;
    this.join();
  }

  closeForm() {
    document.getElementById("myForm").style.display = "none";
  }

  openUserInChat(op){
    if(this.user.username != op){
      this.targetUsername = op;
      this.openForm();
    }
  }

  // go offline or online
  toggleStatus(){
    if(this.userStatus){
      document.getElementById("offlineToggle").style.background = "#D9D9D9";
      this.userStatus = false;
      this.leave();
    } else {
      this.getAllUsersList();
      document.getElementById("offlineToggle").style.background = "green";
      this.userStatus = true;
      this.join();
    }

  }

  // join chat room
  join(){
    if(this.targetUsername < this.user.username){
      this.room = this.targetUsername + this.user.username;
    } else {
      this.room = this.user.username + this.targetUsername;
    }
    //console.log(this.room);
    //this.room = this.targetUsername;
    this.chatService.joinRoom({user:this.user.username, room:this.room});
  }

  // leave chat room
  leave(){
    this.chatService.leaveRoom({user:this.user.username, room:this.room});
  }

  // send message to chat room
  sendMessage(){
    if(this.userStatus && this.targetUsername!=null){
      this.chatService.sendMessage({user:this.user.username, room:this.room, message:this.messageText});
      this.messageText = null;
      const element = document.getElementById("allMessages");
      element.scrollTop = element.scrollHeight;
    } else {
      //console.log('You are offline or receiving user not selected');
    }
  }

  // get all users list
  getAllUsersList(){
    this.chatService.getAllUsernames().subscribe(data => {
      if(data.success){
        this.usersList = data.data;
        //console.log(this.usersList);
      } else {
        //console.log('Unable to get userlist');
      }
    });
  }

  // press enter to send chat
  onKeydown(){
      this.sendMessage();
  }
  // get all posts
  getAllPosts(){
    this.blogpostService.getAllUserPosts().subscribe(data => {
      if(data.success){
        this.posts = data.data;
      } else {
        //console.log('Unable to get posts');
      }
    });
  }

  // create new post
  createPost(){
    const newPost = {
      title: this.title,
      info: this.info,
      op: this.user.username
    }
    this.blogpostService.createUserPost(newPost).subscribe(data =>{
      if(data.success){
        this.getAllPosts();
        this.title = null;
        this.info = null;
      } else {
        //console.log('Error creating post');
      }
    });
  }

  deletePost(post){
    if(post.op == this.user.username){
      const postId = post._id;
      this.blogpostService.deleteUserPost(postId).subscribe(data => {
        if(data.success){
          this.getAllPosts();
        } else {
          //console.log('delete error');
        }
      });
    }
  }

  getPostToEdit(post){
    if(post.op == this.user.username){
      const postId = post._id;
      this.blogpostService.getUserPost(postId).subscribe(data=>{
        if(data.success){
          this.title = data.post.title;
          this.info = data.post.info;
          this.postId = data.post._id;
        } else {
          //console.log('Edit error');
        }
      });
    }
  }

  updatePost(){
    const updatedPost = {
      title: this.title,
      info: this.info
    }
    this.blogpostService.updateUserPost(this.postId, updatedPost).subscribe(data=>{
      if(data.success){
        this.getAllPosts();
        this.title = null;
        this.info = null;
      }
    });
  }

}
