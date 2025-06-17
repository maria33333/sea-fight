document.addEventListener("DOMContentLoaded", function() {
    let playerBoard = document.querySelector("#player-field");
    let opponentBoard = document.querySelector("#cpu-field");
    let playerBoardMatrix = [];
    let cellArray = [];
    let saveFirstCell = 0;

    for (let i = 0; i < 10; i++) {
        let row = document.createElement("div");
        row.classList.add("row");
        playerBoard.append(row);
        cellArray = [];

        for (let j = 0; j < 10; j++) {
            let cell = document.createElement("div");

            cell.addEventListener("click", function() {
                let row = this.dataset.rowIndex;
                let col = this.dataset.colIndex;
                console.log(row, col);
                if (saveFirstCell == 0) {
                    saveFirstCell = this;
                } else {
                    let firstRow = saveFirstCell.dataset.rowIndex;
                    let firstCol = saveFirstCell.dataset.colIndex;
                    let secondRow = this.dataset.rowIndex;
                    let secondCol = this.dataset.colIndex;
                    if (firstRow == secondRow || firstCol == secondCol) {
                        console.log("OK");
                        if (firstRow == secondRow) {
                            let row = firstRow;
                            let start = Math.min(firstCol, secondCol);
                            let end = Math.max(firstCol, secondCol);
                            for (let col = start; col <= end; col++) {
                                playerBoardMatrix[row][col].classList.add("asd");
                            }
                        }
                        if (firstCol == secondCol) {
                            let col = firstCol;
                            let start = Math.min(firstRow, secondRow);
                            let end = Math.max(firstRow, secondRow);
                            for (let row = start; row <= end; row++) {
                                playerBoardMatrix[row][col].classList.add("asd");
                            }
                        }
                        saveFirstCell = 0;
                    } else {
                        alert("лінія має буть тільки вертикальна або горизонтальна");
                        return;
                    }
                }
            });
            cell.classList.add("cell");
            cell.dataset.rowIndex = i;
            cell.dataset.colIndex = j;
            row.append(cell);
            cellArray[j] = cell;
        }
        playerBoardMatrix[i] = cellArray
    }
    console.log(playerBoardMatrix);



     for (let i = 0; i < 10; i++) {
        let row = document.createElement("div");
        row.classList.add("row");
        opponentBoard.append(row);
        // cellArray = [];
        for (let j = 0; j < 10; j++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            // cell.dataset.rowIndex = i;
            // cell.dataset.colIndex = j;
            row.append(cell);
            // cellArray[j] = cell;
        }
        // playerBoardMatrix[i] = cellArray
    }
    console.log(playerBoardMatrix);
});
