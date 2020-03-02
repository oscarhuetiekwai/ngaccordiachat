const express = require('express');
const socket = require('socket.io');
const cors = require('cors');
const mysql = require('mysql');
const config = require('config');
const auth = require('./routes/auth');
const chat = require('./routes/chat');

// App setup
const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth',auth);
app.use('/api/chat',chat);

const port = process.env.PORT || 4000;
const server = app.listen(port, function(){
    console.log('listening for requests on port 4000,');
});

// db connection 
const dbhost = config.get('dbconfig.host');
const dbName = config.get('dbconfig.dbName');
const dbUsername = config.get('dbconfig.dbUsername');
const dbPassword = config.get('dbconfig.dbPassword');

const mysqlconn = mysql.createConnection({
  host: dbhost,
  user: dbUsername,
  password: dbPassword,
  database: dbName
})

// END db connection 


// Socket setup & pass server
const io = socket(server);
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);

    // sending message within room
    socket.on('chatmessage',(data) => {

        io.in(data.room).emit('chatmessage', data);

        // insert to db 
        if(data.user_id){
            mysqlconn.query("INSERT INTO `chat_details` (`chat_id`, `role_id`, `user_id`, `chat_username`, `chat_message`, `chat_room`, `chat_datecreated`, `chat_status`) VALUES (NULL, "+data.role_id+", "+data.user_id+", '"+data.username+"', '"+data.message+"', '"+data.room+"', CURRENT_TIMESTAMP, '0')", function (err, rows, fields) {
                if (err) throw err
                    console.log('Insert DB chatmessage: ', rows)
            });
        }else{
            mysqlconn.query("INSERT INTO `chat_details` (`chat_id`, `role_id`, `user_id`, `chat_username`, `chat_message`, `chat_room`, `chat_datecreated`, `chat_status`) VALUES (NULL, "+data.role_id+", 0,'"+data.username+"', '"+data.message+"', '"+data.room+"', CURRENT_TIMESTAMP, '0')", function (err, rows, fields) {
                if (err) throw err
                    console.log('Insert DB chatmessage: ', rows)
            });
        }
        
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

       // insert to db 
       if(data.user_id){
            mysqlconn.query("INSERT INTO `chat_details` (`chat_id`, `role_id`, `user_id`,`chat_username`, `chat_message`, `chat_room`, `chat_datecreated`, `chat_status`) VALUES (NULL, "+data.role_id+", "+data.user_id+", '"+data.username+"', '"+data.message+"', '"+data.room+"', CURRENT_TIMESTAMP, '0')", function (err, rows, fields) {
                if (err) throw err
                    console.log('Insert DB joinroom: ', rows);
            });
        }else{
            mysqlconn.query("INSERT INTO `chat_details` (`chat_id`, `role_id`, `user_id`,`chat_username`, `chat_message`, `chat_room`, `chat_datecreated`, `chat_status`) VALUES (NULL, "+data.role_id+", 0, '"+data.username+"', '"+data.message+"', '"+data.room+"', CURRENT_TIMESTAMP, '0')", function (err, rows, fields) {
                if (err) throw err
                    console.log('Insert DB joinroom: ', rows);
            });
        }
    });


    
    // agent join in one room
    socket.on('agentjoinroom', (data) => {
       socket.join(data.newroom);
       
       // update agent joined the room 
       mysqlconn.query("UPDATE `chat_details` SET user_id = "+data.user_id+" WHERE chat_room = '"+data.newroom+"'", function (err, rows, fields) {
        if (err) throw err
        console.log(err);
    });
        
    });

     // agent transfer chat
     socket.on('transferchat', (data) => {
        socket.leave(data.previousroom);
        socket.join(data.newroom);
        //io.in(data.room).emit('chatmessage', data);
    });
  
    // customer or agent leave the room   
    socket.on('leaveroom', (data) => {
        console.log(data.username + ' left the room : ' + data.room);
        io.in(data.room).emit('wholeaveroom', data);
        socket.leave(data.room);


         // update when leave room
        mysqlconn.query("UPDATE `chat_details` SET chat_status = 2 WHERE chat_room = '"+data.room+"'", function (err, rows, fields) {
        if (err) throw err
            console.log(err);
        });

    });

});

