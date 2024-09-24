let board;
let score  = 0;
let row = 4;
let columns =4;

window.onload = function(){
    setGame(); //to load initial board on loading window
}

function setGame(){
    board = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]    ///initialising empty board
    ]


    // board = [
    //     [2,2,2,2],
    //     [2,2,2,2],
    //     [4,4,8,8],
    //     [4,4,8,8]    ///initialising empty board
    // ]

    for(let r =0;r<row;r++){
        for(let c=0;c<columns;c++){

            //<div id="r-c"></div>
            let tile = document.createElement('div'); //create a div which is a tile 
            tile.id=r.toString()+"-"+c.toString(); //set id = 'r-c'
            let num = board[r][c]; //get the nummber from board
            updateTile(tile,num); //function to update tile which apply the style to the tiles as we slide
            document.getElementById("board").append(tile);
        }

    } 
    setTwo();
    setTwo();

}

function hasEmptyTile(){
    for(let r =0; r<row; r++){
        for (let c =0; c<columns; c++){
            if(board[r][c]==0){
                return true; 
            }
        }
    }
    return false;
}

function setTwo(){

    if(!hasEmptyTile()){
        return;
    }

    let found = false;
    while (!found){
        let r = Math.floor(Math.random()*row)
        let c = Math.floor(Math.random()*columns)

        if(board[r][c]==0){
            board[r][c]=2;
            let tile = document.getElementById(r.toString()+"-"+c.toString())
            tile.innerText = 2
            tile.classList.add('x2')
            found = true;

        }
    }
}

function updateTile(tile, num){
    tile.innerText = "";
    tile.classList.value ="";
    tile.classList.add("tile")
    if(num>0){
        tile.innerText = num;
        if(num<=4096){
            tile.classList.add("x"+num.toString())
        }
        else{
            tile.classList.add("x8192")
        }
    }

}

document.addEventListener("keyup", (e) => {
    let oldBoard = JSON.stringify(board); // Store board state before move

    if (e.code == "ArrowLeft") {
        slideLeft();
    } else if (e.code == "ArrowRight") {
        slideRight();
    } else if (e.code == "ArrowUp") {
        slideUp();
    } else if (e.code == "ArrowDown") {
        slideDown();
    }

    if (oldBoard !== JSON.stringify(board)) { // Only set new tile if the board changed
        setTwo();
    }
    
    document.getElementById('score').innerText = score;


    if (checkWin()) {
        setTimeout(() => {
            if (confirm("You win! Continue playing?")) {
                // Continue playing
            } else {
                resetGame();
            }
        }, 200);
    }

     if (!hasEmptyTile() && noPossibleMoves()) {
        setTimeout(() => {
            if (confirm("Game Over! Restart?")) {
                resetGame();
            }
        }, 200);
    }
});


function checkWin() {
    for (let r = 0; r < row; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 2048) {
                return true;
            }
        }
    }
    return false;
}

function noPossibleMoves() {
    for (let r = 0; r < row; r++) {
        for (let c = 0; c < columns; c++) {
            if (c < columns - 1 && board[r][c] == board[r][c + 1]) {
                return false; // Horizontal moves are possible
            }
            if (r < row - 1 && board[r][c] == board[r + 1][c]) {
                return false; // Vertical moves are possible
            }
        }
    }
    return true; // No moves left
}


//function to filterZeros from row
function filterZero(row){
    //[2,2,2,0]
    return row.filter(num=>num != 0)
}


//function to slide

function slide(row){
    row = filterZero(row) //getting rid of zero [2,2,2]
    //slide
    for(let i=0; i<row.length-1;i++){
        if(row[i]==row[i+1]){
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        } //[2,2,2] => [4,0,2]  
    }
    row = filterZero(row) //filtering zero  [4,2]
    //adding zeros back
    while(row.length<columns){
        row.push(0)

    }//[4,2,0,0]
    return row;
}


function slideLeft(){
    //[2,2,2,0]
    //clear zeros  [2,2,2]
    //merge [4,0,2]
    //clear zeros [4,2]
    //put the zeros back [4,2,0,0]

    for(let r =0; r<row; r++){
      let row = board[r];
      row = slide(row);
      board[r] =row  

      for(let c=0;c<columns;c++){
        let tile = document.getElementById(r.toString()+"-"+c.toString());
        let num = board[r][c];
        updateTile(tile,num);
      }
    }
}

function slideRight(){
  
    for(let r =0; r<row; r++){
      let row = board[r];
      row.reverse();
      row = slide(row);
      row.reverse();
      board[r] =row  

      for(let c=0;c<columns;c++){
        let tile = document.getElementById(r.toString()+"-"+c.toString());
        let num = board[r][c];
        updateTile(tile,num);
      }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let rowArray = [board[0][c], board[1][c], board[2][c], board[3][c]];
        rowArray = slide(rowArray);
        board[0][c] = rowArray[0];
        board[1][c] = rowArray[1];
        board[2][c] = rowArray[2];
        board[3][c] = rowArray[3];

        // update HTML for each column after sliding
        for (let r = 0; r < row; r++) { // corrected 'rows' reference
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}


function slideDown() {
    for (let c = 0; c < columns; c++) {
        let rowArray = [board[0][c], board[1][c], board[2][c], board[3][c]];
        rowArray.reverse()
        rowArray = slide(rowArray);
        rowArray.reverse()
        board[0][c] = rowArray[0];
        board[1][c] = rowArray[1];
        board[2][c] = rowArray[2];
        board[3][c] = rowArray[3];
        

        // update HTML for each column after sliding
        for (let r = 0; r < row; r++) { // corrected 'rows' reference
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}


// Reset game
function resetGame() {
    document.getElementById("board").innerHTML = "";
    score = 0;
    document.getElementById('score').innerText = score;
    setGame();
}