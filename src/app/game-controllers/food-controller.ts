import { GameController } from "../engine/game-controller";
import { Food } from "../game-objects/food";
import { IGameObject } from "../engine/game-object";


const getRandomInArray = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
}

export class FoodController extends GameController {

  constructor(engine) {
    super(engine);
    engine.gameObjectEmitter.on("remove", this.onRemoveObject);
  }

  start() {
    this.engine.addGameObject(this.getNewFood());
  }

  protected onRemoveObject = (gameObject: IGameObject) => {
    if (gameObject instanceof Food) {
      const newFood = this.getNewFood();
      newFood && this.engine.addGameObject(newFood);
    }
  }

  private getNewFood(): Food {
    const freeCells = this.getFreeCells();
    const randomCell = getRandomInArray(freeCells);
    if (!randomCell) {
      this.engine.gameWin();
      return;
    }
    const food = new Food(this.engine);
    food.setPath([randomCell]);
    return food;
  }

  private getFreeCells(): [number, number][] {
    const {xCells, yCells} = this.engine.config;
    const free = [];
    for (let y = 0; y < yCells; y++) {
      for (let x = 0; x < xCells; x++) {
        if (this.engine.gameObjectByPosition(x, y) == null) {
          free.push([x, y]);
        }
      }
    }
    return free;
  }

  remove() {
    this.engine.gameObjectEmitter.off("remove", this.onRemoveObject);
  }

}