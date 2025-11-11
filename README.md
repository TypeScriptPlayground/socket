# UNIX Socket

[![Run Linter](https://github.com/TypeScriptPlayground/socket/actions/workflows/lint.yml/badge.svg)](https://github.com/TypeScriptPlayground/socket/actions/workflows/lint.yml)
[![Run Unit Tests](https://github.com/TypeScriptPlayground/socket/actions/workflows/test.yml/badge.svg)](https://github.com/TypeScriptPlayground/socket/actions/workflows/test.yml)

Use this library to open and connect to UNIX sockets, send requests and get responses similar to a fetch request. This
library supports basic response chunk decoding.

## Example

Connect to the `docker.sock` UNIX socket, send a request to `/containers/json` and log the response.

```ts
import { Socket } from '@typescriptplayground/socket';

const socket = new Socket('/var/run/docker.sock');

await socket.request('/containers/json')
  .then((res) => res.json())
  .then((json) => console.log(json));
```
