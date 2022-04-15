import { Canvas } from "./canvas";
import { ConfigType } from "../config";
import { IGameObject } from "./game-object";
import { EventEmitter } from "./event-emitter";
import { GameController } from "./game-controller";
import { GameMatrix } from "./game-matrix";
import { haveCollision, haveCollisionInPath } from "./utils/have-collision";


export class Engine {

  private canvas: Canvas;

  private started: boolean = true;

  private animationRequestId;

  private gameObjects: IGameObject[] = [];

  private gameControllers: GameController[] = [];

  private gameMatrix: GameMatrix;

  private uuidMap = new Map<IGameObject["uuid"], IGameObject>();

  gameCount = 0;

  gameObjectEmitter = new EventEmitter();

  constructor(public config: ConfigType) {
    this.canvas = new Canvas(this.config);
    this.canvas
    .on("ArrowUp", () => Engine.KeyboardEmitter.emit("ArrowUp"))
    .on("ArrowDown", () => Engine.KeyboardEmitter.emit("ArrowDown"))
    .on("ArrowLeft", () => Engine.KeyboardEmitter.emit("ArrowLeft"))
    .on("ArrowRight", () => Engine.KeyboardEmitter.emit("ArrowRight"));

    this.gameMatrix = new GameMatrix(config.xCells, config.yCells);
  }

  gameObjectByPosition(x, y): IGameObject | undefined {
    return this.uuidMap.get(this.gameMatrix.getUuid(x, y));
  }

  addGameObject(gameObject: IGameObject) {
    this.gameObjects.push(gameObject);
    this.uuidMap.set(gameObject.uuid, gameObject);
    this.gameMatrix.update(this.gameObjects);
    this.gameObjectEmitter.emit("add", gameObject);
  }

  removeGameObject(gameObject: IGameObject) {
    this.gameObjects.splice(this.gameObjects.indexOf(gameObject), 1);
    this.uuidMap.delete(gameObject.uuid);
    this.gameMatrix.update(this.gameObjects);
    this.gameObjectEmitter.emit("remove", gameObject);
  }

  addGameController(controller: GameController) {
    this.gameControllers.push(controller);
  }

  public static KeyboardEmitter = new EventEmitter();

  GameEmitter = new EventEmitter();

  run() {
    this.gameMatrix.update(this.gameObjects);
    this.canvas.drawGrid();
    this.gameControllers.forEach(c => c.start());
    this.startAnimation();
    this.GameEmitter.emit("run");
  }

  startAnimation() {
    this.animationRequestId = window.requestAnimationFrame(this.onTick.bind(this));
  }

  stopAnimation() {
    window.cancelAnimationFrame(this.animationRequestId);
  }

  toggleAnimation() {
    this.started ? this.stopAnimation() : this.startAnimation();
    this.started = !this.started;
  }

  gameWin() {
    this.stopAnimation();
    this.gameControllers.forEach(c => c.remove());
    this.gameControllers = [];
    this.gameObjects = [];
    this.gameCount = 0;
    this.GameEmitter.emit("game-win");
  }

  gameOver() {
    this.stopAnimation();
    this.gameControllers.forEach(c => c.remove());
    this.gameControllers = [];
    this.gameObjects = [];
    this.gameCount = 0;
    this.GameEmitter.emit("game-over");
  }

  incrementCount() {
    this.gameCount++;
    this.GameEmitter.emit("increment-count", this.gameCount);
  }

  private calculatesCollision() {
    const gameObjectsCollisioned: [IGameObject?, IGameObject?] = [];
    for (let i = 0; i < this.gameObjects.length; i++) {
      const gameObject = this.gameObjects[i];
      const nextGameObject = this.gameObjects[i + 1];
      if (!nextGameObject) {
        break;
      }
      if (haveCollision(gameObject.path, nextGameObject.path)) {
        gameObjectsCollisioned.push(gameObject, nextGameObject);
      }
      if (haveCollisionInPath(gameObject.path)) {
        gameObjectsCollisioned.push(gameObject, gameObject);
      }
      if (gameObjectsCollisioned.length >= 2) {
        break;
      }
    }
    if (gameObjectsCollisioned.length) {
      gameObjectsCollisioned[0].handleCollision(gameObjectsCollisioned[1]);
      gameObjectsCollisioned[1].handleCollision(gameObjectsCollisioned[0]);
    }
  }

  private onTick() {
    const needUpdate = this.gameObjects.some(o => o.needUpdate);
    if (needUpdate) {
      this.gameObjects.forEach(o => o.updateOnTick());
      this.calculatesCollision();
      this.gameMatrix.update(this.gameObjects);
      this.canvas.redraw(this.gameObjects);
    }
    this.animationRequestId = window.requestAnimationFrame(this.onTick.bind(this));
  }

}