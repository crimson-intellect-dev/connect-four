/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

// active player: 1 or 2
let currPlayer = 1;

// array of rows, each row is array of cells  (board[y][x])
let board = [];

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // i for y-axis and j for x-axis
  for (let i = 0; i < HEIGHT; i++) {
    let temp = [];
    for (let j = 0; j < WIDTH; j++) {
      temp.push(undefined);
    }
    board.push(temp);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const board = document.getElementById("board");

  // get reference to the table element
  const top = document.createElement("tr");

  // assign table with id of column-top
  top.setAttribute("id", "column-top");

  //attach an event listener (for clicking)
  top.addEventListener("click", handleClick);

  // create 7 td elements with id values from 0 - 6 : <td id="0"></td>
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);

    // append to the top tr element
    top.append(headCell);
  }

  // append the top tr to the main table
  board.append(top);

  // create 6 table rows to hold the player's ball
  for (let y = 0; y < HEIGHT; y++) {
    // create a brand new row (tr)
    const row = document.createElement("tr");
    // create 7 table data element (td)
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      // the td id reflects the position of the td in relation to the board array
      // for example: 0-1, 0-2, 0-3 etc...
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    board.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // begin checking from the top most to the bottom most
  for (let y = HEIGHT - 1; y >= 0; y--) {
    // since we update the board with player number/current player
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // create a new div for the player's piece
  const piece = document.createElement("div");

  // add the corresponding css classes to piece element
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);
  piece.style.top = -50 * (y + 2);

  // get reference to the location where the piece must go
  const td = document.getElementById(`${y}-${x}`);

  // append piece to the table
  td.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  // pop up alert message
  board = [];
  document.getElementById("board").innerHTML = "";
  alert(msg);
  restart();
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
  // updates the board variable with the player #
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check if all cells in board are filled; if so call, call endGame
  if (board.every(tbRow => tbRow.every(tdata => tdata))) return endGame("Tie");

  // switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;

  /*
  if (currPlayer === 1) {
    currPlayer = 2;
  } else {
    currPlayer = 1;
  }
  */
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {

  // helper function which checks for matches in cells array
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      // checks if y and x are within the board boundaries
      ([y, x]) =>
      y >= 0 &&
      y < HEIGHT &&
      x >= 0 &&
      x < WIDTH &&
      // finally checks of that [x, y] occupied with player number
      board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  // traverses every cell/element in table
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // fetches four elements horizontally and stores in horiz
      let horiz = [
        // given the same y-axis we check neighboring cells up to 3 from the given y
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3]
      ];

      // fetches four elements vertically and stores in vert
      let vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x]
      ];

      // fetches four elements diagonally in right direction and stores in diagDR
      let diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3]
      ];

      // fetches four elements diagonally in left direction and stores in diagDL
      let diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3]
      ];

      // check if any four elements have the same color and determines the winner
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

// resets the game board in JS
makeBoard();

// resetsthe game board in html 
makeHtmlBoard();

function restart() {
  makeBoard();
  makeHtmlBoard();
}