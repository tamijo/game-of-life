function testGetNextState(aliveNeighbors, state, expectedState, msg) {
  var ans = GOL.States.getNextState(aliveNeighbors, state);
  equal(ans, expectedState, msg);
}
function testGetNeighbors(board, cell_x, cell_y, expectedNumber, msg) {
  var cell = board._getCell(cell_x, cell_y);
  var ans = board._getNeighbors(cell).length;
  equal(ans, expectedNumber, msg);
}

test("testing GOL.States", function() {
  var state = GOL.States.ALIVE;
  GOL.States.ALIVE = 'alive';
  equal(state, GOL.States.ALIVE, "attempted modification of GOL.States");
  // test getNextState
  testGetNextState(3, GOL.States.ALIVE, GOL.States.ALIVE,
    "alive cell with 3 neighbors stays alive");
  testGetNextState(2, GOL.States.ALIVE, GOL.States.ALIVE,
    "alive cell with 2 neighbors stays alive");
  testGetNextState(1, GOL.States.ALIVE, GOL.States.DEAD,
    "alive cell with <2 neighbors dies");
  testGetNextState(4, GOL.States.ALIVE, GOL.States.DEAD,
    "alive cell with >3 neighbors dies");

  testGetNextState(3, GOL.States.DEAD, GOL.States.ALIVE,
    "dead cell with 3 neighbors becoms alive");
  testGetNextState(2, GOL.States.DEAD, GOL.States.DEAD,
    "dead cell with 2 or less neighbors stays dead");
  testGetNextState(4, GOL.States.DEAD, GOL.States.DEAD,
    "dead cell with 4 or more neighbors stays dead");

});
test("testing GOL.Cell", function() {
  var cell_1 = GOL.Cell(0,0,GOL.States.DEAD);
  equal(cell_1.getX(), 0, "test cell creation/getters");
  equal(cell_1.getState(), GOL.States.DEAD, "test cell creation/getters");
  var cell_2 = GOL.Cell(1,1,GOL.States.DEAD);
  equal(cell_1.equals(cell_2), false, "testing cell equality");
});

test("testing GOL.Board initialization", function() {
  var testBoard = new TestingBoard(10,10).init();
  var count = 0;
  testBoard._applyToEachCell(function(cell) {
    count +=1;
    equal(cell.getState(), GOL.States.DEAD, "all cells should be dead");
  });
  equal(count, 100, "wrong number of cells initialized");
  equal(testBoard._cellExists(11,10), false, "cell should not exist");
  equal(testBoard._cellExists(9,9), true, "cell should exists");
});

test("testing GOL.Board with initial alive cell", function() {
  var testBoard_1 = new TestingBoard(10,10);
  testBoard_1.setInitialConfig([GOL.Cell(1,1,GOL.States.ALIVE)]);
  var count = 0;
  testBoard_1._applyToEachCell(function(cell) {
    if (cell.getState() === GOL.States.ALIVE) {
      count +=1;
    }
  });
  equal(count, 1, "one alive cell was added to board");
  equal(testBoard_1._getCell(1,1).getState(), GOL.States.ALIVE,
    "cell 1,1 should be alive");
});

test("testing GOL.Board neighbors functions", function() {
  var testBoard_2 = new TestingBoard(10,10).init();
  testGetNeighbors(testBoard_2, 0,0, 3, "corner cell has 3 neighbors");
  testGetNeighbors(testBoard_2, 0,1, 5, "cell on an edge row has 5 neighbors");
  testGetNeighbors(testBoard_2, 1,1, 8, "all other cells should have 8");

  testBoard_2.setInitialConfig([GOL.Cell(1,1,GOL.States.ALIVE)]);
  var cell = testBoard_2._getCell(0,1);
  var aliveNeighbors = testBoard_2._countAliveNeighbors(cell);
  equal(aliveNeighbors, 1, "only one neighbor is alive");
});

test("testing GOL.Board step", function() {
  var testBoard_3 = new TestingBoard(5,5);
  testBoard_3.setInitialConfig([GOL.Cell(1,1,GOL.States.ALIVE)]);
  testBoard_3.step();
  equal(testBoard_3._getCell(1,1).getState(), GOL.States.DEAD,
    "cell 1,1 should die since it has no alive neighbors");
  var testBoard_4 = TestingBoard(5,5);
  testBoard_4.setInitialConfig([
    GOL.Cell(0,0,GOL.States.ALIVE),
    GOL.Cell(0,1,GOL.States.ALIVE),
    GOL.Cell(0,2,GOL.States.ALIVE)
  ]);
  testBoard_4.step();
  var testCell = testBoard_4._getCell(1,1);
  equal(testCell.getState(), GOL.States.ALIVE,
    "cell 1,1 should be alive since it had two alive neighbors");
});

test("testing toggleStateforCellAt on GOL.Board", function() {
  var testBoard = new TestingBoard(5,5);
  testBoard.setInitialConfig([GOL.Cell(1,1,GOL.States.ALIVE)]);
  testBoard.toggleStateforCellAt(1,1);
  var testCell = testBoard._getCell(1,1);
  equal(testCell.getState(), GOL.States.DEAD,
    "cell 1,1 should be dead since its state was toggled");
});
