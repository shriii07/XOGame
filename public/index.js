var socket=io.connect("http://localhost:3000");
var myTurn=true;
var symbol;
socket.on("game.begin",function(data)
{
    symbol=data.symbol;
    myTurn=symbol === 'X';
    renderTurnMessage();
});
function getBoardState(){
    var obj={};
    $(".board button").each(function(){
        obj[$(this).attr("id")]=$(this).text()||"";
    });
    return obj;
}
function isGameOver()
{
    var state=getBoardState();
    var matches=["XXX","OOO"];
    var rows = [
        state.r0c0 + state.r0c1 + state.r0c2,  
        state.r1c0 + state.r1c1 + state.r1c2,
        state.r2c0 + state.r2c1 + state.r2c2, 
        state.r0c0 + state.r1c0 + state.r2c0, 
        state.r0c1 + state.r1c1 + state.r2c1, 
        state.r0c2 + state.r1c2 + state.r2c2, 
        state.r0c0 + state.r1c1 + state.r2c2, 
        state.r0c2 + state.r1c1 + state.r2c0  
      ];
  for(var i=0;i<rows.length-1;i++)
  {
      if(rows[i]===matches[0]||rows[i]===matches[1])
      {
return 1;
      }
      for(var j=0;j<rows.length-1;j++)
{      if(rows[j].length===3)
      {
          if(j===rows.length-2)
          {
            return 2;
         }
        }else{
            break;
        }
         
      }

          } 
          
          return 3;
  
}
socket.on("move.made",function(data){
    $("#"+data.position).text(data.symbol);
    myTurn=data.symbol!=symbol;
    if(isGameOver()===3)
    {
renderTurnMessage();
    }
    else if(isGameOver()===2)
    {
        $("#message").text("Tie");

    }
    else if(isGameOver()===1){
        if(myTurn)
        {
            $("#message").text("You lost");
        }
        else{
            $("#message").text("You won");
        }
        
        $(".board button").attr("disabled",true);
    }
})
function makeMove(e){
if(!myTurn)
{
    return;
}
if($(this).text().length)
{
    document.write($(this).text().length);
    return;
}
socket.emit("make.move",{
    symbol:symbol,
    
    position:$(this).attr("id")
});
}
function renderTurnMessage()
{
    if(!myTurn)
    {
        $("#message").text("Opponent's turn");
        $(".board button").attr("disabled",true);
    }
    else
    {
        $("#message").text("Your turn");
      $(".board button").removeAttr("disabled");
    }
}
socket.on("opponent.left",function(){
    $("#message").text("Opponent has left the game");
    $(".board button").attr("disabled",true);
});   

$(function(){
    $(".board button").attr("disabled",true);
    $(".board button").on("click",makeMove);
});