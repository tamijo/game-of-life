var GOL = GOL || {};
// BoardView represents an abstraction for the display of the Game of Life
// Required methods:
// reset(): clear the board
// drawCell(cell): draw a GOL.Cell on the given board.
GOL.BoardView = {
  reset: function() {},
  drawCell: function(cell) {},
};

// Set of utility methods
GOL.Util = (function() {
  var that = {
    // constructor for color
    Color: function (red, green, blue) {
      return {red: red, green: green, blue: blue};
    },

    // turn a cell's state into a color
    ColorByState: function(state) {
      var color;
      switch (state) {
        case GOL.States.ALIVE:
          color = GOL.Util.Color(135, 204, 94);
          break;
        case GOL.States.DEAD:
          color = GOL.Util.Color(50,50,50);
          break;
      };
      return color;
    }
  };
  Object.freeze(that);
  return that;
})();

// The DOMView is a board view that displays each cell as a DOM element. It
// accepts a ##<DIV>## as the base container for the grid, as well as a width,
// height, cellWidth, and cellHeight, all in pixels.

// Exported methods:
// reset(): clears the board by removing the state colors from each cell
// drawCell(cell): draws the cell on the board/updates the color if necessary
// addCellClickHandler(function): adds a function to a list of click handlers that
// are fired when a cell is clicked on, or the mouse is dragged over the board.
// The function is called for each cell div, with the row and col of the cell given
// as parameters.
GOL.DOMView = function(container, width, height, cellWidth, cellHeight) {
  var that = Object.create(GOL.BoardView);
  var BORDER_COLOR = GOL.Util.Color(71, 71, 71);
  var CELL_CLASS = 'board-cell';
  var ROW_CLASS = 'board-row';
  var mouseEventHandlers = [];

  var cellSelector = function(row, col) {
    return 'cell'+row+'-'+col;
  }

  var colorToCSS = function(color) {
    if (color) {
      return 'rgb(' + color.red + ',' + color.green + ',' + color.blue+')';
    }
  }

  var applyBackgroundColor = function(div, color) {
    if (color) {
      $(div).css('background-color', colorToCSS(color));
    }
  }

  var makeCellDiv = function(row, col) {
    var div = $('<div></div>');
    div.attr({
      'id': cellSelector(row, col),
      'class': CELL_CLASS,
      'data-col': col,
      'data-row': row
    });
    div.css({
      'width': cellWidth,
      'height': cellHeight,
      'border-left': '1px solid '+colorToCSS(BORDER_COLOR),
      'border-bottom': '1px solid '+colorToCSS(BORDER_COLOR)
    });
    return div;
  }

  var applyListenerFunctions = function(cellDiv) {
    mouseEventHandlers.forEach(function(handler, i, arr) {
      handler(cellDiv.attr('data-row'), cellDiv.attr('data-col'));
    });
  }

  var _init = function() {
    $(container).html('').css({
      'min-width': width,
      'max-width': width,
      'min-height': height,
      'max-height': height,
      'margin': '0 auto'
    });
    // create divs for each cell
    var cols = width/cellWidth, rows = height/cellHeight;
    for (var i = 0; i < rows; i++) {
      var row = $('<div></div>');
      row.attr('class', ROW_CLASS);
      for (var j = 0; j < cols; j++) {
        row.append(makeCellDiv(i,j));
      }
      $(container).append(row);
    };

    // initialize event listeners for each cell
    $('.'+ CELL_CLASS).on('mousedown', function(e) {
      applyListenerFunctions($(this));
      // continue listening for captured cells if the mouse is dragged over board
      $('.'+ CELL_CLASS).on('mouseenter', function(e) {
        applyListenerFunctions($(this));
      });
    });
    // remove mouseenter listener after a drag operation has completed
    $('.'+ CELL_CLASS).on('mouseup', function(e) {
      $('.'+ CELL_CLASS).off('mouseenter');
    });
  }

  that.reset = function() {
    $('.'+CELL_CLASS).css('background-color','');
  }

  that.drawCell = function(cell) {
    var cellDiv = $('#'+cellSelector(cell.getY(), cell.getX()));
    var color = GOL.Util.ColorByState(cell.getState());
    applyBackgroundColor(cellDiv, color);
  }

  // adds a function to a list of click handlers that are fired when a cell is
  // clicked on, or the mouse is dragged over the board.
  // handlerFunc parameters are (row, col)
  that.addCellClickHandler = function(handlerFunc) {
    mouseEventHandlers.push(handlerFunc);
  }

  Object.freeze(that);
  _init();
  return that;
}
