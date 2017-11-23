var express = require('express'),
    http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var _ = require('lodash');


server.listen(3000);
app.use(express.static(__dirname + '/public'))
console.log("Server running on 127.0.0.1:3000");
var boards = ['same_board']
var line_history = [];
var userids = [];
io.on('connection', socket => {
  socket.on('adduser', user => {
    if(boards.indexOf(user.boardid) == -1) {
      boards.push(user.boardid);
    }
    socket.username = 'Same user name';
    console.log(`${userid} has connected to this room`)
    socket.room = user.boardid;
    socket.join(user.boardid);
    socket.emit('updateboard','SERVER', `you have connected to ${user.boardid}`);
    socket.broadcast.to(user.boardid).emit('updateboard','SEVER', `${userid} has connected to this room`);
    socket.emit('updateboards', boards, user.boardid)
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