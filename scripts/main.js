/*
Gameboard is an array.

0 | 1 | 2
---------
3 | 4 | 5
---------
6 | 7 | 8
 */
function Board() {
  this.gameBoard = [];
  this.isActive = true;
  for (let i = 0; i < 9; i += 1) {
    this.gameBoard.push(false);
  }
  this.deactivateBoard = function deactivateBoard() { this.isActive = false; };
  // returns true if the location is both empty (false) and the board is active
  this.legalMove = function legalMove(square) { return !this.gameBoard[square] && this.isActive; };
  // TODO: makeMove() adds mark to board and returns changed board
  this.toHtml = function toHtml(gameBoardID) {
    let html = '';
    html = html.concat(`<div class="game-grid" id="game-grid-${gameBoardID}">`);
    for (let i = 0; i < this.gameBoard.length; i += 1) {
      let cssClass = 'square';
      if (this.gameBoard[i] === 'player1') {
        cssClass = 'square player1';
      } else if (this.gameBoard[i] === 'player2') {
        cssClass = 'square plyayer2';
      }
      html = html.concat(`<div class="${cssClass}" id="${gameBoardID}-${i}"></div>`);
    }
    html = html.concat('</div>');
    return html;
  };
}

// TODO: change boards into an array which can be iterated over.
// TODO: change toHtml to use _map over board array
function Game() {
  // make three game boards
  this.boards = [];
  for (let i = 0; i < 3; i += 1) {
    this.boards.push(new Board());
  }

  // returns html representation of all boards
  this.toHtml = function toHtml() {
    let html = '';
    for (let i = 0; i < this.boards.length; i += 1) { html += this.boards[i].toHtml(i); }
    return html;
  };
  this.renderAllBoards = function renderAllBoards(target) { target.html(this.toHtml()); };
}

$(document).ready(() => {
  const game = new Game();
  game.renderAllBoards($('#game-area'));
});
