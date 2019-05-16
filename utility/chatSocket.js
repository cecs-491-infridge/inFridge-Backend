/*
 * Creates a socket for chat messaging
 */

const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3003;
var sockets = {};

/* New client */
io.on("connection", socket => {

    console.log("New client connected");

    // Add to our our sockets list
    socket.on("init",function(data){
        console.log("init",data);
        let { id } = data;
        if(!sockets[id]) sockets[id] = {};
        sockets[id][socket.id] = socket;
    });

    // Delete from our sockets list
    // this is O(n^2) but who cares c:
    socket.on("disconnect",()=>{
        for(let i in sockets){
            for(let j in sockets[i]){
                if(sockets[i][j]===socket){
                    delete sockets[i][j];
                    return;
                }
            }
        }
    });

});

/* Sends a message to one of our clients */
exports.send = function(from, msg, time, to){
    console.log(to);
    console.log(sockets);
    let socket = sockets[to];
    if(!socket) return;
    console.log("socket emit message to: "+to);

    for(let i in socket){
        socket[i].emit('message',{from,msg,time});
    }
}

http.listen(port, () => console.log(`SocketIO listening on port ${port}`));
