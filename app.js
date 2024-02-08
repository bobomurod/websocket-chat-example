import { WebSocketServer } from 'ws';
import {v4 as uuid} from 'uuid';
const clients = {};
const messages = [];
const wss = new WebSocketServer({port: 8000})
wss.on("connection", (ws) => {
  const id = uuid();
  clients[id] = ws;
  console.info(`New client ${id}`);
  ws.on("message", (rawMessage) => {
    const {name, message} = JSON.parse(rawMessage.toString('utf-8'));
    messages.push({name, message});
    for (const id in clients) {
      clients[id].send(JSON.stringify({name, messages}))
    }
  });
  ws.on("close", () => {
    delete clients[id];
    console.log(`Client ${id} closed`);
  })
});
