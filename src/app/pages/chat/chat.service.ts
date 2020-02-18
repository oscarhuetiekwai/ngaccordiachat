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

  // handle send message
  public sendMessage(message,username,role_id,current_date_time) {
    this.socket.emit('sendmessage', {
      message: message,
      username: username,
      role_id: role_id,
      current_date_time: current_date_time
    });
  }

  // handle get message
  public getMessages = () => {
      return Observable.create((observer) => {
          this.socket.on('sendmessage', (message,username,role_id,current_date_time) => {
              observer.next(message,username,role_id,current_date_time);
              
          });
      });
  }

  // handle typing message
  public typing(username,role_id) {
    this.socket.emit('typing', {
      username: username,
      role_id: role_id
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

}
