let ul = document.querySelector("ul");
let lis = document.querySelectorAll("ul li");
let singlePlayer = false;
let gameOver = document.querySelector(".game-over");

// with AI / with a friend
let info1 = document.querySelector(".info-1");
let info2 = document.querySelector(".info-2");
let info1Btns = document.querySelectorAll(".info-1 button");
info1Btns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        info1Btns.forEach(btn => {
            btn.classList.remove("clicked");
        });
        btn.classList.add("clicked");
        singlePlayer = index === 0;
        // hide info-1 & display info-2
        info1.style = "display: none";
        info2.style = "display: block";
    });
});

let chosenX = true;
let X = chosenX;
// chose x or o
let info2Labels = document.querySelectorAll(".info-2 div label");
let info2Inputs = document.querySelectorAll(".info-2 div input");
info2Inputs.forEach((input, index) => {
    input.addEventListener("click", () => {
        if (input.id === 'x') {
            info2Labels[0].classList.add("checked");
            info2Labels[1].classList.remove("checked");
            chosenX = true;
        } else {
            info2Labels[0].classList.remove("checked");
            info2Labels[1].classList.add("checked");
            chosenX = false;
        }
        X = chosenX;
    });
});

// hide info-2 & display x/o game
let info3 = document.querySelector(".info-3");
let info2Btn = document.querySelector(".info-2 button");
info2Btn.addEventListener('click', _ => {
    info2.style = "display: none";
    info3.style = "display: block";

    if (!singlePlayer) {
        document.querySelector(".info-3 .vs .player1").innerHTML = chosenX? 'X': 'O';
        document.querySelector(".info-3 .vs .player2").innerHTML = chosenX? 'O': 'X';
    } else {
        document.querySelector(".info-3 .vs .player1").innerHTML = 'You';
        document.querySelector(".info-3 .vs .player2").innerHTML = 'AI';
    }
});

// x/o game logic
lis.forEach(li => {
    li.addEventListener("click", () => {
        // prevent double click in AI play mode
        if (singlePlayer) {
            ul.style = "pointer-events: none";
        }
        // only one click on any square
        li.classList.add("clicked");
        // click sound
        document.getElementById("click").play();
        // add x/o
        if (X) {
            li.innerHTML = 'x';
            X = false;
        } else {
            li.innerHTML = 'o';
            X = true;
        }
        if (!checkTheWin()) {
            if (singlePlayer) {
                let empty = [];
                lis.forEach((li, index) => {
                    if (li.innerHTML === '') {
                        empty.push(index);
                    }
                });
                setTimeout(_ => {
                    let randomIndex = empty[parseInt(Math.random() * empty.length)];
                    lis[randomIndex].innerHTML = X? 'x': 'o';
                    lis[randomIndex].classList.add("clicked");
                    if (X) {
                        X = false;
                    } else {
                        X = true;
                    }
                    // prevent double click
                    if (!checkTheWin()) {
                        ul.style = "pointer-events: auto";
                    }
                }, 700);
            }
        }
    });
});

let player1score = document.querySelector(".info-3 .vs .result span:nth-of-type(1)");
let player2score = document.querySelector(".info-3 .vs .result span:nth-of-type(2)");
let next = document.querySelector(".icons .next");

// check if someone has won or the game is over
function checkTheWin () {
    // function to end the game if a win case occurred
    function endGame (winner, one, two, three, angle) {
        ul.style = "pointer-events: none";
        lis[one].classList.add(angle);
        lis[two].classList.add(angle);
        lis[three].classList.add(angle);
        document.getElementById("win").play();
        X = chosenX;
        
        // change score
        if ((winner === 'x' && chosenX === true) || (winner === 'o' && chosenX === false)) {
            player1score.innerHTML++;
        } else {
            player2score.innerHTML++;
        }
        next.style = "display: flex";
        next.addEventListener('click', _ => {
            next.style = "display: none";
            ul.style = "pointer-events: auto";
            lis.forEach(li => {
                li.innerHTML = '';
                li.classList.remove("clicked");
                li.classList.remove("vertical");
                li.classList.remove("horizontal");
                li.classList.remove("left");
                li.classList.remove("right");
            });
        });
        return true;
    }
    // return number of filled squares
    function noOfFilledSquares () {
        let noOfFilledSquares = 0;
        lis.forEach(li => {
            if (li.innerHTML !== '') {
                noOfFilledSquares++;
            }
        });
        return noOfFilledSquares;
    }
    // There are only 8 cases to win
    if (lis[0].innerHTML !== '' && lis[0].innerHTML === lis[1].innerHTML && lis[0].innerHTML === lis[2].innerHTML) {
        return endGame(lis[0].innerHTML, 0, 1, 2, "horizontal");
    } else if (lis[0].innerHTML !== '' && lis[0].innerHTML === lis[3].innerHTML && lis[0].innerHTML === lis[6].innerHTML) {
        return endGame(lis[0].innerHTML, 0, 3, 6, "vertical");
    } else if (lis[0].innerHTML !== '' && lis[0].innerHTML === lis[4].innerHTML && lis[0].innerHTML === lis[8].innerHTML) {
        return endGame(lis[0].innerHTML, 0, 4, 8, "left");
    } else if (lis[2].innerHTML !== '' && lis[2].innerHTML === lis[5].innerHTML && lis[2].innerHTML === lis[8].innerHTML) {
        return endGame(lis[2].innerHTML, 2, 5, 8, "vertical");
    } else if (lis[2].innerHTML !== '' && lis[2].innerHTML === lis[4].innerHTML && lis[2].innerHTML === lis[6].innerHTML) {
        return endGame(lis[2].innerHTML, 2, 4, 6, "right");
    } else if (lis[6].innerHTML !== '' && lis[6].innerHTML === lis[7].innerHTML && lis[6].innerHTML === lis[8].innerHTML) {
        return endGame(lis[6].innerHTML, 6, 7, 8, "horizontal");
    } else if (lis[1].innerHTML !== '' && lis[1].innerHTML === lis[4].innerHTML && lis[1].innerHTML === lis[7].innerHTML) {
        return endGame(lis[1].innerHTML, 1, 4, 7, "vertical");
    } else if (lis[5].innerHTML !== '' && lis[5].innerHTML === lis[4].innerHTML && lis[5].innerHTML === lis[3].innerHTML) {
        return endGame(lis[5].innerHTML, 5, 4, 3, "horizontal");
    } else if (noOfFilledSquares() === 9) {   // check if the game Ended and no one won
        ul.style = "pointer-events: none";
        gameOver.style = "display: block";
        document.getElementById("lose").play();
        X = chosenX;
        return true;
    } else {
        return false;
    }
}

// erase data
function erase () {
    ul.style = "pointer-events: auto";
    gameOver.style = "display: none";
    next.style = "display: none";
    X = chosenX;
    player1score.innerHTML = 0;
    player2score.innerHTML = 0;
    lis.forEach(li => {
        li.innerHTML = '';
        li.classList.remove("clicked");
        li.classList.remove("vertical");
        li.classList.remove("horizontal");
        li.classList.remove("left");
        li.classList.remove("right");
    });
}
document.querySelector(".repeat").addEventListener('click', _ => {
    erase();
});
document.querySelector(".home").addEventListener('click', _ => {
    erase();
    info1.style = "display: flex";
    info2.style = "display: none";
    info3.style = "display: none";
});