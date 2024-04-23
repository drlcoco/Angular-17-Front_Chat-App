import { Component, OnInit } from '@angular/core';
import { Client, IStompSocket, IStompSocketMessageEvent } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface SockJSStompSocket extends IStompSocket {
  // Define las propiedades o métodos necesarios para que SockJS sea compatible
  // Aquí definimos una propiedad onmessage que acepta un callback de tipo IStompSocketMessageEvent
  onmessage: ((ev: IStompSocketMessageEvent) => any) | null;
  // Otros métodos o propiedades necesarios para que SockJS sea compatible con IStompSocket
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

  constructor() {}

  ngOnInit(): void {
    this.client = new Client();

    this.client.webSocketFactory = () => {
      return new SockJS("http://localhost:8080/chat-websocket") as SockJSStompSocket;
    };

    this.client.onConnect = (frame) => {
      console.log('Conectado: ' + this.client.connected + ' : ' + frame);
    }
    this.client.activate();
  }

}

