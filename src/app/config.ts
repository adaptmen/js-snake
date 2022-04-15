

type CellSize = number;

type Color = string;

export type ConfigType = {

  cellSize: CellSize;

  gridBorderWidth: number;

  gridBorderColor: Color;

  backgroundColor: Color;

  snakeColor: Color;

  foodColor: Color;

  xCells: number;

  yCells: number;

  canvasId: string;

  statusContainerId: string;

  snakeStartLength: number;

  /***
   * Cells per second
   */
  snakeSpeed: number;

  snakeStartX: number;

  snakeStartY: number;

};
