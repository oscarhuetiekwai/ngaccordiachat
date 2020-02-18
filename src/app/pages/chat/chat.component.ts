import { Component, OnInit,AfterViewChecked, ViewChild, ElementRef } from "@angular/core";
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { ChatService } from './chat.service';

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"]
})
export class ChatComponent implements OnInit,AfterViewChecked {
  @ViewChild('typing') private typingElement: ElementRef;

  faEnvelope = faEnvelope;
  message:string;
  data:any;
  typing:string;
  messages: string[] = [];
  typings: string[] = [];
  username:string;
  role_id:string;
  date:string;
  current_date_time:string;
  container: HTMLElement;  




  constructor(private chatService: ChatService) {}

  ngOnInit(): void { 
    // get all chat message socket
    this.chatService
    .getMessages()
    .subscribe((data) => {
      this.messages.push(data);
    });

    // get all typing socket
    this.chatService
    .whoTyping()
    .subscribe((data) => {
      if(data.username !== ''){
        this.typings.push(data);
      }else{
        this.typings = [];
        document.getElementById('typing').innerHTML = '';
      }
    });
  }

  // check for scrolling chat
  ngAfterViewChecked(){
    this.container = document.getElementById("msgContainer");           
    this.container.scrollTop = this.container.scrollHeight;     
  }

  // send chat here
  sendchat(){
    this.typings = [];
    this.chatService.typing('','');

    const username = localStorage.getItem('username');
    const role_id = localStorage.getItem('role_id');
    const date = new Date;
    // get day
    let days = ["Sun","Mon","Tues","Wed","Thur","Fri","Sat"];
    let today_day = days[date.getDay()];

    // get month
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    let today_month = months[date.getMonth()];
    const current_date_time = date.getHours() + ":" + date.getMinutes() + " | " + today_month + " " + date.getDate() + " " + today_day;

    this.chatService.sendMessage(this.message,username,role_id,current_date_time);
    this.message = '';
  }
 
  // who typing
  keypressmessage(event){
    const username = localStorage.getItem('username');
    const role_id = localStorage.getItem('role_id');
    if(event.target.value !== '') {
      this.chatService.typing(username,role_id);
    }else{
      this.typings = [];
    }
  }
}
