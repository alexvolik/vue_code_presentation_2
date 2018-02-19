<template>
  <div class="snake-app">
    <div v-if="play">
      <table>
        <tr v-for="(row, index) in grid" :key="index">
          <td v-for="cell in row" class="grid-cell"
              :class="{ snake: cell.snake > 0, food: cell.food, head: cell.x === snakeCells[snakeCells.length -1].x && cell.y === snakeCells[snakeCells.length -1].y }">
          </td>
        </tr>
      </table>
      <div class="text-center">
        <p><b>Size:</b> {{size}} x {{size}}</p>
        <p><b>Speed:</b> {{Number((1000/speed).toFixed(2))}} cells/sec</p>
        <p><b>Length snake:</b> {{length}} cells</p>
      </div>
    </div>
    <div class="panel panel-default" v-else>
      <div class="panel-body text-center">
        <h1>{{message}}</h1>
        <button class="btn btn-success" @click="start">Start</button>
      </div>
    </div>
  </div>
</template>


<script type="module">
  import Grid from '../classes/Grid';

  const UP = [-1, 0],
    DOWN = [1, 0],
    LEFT = [0, -1],
    RIGHT = [0, 1];

  let keyMap = {
    "37": LEFT,
    "38": UP,
    "39": RIGHT,
    "40": DOWN
  };

  const defValue = {
    length: 8,
    speed: 200,
    dead: false
  }

  export default {
    props: {
      size: {
        type: Number,
        default: 10,
        validator: value => {
          return value >= 10 && value <= 100
        }
      }
    },

    mounted() {
      window.addEventListener('keydown', event => {
        this.handleUserAction(event.which)
        event.preventDefault()
      });
    },

    data() {
      return {
        play: false,
        direction: RIGHT,
        dead: defValue.dead,
        grid: null,
        snakePos: {},
        snakeCells: {},
        length: defValue.length,
        ticking: null,
        userActions: [],
        speed: defValue.speed
      };
    },

    computed: {
      message() {
        return this.dead ? 'You\'a dead' : 'Start game))';
      }
    },

    methods: {
      handleUserAction(key) {
        let direction = keyMap[key];
        if (direction) {
          this.userActions.push(() => {
            if (direction[0] + this.direction[0] === 0 && direction[1] + this.direction[1] === 0) {
              return;
            }
            this.direction = direction
          });
        }
      },

      start() {
        this.play = true
        this.dead = defValue.dead
        this.speed = defValue.speed
        this.length = defValue.length
        this.grid = new Grid(this.size, (x, y) => ({x, y, snake: 0, food: false}));
        this.userActions = [];
        this.ticking = setInterval(this.tick, this.speed);
        this.snakePos = Grid.random(this.grid);
        this.snakePos.snake = this.length;
        this.snakeCells = [this.snakePos];
        this.setFood();
      },

      tick() {
        if (this.userAction = this.userActions.shift()) {
          this.userAction();
        }
        this.moveSnake();
        this.eatFood();
      },

      moveSnake() {
        let {x, y} = this.snakePos;
        let [xd, yd] = this.direction;

        let X = x + xd > this.size - 1 ? 0 : x + xd < 0 ? this.size - 1 : x + xd
        let Y = y + yd > this.size - 1 ? 0 : y + yd < 0 ? this.size - 1 : y + yd

        this.snakePos = (this.grid[X] || [])[Y];

        if (this.snakePos.snake) {
          return this.gameOver();
        }

        this.snakeCells.forEach(cell => cell.snake--);
        this.snakeCells = this.snakeCells.filter(cell => cell.snake > 0);

        this.snakePos.snake = this.length;
        this.snakeCells.push(this.snakePos);
      },

      eatFood() {
        if (this.snakePos && this.snakePos.food) {
          this.length++;
          this.speed -= 1
          this.snakeCells.forEach(cell => cell.snake++);
          this.snakePos.food = false;
          this.setFood();
        }
      },

      setFood() {
        Grid.random(this.grid).food = true;
      },

      gameOver() {
        this.dead = true;
        clearInterval(this.ticking);
        setTimeout(
          this.play = false, 500
        )
      }
    }
  }
</script>

<style scoped lang="scss">
  a {
    cursor: pointer;
    color: #006aff;
  }

  table {
    border-collapse: collapse;
    overflow: hidden;
    margin: 20px auto;
  }

  .grid-cell {
    margin: 0;
    padding: 0;
    height: 10px;
    width: 10px;
    background-color: #f4f4f4;
    border: 1px solid white;
    transition: 0.5s;
  }

  .food {
    background-color: #56b0bb;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      right: -100%;
      bottom: 0;
      width: 100%;
      height: 100%;
      background: #56b0bb;
      opacity: 0.5;
      padding: 13px;
      margin: auto;
      z-index: 2;
    }
  }

  .snake-app {
    padding: 10px 0;
  }

  .snake {
    background-color: #3e3e3e;
    position: relative;
  }

  .head {
    background-color: #ff7f2e;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      right: -100%;
      bottom: 0;
      width: 100%;
      height: 100%;
      background: #ff0000;
      opacity: 0.5;
      padding: 13px;
      margin: auto;
      z-index: 2;
    }
  }
</style>
