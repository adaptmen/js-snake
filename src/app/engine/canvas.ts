import { ConfigType } from "../config";
import { IGameObject } from "./game-object";
import { EventEmitter } from "./event-emitter";


export class Canvas extends EventEmitter {

  private element: HTMLCanvasElement;

  private context: CanvasRenderingContext2D;

  constructor(private config: ConfigType) {
    super();
    this.element = document.getElementById(config.canvasId) as HTMLCanvasElement;
    this.context = this.element.getContext("2d");
    this.init();
    this.setupListeners();
  }

  private setupListeners() {
    document.body.addEventListener("keydown", this.onKeyDown.bind(this));
  }

  private onKeyDown(event: KeyboardEvent) {
    switch (event.code) {
      case "KeyW":
      case "ArrowUp": {
        this.emit("ArrowUp");
        break;
      }
      case "KeyS":
      case "ArrowDown": {
        this.emit("ArrowDown");
        break;
      }
      case "KeyA":
      case "ArrowLeft": {
        this.emit("ArrowLeft");
        break;
      }
      case "KeyD":
      case "ArrowRight": {
        this.emit("ArrowRight");
        break;
      }
    }
  }

  init() {
    const {backgroundColor, cellSize, gridBorderWidth, xCells, yCells} = this.config;
    this.element.width = ( xCells * cellSize ) + ( (xCells - 1) * gridBorderWidth );
    this.element.height = ( yCells * cellSize ) + ( (yCells - 1) * gridBorderWidth );
    this.element.style.backgroundColor = backgroundColor;
  }

  clear() {
    this.context.clearRect(0, 0, this.element.width, this.element.height);
  }

  redraw(gameObjects: IGameObject[]) {
    this.clear();
    this.drawGrid();
    this.drawGameObjects(gameObjects);
  }

  drawGrid() {
    const {yCells, xCells, cellSize, gridBorderWidth, gridBorderColor} = this.config;
    this.context.strokeStyle = gridBorderColor;
    this.context.lineWidth = gridBorderWidth;

    for (let i = 1; i < xCells; i++) {
      const x = i * cellSize + (Math.max(i - 1, 0) * gridBorderWidth) + gridBorderWidth / 2;
      const y = yCells * cellSize + (yCells - 1) * gridBorderWidth;
      this.context.beginPath();
      this.context.moveTo(x, 0);
      this.context.lineTo(x, y);
      this.context.stroke();
      this.context.closePath();
    }

    for (let i = 1; i < yCells; i++) {
      const y = i * cellSize + (Math.max(i - 1, 0) * gridBorderWidth) + gridBorderWidth / 2;
      const x = xCells * cellSize + (xCells - 1) * gridBorderWidth;
      this.context.beginPath();
      this.context.moveTo(0, y);
      this.context.lineTo(x, y);
      this.context.stroke();
      this.context.closePath();
    }
  }

  drawGameObjects(gameObjects: IGameObject[]) {
    for (let gameObject of gameObjects) {
      for (let part of gameObject.path) {
        this.fillCell(part[0], part[1], gameObject.color);
      }
    }
  }

  private fillCell(x, y, color) {
    const viewX = x * this.config.cellSize + x * this.config.gridBorderWidth;
    const viewY = y * this.config.cellSize + y * this.config.gridBorderWidth;
    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.fillRect(viewX, viewY, this.config.cellSize, this.config.cellSize);
    this.context.closePath();
  }

}