import { ConfigType } from "../config";
import { GameObject, IGameObject } from "../engine/game-object";
import { Engine } from "../engine/engine";
import { Mutex } from "../engine/mutex";
import { Food } from "./food";


enum SnakeDirection {
  Forward,
  Back,
  Middle
}

enum Axis {
  X,
  Y
}

enum ArrowType {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
}

export class Snake extends GameObject {

  private xDirection: SnakeDirection = SnakeDirection.Forward;

  private yDirection: SnakeDirection = SnakeDirection.Middle;

  private directionMutex = new Mutex();

  constructor(engine: Engine) {
    super(engine, engine.config.snakeSpeed, engine.config.snakeColor);
  }

  get head() {
    return this.path[0];
  }

  init() {
    const {snakeStartLength, snakeStartX, snakeStartY} = this.engine.config;
    for (let i = snakeStartLength; i > 0; i--) {
      this.path.push([snakeStartX + i, snakeStartY]);
    }
    Engine.KeyboardEmitter
    .on("ArrowUp", () => this.changeDirection(Axis.Y, ArrowType.ArrowUp))
    .on("ArrowDown", () => this.changeDirection(Axis.Y, ArrowType.ArrowDown))
    .on("ArrowLeft", () => this.changeDirection(Axis.X, ArrowType.ArrowLeft))
    .on("ArrowRight", () => this.changeDirection(Axis.X, ArrowType.ArrowRight));
  }

  private changeDirection(axis: Axis, arrow: ArrowType) {
    if (this.directionMutex.locked) {
      return;
    }
    if (axis === Axis.X) {
      if (arrow === ArrowType.ArrowLeft && this.xDirection !== SnakeDirection.Forward) {
        this.xDirection = SnakeDirection.Back;
      } else if (arrow === ArrowType.ArrowRight && this.xDirection !== SnakeDirection.Back) {
        this.xDirection = SnakeDirection.Forward;
      }
      this.yDirection = SnakeDirection.Middle;
    } else {
      if (arrow === ArrowType.ArrowUp && this.yDirection !== SnakeDirection.Forward) {
        this.yDirection = SnakeDirection.Back;
      } else if (arrow === ArrowType.ArrowDown && this.yDirection !== SnakeDirection.Back) {
        this.yDirection = SnakeDirection.Forward;
      }
      this.xDirection = SnakeDirection.Middle;
    }
    this.directionMutex.lock();
  }

  protected update() {
    let nextX = this.getNextX();
    let nextY = this.getNextY();
    let tempX = this.path[0][0];
    let tempY = this.path[0][1];
    this.path[0][0] = nextX;
    this.path[0][1] = nextY;
    for (let i = 1; i < this.path.length; i++) {
      let tempTempX = this.path[i][0];
      let tempTempY = this.path[i][1];
      this.path[i][0] = tempX;
      this.path[i][1] = tempY;
      tempX = tempTempX;
      tempY = tempTempY;
    }
    this.directionMutex.unlock();
  }

  private getNextX() {
    let nextX = this.head[0];
    switch (this.xDirection) {
      case SnakeDirection.Back: {
        nextX = nextX - 1;
        if (nextX < 0) {
          nextX = this.engine.config.xCells - 1;
        }
        break;
      }
      case SnakeDirection.Forward: {
        nextX = nextX + 1;
        if (nextX > this.engine.config.xCells - 1) {
          nextX = 0;
        }
        break;
      }
    }
    return nextX;
  }

  private getNextY() {
    let nextY = this.head[1];
    switch (this.yDirection) {
      case SnakeDirection.Back: {
        nextY = nextY - 1;
        if (nextY < 0) {
          nextY = this.engine.config.yCells - 1;
        }
        break;
      }
      case SnakeDirection.Forward: {
        nextY = nextY + 1;
        if (nextY > this.engine.config.yCells - 1) {
          nextY = 0;
        }
        break;
      }
    }
    return nextY;
  }

  protected onCollision(gameObject: IGameObject) {
    if (gameObject instanceof Food) {
      this.path.push(this.getPathPartForPush());
      this.engine.removeGameObject(gameObject);
      this.engine.incrementCount();
    } else if (gameObject instanceof Snake) {
      this.engine.gameOver();
    }
  }

  private getPathPartForPush(): [number, number] {
    const newPathPart: [number, number] = [0, 0];
    const [preLast, last] = this.path.slice(-2);
    for (let i = 0; i < preLast.length; i++) {
      if (preLast[i] - last[i] === 1) {
        newPathPart[i] = last[i] - 1;
      } else if (preLast[i] - last[i] === -1) {
        newPathPart[i] = last[i] + 1;
      } else if (preLast[i] - last[i] > 1) {
        newPathPart[i] = last[i] + 1;
      } else if (preLast[i] - last[i] < -1) {
        newPathPart[i] = last[i] - 1;
      } else {
        newPathPart[i] = last[i];
      }
    }
    return newPathPart;
  }

}