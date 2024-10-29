window.onload = function() {
    var canvasWidth = 400; // Largeur du canvas
    var canvasHeight = 400; // Hauteur du canvas
    var blockSize = 10; // Taille d'un bloc utilisé pour dessiner le serpent et la pomme
    var ctx;
    var delay = 100;
    var snakee;
    var apple;
    var widthInBlocks = canvasWidth / blockSize;
    var heightInBlocks = canvasHeight / blockSize;
    var score = 0; // Initialiser le score

    init();

    function init() {
        var canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "1px solid";
        document.body.appendChild(canvas);
        ctx = canvas.getContext("2d");
        snakee = new Snake([[6, 4], [5, 4], [4, 4]], "right");
        apple = new Apple();
        refreshCanvas();
    }

    function refreshCanvas() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        snakee.checkAppleCollision(); // Vérifier la collision avec la pomme
        snakee.advance();
        drawScore();
        snakee.draw();
        apple.draw();
        setTimeout(refreshCanvas, delay);
    }

    function drawBlock(position) {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    function Snake(body, direction) {
        this.body = body;
        this.direction = direction;
        this.ateApple = false; // Indique si le serpent a mangé la pomme

        this.draw = function() {
            ctx.save()
            ctx.fillStyle = "#ff0000";
            for (var i = 0; i < this.body.length; i++) {
                drawBlock(this.body[i]);
            }
            ctx.restore();
        };

        this.advance = function() {
            var nextPosition = this.getNextPosition();
            var head = this.body[0];

            // Vérifier la collision avec son propre corps
            for (var i = 1; i < this.body.length; i++) {
                if (head[0] === this.body[i][0] && head[1] === this.body[i][1]) {
                    restartGame(); // Recommencer le jeu
                    return;
                }
            }

            if (this.isInsideCanvas(nextPosition)) {
                this.body.unshift(nextPosition);
                if (!this.ateApple) {
                    this.body.pop();
                }
            } else {
                this.adjustPosition(nextPosition);
                this.body.unshift(nextPosition);
                if (!this.ateApple) {
                    this.body.pop();
                }
            }
        };

        this.setDirection = function(newDirection) {
            var allowedDirections;
            switch (this.direction) {
                case "left":
                case "right":
                    allowedDirections = ["up", "down"];
                    break;
                case "down":
                case "up":
                    allowedDirections = ["left", "right"];
                    break;
                default:
                    throw("Invalid Direction");
            }
            if (allowedDirections.indexOf(newDirection) > -1) {
                this.direction = newDirection;
            }
        };

        this.getNextPosition = function() {
            var head = this.body[0];
            var nextPosition = head.slice();
            switch (this.direction) {
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw("Invalid Direction");
            }
            return nextPosition;
        };

        this.adjustPosition = function(nextPosition) {
            var snakeX = nextPosition[0];
            var snakeY = nextPosition[1];
            if (snakeX < 0) {
                nextPosition[0] = widthInBlocks - 1;
            } else if (snakeX >= widthInBlocks) {
                nextPosition[0] = 0;
            }
            if (snakeY < 0) {
                nextPosition[1] = heightInBlocks - 1;
            } else if (snakeY >= heightInBlocks) {
                nextPosition[1] = 0;
            }
        };

        this.isInsideCanvas = function(position) {
            var insideHorizontalWalls = position[0] >= 0 && position[0] < widthInBlocks;
            var insideVerticalWalls = position[1] >= 0 && position[1] < heightInBlocks;
            return insideHorizontalWalls && insideVerticalWalls;
        };

        this.checkAppleCollision = function() {
            var head = this.body[0];
            if (head[0] === apple.position[0] && head[1] === apple.position[1]) {
                this.ateApple = true;
                score++; // Incrémenter le score
                var newX = Math.floor(Math.random() * (widthInBlocks - 2)) + 1; // Éviter les bords
                var newY = Math.floor(Math.random() * (heightInBlocks - 2)) + 1; // Éviter les bords
                apple.position = [newX, newY];
            } else {
                this.ateApple = false;
            }
        };
    }

    function Apple() {
        this.position = [10, 10]; // Position initiale de la pomme

        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            var radius = blockSize / 2;
            var x = (this.position[0] * blockSize) + radius;
            var y = (this.position[1] * blockSize) + radius;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.restore();
        };
    }

    document.onkeydown = function handleKeydown(e) {
        var key = e.keyCode;
        var newDirection;
        switch (key) {
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            default:
                return;
        }
        snakee.setDirection(newDirection);
    };

    // Fonction pour afficher le score
    function drawScore() {
        ctx.save();
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        var centerX = canvasWidth / 2;
        ctx.fillText("Score: " + score, centerX, 10);
        ctx.restore();
    }
     // Fonction pour recommencer le jeu
function restartGame() {
    snakee = new Snake([[6, 4], [5, 4], [4, 4]], "right");
    apple = new Apple();
    score = 0; // Réinitialiser le score
}

    };
