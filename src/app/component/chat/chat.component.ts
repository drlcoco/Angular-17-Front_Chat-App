import { Component, OnInit } from '@angular/core';
import { Client, IStompSocket, IStompSocketMessageEvent } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Message } from '../../chat/model/message';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface SockJSStompSocket extends IStompSocket {
  onmessage: ((ev: IStompSocketMessageEvent) => any) | null;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})

export class ChatComponent implements OnInit{

  private client!: Client;
  connected: boolean = false;
  message: Message = new Message();
  messages: Message[] = [];

  constructor() {}

  ngOnInit(): void {
    this.client = new Client();

    this.client.webSocketFactory = () => {
      return new SockJS("http://localhost:8080/chat-websocket") as SockJSStompSocket;
    };

    this.client.onConnect = (frame) => {
      console.log('Conectado: ' + this.client.connected + ' : ' + frame);
      this.connected = true;
      this.client.subscribe('/chat/message', e => {
        let message = JSON.parse(e.body) as Message;
        message.date = new Date(message.date);
        this.messages.push(message);
        console.log(message);
      });
      this.message.type = 'NEW_USER';
      this.client.publish({destination: '/app/message', body: JSON.stringify(this.message)});
    }
    
    this.client.onDisconnect = (frame) => {
      console.log('Desconectado: ' + !this.client.connected + ' : ' + frame);
      this.connected = false;
    }
  }

  connect() {
    this.client.activate();
  }

  disconnect() {
    this.client.deactivate();
  }

  sendMessage(): void {
    this.message.type = 'MESSAGE';
    this.client.publish({destination: '/app/message', body: JSON.stringify(this.message)});
    this.message.text = '';
  }

}

