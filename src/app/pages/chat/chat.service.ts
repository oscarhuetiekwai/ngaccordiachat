import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private url = 'http://localhost:4000';
  private socket;

  constructor() {
    this.socket = io(this.url);
  }

  // handle get message
  public getMessages = () => {
      return Observable.create((observer) => {
          this.socket.on('chatmessage', (message,username,role_id,current_date_time,room) => {
              observer.next(message,username,role_id,current_date_time,room);
          });
      });
  }

  // handle who typing
  public whoTyping = () => {
    return Observable.create((observer) => {
        this.socket.on('typing', (username,role_id) => {
            observer.next(username,role_id);
        });
    });
  }

  // handle who left the room
  public wholeaveroom = () => {
    return Observable.create((observer) => {
        this.socket.on('wholeaveroom', (data) => {
            observer.next(data);
        });
    });
  }

  // get all room
  public getallroom = () => {
    return Observable.create((observer) => {
        this.socket.on('allrooms', (data) => {
            observer.next(data);
            
        });
    });
  }

  // handle typing message
  public typing(username,room) {
    this.socket.emit('typing', {
      username: username,
      room: room
    });
  }

  // handle leave chat
  public leavechat(username,room) {
    this.socket.emit('leaveroom', {
      username: username,
      room: room
    });
  }


  // handle join room
  public joinroom(newroom) {
    this.socket.emit('agentjoinroom', {
      newroom: newroom
    });
  }

   // handle change room
   public transferchat(newroom,previousroom) {
    this.socket.emit('transferchat', {
      newroom: newroom,
      previousroom: previousroom
    });
  }

  // handle send message
  public sendMessage(message,username,role_id,current_date_time,room) {
    this.socket.emit('chatmessage', {
      message: message,
      username: username,
      role_id: role_id,
      current_date_time: current_date_time,
      room: room
    });
  }
}
