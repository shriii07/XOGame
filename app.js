const express=require("express");
const path = require("path");
const app=express();
const socketIo=require("socket.io");
const server=require("http").createServer(app);
const io=socketIo(server);
var clients={};
var players={};
var unmatched;
app.use(express.static("public"));
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname+"/index.html"));
});
io.on("connection",(socket)=>{
    console.log("User connected",socket.id);
clients[socket.id]=socket;
socket.on("disconnect",()=>{
    console.log("User disconnected",socket.id);
    delete clients[socket.id];
    socket.broadcast.emit("User disconnect",socket.id);
});
joins(socket);
if(opponentOf(socket))
{
socket.emit("game.begin",{
    symbol:players[socket.id].symbol
});
opponentOf(socket).emit("game.begin",{
    symbol:players[opponentOf(socket).id].symbol
});
}
socket.on("make.move",function(data)
{
    if(!opponentOf(socket))
    {
        return;
    }
    socket.emit("move.made",data);
    opponentOf(socket).emit("move.made",data);
});

});

function joins(socket)
{
    players[socket.id]={
        opponent:unmatched,
        symbol:"X",
        socket:socket
    }
    if(unmatched)
    {
        players[socket.id].symbol="O";
        players[unmatched].opponent=socket.id;
        unmatched=null;
    }
    else{
        unmatched=socket.id;
    }
}
function opponentOf(socket)
{
    if(!players[socket.id].opponent)
    {
        return;
    }
    else{
        return players[players[socket.id].opponent].socket;
    }
}
server.listen(3000, () => {
    console.log('listening on *:3000');
  });