const express = require('express');
const socket = require('socket.io');
const cors = require('cors');
const auth = require('./routes/auth');

// App setup
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth',auth);

const port = process.env.PORT || 4000;
const server = app.listen(port, function(){
    console.log('listening for requests on port 4000,');
});


// Socket setup & pass server
const io = socket(server);
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);

    // sending message within room
    socket.on('chatmessage',(data) => {
        io.in(data.room).emit('chatmessage', data);
    });

    // Handle typing event
    socket.on('typing', (data) => {
        socket.broadcast.to(data.room).emit('typing', data);
    });

    // Handle chat event
    socket.on('allrooms', (data) => {
        io.sockets.emit('allrooms', data);
    });
  

    // customer join in one room 1st
    socket.on('joinroom', (data) => {

        //joining
        socket.join(data.room);
        console.log(data.username + ' joined the room : ' + data.room);
       // console.log('list of rooms', io.sockets.adapter.rooms);
        io.sockets.emit('allrooms', data);
        io.in(data.room).emit('chatmessage', data);
        //io.sockets.emit('chatmessage', data);
        //socket.broadcast.to(data.room).emit('new user joined', {user:data.user, message:'has joined this room.'});
       //socket.broadcast.to(data.room).emit('chatmessage', {user:data.user, message:data.message, room:data.room});
    });


    
    // agent join in one room
    socket.on('agentjoinroom', (data) => {
       socket.join(data.newroom);
        
    });

     // agent transfer chat
     socket.on('agentchangeroom', (data) => {
        socket.leave(data.previousroom);
        socket.join(data.newroom);
        //io.in(data.room).emit('chatmessage', data);
    });
  
    // customer or agent leave the room   
    socket.on('leaveroom', (data) => {
        console.log(data.username + 'left the room : ' + data.room);
        socket.broadcast.to(data.room).emit('left room', {user:data.username, message:'has left this room.'});
        socket.leave(data.room);
    });

});
