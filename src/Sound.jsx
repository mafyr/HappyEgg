// src/Sound.jsx
// this is more of a module, rather than function
import coinSound from "./assets/sounds/coin.mp3";
import sharpTileSound from "./assets/sounds/sharp_tile.mp3";
import gameOverSound from "./assets/sounds/game_over.mp3";

const sounds = {
  coin: new Audio(coinSound),
  sharp: new Audio(sharpTileSound),
  gameover: new Audio(gameOverSound),
};

export function playSound(type) {
  const sound = sounds[type];
  if (sound) {
    sound.currentTime = 0; // reset to start
    sound.play();
  }
}
