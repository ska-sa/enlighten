var express = require('express'),
    http = require('http');

var port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var _ = require('lodash');

io.set('origins', '*:*');

io.set('match origin protocol', true);

io.set('transports', ['xhr-polling']);
io.set('polling duration', 10);

app.use(express.static(__dirname + '/public'))

server.listen(port);

app.get('/index.html');
console.log(`Server running on port:${port}`);
var boards = ['same_board']
var line_history = [];
var userids = [];
io.on('connection', socket => {
  socket.on('adduser', data => {
    if(boards.indexOf(data.boardid) === 0) {
      boards.push(data.boardid);
    }
    socket.username = data.username;
    console.log(`${data.username} has gracefully connected to this room`)
    socket.room = `board:${data.boardid}`;
    socket.join(`board:${data.boardid}`);
    socket.emit('updateboard','SERVER', 'you have connected to same_board');
    socket.broadcast.to(`board:${data.boardid}`).emit('updateboard','SEVER', `${data.username} has connected to this room`);
    socket.emit('updateboards', boards, data.boardid)
  })

  socket.on('disconnect', ()=> {
    socket.leave(socket.room);
  })
  for(var i in line_history) {
    socket.emit('draw_line', {line: line_history[i]});
  }

  socket.on('draw_line', data => {
    line_history.push(data.line);
    io.sockets.in(socket.room).emit('draw_line', {line: data.line})
  })
})