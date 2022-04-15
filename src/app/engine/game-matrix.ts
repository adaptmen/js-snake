import { IGameObject } from "./game-object";


function getBounded(val: number, size: number): number {
  if (val >= 0 && val <= size) {
    return val;
  }
  if (val < 0) {
    let mod = val % size;
    return size + mod;
  } else if (val > size) {
    let mod = val % size;
    return 0 + mod;
  }
}

export class GameMatrix {

  private matrix: Array<IGameObject["uuid"][]> = [];

  constructor(
    private xSize: number,
    private ySize: number
  ) {
    this.initMatrix(xSize, ySize);
  }

  private initMatrix(xSize: number, ySize: number) {
    for (let y = 0; y < ySize; y++) {
      this.matrix.push(new Array(xSize));
    }
  }

  private setToCell(x, y, value: IGameObject["uuid"]) {
    const boundedX = getBounded(x, this.xSize - 1);
    const boundedY = getBounded(y, this.ySize - 1);
    this.matrix[boundedY][boundedX] = value;
  }

  private clearMatrix() {
    for (let y = 0; y < this.matrix.length; y++) {
      for (let x = 0; x < this.matrix[y].length; x++) {
        this.matrix[y][x] = undefined;
      }
    }
  }

  update(gameObjects: IGameObject[]) {
    this.clearMatrix();
    for (let gameObject of gameObjects) {
      for (let part of gameObject.path) {
        this.setToCell(part[0], part[1], gameObject.uuid);
      }
    }
  }

  getUuid(x, y): IGameObject["uuid"] | undefined {
    return this.matrix[y][x];
  }

}
