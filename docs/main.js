(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

/*
operation = 
fromIndexes: [Number]
toIndex: Number
func: Function
label: String
*/
/*
add 1 2 3 > 5
operand inputs > output
*/
var addOperation, canvas, ctx, drawVerticalLine, gridSize, i, j, lineHeight, offset, operations, parseInput, rect, stage, x, y;

canvas = document.getElementById("canvas");

ctx = canvas.getContext("2d");

stage = new createjs.Stage("canvas");

createjs.Ticker.setFPS(60);

createjs.Ticker.addEventListener("tick", stage);

gridSize = 40;

lineHeight = 80;

for (i = j = 0; j <= 100; i = ++j) {
  y = 0;
  x = i * gridSize;
  rect = new createjs.Shape(new createjs.Graphics().setStrokeStyle(1).beginStroke("gray").drawRect(x, y, gridSize, gridSize));
  stage.addChild(rect);
}

operations = [];

offset = {
  x: gridSize / 2,
  y: lineHeight / 2
};

// 値が変わっていないことを表す線を上に遡って引いていく
drawVerticalLine = function(toIndex) {
  var currentLine, fromY, line, lineShape, results, toY;
  currentLine = operations.length;
  if (!(currentLine > 1)) {
    return;
  }
  x = toIndex * gridSize + offset.x;
  line = currentLine - 2;
  results = [];
  while (true) {
    if (line < 0) {
      break;
    }
    if (operations[line].toIndex === toIndex) {
      break;
    }
    fromY = lineHeight * (line + 1);
    toY = lineHeight * line;
    lineShape = new createjs.Shape(new createjs.Graphics().setStrokeStyle(2).beginStroke("gray").moveTo(x, fromY + offset.y).lineTo(x, toY + offset.y).endStroke());
    stage.addChild(lineShape);
    results.push(line--);
  }
  return results;
};

addOperation = function(ope) {
  var circle, currentLine, fromX, funcX, hline, index, k, len, line, midY, nextY, ref, ref1, text, toX;
  currentLine = operations.length;
  operations.push(ope);
  y = lineHeight * currentLine;
  midY = lineHeight * (currentLine + 0.5);
  nextY = lineHeight * (currentLine + 1);
  toX = gridSize * ope.toIndex;
  funcX = (ope.fromIndexes.reduce(function(a, b) {
    return a + b;
  })) / ope.fromIndexes.length * gridSize;
  ref = ope.fromIndexes;
  for (k = 0, len = ref.length; k < len; k++) {
    index = ref[k];
    fromX = gridSize * index;
    line = new createjs.Shape(new createjs.Graphics().setStrokeStyle(2).beginStroke("rgba(0, 0, 0, 0.1)").moveTo(fromX + offset.x, y + offset.y).lineTo(funcX + offset.x, midY + offset.y).endStroke());
    stage.addChild(line);
    drawVerticalLine(index);
  }
  line = new createjs.Shape(new createjs.Graphics().setStrokeStyle(2).beginStroke("rgba(0, 0, 0, 0.1)").moveTo(funcX + offset.x, midY + offset.y).lineTo(toX + offset.x, nextY + offset.y).endStroke());
  stage.addChild(line);
  circle = new createjs.Shape(new createjs.Graphics().beginFill("black").drawCircle(funcX + offset.x, midY + offset.y, 4));
  stage.addChild(circle);
  text = new createjs.Text((ref1 = ope.label) != null ? ref1 : "", "12px Consolas", "black");
  text.x = funcX + offset.x + 10;
  text.y = midY + offset.y;
  stage.addChild(text);
  hline = new createjs.Shape(new createjs.Graphics().setStrokeStyle(2).beginStroke("rgba(0, 0, 0, 0.1)").moveTo(0, y + offset.y).lineTo(1000, y + offset.y).endStroke());
  stage.addChild(hline);
  return currentLine++;
};

parseInput = function(text) {
  var ch, inputs, k, operand, output, ref;
  ch = text.split(" ");
  operand = ch[0];
  inputs = [];
  for (i = k = 1, ref = ch.length - 1; (1 <= ref ? k <= ref : k >= ref); i = 1 <= ref ? ++k : --k) {
    if (ch[i] === ">") {
      break;
    }
    inputs.push(parseInt(ch[i]));
  }
  output = parseInt(ch[ch.length - 1]);
  return {
    fromIndexes: inputs,
    toIndex: output,
    func: true,
    label: operand
  };
};

$("#input").on("keyup", function(e) {
  if (e.keyCode === 13) {
    addOperation(parseInput($(this).val()));
    return $(this).val("");
  }
});

addOperation(parseInput("add 2 3 > 1"));

addOperation(parseInput("add 1 0 3 > 2"));


},{}]},{},[1]);
