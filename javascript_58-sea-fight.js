document.addEventListener("DOMContentLoaded", function() {
    const DEBUG = true;
    const SHIP_PART = -2;
    const SHIP_SPACE = -1;
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
    let enemyShipCountGlobal = 0;
    let playerShipCountGlobal = 0;
    let enemyTurn = false;

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
                    return;
                }
                if (saveFirstCell == 0) {
                    this.classList.add("firstColor");
                    saveFirstCell = this;
                } else {
                    let firstRow = Number(saveFirstCell.dataset.rowIndex);
                    let firstCol = Number(saveFirstCell.dataset.colIndex);
                    let secondRow = Number(this.dataset.rowIndex);
                    let secondCol = Number(this.dataset.colIndex);

                    if (firstRow == secondRow || firstCol == secondCol) {
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
                                playerShipCountGlobal++;
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
                                playerShipCountGlobal++;
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
        playerBoardMatrix[i] = cellArray;
    }
    console.log(playerBoardMatrix);

    let freeCells = [];
    let index = 0;
    function sameRow(index, offset) {
        let newIndex = index + offset;
        if (newIndex <= 0 || newIndex >= freeCells.length) return undefined;
        let currentRow = freeCells[index][0];
        let newRow = freeCells[newIndex][0];
        if (currentRow !== newRow) return undefined;
        return freeCells[newIndex];
    }
    function oneDeckCheck(shipIndex) {
        let currentEl = freeCells[shipIndex];

        let shipRightSideEl = freeCells[shipIndex + 1];
        let shipLeftSideEl = freeCells[shipIndex - 1];
        let shipTopSideEl = freeCells[shipIndex - 10];
        let shipBottomSideEl = freeCells[shipIndex + 10];

        let shipRightSide1 = currentEl[1] == 0 || currentEl[1] == 9 || shipRightSideEl[2] == SHIP_SPACE;
        let shipLeftSide1 = currentEl[1] == 0 || currentEl[1] == 9 || shipLeftSideEl[2] == SHIP_SPACE;
        let shipTopSide1 = shipTopSideEl == undefined || shipTopSideEl[2] == SHIP_SPACE;
        let shipBottomSide1 = shipBottomSideEl == undefined || shipBottomSideEl[2] == SHIP_SPACE;

        return shipRightSide1 && shipLeftSide1 && shipTopSide1 && shipBottomSide1;
    }
    function twoDeckCheck(shipIndex) {
        let currentEl = freeCells[shipIndex];

        let shipRightSideEl = freeCells[shipIndex + 1];
        let shipLeftSideEl = freeCells[shipIndex - 1];
        let shipTopSideEl = freeCells[shipIndex - 10];
        let shipBottomSideEl = freeCells[shipIndex + 10];

        let shipRightSide2 = currentEl[1] != 9 && shipRightSideEl[2] == SHIP_PART;
        let shipLeftSide2 = currentEl[1] != 0 && shipLeftSideEl[2] == SHIP_PART;
        let shipTopSide2 = shipTopSideEl != undefined && shipTopSideEl[2] == SHIP_PART;
        let shipBottomSide2 = shipBottomSideEl != undefined && shipBottomSideEl[2] == SHIP_PART;

        return shipRightSide2 || shipLeftSide2 || shipTopSide2 || shipBottomSide2;
    }
    function threeDeckCheck(shipIndex) {
        let currentEl = freeCells[shipIndex];

        let shipRightSideEl = freeCells[shipIndex + 1];
        let shipLeftSideEl = freeCells[shipIndex - 1];
        // let shipRightSideEl = sameRow(shipIndex, 1);
        // let shipLeftSideEl = sameRow(shipIndex, -1);
        let shipTopSideEl = freeCells[shipIndex - 10];
        let shipBottomSideEl = freeCells[shipIndex + 10];

        let shipRightSide2 = currentEl[1] != 9 && shipRightSideEl[2] == SHIP_PART;
        let shipLeftSide2 = currentEl[1] != 0 && shipLeftSideEl[2] == SHIP_PART;
        let shipTopSide2 = shipTopSideEl != undefined && shipTopSideEl[2] == SHIP_PART;
        let shipBottomSide2 = shipBottomSideEl != undefined && shipBottomSideEl[2] == SHIP_PART;

        if (shipRightSide2 && shipLeftSide2) {
            return true;
        }
        if (shipTopSide2 && shipBottomSide2) {
            return true;
        }

        if (shipRightSide2) {
            let right = freeCells[shipIndex + 2];
            let right2 = freeCells[shipIndex + 3];
            // let right = getCellHorizontal(shipIndex, 1);
            // let right2 = getCellHorizontal(shipIndex, 2);

            return shipRightSideEl[1] != 9 && right[2] == SHIP_PART && (right2 == 9 || right2[2] == SHIP_SPACE);
        }
        if (shipLeftSide2) {
            let left = freeCells[shipIndex - 2];
            let left2 = freeCells[shipIndex - 3];
            // let left = getCellHorizontal(shipIndex, -1);
            // let left2 = getCellHorizontal(shipIndex, -2);

            return shipLeftSideEl[1] != 0 && left[2] == SHIP_PART && (left2 == 0 || left2[2] == SHIP_SPACE);
        }
        if (shipTopSide2) {
            let top = freeCells[shipIndex - 20];
            let top2 = freeCells[shipIndex - 30];

            return top != undefined && top[2] == SHIP_PART && (top2 == undefined || top2[2] == SHIP_SPACE);
        }
        if (shipBottomSide2) {
            let bottom = freeCells[shipIndex + 20];
            let bottom2 = freeCells[shipIndex + 30];

            return bottom != undefined && bottom[2] == SHIP_PART && (bottom2 == undefined || bottom2[2] == SHIP_SPACE);
        }

        return false;
    }
    function fourDeckCheck(shipIndex) {
        let currentEl = freeCells[shipIndex];

        // let shipRightSideEl = sameRow(shipIndex, 1);
        // let shipLeftSideEl = sameRow(shipIndex, -1);
        let shipRightSideEl = freeCells[shipIndex + 1];
        let shipLeftSideEl = freeCells[shipIndex - 1];
        let shipTopSideEl = freeCells[shipIndex - 10];
        let shipBottomSideEl = freeCells[shipIndex + 10];



        let shipRightSide2 = currentEl[1] != 9 && shipRightSideEl[2] == SHIP_PART;
        let shipLeftSide2 = currentEl[1] != 0 && shipLeftSideEl[2] == SHIP_PART;
        let shipTopSide2 = shipTopSideEl != undefined && shipTopSideEl[2] == SHIP_PART;
        let shipBottomSide2 = shipBottomSideEl != undefined && shipBottomSideEl[2] == SHIP_PART;

        if (shipRightSide2 && shipLeftSide2) {
            let secondCellLeftSide = freeCells[shipIndex - 2];
            let secondCellRightSide = freeCells[shipIndex + 2];
            return (shipLeftSideEl[1] != 0 && secondCellLeftSide[2] == SHIP_PART) || (shipRightSideEl[1] != 9 && secondCellRightSide[2] == SHIP_PART);
        }
        if (shipTopSide2 && shipBottomSide2) {
            let secondCellTopSide = freeCells[shipIndex - 20];
            let secondCellBottomSide = freeCells[shipIndex + 20];
            return (secondCellTopSide != undefined && secondCellTopSide[2] == SHIP_PART) || (secondCellBottomSide != undefined && secondCellBottomSide[2] == SHIP_PART);
        }

        if (shipRightSide2) {
            let right = freeCells[shipIndex + 2];
            let right2 = freeCells[shipIndex + 3];

            // 1 2 3 4
            // 1 - поточна
            // 2 - індекс + 1
            // поточна не крайня і після неї частина корабля
            // 3 і 4 - індекс + 2 і індекс + 3
            // друга не крайня і третя частина корабля
            // третя не крайня і 4 чатинка


            return shipRightSideEl[1] != 9 && right[2] == SHIP_PART && right != 9 && right2[2] == SHIP_PART;
        }
        if (shipLeftSide2) {
            let left = freeCells[shipIndex - 2];
            let left2 = freeCells[shipIndex - 3];

            return shipLeftSideEl[1] != 0 && left[2] == SHIP_PART && left != 0 && left2[2] == SHIP_PART;
        }
        if (shipTopSide2) {
            let top = freeCells[shipIndex - 20];
            let top2 = freeCells[shipIndex - 30];

            return top != undefined && top[2] == SHIP_PART && top2 != undefined && top2[2] == SHIP_PART;
        }
        if (shipBottomSide2) {
            let bottom = freeCells[shipIndex + 20];
            let bottom2 = freeCells[shipIndex + 30];

            return bottom != undefined && bottom[2] == SHIP_PART && bottom2 != undefined && bottom2[2] == SHIP_PART;
        }

        return false;
    }
    for (let i = 0; i < 10; i++) {
        let row = document.createElement("div");
        row.classList.add("row");
        opponentBoard.append(row);
        cellArray = [];
        for (let j = 0; j < 10; j++) {
            let cell = document.createElement("div");
            cell.addEventListener("click", function() {
                if (this.dataset.shot === "true") {
                    return;
                }
                let shipIndex = -1;
                for (let k = 0; k < freeCells.length; k++) {
                    if (freeCells[k][0] == i && freeCells[k][1] == j) {
                        shipIndex = k;
                        break;
                    }
                }
                // !!!! FOR TESTING ONLY !!!!!
                // TODO increas enemyShipCountGlobal
                // if (enemyShipCountGlobal == 10 && playerShipCountGlobal == 10 && !enemyTurn) {
                if (1) {
                    if (shipIndex !== -1) {
                        if (freeCells[shipIndex][2] == SHIP_PART) {
                            if (fourDeckCheck(shipIndex)) {
                                console.log("fourDeckCheck");
                                this.classList.add("hit");
                                let parts = [shipIndex];
                                let neighbours = [shipIndex + 1, shipIndex - 1, shipIndex - 10, shipIndex + 10];
                                for (let i = 0; i < neighbours.length; i++) {
                                    let n = neighbours[i];
                                    if (freeCells[n] && freeCells[n][2] == SHIP_PART) {
                                            parts.push(n);
                                            let diff = n - shipIndex;
                                            let next = n + diff;
                                            if (freeCells[next] && freeCells[next][2] == SHIP_PART) {
                                                parts.push(next);
                                            }
                                            let nextNext = next + diff;
                                            if (freeCells[nextNext] && freeCells[nextNext][2] == SHIP_PART) {
                                                parts.push(nextNext);
                                            }
                                    }
                                }
                                let hitCount = 0;
                                for (let i = 0; i < parts.length; i++) {
                                    let ro = freeCells[parts[i]][0];
                                    let co = freeCells[parts[i]][1];
                                    if (enemyBoardMatrix[ro][co].classList.contains("hit")) {
                                        hitCount++;
                                    }
                                }
                                if (hitCount == 4) {
                                    for (let i = 0; i < parts.length; i++) {
                                        let ro = freeCells[parts[i]][0];
                                        let co = freeCells[parts[i]][1];
                                        enemyBoardMatrix[ro][co].classList.remove("hit");
                                        enemyBoardMatrix[ro][co].classList.add("randomCell");
                                    }
                                }
                            } else if (threeDeckCheck(shipIndex)) {
                                this.classList.add("hit");
                                let parts = [shipIndex];

                                let neighbours = [shipIndex - 10, shipIndex + 10];
                                if (freeCells[shipIndex][1] != 0) {
                                    neighbours.push(shipIndex - 1);
                                }

                                if (freeCells[shipIndex][1] != 9) {
                                    neighbours.push(shipIndex + 1);
                                }

                                for (let i = 0; i < neighbours.length; i++) {
                                    let n = neighbours[i];
                                    if (freeCells[n] && freeCells[n][2] == SHIP_PART) {
                                        parts.push(n);
                                        let diff = n - shipIndex;
                                        let next = n + diff;

                                        if (freeCells[next] && freeCells[next][2] == SHIP_PART) {
                                            parts.push(next);
                                        }
                                    }
                                }
                                let hitCount = 0;
                                for (let i = 0; i < parts.length; i++) {
                                    let ro = freeCells[parts[i]][0];
                                    let co = freeCells[parts[i]][1];
                                    if (enemyBoardMatrix[ro][co].classList.contains("hit")) {
                                        hitCount++;
                                    }
                                }
                                if (hitCount == 3) {
                                    for (let i = 0; i < parts.length; i++) {
                                        let ro = freeCells[parts[i]][0];
                                        let co = freeCells[parts[i]][1];
                                        enemyBoardMatrix[ro][co].classList.remove("hit");
                                        enemyBoardMatrix[ro][co].classList.add("randomCell");
                                    }
                                }
                                console.log("threeDeckCheck");
                            } else if (twoDeckCheck(shipIndex)) {
                                console.log("twoDeckCheck");

                                this.classList.add("hit");

                                // debugger;
                                //let neighbours = [shipIndex + 1, shipIndex - 1, shipIndex - 10, shipIndex + 10];

                                // let neighbours = [shipIndex - 10, shipIndex + 10];
                                // if (freeCells[shipIndex][1] != 0) {
                                //     neighbours.push(shipIndex - 1);
                                // }

                                // if (freeCells[shipIndex][1] != 9) {
                                //     neighbours.push(shipIndex + 1);
                                // }
                                let neighbours = [shipIndex - 10, shipIndex + 10];

                                if (freeCells[shipIndex][1] > 0 && freeCells[shipIndex][1] < 9) {
                                    neighbours.push(shipIndex - 1, shipIndex + 1);
                                } else if (freeCells[shipIndex][1] === 0) {
                                    neighbours.push(shipIndex + 1);
                                } else if (freeCells[shipIndex][1] === 9) {
                                    neighbours.push(shipIndex - 1);
                                }

                                let neighbourIndex = -1;
                                for (let i = 0; i < neighbours.length; i++) {
                                    let n = neighbours[i];
                                    if (freeCells[n] && freeCells[n][2] == SHIP_PART) {
                                        neighbourIndex = n;
                                    }
                                }

                                // поруч підбита частинка
                                // що навколо немає частинок корабля
                                if (neighbourIndex !== -1) {
                                    let row1 = freeCells[shipIndex][0];
                                    let col1 = freeCells[shipIndex][1];
                                    let row2 = freeCells[neighbourIndex][0];
                                    let col2 = freeCells[neighbourIndex][1];


                                    if (enemyBoardMatrix[row1][col1].classList.contains("hit") &&
                                        enemyBoardMatrix[row2][col2].classList.contains("hit")) {

                                        enemyBoardMatrix[row1][col1].classList.remove("hit");
                                        enemyBoardMatrix[row2][col2].classList.remove("hit");

                                        enemyBoardMatrix[row1][col1].classList.add("randomCell");
                                        enemyBoardMatrix[row2][col2].classList.add("randomCell");
                                    }
                                }
                            } else if (oneDeckCheck(shipIndex)) {
                                this.classList.add("randomCell");
                            } else {
                                this.classList.add("hit");
                            }
                        } else {
                            this.classList.add("miss");
                            enemyTurn = true;
                            enemyAction();
                        }
                        this.dataset.shot = true;
                        }
                } else {
                    console.log("dont ready");
                }
            });

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
        let randomIndex = -1;
        let increaseCount = false;
        let enemyShipCount = 0;

        while(enemyShipCount < shipCount && limiter < 200000) {
            randomIndex = Math.floor(Math.random() * (freeCells.length - 1));

            if (freeCells[randomIndex][2] != SHIP_SPACE && freeCells[randomIndex][2] != SHIP_PART) {
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
                        increaseCount = spawnFourDeckShip(randomIndex);
                        if (increaseCount) {
                            console.log({limiter});
                        }

                        break;
                    default:
                        console.log("Unrecognized ship type");
                }

                if (increaseCount) {
                    enemyShipCount++;
                    increaseCount = false;
                }
            }

            limiter++;
        }
    }

    function takePosition(positionIndex) {
        if (DEBUG) {
            enemyBoardMatrix[freeCells[positionIndex][0]][freeCells[positionIndex][1]].classList.add("color");
        }

        freeCells[positionIndex][2] = SHIP_PART;
    }

    function spawnFourDeckShip(startPosition, test_dir = undefined) {
        let directions = [1, -1, 10, -10];
        if (DEBUG && test_dir) {
            directions = [test_dir];
        }
        let limiter = 0;
        let spawnCheck = false;

        while(!spawnCheck && directions.length > 0 && limiter < 200) {
            let randomDirIndex = Math.floor(Math.random() * (directions.length - 1));
            let dir = directions[randomDirIndex];
            let second = startPosition + dir;
            let third = startPosition + dir * 2;
            let four = startPosition + dir + dir * 2;

            let spawnPositions = [startPosition, second, third, four];

            // TODO move to separate function and call for spawnThreeDeckShip too
            for (let i = 0; i < spawnPositions.length; i++) {
                // if (i != 3 && dir === 1 && freeCells[spawnPositions[i]][1] === 9 || dir === -1 && freeCells[spawnPositions[i]][1] === 0) {
                if (dir === 1 && freeCells[spawnPositions[i]][1] === 9 || dir === -1 && freeCells[spawnPositions[i]][1] === 0) {
                    directions.splice(randomDirIndex, 1);
                    spawnCheck = false;
                    break;
                } else {
                    if (freeCells[spawnPositions[i]] != undefined && freeCells[spawnPositions[i]][2] != SHIP_SPACE && freeCells[spawnPositions[i]][2] != SHIP_PART) {
                        spawnCheck = true;
                    } else {
                        directions.splice(randomDirIndex, 1);
                        spawnCheck = false;
                        break;
                    }
                }
            }
            if (spawnCheck) {
                spawnPositions.forEach(function(p) { spawnOneDeckShip(p); })
            }
            limiter++;
        }
        return spawnCheck;
    }
    function spawnThreeDeckShip(startPosition, test_dir = undefined) {
        let directions = [1, -1, 10, -10];
        if (DEBUG && test_dir) {
            directions = [test_dir];
        }

        let limiter = 0;
        let spawnCheck = false;

        while(!spawnCheck && directions.length > 0 && limiter < 200) {
            let randomDirIndex = Math.floor(Math.random() * (directions.length - 1));
            let dir = directions[randomDirIndex];
            let second = startPosition + dir;
            let third = startPosition + dir * 2;

            let spawnPositions = [startPosition, second, third];

            for(let i = 0; i < spawnPositions.length; i++) {
                if (i != spawnPositions.length - 1 && dir === 1 && freeCells[spawnPositions[i]][1] === 9 || dir === -1 && freeCells[spawnPositions[i]][1] === 0) {
                    directions.splice(randomDirIndex, 1);
                    spawnCheck = false;
                    break;
                } else {
                    if (freeCells[spawnPositions[i]] != undefined && freeCells[spawnPositions[i]][2] != -1) {
                        spawnCheck = true;
                    } else {
                        directions.splice(randomDirIndex, 1);
                        spawnCheck = false;
                        break;
                    }
                }
            }

            if (spawnCheck) {
                spawnPositions.forEach(function(p) { spawnOneDeckShip(p); })
            }
            limiter++;
        }
        return spawnCheck;
    }
    function spawnTwoDeckShip(startPosition, test_dir = undefined) {
        let directions = [1, -1, 10, -10];
        if (DEBUG && test_dir) {
            directions = [test_dir];
        }
        let limiter = 0;
        let spawnCheck = false;

        while(!spawnCheck && directions.length > 0 && limiter < 200) {
            let randomDirIndex = Math.floor(Math.random() * (directions.length - 1));
            let dir = directions[randomDirIndex];

            if (dir === 1 && freeCells[startPosition][1] === 9 || dir === -1 && freeCells[startPosition][1] === 0) {
                directions.splice(randomDirIndex, 1);
            } else {
                let endPosition = startPosition + directions[randomDirIndex];
                if (freeCells[endPosition] != undefined && freeCells[endPosition][2] != SHIP_SPACE) {
                    // spawnOneDeckShip(startPosition);
                    spawnOneDeckShip(endPosition);
                    spawnCheck = true;
                } else {
                    directions.splice(randomDirIndex, 1);
                }
            }
            limiter++;
        }

        if (spawnCheck) {
            spawnOneDeckShip(startPosition);
        }

        return spawnCheck;
    }
    function spawnOneDeckShip(position) {
        takePosition(position);

        // right
        if (freeCells[position][1] < 9) {
            freeCells[position + 1][2] ??= SHIP_SPACE;

            if (freeCells[position][0] < 9) {
                freeCells[position + 11][2] ??= SHIP_SPACE;
                freeCells[position + 10][2] ??= SHIP_SPACE;
            }

            if (freeCells[position][0] > 0 ) {
                freeCells[position - 9][2] ??= SHIP_SPACE;
                freeCells[position - 10][2] ??= SHIP_SPACE;
            }
        }

        // left
        if (freeCells[position][1] > 0) {
            freeCells[position - 1][2] ??= SHIP_SPACE;
            if (freeCells[position][0] < 9) {
                freeCells[position + 9][2] ??= SHIP_SPACE;
                freeCells[position + 10][2] ??= SHIP_SPACE;
            }

            if (freeCells[position][0] > 0) {
                freeCells[position - 11][2] ??= SHIP_SPACE;
                freeCells[position - 10][2] ??= SHIP_SPACE;
            }
        }
    }

    if (DEBUG) {

        spawnOneDeckShip(0);
        spawnOneDeckShip(2);
        spawnOneDeckShip(4);
        spawnOneDeckShip(99);

        spawnTwoDeckShip(70, 1);
        spawnTwoDeckShip(20, 1);
        spawnTwoDeckShip(73, 1);

        spawnThreeDeckShip(19, -1);
        spawnThreeDeckShip(44, 1);

        spawnFourDeckShip(49, 10);


        //enemyShipCountGlobal = 10;
    } else {
        spawnEnemyShips(4, 1);
        spawnEnemyShips(3, 2);
        spawnEnemyShips(2, 3);
        spawnEnemyShips(1, 4);
    }

    console.log({freeCells});

    function enemyAction() {
        // fix stack error

        let randomRow = Math.floor(Math.random() * 10);
        let randomCol = Math.floor(Math.random() * 10);

        if (playerBoardMatrix[randomRow][randomCol].dataset.shot == "true") {
            enemyAction();
            return;
        } else {
            playerBoardMatrix[randomRow][randomCol].dataset.shot = true;
        }

        if (playerBoardMatrix[randomRow][randomCol].classList.contains("color")) {
            playerBoardMatrix[randomRow][randomCol].classList.remove("color");
            playerBoardMatrix[randomRow][randomCol].classList.add("randomCell");
        } else {
            playerBoardMatrix[randomRow][randomCol].classList.add("miss");
        }
        enemyTurn = false;
    }

    console.log({playerBoardMatrix});
});
