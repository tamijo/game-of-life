var GOL = GOL || {};
GOL.DEFAULTS = {
  boardWidth: 600,
  boardHeight: 400,
  cellWidth: 8,
  cellHeight: 8,
  tickTime: 30,
  initialBoard: 'glider'
};

GOL.DEFAULT_BOARDS = {
  // default boards work with any board with more than 40 cells on each side
  beacon: [
    GOL.Cell(25,10, GOL.States.ALIVE),
    GOL.Cell(26,10, GOL.States.ALIVE),
    GOL.Cell(25,11, GOL.States.ALIVE),
    GOL.Cell(26,11, GOL.States.ALIVE),
    GOL.Cell(27,12, GOL.States.ALIVE),
    GOL.Cell(27,13, GOL.States.ALIVE),
    GOL.Cell(28,12, GOL.States.ALIVE),
    GOL.Cell(28,13, GOL.States.ALIVE),
  ],
  blinker: [
    GOL.Cell(20,11, GOL.States.ALIVE),
    GOL.Cell(20,12, GOL.States.ALIVE),
    GOL.Cell(20,13, GOL.States.ALIVE),

    GOL.Cell(25,11, GOL.States.ALIVE),
    GOL.Cell(25,12, GOL.States.ALIVE),
    GOL.Cell(25,13, GOL.States.ALIVE),
    GOL.Cell(31,11, GOL.States.ALIVE),
    GOL.Cell(31,12, GOL.States.ALIVE),
    GOL.Cell(31,13, GOL.States.ALIVE),
    GOL.Cell(27, 9, GOL.States.ALIVE),
    GOL.Cell(28, 9, GOL.States.ALIVE),
    GOL.Cell(29, 9, GOL.States.ALIVE),
    GOL.Cell(27, 15, GOL.States.ALIVE),
    GOL.Cell(28, 15, GOL.States.ALIVE),
    GOL.Cell(29, 15, GOL.States.ALIVE),

    GOL.Cell(36,11, GOL.States.ALIVE),
    GOL.Cell(36,12, GOL.States.ALIVE),
    GOL.Cell(36,13, GOL.States.ALIVE),
  ],
  glider: [
    GOL.Cell(1, 5, GOL.States.ALIVE),
    GOL.Cell(2, 5, GOL.States.ALIVE),
    GOL.Cell(1, 6, GOL.States.ALIVE),
    GOL.Cell(2, 6, GOL.States.ALIVE),
    GOL.Cell(35, 3, GOL.States.ALIVE),
    GOL.Cell(36, 3, GOL.States.ALIVE),
    GOL.Cell(35, 4, GOL.States.ALIVE),
    GOL.Cell(36, 4, GOL.States.ALIVE),
    GOL.Cell(11, 5, GOL.States.ALIVE),
    GOL.Cell(11, 6, GOL.States.ALIVE),
    GOL.Cell(11, 7, GOL.States.ALIVE),
    GOL.Cell(12, 4, GOL.States.ALIVE),
    GOL.Cell(12, 8, GOL.States.ALIVE),
    GOL.Cell(13, 3, GOL.States.ALIVE),
    GOL.Cell(13, 9, GOL.States.ALIVE),
    GOL.Cell(14, 3, GOL.States.ALIVE),
    GOL.Cell(14, 9, GOL.States.ALIVE),
    GOL.Cell(15, 6, GOL.States.ALIVE),
    GOL.Cell(16, 4, GOL.States.ALIVE),
    GOL.Cell(16, 8, GOL.States.ALIVE),
    GOL.Cell(17, 5, GOL.States.ALIVE),
    GOL.Cell(17, 6, GOL.States.ALIVE),
    GOL.Cell(17, 7, GOL.States.ALIVE),
    GOL.Cell(18, 6, GOL.States.ALIVE),
    GOL.Cell(21, 3, GOL.States.ALIVE),
    GOL.Cell(21, 4, GOL.States.ALIVE),
    GOL.Cell(21, 5, GOL.States.ALIVE),
    GOL.Cell(22, 3, GOL.States.ALIVE),
    GOL.Cell(22, 4, GOL.States.ALIVE),
    GOL.Cell(22, 5, GOL.States.ALIVE),
    GOL.Cell(23, 2, GOL.States.ALIVE),
    GOL.Cell(23, 6, GOL.States.ALIVE),
    GOL.Cell(25, 1, GOL.States.ALIVE),
    GOL.Cell(25, 2, GOL.States.ALIVE),
    GOL.Cell(25, 6, GOL.States.ALIVE),
    GOL.Cell(25, 7, GOL.States.ALIVE)
  ],
  blank: []
}
// GameofLife represents the controller of the actual game.
// To start an instance of the GameofLife, it requires either a ##<canvas>## or
// a ##<div>##. The board size is determined by the fields in GOL.DEFAULTS.
// Future work includes allowing this to take optional settings.

// Exported functions:
// init(): starts running the game with a default board configuration. It sets
// an interval for the board to update with the tickTime specified in
// GOL.DEFAULTS
// setupBoard(boardName): sets up the board with one of the boards specified in
// GOL.DEFAULT_BOARDS.
// pause(): stops the game
// start(): starts the game
// restart(): restarts the board to its initial state and stops the game
// changeSpeed(speed): changes the speed (in ms). if the game is already running,
// it is stopped and then replayed at the new speed.
var GameofLife = function(boardDiv) {
  if (boardDiv) {
    var ops = GOL.DEFAULTS;
    var num_rows = ops.boardHeight / ops.cellHeight;
    var num_cols = ops.boardWidth / ops.cellWidth;
    var view = GOL.DOMView(
      boardDiv, ops.boardWidth, ops.boardHeight, ops.cellHeight, ops.cellWidth);
    var board = GOL.Board(view, num_rows, num_cols);
    // on click, toggle the state of the cell and any cell that's dragged over
    view.addCellClickHandler(board.toggleStateforCellAt);
    var tickInterval = false;
    var tickTime = ops.tickTime;

    var _initControls = function(game) {
      var disableButtons = function(buttons) {
        buttons.forEach(function(button, i, arr) {
          button.addClass('disabled');
        });
      }
      var enableButtons = function(buttons) {
        buttons.forEach(function(button, i, arr) {
          button.removeClass('disabled');
        });
      }
      var playButton = $("#play");
      var stepButton = $('#step');
      var pauseButton = $("#pause");
      var restartButton = $("#reset");
      var boardSelect = $("#board_config");
      var speedInput = $('#speed');
      speedInput.val(tickTime);
      boardSelect.val(ops.initialBoard);

      playButton.click(function() {
        game.play();
        disableButtons([playButton, stepButton]);
        enableButtons([pauseButton]);
      });

      pauseButton.click(function() {
        game.pause();
        enableButtons([playButton, stepButton]);
        disableButtons([pauseButton]);
      });

      stepButton.click(function() {
        game.step();
      })

      restartButton.click(function() {
        game.restart();
        enableButtons([playButton, stepButton]);
        disableButtons([pauseButton]);
      });

      speedInput.on('input', function() {
        setTimeout(function() { // don't overload the browser, set a timeout
          var speed = parseInt($(speedInput).val());
          game.changeSpeed(speed);
        }, 10);
        });

      boardSelect.change(function(e) {
        var boardName = e.target.options[e.target.selectedIndex].value;
        game.setupBoard(boardName);
        enableButtons([playButton, stepButton]);
        disableButtons([pauseButton]);
      })
    };

    var that = {
      init: function() {
        _initControls(this);
        this.setupBoard(ops.initialBoard);
      },

      setupBoard: function(boardName) {
        if (tickInterval) {
          this.pause();
        }
        var boardConfig = GOL.DEFAULT_BOARDS[boardName];
        if (!boardConfig) {
          board.setRandomInitialConfig();
        } else {
          board.setInitialConfig(boardConfig);
        }
      },

      pause: function(){
        clearInterval(tickInterval);
        tickInterval = false;
      },

      play: function() {
        if (!tickInterval) {
          tickInterval = setInterval(function() {
            board.step();
          }, tickTime);
        }
      },

      step: function() {
        board.step();
      },

      restart: function(){
        this.pause();
        if (board){
          board.restart();
        }
      },

      changeSpeed: function(speed) {
        tickTime = speed;
        if (tickInterval) {
          // if game is running, pause and continue with new speed
          this.pause();
          this.play();
        }
      }
    };
    Object.freeze(that);
    return that;
  }
  return {};
};
