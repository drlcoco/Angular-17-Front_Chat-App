import { Component, OnInit } from '@angular/core';
import { Client, IStompSocket, IStompSocketMessageEvent } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface SockJSStompSocket extends IStompSocket {
  onmessage: ((ev: IStompSocketMessageEvent) => any) | null;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})

export class ChatComponent implements OnInit{

  private client!: Client;
  connected: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.client = new Client();

    this.client.webSocketFactory = () => {
      return new SockJS("http://localhost:8080/chat-websocket") as SockJSStompSocket;
    };

    this.client.onConnect = (frame) => {
      console.log('Conectado: ' + this.client.connected + ' : ' + frame);
      this.connected = true;
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

}

