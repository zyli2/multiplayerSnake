const { GRID_SIZE } = require('./constants');

module.exports = {
  initGame,
  gameLoop,
  getUpdatedVelocity,
}

function initGame() {
  const state = createGameState()
  randomFood(state);
  return state;
}

function createGameState() {
  return {
    players: [{
      pos: {
        x: 3,
        y: 10,
      },
      vel: {
        x: 1,
        y: 0,
      },
      snake: [
        {x: 1, y: 10},
        {x: 2, y: 10},
        {x: 3, y: 10},
      ],
    }, {
      pos: {
        x: 18,
        y: 10,
      },
      vel: {
        x: 0,
        y: 0,
      },
      snake: [
        {x: 20, y: 10},
        {x: 19, y: 10},
        {x: 18, y: 10},
      ],
    }],
    food: {},
    gridsize: GRID_SIZE,
  };
}

function gameLoop(state) {
// for defensive purposes, if not given a state, we should just return
if (!state) {
    return;
  }

  const playerOne = state.players[0];
  const playerTwo = state.players[1];

// updates player's position according to its velocity.
// if player x position is 6 and x vel is 1,
// then updating the player's x position should result in x = 7
playerOne.pos.x += playerOne.vel.x;
playerOne.pos.y += playerOne.vel.y;

playerTwo.pos.x += playerTwo.vel.x;
playerTwo.pos.y += playerTwo.vel.y;
// lose condition
if (playerOne.pos.x < 0 || playerOne.pos.x > GRID_SIZE || playerOne.pos.y < 0 || playerOne.pos.y > GRID_SIZE) {
    return 2;
  }

  if (playerTwo.pos.x < 0 || playerTwo.pos.x > GRID_SIZE || playerTwo.pos.y < 0 || playerTwo.pos.y > GRID_SIZE) {
    return 1;
  }

// this means that the player's head is in the same x and yposition as the food, then the snake eats the food
// this results in the snake getting 1 pixel bigger/longer
if (state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y) {
    playerOne.snake.push({ ...playerOne.pos });
    playerOne.pos.x += playerOne.vel.x;
    playerOne.pos.y += playerOne.vel.y;
// after food is eaten, a new food is placed into the screen at a random position
randomFood(state);
}

if (state.food.x === playerTwo.pos.x && state.food.y === playerTwo.pos.y) {
    playerTwo.snake.push({ ...playerTwo.pos });
    playerTwo.pos.x += playerTwo.vel.x;
    playerTwo.pos.y += playerTwo.vel.y;
    randomFood(state);
  }

// makes sure the snake is actually moving before doing this check
if (playerOne.vel.x || playerOne.vel.y) {
        // loops through each cell
        for (let cell of playerOne.snake) {
            // means if the snake's head is overlapping with its own body
            if (cell.x === playerOne.pos.x && cell.y === playerOne.pos.y) {
                return 2;
              }
            }
        
            playerOne.snake.push({ ...playerOne.pos });
            playerOne.snake.shift();
          }

          if (playerTwo.vel.x || playerTwo.vel.y) {
            for (let cell of playerTwo.snake) {
              if (cell.x === playerTwo.pos.x && cell.y === playerTwo.pos.y) {
                return 1;
              }
            }
        
            playerTwo.snake.push({ ...playerTwo.pos });
            playerTwo.snake.shift();
          }
        
          return false;
        }

function randomFood(state) {
    food = {
        // multiplies a random floating point number by grid size, and floors it (rounds down) so it's an integer
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      }

// make sure we don't place the food on the snake
for (let cell of state.players[0].snake) {
    if (cell.x === food.x && cell.y === food.y) {
            // recursively place the random food until it is not on a snake
            return randomFood(state);
        }
      }

      for (let cell of state.players[1].snake) {
        if (cell.x === food.x && cell.y === food.y) {
          return randomFood(state);
        }
      }
    
      state.food = food;
    }

function getUpdatedVelocity(keyCode) {
    switch (keyCode) {
      case 37: { // left
        return { x: -1, y: 0 };
      }
      case 38: { // down
        return { x: 0, y: -1 };
      }
      case 39: { // right
        return { x: 1, y: 0 };
      }
      case 40: { // up
        return { x: 0, y: 1 };
      }
    }
  }