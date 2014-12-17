proj1 - Game of Life
=====
![Screenshot of Game](screenshot.png)
## Running the Game
Download all files, and open the index.html file in the root directory.
The game will start onload! Tested in latest versions of Chrome, Safari, and Firefox. Performs best in Chrome.
## Part 1

### Design
My Game of Life implementation was split up into three main modules - The Board, the BoardView, and the GameOfLife (Controller) to separate different concerns. The Board represents the information,the BoardView the presentation and the GameOfLife the controller of the play of the game. These modules were then broken down (if necessary) into even smaller components. For example, the Rules of the Game, ie. deciding if a cell is about to die, were abstracted out of the Board logic into their own object. This implementation design choice was made to make all parts easily extendable and the logic more clean and functional, with inspiration from the MVC paradigm.

Making it such that the rules of the Game applied to all cells, regardless of their location and number of neighbors, was another design decision that was made. The other alternative is to have the board wrap around itself - ie the cells of the top row are connected to the cells of the bottom row. This way, all cells have 8 neighbors. I didn't implement it this way, though there was no specific reasoning for that since both options are viable.


### Directing the Grader
##### Highlights:
One of the highlights for this project was making code that was very functional, especially in GOL.Board. I tried to do this by abstracting as much internal details as possible, making it such that the internal representation of the board, for example, was only known to a few functions. [Here is one example](https://github.com/6170-fa14/tforrest_proj1/blob/2404a6f111b9c7262a004655c13a0bce474429f8/js/board.js#L160), where a function doesn't need to know that the board is a two-dimensional associative array to apply a function to the cells in a specific range. The [Game](https://github.com/6170-fa14/tforrest_proj1/blob/2404a6f111b9c7262a004655c13a0bce474429f8/js/game.js#L142) function was similarly structured.
Other highlights included making sure (or trying to) separate concerns where possible, as mentioned in the Design section. I'm proud of my implementation of the [States](https://github.com/6170-fa14/tforrest_proj1/blob/2404a6f111b9c7262a004655c13a0bce474429f8/js/board.js#L11) and their rules, and making that logic completely separate from the Board. The same was done with the BoardView to make it easy to display the board in different ways.
I also implemented [Start/Stop/Restart](https://github.com/6170-fa14/tforrest_proj1/blob/2404a6f111b9c7262a004655c13a0bce474429f8/js/game.js#L110), though this was more for my own testing purposes.
##### Help Wanted:
I tried to namespace my code, though I'm not sure if it was done in the best way. In addition, I wanted to make it such that my tests weren't too redundant, though I'm not sure if I should have been more thorough in doing so.

## Part 2

### Design
The overall design of my implementation remained the same, with three different modules that were in charge of different concerns. In representing the board with DOM elements, my Board View creates a `<div>` for each cell, and recolors the background if a cell's state was changed. To allow user interaction, I stored a list of handler functions that are applied during mouse events on the board. The handler functions are added to the board from the GameOfLife (controller). This is done to ensure a separation of concerns - the view doesn't need to know any internal details, but just needs to know how to color the different cells on the board. 

In my design, I allow the user to play, pause, step, and restart a board, as well as change the speed of the game (this can be done even if the game is playing). The user is also allowed to click and draw on the board, toggling the state of each cell that is clicked or moused over. This also can be done even if the game is currently running. The user has the option to select a few pre-designed boards, or select a blank board to draw on. 
In allowing user input, I've tried to ensure that the user is not confused about what actions can currently be taken - if the game is currently playing, then the Step button is disabled, and likewise if the game is already paused or hasn't started, the Pause button is disabled.

### Directing the Grader
##### Highlights:
Highlights of part 2 included not having to modify much of the existing logic surrounding the state of the board, save for allowing user input to the states of the cells on the board [here](https://github.com/6170-fa14/tforrest_proj1/blob/master/js/board.js#L264). My [DOMView logic](https://github.com/6170-fa14/tforrest_proj1/blob/master/js/boardview.js#L49) was structured very similar to the GraphicsView logic from part 1. I allowed the user to drag across the board and toggle the state of the cells [here](https://github.com/6170-fa14/tforrest_proj1/blob/master/js/boardview.js#L113) by creating a listener on the cells, and applying any callbacks set from the exported function, [addCellClickHandlers](https://github.com/6170-fa14/tforrest_proj1/blob/master/js/boardview.js#L140).
Other highlights are more interaction oriented nits, [like changing the cursor of the mouse](https://github.com/6170-fa14/tforrest_proj1/blob/44f11304653b088224684c734f0f1ad1502efeef/styles.css#L22) over the board to indicate that it can be drawn on, and [disabling buttons](https://github.com/6170-fa14/tforrest_proj1/blob/44f11304653b088224684c734f0f1ad1502efeef/js/game.js#L137) to make the state of the game less unclear.

##### Help Wanted:
In testing the board with different sizes, I've noticed that rendering performance doesn't scale as well - if the board has a large amount of cells, clicking and dragging while the board is currently being played will for a second slow down the rendering of the game if the speed is around 30ms or less. In addition, though the game is rendered very smoothly in Chrome, the Safari browser doesn't always render progression of the game very smoothly, depending on the speed. I'm unsure if there is anything I can do to remedy this.

## Attributions
Thanks to [Font Awesome](http://fortawesome.github.io/Font-Awesome/) for icons, [Bootstrap](http://getBootstrap.com) for base CSS, [Google Fonts](https://www.google.com/fonts) for fonts, and [jQuery](https://jquery.com/) for general JavaScript awesomeness.

