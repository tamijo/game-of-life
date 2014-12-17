// used to allow scope binding in anonymous functions
Function.prototype.bind = function(scope) {
  var _function = this;

  return function() {
    return _function.apply(scope, arguments);
  }
}

var GOL = GOL || {};
GOL.States = (function(){
  var that = {
    // The two states possible for a cell
    ALIVE:  1,
    DEAD: 0,
    // Computes a random state
    getRandom: function() {
      return Math.round(Math.random());
    },
    // Computes the next state for a cell given its number of alive neighbors and
    // its current state
    getNextState: function(aliveNeighbors, state) {
      if (state === GOL.States.ALIVE) {
        return (aliveNeighbors === 2 || aliveNeighbors == 3)? GOL.States.ALIVE :
          GOL.States.DEAD;
      }
      else if (state === GOL.States.DEAD) {
        return aliveNeighbors === 3? GOL.States.ALIVE : GOL.States.DEAD;
      }
    },
    // Toggles the state that is input - IE if 'alive' is given, 'dead' is returned
    toggleState: function(state) {
      if (state === GOL.States.ALIVE) {
        return GOL.States.DEAD;
      }
      else if (state === GOL.States.DEAD) {
        return GOL.States.ALIVE;
      }
    }
  };
  Object.freeze(that);
  return that;
})();

// A cell is a single unit on the board of the game, which has a state, an x and
// a y value, representing columns and rows respectively, and nextState, an
// auxiliary field used when updating a cell's next state. We use this extra
// field to ensure that the cell's computed next state is accurate according to
// its neighbors. A cell that has not computed its next state has a nextState of
// undefined

// Exported Methods:
// getY(): returns y value
// x(): returns x value
// step(): transfers over the cell's next state to its current state.
// setNextState(): sets the nextState variable
// getState(): returns the current state
// getNextState(): returns the next state
// reset(): resets the cell to a States.DEAD state
// equals(): compares a cell to another cell
// toggleState(): toggles the state

GOL.Cell = function(x, y, state) {
  var nextState = undefined;
  var that = {
    getY: function() {
      return y;
    },
    getX: function() {
      return x;
    },
    step: function() {
      if (nextState !== undefined) {
        state = nextState;
        nextState = undefined;
      }
    },
    setNextState: function(newState){
      nextState = newState;
    },
    reset: function() {
      nextState = undefined;
      state = GOL.States.DEAD;
    },
    getState: function() {
      return state;
    },
    getNextState: function() {
      return nextState;
    },
    equals: function(cell) {
      return (cell.getY() === y && cell.getX() === x);
    },
    toggleState: function() {
      state = GOL.States.toggleState(state);
    }
  };
  Object.freeze(that);
  return that;
};

// Abstraction for the representation of the board. It takes a board view
// as a library and the number of rows and columns. All of the cells on the
// board are initiallly dead. A starting configuration of alive GOL.Cells can be set
// on the board. The view will always represent the state of the board.

// Exported methods:
// init(): initializes and draws the cells on the view
// setInitialConfig(cells): sets the initial configuration of alive cells, and
// initializes the board.
// setRandomInitialConfig(): creates a random configuration of alive and dead
// cells, and initializes the board.
// step(): advances the game by one generation, and draws this new generation on
// the view.
// restart(): Restarts the board to its initial configuration if set, or a board of
// dead cells
// clearBoard(): Resets the board to a board of dead cells.
// toggleStateforCellAt(row, col): toggles the state of the cell at a given row and col

GOL.Board = function(view, numRows, numCols) {

  var cells = {};
  var initialAliveCells = [];

  // Creates a cell with a defined x and y column and row, and an optional state
  var _createCell = function(x, y, state) {
    if (state === undefined) {
      state = GOL.States.DEAD;
    }
    cells[y][x] = GOL.Cell(x, y, state);
    return cells[y][x];
  };

  var _initializeCells = function() {
    for (var i = 0; i < numRows; i++) {
      cells[i] = {};
      for (var j = 0; j < numCols; j++) {
        _createCell(j, i);
      }
    };
    if (initialAliveCells) { //add optional config of alive cells
      initialAliveCells.forEach(function(cell, i, arr) {
        if (cell.getX() < numCols && cell.getY() < numRows) {
          _createCell(cell.getX(), cell.getY(), cell.getState());
        }
      }.bind(this));
    };
  };

  var _getCell = function(x, y) {
    return cells[y][x];
  };

  var _rowExists = function(y) {
    return (y in cells)
  };

  var _cellExists = function(x, y) {
    if (_rowExists(y)) {
      return (x in cells[y]);
    }
    return false;
  };

  // apply function over all cells
  var _applyToEachCell = function(func) {
    for (var i = 0; i < numRows; i++) {
      for (var j = 0; j < numCols; j++) {
        func(_getCell(j, i));
      }
    }
  };

  var _applyToEachCellInRange = function(xmin, ymin, xmax, ymax,func) {
    for (var i = ymin; i < ymax; i++) {
      if (_rowExists(i)) {
        for (var j = xmin; j < xmax; j++) {
          if (_cellExists(j, i) ) {
            func(_getCell(j, i));
          }
        }
      }
    }
  };

  // Calculates a cell's next state, and returns true if the cell's state has
  // changed
  var _setCellNextState = function(cell) {
    var _aliveCount = _countAliveNeighbors(cell);
    var nextState = GOL.States.getNextState(_aliveCount, cell.getState());
    if (nextState !== cell.getState()) {
      cell.setNextState(nextState);
      return true;
    }
    return false;
  };

  // Get all of a cells neighbors
  var _getNeighbors = function(cell) {
    var neighs = [];
    _applyToEachCellInRange(
      cell.getX()-1, cell.getY()-1, cell.getX()+2, cell.getY()+2,
      function(neighbor) {
        if (!neighbor.equals(cell)) {
          neighs.push(neighbor);
        }
    }.bind(this));
    return neighs;
  };

  var _countAliveNeighbors = function(cell) {
    var _aliveCount = 0;
    var neigh = _getNeighbors(cell);
    neigh.forEach(function(neighbor, index, arr) {
      if (neighbor.getState() === GOL.States.ALIVE) {
        _aliveCount+=1;
      }
    });
    return _aliveCount;
  };

  var that = {
    init: function() {
      _initializeCells();
      _applyToEachCell(view.drawCell);
    },
    setInitialConfig: function(aliveCells) {
      initialAliveCells = aliveCells;
      this.init();
    },
    setRandomInitialConfig: function() {
      initialAliveCells = [];
      for (var i = 0; i < numRows; i++) {
        for (var j = 0; j < numCols; j++) {
          initialAliveCells.push(GOL.Cell(j, i, GOL.States.getRandom()));
        }
      }
      this.init();
    },
    restart: function() {
      view.reset();
      // reset board to initial configuration, if set
      this.init();
    },

    clearBoard: function() {
      view.reset();
      initialAliveCells = [];
      this.init();
    },
    step: function() {
      var _dirty = [];
      _applyToEachCell(function(cell) {
        if(_setCellNextState(cell)){
            _dirty.push(cell);
        }
      }.bind(this));
      // only redraw dirty cells
      _dirty.forEach(function(cell, i, arr) {
        cell.step();
        view.drawCell(cell);
      }.bind(this));
    },
    toggleStateforCellAt: function(row, col) {
      var cell = _getCell(col, row)
      cell.toggleState();
      view.drawCell(cell);
    }
  };
  Object.freeze(that);
  return that;
};
