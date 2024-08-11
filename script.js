let game_mode = "two-player-mode";
const O_src = "./images/circle.png";
const X_src = "./images/cross.png";
let player_1,player_2,encountered_moves,board,winner,moves = 0;
player_1 = {name:"Player-1",symbol:"O"};
player_2 = {name:"Player-2",symbol:"X"};
let temp_count = 0;


start_game();


function select_game_mode(mode){
    if(mode.value=="ai-mode"){
        game_mode = "ai-mode";
    }
    else if(mode.value=="two-player-mode"){
        game_mode = "two-player-mode";
    }

    let modes = document.getElementsByClassName("mode-button");
    for(let i = 0 ;i<modes.length;i++){
        modes[i].classList.remove("mode-selected");
    }
    mode.classList.add("mode-selected");
    assgin_players();
}

// for assign name to players
function assgin_players(){
    player_1.name = prompt("Enter Name of Player-1.");
    if(game_mode=="two-player-mode"){
        player_2.name = prompt("Enter Name of Player-2.");
    }
    else if(game_mode=="ai-mode"){
        player_2.name = "AI✨";
    }
    document.getElementById("player-1-name").innerHTML = player_1.name;
    document.getElementById("player-2-name").innerHTML = player_2.name;
    document.getElementById("p1-name").innerHTML = player_1.name;
    document.getElementById("p2-name").innerHTML = player_2.name;
    start_game();
}

// player perform move 
function player_move(click){

    if((game_mode=="ai-mode" && moves%2==0) || game_mode=="two-player-mode"){
        let clicked_box = click.id.replace("box","");
        let i = parseInt(clicked_box[0]);
        let j = parseInt(clicked_box[1]);
        console.log("Part-1");
        
        if(moves!=10 && winner=="?"){
            if(board[i][j]=="-"){
                if(moves%2==0){
                    board[i][j]=player_1.symbol;
                    moves++;
                }
                else{
                    board[i][j]=player_2.symbol;
                    moves++;
                }
                // console.log(moves);
                update_board();
                
                // if(check_win()){
                //     // console.log("test-2");
                //     if(moves%2!=0){
                //         winner = player_1.name;
                //     }
                //     else{
                //         winner = player_2.name;
                //     }
                // }

                if(check_win(player_1.symbol)){
                    winner = player_1.name;
                }
                else if(check_win(player_2.symbol)){
                    winner = player_2.name;
                }
                
                if(winner!="?"){
                    document.getElementById("winner").innerHTML = winner + "<br/>🥳";
                    document.getElementById("game-status").innerHTML = "🚩 GAME OVER! 🏁";
                }
                if(winner=="?" && moves==9){
                    document.getElementById("winner").innerHTML =  "Draw! <br/>😐";
                }
    
                update_pointer();

                if(game_mode=="ai-mode" && winner=="?"){
                    console.log("now ai turn!")
                    player_move();
                    
                    // disable player to perform move during the Ai move
                    // add logic (pending)
                }
            }
            else{
                setTimeout(()=>{
                    document.getElementById(`box${i}${j}`).style.boxShadow = "0px 0px 0px";
                },500)
                document.getElementById(`box${i}${j}`).style.boxShadow = "inset 0px 0px 3px 2px red";
                // console.log("this move already encountered!");
            }
        }
        else{
            console.log("game over!");
        }
    }
    else if(game_mode=="ai-mode" && moves%2==1 && winner=="?"){

        ai_think_time = Math.random()*1000 + 200;
        setTimeout(()=>{

            console.log("Part-2-start");
            let best_score = Number.NEGATIVE_INFINITY;
            let ai_move ;
            
            for(let row of possible_moves()){
                board[row[0]][row[1]] = "X";
                let score = minimax(0,false);
                board[row[0]][row[1]] = "-";
                if(score>best_score){
                    best_score = score;
                    ai_move = [row[0],row[1]];
                }
            }
            
            board[ai_move[0]][ai_move[1]] = "X";
            moves++;
            
            update_board();
    
            if(check_win(player_1.symbol)){
                winner = player_1.name;
            }
            else if(check_win(player_2.symbol)){
                winner = player_2.name;
            }
            
            if(winner!="?"){
                document.getElementById("winner").innerHTML = winner + "<br/>🥳";
                document.getElementById("game-status").innerHTML = "🚩 GAME OVER! 🏁";
            }
            if(winner=="?" && moves==9){
                document.getElementById("winner").innerHTML =  "Draw! <br/>😐";
            }
            update_pointer();
            console.log("part-2-end")

        },ai_think_time);
    }
}

function possible_moves(){
    let available_moves = [];

    // getting available moves
    for(let i=0 ; i<3 ; i++){
        for(let j=0 ; j<3 ; j++){
            if(board[i][j]=="-"){
                available_moves.push([i,j]);
            }
        }
    }
    return available_moves;
}

function minimax(depth,is_maximizing){

    // It just Check and Count how many times minimax was called.
    temp_count ++;
    console.log(temp_count);

    // Only To see Behind the Scenes
    console.log("------------------");
    console.log(board[0]);
    console.log(board[1]);
    console.log(board[2]);
    

    if(check_win("X")){
        return 1;
    }
    if(check_win("O")){
        return -1;
    }
    if(check_tie()){
        return 0;
    }

    if(is_maximizing){
        let max_eval = Number.NEGATIVE_INFINITY;
        for(let row of possible_moves()){
            board[row[0]][row[1]] = "X";
            let eval = minimax(depth+1,false);
            board[row[0]][row[1]] = "-";
            max_eval = Math.max(max_eval,eval);
        } 
        return max_eval 
    }
    else{
        let min_eval = Number.POSITIVE_INFINITY;
        for(let row of possible_moves()){
            board[row[0]][row[1]] = "O";
            let eval = minimax(depth+1,true);
            board[row[0]][row[1]] = "-";
            min_eval = Math.min(min_eval,eval);
        } 
        return min_eval 
    }
}


function check_tie(){
    for(let i=0 ; i<3 ; i++){
        if(board[i].includes("-")){
            return false;
        }
    }
    return true
}

// updating the live player pointer
function update_pointer(){
    if(moves!=9 && winner=="?"){
        if(moves%2==0){
            document.getElementById('pointer-p1').style.opacity = 1;
            document.getElementById('pointer-p2').style.opacity = 0;
        }
        else{
            document.getElementById('pointer-p1').style.opacity = 0;
            document.getElementById('pointer-p2').style.opacity = 1;
        }
    }
    else{
        document.getElementById('pointer-p1').style.opacity = 0;
        document.getElementById('pointer-p2').style.opacity = 0;
        document.getElementById("game-status").innerHTML = "🚩 GAME OVER! 🏁";
    }
}

// updating the O-X symbols on the board.
function update_board(){
    for(let i = 0; i<3 ; i++){
        for(let j = 0; j<3; j++){
            if(board[i][j]=="O"){
                document.getElementById(`img${i}${j}`).src = O_src;
            }
            else if(board[i][j]=="X"){
                document.getElementById(`img${i}${j}`).src = X_src;
            }
        }
    }
}

// function check_win(){
//     let winning_status = false;
//     // console.log("test-1");
    
//     // check all rows & columns
//     for(let x = 0; x<3 ; x++){
//         if((board[x][0]==board[x][1] && board[x][1]==board[x][2] && board[x][0]!="-")||(board[0][x]==board[1][x] && board[1][x]==board[2][x] && board[0][x]!="-")){
//             winning_status = true;
//             break;
//         }
//     }

//     // check both diagonal
//     if(winning_status == false){
//         if(board[1][1]!="-" &&((board[0][0]==board[1][1] && board[1][1]==board[2][2])||(board[0][2]==board[1][1] && board[1][1]==board[2][0]))){
//             winning_status = true;
//         }
//     }
//     return winning_status;
// }

function check_win(player_symbol){
    let winning_status = false;

    // check all rows & columns
    for(let x = 0; x<3 ; x++){
        if((board[x][0]==board[x][1] && board[x][1]==board[x][2] && board[x][0]==player_symbol)||(board[0][x]==board[1][x] && board[1][x]==board[2][x] && board[0][x]==player_symbol)){
            winning_status = true;
            break;
        }
    }

    // check both diagonal
    if(winning_status == false){
        if(board[1][1]==player_symbol &&((board[0][0]==board[1][1] && board[1][1]==board[2][2])||(board[0][2]==board[1][1] && board[1][1]==board[2][0]))){
            winning_status = true;
        }
    }

    return winning_status;
}

function start_game(){
    encountered_moves = [];
    board = [["-","-","-"],["-","-","-"],["-","-","-"]];
    winner = "?";
    moves = 0;
    
    document.getElementById('pointer-p1').style.opacity = 1;
    document.getElementById('pointer-p2').style.opacity = 0;
    document.getElementById("game-status").innerHTML = "Current Turn";
    document.getElementById("winner").innerHTML = winner;
    
    for(let i = 0; i<3 ; i++){
        for(let j = 0; j<3; j++){
            document.getElementById(`img${i}${j}`).src = "./images/blank.png";
        }
    }
}