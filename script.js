// selectors
let solveBtn = document.querySelector('.solve');
let board = document.querySelector('.board');

// sudoku puzzle
let puzzle = [
  [0, 0, 0, 0, 0, 0, 7, 0, 6],
  [0, 7, 0, 9, 0, 6, 3, 0, 0],
  [0, 5, 0, 4, 7, 3, 8, 9, 0],
  [1, 3, 2, 0, 0, 5, 0, 7, 9],
  [0, 0, 4, 2, 1, 0, 5, 3, 8],
  [0, 9, 0, 0, 0, 4, 0, 0, 0],
  [0, 2, 7, 0, 6, 8, 0, 1, 3],
  [0, 0, 0, 0, 4, 0, 0, 8, 0],
  [6, 0, 0, 0, 9, 7, 0, 0, 4],
];

// function to create the board
const createBoard = () => {
  board.innerHTML = '';

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let cell = document.createElement('input');
      cell.setAttribute('class', 'cell');
      cell.value = puzzle[i][j] ? puzzle[i][j] : '';

      if (puzzle[i][j] != 0) {
        cell.classList.add('fixed');
        cell.disabled = true;
      }

      // css for borders, I'm not good at css so have to do it with js :)
      {
        if (i === 0) cell.style.borderTop = '3px solid #181810';
        if (i === 2 || i == 5 || i === 8)
          cell.style.borderBottom = '3px solid #181810';
        if (j === 0) cell.style.borderLeft = '3px solid #181810';
        if (j === 2 || j === 5 || j === 8)
          cell.style.borderRight = '3px solid #181810';
      }

      board.appendChild(cell);
    }
  }
};

// sudoku solving algorithm
const backTrack = async (puzzle, board, i) => {
  if (i == 81) {
    return true;
  }

  let row = Math.floor(i / 9);
  let col = i % 9;

  if (puzzle[row][col] == 0) {
    let vals = validVals(puzzle, row, col);
    for (let val of vals) {
      puzzle[row][col] = val;
      board[i].value = val;

      await new Promise((resolve) =>
        setTimeout(() => {
          resolve();
        }, 100)
      );

      if (await backTrack(puzzle, board, i + 1)) {
        return true;
      }

      puzzle[row][col] = '';
      board[i].value = '';
    }
  } else {
    if (await backTrack(puzzle, board, i + 1)) {
      return true;
    }
  }

  return false;
};

const validVals = (puzzle, row, col) => {
  let tab = new Set();

  // column check
  for (let i = 0; i < 9; i++) {
    if (puzzle[i][col] != 0) {
      tab.add(puzzle[i][col]);
    }
  }

  // row check
  for (let j = 0; j < 9; j++) {
    if (puzzle[row][j] != 0) {
      tab.add(puzzle[row][j]);
    }
  }

  let i = Math.floor(row / 3) * 3;
  let j = Math.floor(col / 3) * 3;

  // 3 x 3 matrix check
  for (let m = i; m < i + 3; m++) {
    for (let n = j; n < j + 3; n++) {
      if (puzzle[m][n] !== 0) {
        tab.add(puzzle[m][n]);
      }
    }
  }

  let vals = [];

  for (let i = 1; i < 10; i++) {
    if (!tab.has(i)) {
      vals.push(i);
    }
  }

  return vals;
};

// create the board initially
createBoard();

// selector of board after creation
let unsolvedBoard = document.querySelectorAll('.cell');

// click event handler on solve button
solveBtn.addEventListener(
  'click',
  async () =>
    await backTrack(
      puzzle.map((arr) => arr.slice()),
      unsolvedBoard,
      0
    )
);
