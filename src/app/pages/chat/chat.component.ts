import { Component, OnInit,AfterViewChecked, ViewChild, ElementRef } from "@angular/core";
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { ChatService } from './chat.service';
import { Chat } from './chat';
import { JwtHelperService } from "@auth0/angular-jwt";


@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"]
})
export class ChatComponent implements OnInit,AfterViewChecked {
  @ViewChild('typing') private typingElement: ElementRef;

  faEnvelope = faEnvelope;
  message:string;
  user_id:number;
  data:any;
  typing:string;
  messages: string[] = [];
  typings: string[] = [];
  rooms: string[] = [];
  wholeaveroom: string[] = [];
  username:string;
  role_id:string;
  date:string;
  current_date_time:string;
  container: HTMLElement;  

  currentjoinroom:any = ''; 
  chat: Chat[]


  constructor(private chatService: ChatService) {}

  ngOnInit(): void { 

    this.currentjoinroom = localStorage.getItem('currentjoinroom');

    // get all chat message socket
    this.chatService
    .getMessages()
    .subscribe((data) => {

      // only display which room I am
      const room = localStorage.getItem('currentjoinroom');
      if(room == data.room){
        this.messages.push(data);
      }
      
      // clear typing
      this.typings = [];
    });

    // get all typing socket
    this.chatService
    .whoTyping()
    .subscribe((data) => {
      this.typings.push(data);
    });

    // get all chat rooms
    this.chatService
    .wholeaveroom()
    .subscribe((data) => {
      this.wholeaveroom.push(data);
    });


    // get all chat rooms
    this.chatService
    .getallroom()
    .subscribe((data) => {
      console.log('all rooms: ',data);
      this.rooms.push(data);
    });

  }

  // check for scrolling chat
  ngAfterViewChecked(){
    this.container = document.getElementById("msgContainer");           
    this.container.scrollTop = this.container.scrollHeight;     
  }

  // send chat here
  sendchat(){
    const room = localStorage.getItem('currentjoinroom');
    let token = localStorage.getItem('token');
    if (token) {
      let jwt = new JwtHelperService();
      let token_data = jwt.decodeToken(token);
      this.username = token_data.username; 
      this.role_id = token_data.role_id; 
      this.user_id = token_data.user_id; 
    }

    const date = new Date;
    // get day
    let days = ["Sun","Mon","Tues","Wed","Thur","Fri","Sat"];
    let today_day = days[date.getDay()];

    // get month
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    let today_month = months[date.getMonth()];
    const current_date_time = date.getHours() + ":" + date.getMinutes() + " | " + today_month + " " + date.getDate() + " " + today_day;

    this.chatService.sendMessage(this.message,this.username,this.role_id,current_date_time,room,this.user_id);
    this.message = '';
  }

  endchat(){
    const room = localStorage.getItem('currentjoinroom');
    let token = localStorage.getItem('token');
    if (token) {
      let jwt = new JwtHelperService();
      let token_data = jwt.decodeToken(token);
      this.username = token_data.username; 
      this.role_id = token_data.role_id; 
    }

    this.chatService.leavechat(this.username,room);
  }


  agentjoinroom(newroom){
    // clear all the chat when switch different room
    this.messages = [];
    this.chat = [];
    this.currentjoinroom = localStorage.getItem('currentjoinroom');

    let token = localStorage.getItem('token');
    if (token) {
      let jwt = new JwtHelperService();
      let token_data = jwt.decodeToken(token);
      this.user_id = token_data.user_id; 
    }


    this.chatService.joinroom(newroom,this.user_id);
    localStorage.setItem('currentjoinroom',newroom);

  
    // get history chat from this room 
    this.chatService.getroomhistorychat(newroom)
    .subscribe( result => {
 
      this.chat = result;
    });
    // if agent not joining any room yet
   /* if(this.currentjoinroom == ''){
      this.chatService.joinroom(newroom);
      localStorage.setItem('currentjoinroom',newroom);
    }else{
      this.chatService.changeroom(newroom, this.currentjoinroom);
      localStorage.setItem('currentjoinroom',newroom);
    }*/
  }
 
  // who typing
  keypressmessage(event){
    let token = localStorage.getItem('token');
    if (token) {
      let jwt = new JwtHelperService();
      let token_data = jwt.decodeToken(token);
      this.username = token_data.username; 
    }
    this.currentjoinroom = localStorage.getItem('currentjoinroom');

    if(event.target.value !== '') {
      this.chatService.typing(this.username,this.currentjoinroom);
    }else{
      this.typings = [];
    }
  }
}
