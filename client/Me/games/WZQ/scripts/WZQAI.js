var WZQ = function (settings) {
    this.settings = settings;
    this.canvas = this.settings.canvas;
    this.isEnded = false;
    this.isWhite = true;
    this.isMyTurn = true;
    this.room = null;
    this.lastStepX = -1;
    this.lastStepY = -1;
    this.context = this.canvas.getContext("2d");
}

WZQ.prototype.EnablePlay = function () {
    var that = this;
    this.canvas.onmousedown = function (ev) {
        that.play(ev, that);
    }
}

WZQ.prototype.DisablePlay = function () {
    this.canvas.onmousedown = null;
}

WZQ.prototype.initialize = function () {
    var img_b = new Image();
    img_b.src = "images/black.png";
    var img_w = new Image();
    img_w.src = "images/white.png";
    var img_b_l = new Image();
    img_b_l.src = "images/black_n.png";
    var img_w_l = new Image();
    img_w_l.src = "images/white_n.png";

    var _settings = {
        fullWidth: 640,
        fullHeight: 640,
        image_b: img_b,
        image_b_l: img_b_l,
        image_w: img_w,
        image_w_l: img_w_l,
        rangeNumber: 20,
        rangeWidth: 40,
        rangeHeight: 40
    },
     _settings = Object.assign(_settings, this.settings);
    this.settings = _settings;
    //must fill value
    this.canvas.width = this.settings.fullWidth;
    this.canvas.height = this.settings.fullHeight;
    this.isEnded = false;
    

    var chessData = new Array(this.settings.rangeNumber);
    for (var i = 0; i < this.settings.rangeNumber; i++) {
        chessData[i] = new Array(this.settings.rangeNumber);
        for (var j = 0; j <= this.settings.rangeNumber; j++) {
            chessData[i][j] = 0;
        }
    }
    this.chessData = chessData;
}

WZQ.prototype.setSettings = function (settings) {
    //retain properties
    this.settings = settings;
}

WZQ.prototype.DrawChessRange = function () {
    this.initialize();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (var i = 0; i <= this.settings.fullWidth; i += this.settings.rangeWidth) {
        this.context.beginPath();
        this.context.moveTo(0, i);
        this.context.lineTo(this.settings.fullWidth, i);
        this.context.closePath();
        this.context.stroke();

        this.context.beginPath();
        this.context.moveTo(i, 0);
        this.context.lineTo(i, this.settings.fullWidth);
        this.context.closePath();
        this.context.stroke();
    }
}

WZQ.prototype.play = function (ev, wzq) {
    var x = parseInt((ev.offsetX - wzq.settings.rangeWidth * 0.5) / wzq.settings.rangeWidth);

    var y = parseInt((ev.offsetY - wzq.settings.rangeHeight * 0.5) / wzq.settings.rangeHeight);


    if ((x < 0 || x > wzq.settings.rangeNumber - 1) || (y < 0 || y > wzq.settings.rangeNumber - 1)) {
        alert("你不能在这个位置下棋");
        return;
    }
    if (wzq.chessData[x][y] != 0) {
        alert("你不能在这个位置下棋");
        return;
    }

    if (wzq.isMyTurn) {
        wzq.drawChess(this.isWhite ? 1 : 2, x, y);
        wzq.isMyTurn = false;
        wzq.AIPlay();
        wzq.isMyTurn = true;

    } else {
        alert("请等待对手下棋!");
    }

}

WZQ.prototype.drawChess = function (chess, x, y) {
    if (this.isEnded == true) {
        // alert("已经结束了，如果需要重新玩，请刷新");
        return;
    }

    if (chess == 1) {
        this.context.drawImage(this.settings.image_w_l, x * this.settings.rangeWidth + this.settings.rangeWidth * 0.5 + 1.5, y * this.settings.rangeHeight + this.settings.rangeHeight * 0.5);
        this.chessData[x][y] = 1;
    }
    else {
        this.context.drawImage(this.settings.image_b_l, x * this.settings.rangeWidth + this.settings.rangeWidth * 0.5 + 1.5, y * this.settings.rangeHeight + this.settings.rangeHeight * 0.5);
        this.chessData[x][y] = 2;
    }
    if (this.lastStepX >= 0) {
        if ((this.isWhite && this.isMyTurn) || (!this.isWhite && !this.isMyTurn)) {
            this.context.drawImage(this.settings.image_b, this.lastStepX * this.settings.rangeWidth + this.settings.rangeWidth * 0.5 + 1.5, this.lastStepY * this.settings.rangeHeight + this.settings.rangeHeight * 0.5);
        } else {
            this.context.drawImage(this.settings.image_w, this.lastStepX * this.settings.rangeWidth + this.settings.rangeWidth * 0.5 + 1.5, this.lastStepY * this.settings.rangeHeight + this.settings.rangeHeight * 0.5);
        }
    }
    this.lastStepX = x;
    this.lastStepY = y;
    this.judge(x, y, chess);
    this.isMyTurn = false;

}

WZQ.prototype.judge = function (x, y, chess) {
    var count1 = 0;
    var count2 = 0;
    var count3 = 0;
    var count4 = 0;

    //左右判断
    for (var i = x; i >= 0; i--) {
        if (this.chessData[i][y] != chess) {
            break;
        }
        count1++;
    }
    for (var i = x + 1; i < 15; i++) {
        if (this.chessData[i][y] != chess) {
            break;
        }
        count1++;
    }
    //上下判断
    for (var i = y; i >= 0; i--) {
        if (this.chessData[x][i] != chess) {
            break;
        }
        count2++;
    }
    for (var i = y + 1; i < 15; i++) {
        if (this.chessData[x][i] != chess) {
            break;
        }
        count2++;
    }
    //左上右下判断
    for (var i = x, j = y; i >= 0 && j >= 0; i--, j--) {
        if (this.chessData[i][j] != chess) {
            break;
        }
        count3++;
    }
    for (var i = x + 1, j = y + 1; i < 15 && j < 15; i++, j++) {
        if (this.chessData[i][j] != chess) {
            break;
        }
        count3++;
    }
    //右上左下判断
    for (var i = x, j = y; i >= 0 && j < 15; i--, j++) {
        if (this.chessData[i][j] != chess) {
            break;
        }
        count4++;
    }
    for (var i = x + 1, j = y - 1; i < 15 && j >= 0; i++, j--) {
        if (this.chessData[i][j] != chess) {
            break;
        }
        count4++;
    }

    if (count1 >= 5 || count2 >= 5 || count3 >= 5 || count4 >= 5) {
        if (this.isWhite && chess == 1) {
            alert("你赢了");
        }
        else {
            alert("AI赢了");
        }
        this.isEnded = true;
    }
}


WZQ.prototype.reset = function () {
    this.lastStepX = -1;
    this.lastStepY = -1;
    this.setSettings(this.settings);
    this.DrawChessRange();
}


WZQ.prototype.AIPlay = function () {
    var count1 = 0;
    var count2 = 0;
    var count3 = 0;
    var count4 = 0;
    var scoreArr = [];
    for (var i = 0 ; i < this.chessData.length; i++) {
        for (var j = 0; j < this.chessData[i].length; j++) {
            if (this.chessData[i][j] != 0) {
                continue;
            }
            var score = this.computerTotolScore(i, j);
            scoreArr.push({ x: i, y: j, score: score });
        }
    }

    scoreArr.sort(function (s1, s2) {
        return s1.score >= s2.score ? -1 : 1;
    });
    var scorePoint = scoreArr[0];
    this.drawChess(this.isWhite ? 2 : 1, scorePoint.x, scorePoint.y);

}

WZQ.prototype.computerTotolScore = function (x, y) {
    var scs1 = this.computeScore(this.isWhite ? 2 : 1, x, y);
    var scs2 = this.computeScore(this.isWhite ? 1 : 2, x, y);
    var scoresMy = this.getScoreLevels(scs1);
    var scoresEnemy = this.getScoreLevels(scs2);
    var s1 = this.getHighestScore(scoresMy);
    var s2 = this.getHighestScore(scoresEnemy);
    return s1 + s2;
}

// 1 上， 2 右上
// 3 右 ，4 右下       
// 5 下 ，6 左下
// 7 左， 8 右上
WZQ.prototype.computeScore = function (player, x, y) {
    var chessData = this.chessData;
    var ss1 = { live1: false, live2: false, count: 1 },
        ss2 = { live1: false, live2: false, count: 1 },
        ss3 = { live1: false, live2: false, count: 1 },
        ss4 = { live1: false, live2: false, count: 1 };
    var retArr = [ss1, ss2, ss3, ss4];

    var minx = 0, maxx = 0, miny = 0, maxy = 0;
    minx = x - 4 >= 0 ? x - 4 : 0;
    miny = y - 4 >= 0 ? y - 4 : 0;
    maxx = x + 4 >= chessData.length - 1 ? chessData.length - 1 : x + 4;
    maxy = y + 4 >= chessData.length - 1 ? chessData.length - 1 : y + 4;

    //左右
    for (var i = x; i >= minx; i--) {
        if (i == x) {
            continue;
        }
        if (chessData[i][y] == 0) {
            ss1.live1 = true;
            break;
        }
        if (chessData[i][y] != player) {
            ss1.live1 = false;
            break;
        }
        ss1.count++;
    }

    for (var i = x ; i <= maxx ; i++) {
        if (i == x) {
            continue;
        }
        if (chessData[i][y] == 0) {
            ss1.live2 = true;
            break;
        }
        if (chessData[i][y] != player) {
            ss1.live2 = false;
            break;
        }
        ss1.count++;
    }

    //上下判断
    for (var i = y; i >= miny; i--) {
        if (i == y) {
            continue;
        }
        if (chessData[x][i] == 0) {
            ss2.live1 = true;
            break;
        }
        if (chessData[x][i] != player) {
            ss2.live1 = false;
            break;
        }
        ss2.count++;
    }

    for (var i = y ; i <= maxy ; i++) {
        if (i == y) {
            continue;
        }
        if (chessData[x][i] == 0) {
            ss2.live2 = true;
            break;
        }
        if (chessData[x][i] != player) {
            ss2.live2 = false;
            break;
        }
        ss2.count++;
    }
    //左上右下判断  
    for (var i = x, j = y; i >= minx && j >= miny; i--, j--) {
        if (i == x) {
            continue;
        }
        if (chessData[i][j] == 0) {
            ss3.live1 = true;
            break;
        }
        if (chessData[i][j] != player) {
            ss3.live1 = false;
            break;
        }
        ss3.count++;
    }
    for (var i = x, j = y ; i <= maxx && j <= maxy; i++, j++) {
        if (i == x) {
            continue;
        }
        if (chessData[i][j] == 0) {
            ss3.live2 = true;
            break;
        }
        if (chessData[i][j] != player) {
            ss3.live2 = false;
            break;
        }
        ss3.count++;
    }

    //右上左下判断
    for (var i = x, j = y; i >= minx && j <= maxy; i--, j++) {
        if (i == x) {
            continue;
        }
        if (chessData[i][j] == 0) {
            ss4.live1 = true;
            break;
        }
        if (chessData[i][j] != player) {
            ss4.live1 = false;
            break;
        }
        ss4.count++;
    }
    for (var i = x + 1, j = y - 1; i <= maxx && j >= miny; i++, j--) {
        if (i == x) {
            continue;
        }
        if (chessData[i][j] == 0) {
            ss4.live2 = true;
            break;
        }
        if (chessData[i][j] != player) {
            ss4.live2 = false;
            break;
        }
        ss4.count++;
    }

    return retArr;
}

WZQ.prototype.getScoreLevels = function (scs) {
    var scores = { live5: 0, live4: 0, dead4: 0, live3: 0, dead3: 0, live2: 0, dead2: 0, live1: 0 };
    scs.forEach(function (value, index, arr) {
        switch (value.count) {
            case 5:
                scores.live5 = 1;
                break;
            case 4:
                scores.live4 += (value.live1 && value.live2) ? 1 : 0;
                scores.dead4 += (value.live1 && value.live2) ? 0 : 1;
                break;
            case 3:
                scores.live3 += (value.live1 && value.live2) ? 1 : 0;
                scores.dead3 += (value.live1 && value.live2) ? 0 : 1;
                break;
            case 2:
                scores.live2 += (value.live1 && value.live2) ? 1 : 0;
                scores.dead2 += (value.live1 && value.live2) ? 0 : 1;
                break;
            default:
                scores.live1 += 1
                break;
        }
    });
    return scores;
}

//成5, 100分 
//活4、双死4、死4活3， 90分 
//双活3， 80分 
//死3活3， 70分 
//死4， 60分 
//活3， 50分 
//双活2， 40分 
//死3， 30分 
//活2， 20分 
//死2， 10分 
//单子 0分 


//成5, 12000分 
//活4、双死4、死4活3， 5500分 
//双活3，2700分 
//死3活3， 1300分 
//活3， 630分 
//双活2， 150分 
//死4， 310分 
//死3， 70分 
//活2， 30分 
//死2， 10分 
//单子 0分 
WZQ.prototype.getHighestScore = function (scoreLevels) {
    var s = 0;
    if (scoreLevels.live5 == 1) {
        s = 12000;
    } else if (scoreLevels.live4 == 1 || scoreLevels.dead4 == 2 || (scoreLevels.dead4 == 1 && scoreLevels.live3 == 1)) {
        s = 5500;
    } else if (scoreLevels.live3 == 2) {
        s = 2700;
    } else if (scoreLevels.dead3 == 1 && scoreLevels.live3 == 1) {
        s = 1300;
    } else if (scoreLevels.dead4 == 1) {
        s = 310;
    } else if (scoreLevels.live3 == 1) {
        s = 630;
    } else if (scoreLevels.live2 == 2) {
        s = 150;
    } else if (scoreLevels.dead3 == 1) {
        s = 70;
    } else if (scoreLevels.live2 == 1) {
        s = 30;
    } else if (scoreLevels.dead2 == 1) {
        s = 10;
    } else {
        s = 0;
    }
    return s;

}






