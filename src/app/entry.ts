import { Engine } from "./engine/engine";
import { Snake } from "./game-objects/snake";
import { FoodController } from "./game-controllers/food-controller";
import { ConfigType } from "./config";


const config: ConfigType = {
  cellSize: 20,
  xCells: 30,
  yCells: 30,
  snakeStartLength: 24,
  snakeSpeed: 20,
  snakeStartX: 1,
  snakeStartY: 1,
  canvasId: "game-canvas",
  statusContainerId: "status-container",
  gridBorderWidth: 2,
  backgroundColor: "rgba(176, 213, 255, 0.1)",
  foodColor: "rgb(154,255,179)",
  gridBorderColor: "rgba(60, 151, 255, 0.2)",
  snakeColor: "rgba(154,203,255,0.7)",
};

const engine = new Engine(config);

function startGame() {
  const snake = new Snake(engine);
  engine.addGameObject(snake);

  const foodController = new FoodController(engine);
  engine.addGameController(foodController);
}

const statusContainer = document.getElementById(config.statusContainerId);
statusContainer.getElementsByClassName("count")[0].innerHTML = String(engine.gameCount);

engine.GameEmitter.on("increment-count", count => {
  statusContainer.getElementsByClassName("count")[0].innerHTML = count;
});

engine.GameEmitter.on("run", () => {
  (statusContainer.getElementsByClassName("retry-btn")[0] as HTMLButtonElement).style.display = "none";
});

engine.GameEmitter.on("game-win", () => {
  statusContainer.getElementsByClassName("count")[0].innerHTML = "GAME WIN!!!";
  (statusContainer.getElementsByClassName("retry-btn")[0] as HTMLButtonElement).style.display = "inline-block";
});

engine.GameEmitter.on("game-over", () => {
  statusContainer.getElementsByClassName("count")[0].innerHTML = "GAME OVER";
  (statusContainer.getElementsByClassName("retry-btn")[0] as HTMLButtonElement).style.display = "inline-block";
});

const retryBtn = statusContainer.getElementsByClassName("retry-btn")[0] as HTMLButtonElement;
retryBtn.addEventListener("click", () => {
  startGame();
  engine.run();
  statusContainer.getElementsByClassName("count")[0].innerHTML = String(engine.gameCount);
  (statusContainer.getElementsByClassName("retry-btn")[0] as HTMLButtonElement).style.display = "none";
});

startGame();

engine.run();
