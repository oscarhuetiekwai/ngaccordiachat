const express = require('express');
const socket = require('socket.io');
const auth = require('./routes/auth');

// App setup
const app = express();

app.use(express.json());
app.use('/api/auth',auth);

const port = process.env.PORT || 4000;
const server = app.listen(port, function(){
    console.log('listening for requests on port 4000,');
});


// Socket setup & pass server
const io = socket(server);
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);

    // Handle chat event
    socket.on('sendmessage', (data) => {
        // console.log(data);
        io.sockets.emit('sendmessage', data);
    });

    // Handle typing event
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    });

});
