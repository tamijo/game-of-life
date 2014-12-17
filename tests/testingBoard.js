// Board to be used for testing purposes only - private methods are public here for
// and the default BoardView is used instead of the View parameter.

var TestingBoard = function(numRows, numCols) {
  var view = GOL.BoardView;
  var cells = {};
  var initialAliveCells = [];

  // Creates a cell with a defined x and y column and row, and an optional state
  this._createCell = function(x, y, state) {
    if (!state) {
      state = GOL.States.DEAD;
    }
    cells[y][x] = GOL.Cell(x, y, state);
    return cells[y][x];
  };

  this._initializeCells = function() {
    for (var i = 0; i < numRows; i++) {
      cells[i] = {};
      for (var j = 0; j < numCols; j++) {
        this._createCell(j, i);
      }
    };
    if (initialAliveCells) { //add optional config of alive cells
      initialAliveCells.forEach(function(cell, i, arr) {
        if (cell.getX() < numCols && cell.getY() < numRows) {
          this._createCell(cell.getX(), cell.getY(), cell.getState());
        }
      }.bind(this));
    };
  };

  this._getCell = function(x, y) {
    return cells[y][x];
  };

  this._rowExists = function(y) {
    return (y in cells)
  };

  this._cellExists = function(x, y) {
    if (this._rowExists(y)) {
      return (x in cells[y]);
    }
    return false;
  };

  // apply function over all cells
  this._applyToEachCell = function(func) {
    for (var i = 0; i < numRows; i++) {
      for (var j = 0; j < numCols; j++) {
        func(this._getCell(j, i));
      }
    }
  };

  this._applyToEachCellInRange = function(xmin, ymin, xmax, ymax,func) {
    for (var i = ymin; i < ymax; i++) {
      if (this._rowExists(i)) {
        for (var j = xmin; j < xmax; j++) {
          if (this._cellExists(j, i) ) {
            func(this._getCell(j, i));
          }
        }
      }
    }
  };

  // Calculates a cell's next state, and returns true if the cell's state has
  // changed
  this._setCellNextState = function(cell) {
    var _aliveCount = this._countAliveNeighbors(cell);
    var nextState = GOL.States.getNextState(_aliveCount, cell.getState());
    if (nextState !== cell.getState()) {
      cell.setNextState(nextState);
      return true;
    }
    return false;
  };

  // Get all of a cells neighbors
  this._getNeighbors = function(cell) {
    var neighs = [];
    this._applyToEachCellInRange(
      cell.getX()-1, cell.getY()-1, cell.getX()+2, cell.getY()+2,
      function(neighbor) {
        if (!neighbor.equals(cell)) {
          neighs.push(neighbor);
        }
    });
    return neighs;
  };

  this._countAliveNeighbors = function(cell) {
    var _aliveCount = 0;
    var neigh = this._getNeighbors(cell);
    neigh.forEach(function(neighbor, index, arr) {
      if (neighbor.getState() === GOL.States.ALIVE) {
        _aliveCount+=1;
      }
    });
    return _aliveCount;
  };

  this.init = function() {
      this._initializeCells();
      this._applyToEachCell(view.drawCell);
      return this;
  }
  this.setInitialConfig = function(aliveCells) {
      initialAliveCells = aliveCells;
      this.init();
  }
  this.setRandomInitialConfig = function() {
    initialAliveCells = [];
    for (var i = 0; i < numRows; i++) {
      for (var j = 0; j < numCols; j++) {
        initialAliveCells.push(GOL.Cell(j, i, GOL.States.getRandom()));
      }
    }
    this.init();
  }

  this.restart = function() {
    view.reset();
    // reset board to initial configuration, if set
    this.init();
  }

  this.clearBoard = function() {
    view.reset();
    initialAliveCells = [];
    this.init();
  }
  this.step = function() {
    var _dirty = [];
    this._applyToEachCell(function(cell) {
      if(this._setCellNextState(cell)){
          _dirty.push(cell);
      }
    }.bind(this));
    // only redraw dirty cells
    _dirty.forEach(function(cell, i, arr) {
      cell.step();
      view.drawCell(cell);
    }.bind(this));
  }

  this.toggleStateforCellAt = function(row, col) {
    var cell = this._getCell(col, row)
    cell.toggleState();
    view.drawCell(cell);
  }

  Object.freeze(this);
  return this;
};
