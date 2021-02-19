/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
let inputWidth = document.querySelector('#columns');
let inputHeight = document.querySelector('#rows');
let start = document.querySelector('#start');
let form = document.querySelector('form');

let width = 7;
let height = 7;

let currPlayer = 1;
let board = []; 


//Creates the JS board given the user input values. Generates the necessary arrays and values within each nested array.
function makeBoard() {
  for(let i = 0; i< height; i++){
    board.push([])
    for(let j = 0; j< width; j++){
      board[i].push(null);
    };
  };
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  let htmlBoard = document.querySelector('#board');

  //Creates a table row and adds an event listener to it.
  //WHen the event is triggered it calls the handleClick function.
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  //Loops over the width value and creates data cells with unique id's. Appends the new elements  
  //to the table row created above and ultimately appends the table row to the board.
  for (let x = 0; x < width; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Loops over the height value and creates a new table row. Then creates the correct number of columns
  //within that row and finally appends the new row to the board.
  for (let y = 0; y < height; y++) {
    const row = document.createElement("tr");

    for (let x = 0; x < width; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = height - 1; y >= 0; y--){
    if(!board[y][x]){
      return y;
    } 
  }
  return null; 
}

function placeInTable(y, x) {
  let cell = document.getElementById(`${y}-${x}`);
  let piece = document.createElement('div');
  
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);
  cell.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
    if (checkForWin()) {
      setTimeout(function(){
        currPlayer = currPlayer === 1 ? 2 : 1;
        endGame(`Player ${currPlayer} won!`);
      },100)
    }
  
  // Checks if the entire  board has been filled and there is no winner
  if (board.every(val => val.every(cell => cell))){
    return endGame('Its a Tie!!');
  }

  // Switches the active player after a player has made a move
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < height &&
        x >= 0 &&
        x < width &&
        board[y][x] === currPlayer
    );
  }


  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

//Accepts user inputs and begins the game using the specified number of rows and columns
form.addEventListener('submit', function(e){
  e.preventDefault();
  width = inputWidth.value === "" ? 7: inputWidth.value;
  height = inputHeight.value === "" ? 7: inputHeight.value;
  makeBoard();
  makeHtmlBoard();
  start.classList.toggle('hide');
})

