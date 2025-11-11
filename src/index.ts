
import { Socket } from './socket.ts';

const socket = new Socket('/var/run/docker.sock');


await socket.request("/containers/json")
  .then(res => res.json())
  .then(json => console.log(json));
  
await socket.request("/containers/json")
  .then(res => res.json())
  .then(json => console.log(json));

await socket.request("/containers/0954fa1ee0b11120eeabb22c2b4bc924221840a8d8d8a408ac8881616019161a/logs?stdout=true")
  .then(res => res.text())
  .then(json => console.log(json));
