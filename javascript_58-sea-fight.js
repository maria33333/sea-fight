document.addEventListener("DOMContentLoaded", function() {
    let playerBoard = document.querySelector("#player-field");
    let opponentBoard = document.querySelector("#cpu-field");
    let playerBoardMatrix = [];
    let cellArray = [];
    let saveFirstCell = 0;
    let lockColEnd = -1;
    let lockColStart = -1;
    let lockRowEnd = -1;
    let lockRowStart = -1;

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

            cell.addEventListener("click", function() {
                if (this.dataset.lock == "true") {
                    console.log("false");
                    return;
                }
                console.log(this.dataset.rowIndex, this.dataset.colIndex);
                if (saveFirstCell == 0) {
                    this.classList.add("firstColor");
                    saveFirstCell = this;
                } else {
                    let firstRow = Number(saveFirstCell.dataset.rowIndex);
                    let firstCol = Number(saveFirstCell.dataset.colIndex);
                    let secondRow = Number(this.dataset.rowIndex);
                    let secondCol = Number(this.dataset.colIndex);

                    if (firstRow == secondRow || firstCol == secondCol) {
                        console.log("OK");
                        saveFirstCell.classList.remove("firstColor");
                        if (firstRow == secondRow) {
                            let start = Math.min(firstCol, secondCol); //6, 3
                            let end = Math.max(firstCol, secondCol);//3, 6
                            if (end - start < 4) {
                                if (end != 9) {
                                    lockColEnd = end + 1;
                                } else {
                                    lockColEnd = end;
                                }
                                if (start != 0) {
                                    lockColStart = start - 1;
                                } else {
                                    lockColStart = start;
                                }

                                for (let col = start; col <= end; col++) {
                                    playerBoardMatrix[firstRow][col].classList.add("color");
                                }
                                for (let col = lockColStart; col <= lockColEnd; col++) {
                                    playerBoardMatrix[firstRow][col].dataset.lock = true;
                                    if (firstRow != 0) {
                                        playerBoardMatrix[firstRow - 1][col].dataset.lock = true;
                                    }
                                    if (firstRow != 9) {
                                        playerBoardMatrix[firstRow + 1][col].dataset.lock = true;
                                    }
                                }
                            }
                        }
                        else if (firstCol == secondCol) {
                            let start = Math.min(firstRow, secondRow);
                            let end = Math.max(firstRow, secondRow);
                            if (end - start < 4) {
                                if (end != 9) {
                                    lockRowEnd = end + 1;
                                } else {
                                    lockRowEnd = end;
                                }
                                if (start != 0) {
                                    lockRowStart = start - 1;
                                } else {
                                    lockRowStart = start;
                                }
                                for (let row = start; row <= end; row++) {
                                    playerBoardMatrix[row][firstCol].classList.add("color");
                                }
                                for (let row = lockRowStart; row <= lockRowEnd; row++) {
                                    playerBoardMatrix[row][firstCol].dataset.lock = true;
                                    if (firstCol != 0) {
                                        playerBoardMatrix[row][firstCol - 1].dataset.lock = true;
                                    }
                                    if (firstRow != 9) {
                                        playerBoardMatrix[row][firstCol + 1].dataset.lock = true;
                                    }
                                }
                            }
                        }
                        saveFirstCell = 0;
                    } else {
                        saveFirstCell.classList.remove("firstColor");
                        alert("лінія має буть тільки вертикальна або горизонтальна");
                        saveFirstCell = 0;
                        // return;
                    }
                }
            });
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
    // console.log(enemyBoardMatrix);
});
