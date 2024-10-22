const WebSocket = require('ws');
const robot = require('robotjs');

// Cria um servidor WebSocket na porta 8080
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
  console.log('Novo cliente conectado');

  // Quando uma mensagem é recebida do cliente
  ws.on('message', message => {
    try {
      const { x, y } = JSON.parse(message);
      // Move o ponteiro do mouse para a posição x, y recebida
      robot.moveMouse(x, y);
    } catch (err) {
      console.error('Erro ao processar a mensagem:', err);
    }
  });

  // Quando o cliente desconecta
  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

console.log('Servidor WebSocket rodando na porta 8080');
