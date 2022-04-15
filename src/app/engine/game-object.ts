import { Engine } from "./engine";


type X = number;

type Y = number;

export interface IGameObject {

  speed: number;

  lastTimeStamp: number;

  path: Array<[X, Y]>;

  updateStamp(timeStamp: number);

  updateOnTick(): void;

  needUpdate: boolean;

  init(): void;

  color: string;

  uuid: string;

  setPath(path: [number, number][]): void;

  handleCollision(gameObject: IGameObject): void;

}


export class GameObject implements IGameObject {

  speed: number;

  lastTimeStamp: number = Date.now();

  path: [number, number][] = [];

  color: string = "";

  readonly uuid = crypto.randomUUID();

  readonly engine: Engine;

  constructor(engine: Engine, speed: IGameObject["speed"], color: IGameObject["color"]) {
    this.speed = speed;
    this.color = color;
    this.engine = engine;
    this.init();
  }

  init() {
    this.lastTimeStamp = Date.now();
  }

  updateStamp(timeStamp: number) {
    this.lastTimeStamp = timeStamp;
  }

  private get intervalInMs(): number {
    return 1000 / this.speed;
  }

  get needUpdate(): boolean {
    return (Date.now() - this.lastTimeStamp) >= this.intervalInMs;
  }

  updateOnTick() {
    if (this.needUpdate && !!this.speed) {
      this.update();
      this.updateStamp(Date.now() + this.intervalInMs);
    }
  }

  protected update() {
  }

  setPath(path: [number, number][]) {
    this.path = path;
  }

  handleCollision(gameObject: IGameObject) {
    this.onCollision(gameObject);
  }

  protected onCollision(gameObject: IGameObject) {
  }

}