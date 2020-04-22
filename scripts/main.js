'use strict';

const feild = document.querySelector('.feild');
const message = document.querySelector('.message');

const finalMessage = document.querySelector('.final-message');

function startGame(width, height, bombsCount) {
  let isGameOver = false;
  const cellsCount = width * height;

  feild.style.gridTemplateColumns = `repeat(${width}, 40px)`;
  feild.style.width = `${width * 40}px`;
  feild.innerHTML = '<button></button>'.repeat(cellsCount);
  feild.style.visibility = 'visible';

  const cells = [...feild.children];
  const bombs = [...Array(cellsCount).keys()]
    .sort(() => Math.random() - 0.5).slice(0, bombsCount);
  let closetCount = cellsCount;

  feild.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') {
      return;
    }

    const index = cells.indexOf(e.target);
    const column = index % width;
    const row = Math.floor(index / width);

    openCell(row, column);
  });

  function getCount(row, column) {
    let count = 0;

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (isBomb(row + y, column + x)) {
          count++;
        }
      }
    }

    return count;
  }

  function openCell(row, column) {
    if (isGameOver) {
      return;
    }

    if (!isValid(row, column)) {
      return;
    }

    const index = row * width + column;
    const cell = cells[index];

    if (cell.disabled === true) {
      return;
    }

    cell.disabled = true;

    if (isBomb(row, column)) {
      cell.innerHTML = `<img src='../../images/bomb.png'
      width='30' height='30'>`;
      finalMessage.innerHTML = 'Game Over';
      isGameOver = true;

      return setTimeout(restart, 1000);
    }

    const count = getCount(row, column);

    closetCount--;

    if (count !== 0) {
      cell.innerHTML = count;

      if (closetCount <= bombsCount) {
        finalMessage.innerHTML = 'You won';
        isGameOver = true;

        return setTimeout(restart, 1000);
      }

      return;
    }

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        openCell(row + y, column + x);
      }
    }
  }

  function isBomb(row, column) {
    if (!isValid(row, column)) {
      return false;
    }

    const index = row * width + column;

    return bombs.includes(index);
  }

  function isValid(row, column) {
    return (row >= 0) && (row < height) && (column >= 0) && (column < width);
  }

  function restart() {
    feild.style.visibility = 'hidden';
    message.style.visibility = 'visible';

    setTimeout(() => {
      finalMessage.innerHTML = '';
      form.style.display = 'flex';
    }, 1500);
  }
}

const form = document.getElementById('forma');

form.onsubmit = function() {
  const width = Number(form.column.value);
  const height = Number(form.row.value);
  const bombsCount = Number(form.bomb.value);

  message.style.visibility = 'hidden';
  form.style.display = 'none';
  startGame(width, height, bombsCount);

  return false;
};
