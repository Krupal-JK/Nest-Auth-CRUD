import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { ChatService } from './chat.service';
  
  @WebSocketGateway()
  export class SocketGateway implements OnGatewayConnection {

    @WebSocketServer() server: Server;
  
    handleConnection(client: Socket): void {

      client.emit('connecteee', () => {
        // this.connectedClients.delete(clientId);
        // this.connectedUsers.delete(clientId);
        console.log(`User connected`);
        // console.log(this.connectedUsers);
      });
  
      client.on('disconnect', () => {
        console.log(`User disconnected`);
      });
     
      }
  }
  