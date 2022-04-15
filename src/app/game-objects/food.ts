import { GameObject } from "../engine/game-object";
import { Engine } from "../engine/engine";


export class Food extends GameObject {

  constructor(engine: Engine) {
    super(engine, 0, engine.config.foodColor);
  }

}