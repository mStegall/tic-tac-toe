document.addEventListener('DOMContentLoaded', function () {
  var boardElements = [
    ['cell1', 'cell2', 'cell3'],
    ['cell4', 'cell5', 'cell6'],
    ['cell7', 'cell8', 'cell9']
  ]

  var boardObjects
  var board

  var cell = {
    init: function (id, x, y) {
      this.element = document.getElementById(id);
      this.x = x;
      this.y = y;
    },
    setX: function (player) {
      this.element.textContent = 'X'
      this.element.classList.add('x')
      board[this.x][this.y] = 'x'
      if (!checkWin()) {
        if (player) {
          computerMove();
        }
      }
    },
    setO: function (player) {
      this.element.textContent = 'O';
      this.element.classList.add('o');
      board[this.x][this.y] = 'o'
      if (!checkWin()) {
        if (player) {
          computerMove();
        }
      }
    },
    setOListener: function () {
      this.listener = this.setO.bind(this, true);
      this.element.addEventListener('click', this.listener);

    },
    setXListener: function () {
      this.listener = this.setX.bind(this, true);
      this.element.addEventListener('click', this.listener)
    },
    clearListener: function () {
      this.element.removeEventListener('click', this.listener);
      this.listner = undefined;
    },
    clear: function () {
      this.element.classList.remove('x');
      this.element.classList.remove('o');
      this.element.textContent = '';
    }
  }

  var playerSymbol;

  function boardInit() {
    board = [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined]
    ]

    boardObjects = [
      [],
      [],
      []
    ]

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        var newCell = Object.create(cell)
        newCell.init(boardElements[i][j], i, j)
        boardObjects[i].push(newCell)
      }
    }
  }

  function boardSetX() {
    boardEach(function (cell) {
      cell.setXListener();
    })
  }

  function boardSetO() {
    boardEach(function (cell) {
      cell.setOListener();
    })
  }

  function boardEach(cb) {
    boardObjects.forEach(function (row) {
      row.forEach(cb)
    })
  }

  function clearBoardListeners() {
    boardEach(function (cell) {
      cell.clearListener();
    })
  }

  function clearBoard() {
    boardEach(function (cell) {
      cell.clear();
    })
    board = [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined]
    ]
  }

  function computerMove() {
    var choices = freeSpots();

    var choice = Math.floor(Math.random() * choices.length);

    var coords = choices[choice];

    var cell = boardObjects[coords[0]][coords[1]];

    if (playerSymbol != 'x') {
      cell.setX();
    } else {
      cell.setO();
    }
  }

  function freeSpots() {
    // console.table(board);
    return board.reduce(function (list, row, index) {

      // Get list of free cells in row
      row = row.reduce(function (innerList, cell, index) {
        if (!cell) {
          innerList.push(index)
        }
        return innerList
      }, [])

      // Map to coordinates
      var cells = row.map(function (val) {
        return [index, val]
      })

      // Add coordinates to list
      return list.concat(cells)
    }, [])
  }

  function checkWin() {
    var winner;

    // Checks Rows
    function subCheck() {
      var result;

      board.forEach(function (row) {
        if (row[0] == row[1] && row[1] == row[2]) {
          if (row[0] == playerSymbol) {
            result = 'player'
          } else if (row[0] != undefined) {
            result = 'computer'
          }
        }
      })

      return result;
    }

    // Checks TL to BR diagonal
    function diagCheck() {
      var result;

      if (board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
        if (board[0][0] == playerSymbol) {
          result = 'player'
        } else if (board[0][0] != undefined) {
          result = 'computer'
        }
      }
      if (board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
        if (board[0][2] == playerSymbol) {
          result = 'player'
        } else if (board[0][2] != undefined) {
          result = 'computer'
        }
      }

      return result;
    }

    // Check untransposed board
    winner = subCheck();
    winner = diagCheck() || winner;

    // Transpose board
    board = transpose(board);

    // Check turned board
    winner = subCheck() || winner;

    // Transpose board back
    board = transpose(board);

    if (winner == 'player') {
      setTimeout(playerWin(), 0);
    } else if (winner == 'computer') {
      computerWin();
    } else {
      var openCells = freeSpots().length;
      if (!openCells) {
        alert('Tie!');
        boardInit();
        clearBoard();
      }
    }

    return winner;
  }

  function playerWin() {
    alert('You Win!');
    clearBoard();
  }

  function computerWin() {
    alert('Computer Wins!');
    clearBoard();
  }

  function transpose(matrix) {
    var matrix = matrix[0].map(function (col, i) {
      return matrix.map(function (row) {
        return row[i]
      })
    });

    return matrix;
  }

  function playerSelect(chosenSymbol) {
    return function () {
      playerSymbol = chosenSymbol;
      document.getElementById('playerSelector').classList.remove('in');
      if (chosenSymbol == 'x') {
        boardSetX();
      } else {
        computerMove();
        boardSetO();
      }
    }
  }

  boardInit();

  document.getElementById('xButton').addEventListener('click', playerSelect('x'));
  document.getElementById('oButton').addEventListener('click', playerSelect('o'));
})