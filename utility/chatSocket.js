const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3003;
var sockets = {};

io.on("connection", socket => {

    console.log("New client connected");

    // Add to our our sockets list
    socket.on("init",function(data){
        let { id } = data;
        sockets[id] = socket;
    });

    // Delete from our sockets list
    socket.on("disconnect",()=>{
        for(let i in sockets){
            if(sockets[i]===socket){
                delete sockets[i];
                return;
            }

        }

    });

});

exports.send = function(from, msg, to){
    let socket = sockets[to];
    if(!socket) return;

    socket.emit('message',{from,msg});
}

http.listen(port, () => console.log(`SocketIO listening on port ${port}`));
