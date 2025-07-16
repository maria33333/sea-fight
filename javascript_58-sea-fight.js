document.addEventListener("DOMContentLoaded", function() {
    let playerBoard = document.querySelector("#player-field");
    let opponentBoard = document.querySelector("#cpu-field");
    let playerBoardMatrix = [];
    let enemyBoardMatrix = [];
    let cellArray = [];
    let saveFirstCell = 0;
    let lockColEnd = -1;
    let lockColStart = -1;
    let lockRowEnd = -1;
    let lockRowStart = -1;
    let shipLimits = {
        1: 4,
        2: 3,
        3: 2,
        4: 1
    };

    let standingShips = {
        1: 0,
        2: 0,
        3: 0,
        4: 0
    };
    let limiter = 0;

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
                            let length = end - start + 1;

                            if (standingShips[length] >= shipLimits[length]) {
                                alert("цей тип корабля вже поставлен максимальну кількість");
                                return;
                            }

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
                                standingShips[length]++;
                            }
                        }
                        else if (firstCol == secondCol) {
                            let start = Math.min(firstRow, secondRow);
                            let end = Math.max(firstRow, secondRow);
                            let length = end - start + 1;

                            if (standingShips[length] >= shipLimits[length]) {
                                alert("цей тип корабля вже поставлен максимальну кількість");
                                return;
                            }
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
                                    if (firstCol != 9) {
                                        playerBoardMatrix[row][firstCol + 1].dataset.lock = true;
                                    }
                                }
                                standingShips[length]++;
                            }
                        }
                        saveFirstCell = 0;
                    } else {
                        saveFirstCell.classList.remove("firstColor");
                        alert("лінія має буть тільки вертикальна або горизонтальна");
                        saveFirstCell = 0;
                    }
                }
            });
        }
        playerBoardMatrix[i] = cellArray
    }
    console.log(playerBoardMatrix);

    let freeCells = [];
    let index = 0;

    for (let i = 0; i < 10; i++) {
        let row = document.createElement("div");
        row.classList.add("row");
        opponentBoard.append(row);
        cellArray = [];
        for (let j = 0; j < 10; j++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            row.append(cell);
            cellArray[j] = cell;
            freeCells[index] = [i, j];
            index++;
        }
        enemyBoardMatrix[i] = cellArray;
    }
    console.log(enemyBoardMatrix);


    function spawnEnemyShips(shipCount, shipType) {
        let limiter = 0;
        let enemyShipCount = 0;
        let randomIndex = -1;
        let increaseCount = false;

        while(enemyShipCount < shipCount && limiter < 200) {
            randomIndex = Math.floor(Math.random() * (freeCells.length - 1));

            if (freeCells[randomIndex][2] != -1) {
                switch(shipType) {
                    case 1:
                        spawnOneDeckShip(randomIndex);
                        increaseCount = true;
                        break;
                    case 2:
                        increaseCount = spawnTwoDeckShip(randomIndex);
                        break;
                    case 3:
                        increaseCount = spawnThreeDeckShip(randomIndex);
                        break;
                    case 4:
                        spawnFourDeckShip();
                        break;
                    default:
                        console.log("Unrecognized ship type");
                }

                if (increaseCount) {
                    enemyShipCount++;
                }
            }

            limiter++;
        }
    }

    function takePosition(positionIndex) {
        enemyBoardMatrix[freeCells[positionIndex][0]][freeCells[positionIndex][1]].classList.add("color");
        freeCells[positionIndex][2] = -1;
    }

    function spawnFourDeckShip() { console.log("spawnFourShip"); }
    function spawnThreeDeckShip(startPosition) {
        console.log("spawnThreeShip");

        let directions = [];
        let limiter = 0;
        let spawnCheck = false


        return spawnCheck;

    }
    function spawnTwoDeckShip(startPosition) {
        let directions = [1, -1, 10, -10];
        let limiter = 0;
        let spawnCheck = false

        while(!spawnCheck && directions.length > 0 && limiter < 200) {
            let randomDirIndex = Math.floor(Math.random() * (directions.length - 1));
            let endPosition = startPosition + directions[randomDirIndex];

            if (freeCells[endPosition] != undefined && freeCells[endPosition][2] != -1) {
                spawnOneDeckShip(endPosition);
                spawnCheck = true;
            } else {
                directions.slice(randomDirIndex, 1);
            }
            limiter++;
        }

        if (spawnCheck) {
            spawnOneDeckShip(startPosition);
        }

        return spawnCheck;
    }
    function spawnOneDeckShip(position) {
        takePosition(position)
        // right
        if (freeCells[position][1] < 9) {
            freeCells[position + 1][2] = -1;

            if (freeCells[position][0] < 9) {
                freeCells[position + 11][2] = -1;
                freeCells[position + 10][2] = -1;
            }

            if (freeCells[position][0] > 0 ) {
                freeCells[position - 9][2] = -1;
                freeCells[position - 10][2] = -1;
            }
        }

        // left
        if (freeCells[position][1] > 0) {
            freeCells[position - 1][2] = -1;
            if (freeCells[position][0] < 9) {
                freeCells[position + 9][2] = -1;
                freeCells[position + 10][2] = -1;
            }

            if (freeCells[position][0] > 0) {
                freeCells[position - 11][2] = -1;
                freeCells[position - 10][2] = -1;
            }
        }
    }

    spawnEnemyShips(4, 1);
    spawnEnemyShips(3, 2);
    spawnEnemyShips(2, 3);

    for (let i = 0; i < 100; i++) {
        if (freeCells[i][2] == -1) {
            enemyBoardMatrix[freeCells[i][0]][freeCells[i][1]].classList.add("color_red");
        }
    }



    // for (let i = 0; i < 4; i++) {
    //     let randomIndex = Math.floor(Math.random() * freeCells.length) + 1;
    //     // REMOVE
    //     enemyBoardMatrix[freeCells[randomIndex][0]][freeCells[randomIndex][1]].classList.add("color");
    //     // REMOVE
    //     // console.log(freeCells[randomIndex]);
    //     freeCells.splice(randomIndex, 1);
    //     // console.log(freeCells);
    //     freeCells.splice()
    // }
    console.log(freeCells);

});
