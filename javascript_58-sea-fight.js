document.addEventListener("DOMContentLoaded", function() {
    let playerBoard = document.querySelector("#player-field");
    // let opponentBoard = document.querySelector("#cpu-field");
    let playerBoardMatrix = [];
    let cellArray = [];


    for (let i = 0; i < 10; i++) {
        let row = document.createElement("div");
        row.classList.add("row");
        playerBoard.append(row);
        cellArray = [];

        for (let j = 0; j < 10; j++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.rowIndex = i;
            cell.dataset.colIndex = j;
            row.append(cell);
            cellArray[j] = cell;
        }
        playerBoardMatrix[i] = cellArray
    }

    console.log(playerBoardMatrix);

    playerBoardMatrix[0][0].classList.add("asd");

    // playerBoard.board

    // div.dataset.index = index;
    // var position = getPosition(this.dataset.index);
    // var [newPositionRow, newPositionCol] = getPosition(this.dataset.index);
});
