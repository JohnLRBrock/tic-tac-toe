/*
Gameboard is an array.

0 | 1 | 2
---------
3 | 4 | 5
---------
6 | 7 | 8
 */
function Board() {
  // initialize board
  this.gameBoard = [];
  this.isActive = true;
  for (let i = 0; i < 9; i += 1) {
    this.gameBoard.push(false);
  }

  // First two three-in-a-rows don't end the game, they deactivate the board.
  this.deactivate = function deactivate() { this.isActive = false; };
  // returns true if the location is both empty (false) and the board is active
  this.legalMove = function legalMove(square) {
    return !this.gameBoard[square] && this.isActive;
  };
  // adds mark to gameBoard
  // doesn't alter the html game-board.
  this.makeMove = function makeBoardMove(square, player) {
    if (this.legalMove(square)) {
      this.gameBoard[square] = player;
      return true;
    }
    return false;
  };
  // originally this game renders the grid each time the grid changes.
  // This code represents that.
  // The unnecessary details don't hinder performance so they're left in.
  this.toHtml = function toHtml(gameBoardID) {
    let html = '';
    html = html.concat(`<div class="game-grid" id="game-grid-${gameBoardID}">`);
    for (let i = 0; i < this.gameBoard.length; i += 1) {
      let cssClass = 'square';
      let mark = '';
      if (this.gameBoard[i] === 'player1') {
        cssClass = 'square player1';
        mark = 'X';
      } else if (this.gameBoard[i] === 'player2') {
        cssClass = 'square player2';
        mark = 'X';
      }
      html = html.concat(`<div class="${cssClass}" id="${gameBoardID}-${i}">${mark}</div>`);
    }
    html = html.concat('</div>');
    return html;
  };
  // TODO: finish function
  this.isThreeInRow = function isThreeInRow() {
    if ((this.gameBoard[0] && this.gameBoard[1] && this.gameBoard[2]) ||
      (this.gameBoard[3] && this.gameBoard[4] && this.gameBoard[5]) ||
      (this.gameBoard[6] && this.gameBoard[7] && this.gameBoard[8]) ||
      (this.gameBoard[0] && this.gameBoard[3] && this.gameBoard[6]) ||
      (this.gameBoard[1] && this.gameBoard[4] && this.gameBoard[7]) ||
      (this.gameBoard[2] && this.gameBoard[5] && this.gameBoard[8]) ||
      (this.gameBoard[0] && this.gameBoard[4] && this.gameBoard[8]) ||
      (this.gameBoard[2] && this.gameBoard[4] && this.gameBoard[6])) {
      return true;
    }
    return false;
  };
}

function Game() {
  this.currentPlayer = 'player1';
  // make three game boards
  this.boards = [];
  this.deactivedBoards = 0;
  for (let i = 0; i < 3; i += 1) {
    this.boards.push(new Board());
  }

  this.togglePlayer = function togglePlayer() {
    this.currentPlayer = this.currentPlayer === 'player1' ? 'player2' : 'player1';
    if (this.currentPlayer === 'player1') {
      $('#turn-indicator').html("First Player's Turn");
    } else {
      $('#turn-indicator').html("Second Player's Turn");      
    }
  };
  this.makeMove = function makeGameMove(board, square) {
    if (this.boards[board].makeMove(square, this.currentPlayer)) {
      const $id = $(`#${board}-${square}`);
      $id.html('X');
      $id.addClass(this.currentPlayer);
      return true;
    }
    return false;
  };
  // returns html representation of all boards
  // TODO: add players icons that handles current player
  this.toHtml = function toHtml() {
    let html = '';
    for (let i = 0; i < this.boards.length; i += 1) { html += this.boards[i].toHtml(i); }
    return html;
  };
  // sets the html of the page to represent the boards
  this.renderAllBoards = function renderAllBoards(target) { target.html(this.toHtml()); };
  this.isThreeInRow = function isThreeInRow(boardID) {
    // deactivate current board if there's three in a row and we haven't deactivated two yet.
    if (this.boards[boardID].isThreeInRow()) {
      this.boards[boardID].deactivate();
      this.deactivedBoards += 1;
      return true;
    }
    return false;
  };
}

const whichBoard = function whichBoard(event) {
  const id = event.target.id;
  return id[0];
};
const whichSquare = function whichSquare(event) {
  const id = event.target.id;
  return id[2];
};
const gameOver = function gameOver(currentPlayer) {
  $('#turn-indicator').attr('id', 'victor');
  if (currentPlayer === 'player1') {
    $('#victor').html('First Player Wins!');
  } else {
    $('#victor').html('Second Player Wins!');
  }
};

$(document).ready(() => {
  const game = new Game();
  game.renderAllBoards($('#game-area'));
  $('.square').click((event) => {
    const boardID = whichBoard(event);
    const squareID = whichSquare(event);
    if (game.makeMove(boardID, squareID)) {
      game.togglePlayer();
      // check if game is over
      if (game.isThreeInRow(boardID)) {
        $(`#game-grid-${boardID}`).addClass('deactivated');
        if (game.deactivedBoards > 2) {
          gameOver(game.currentPlayer);
        }
      }
    }
  });
});
