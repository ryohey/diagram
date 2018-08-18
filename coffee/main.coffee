canvas = document.getElementById "canvas"
ctx = canvas.getContext "2d"
stage = new createjs.Stage "canvas"

createjs.Ticker.setFPS 60
createjs.Ticker.addEventListener "tick", stage

gridSize = 40
lineHeight = 80

for i in [0..100]
  y = 0
  x = i * gridSize

  rect = new createjs.Shape(new createjs.Graphics()
    .setStrokeStyle 1
    .beginStroke "gray"
    .drawRect x, y, gridSize, gridSize
  )
  stage.addChild rect

###
operation = 
  fromIndexes: [Number]
  toIndex: Number
  func: Function
  label: String
###

operations = []

offset =
  x: gridSize / 2
  y: lineHeight / 2

# 値が変わっていないことを表す線を上に遡って引いていく
drawVerticalLine = (toIndex) ->
  currentLine = operations.length
  return unless currentLine > 1
  x = toIndex * gridSize + offset.x
  line = currentLine - 2
  while true
    break if line < 0
    break if operations[line].toIndex is toIndex
    fromY = lineHeight * (line + 1)
    toY = lineHeight * line

    lineShape = new createjs.Shape(new createjs.Graphics()
      .setStrokeStyle 2
      .beginStroke "gray"
      .moveTo x, fromY + offset.y
      .lineTo x, toY + offset.y
      .endStroke()
    )
    stage.addChild lineShape
    line--

addOperation = (ope) -> 
  currentLine = operations.length
  operations.push ope
  y = lineHeight * currentLine
  midY = lineHeight * (currentLine + 0.5)
  nextY = lineHeight * (currentLine + 1)
  toX = gridSize * ope.toIndex

  funcX = (ope.fromIndexes.reduce (a, b) -> a + b) / ope.fromIndexes.length * gridSize

  for index in ope.fromIndexes
    fromX = gridSize * index

    line = new createjs.Shape(new createjs.Graphics()
      .setStrokeStyle 2
      .beginStroke "rgba(0, 0, 0, 0.1)"
      .moveTo fromX + offset.x, y + offset.y
      .lineTo funcX + offset.x, midY + offset.y
      .endStroke()
    )
    stage.addChild line

    drawVerticalLine(index)

  line = new createjs.Shape(new createjs.Graphics()
    .setStrokeStyle 2
    .beginStroke "rgba(0, 0, 0, 0.1)"
    .moveTo funcX + offset.x, midY + offset.y
    .lineTo toX + offset.x, nextY + offset.y
    .endStroke()
  )
  stage.addChild line

  circle = new createjs.Shape(new createjs.Graphics()
    .beginFill "black"
    .drawCircle funcX + offset.x, midY + offset.y, 4
  )
  stage.addChild circle

  text = new createjs.Text (ope.label ? ""), "12px Consolas", "black"
  text.x = funcX + offset.x + 10
  text.y = midY + offset.y
  stage.addChild text

  hline = new createjs.Shape(new createjs.Graphics()
    .setStrokeStyle 2
    .beginStroke "rgba(0, 0, 0, 0.1)"
    .moveTo 0, y + offset.y
    .lineTo 1000, y + offset.y
    .endStroke()
  )
  stage.addChild hline

  currentLine++

###
add 1 2 3 > 5
operand inputs > output
###
parseInput = (text) ->
  ch = text.split " "
  operand = ch[0]
  inputs = []
  for i in [1..ch.length - 1]
    break if ch[i] is ">"
    inputs.push parseInt ch[i]
  output = parseInt ch[ch.length - 1]

  {
    fromIndexes: inputs
    toIndex: output
    func: true
    label: operand
  }

$("#input").on "keyup", (e) ->
  if e.keyCode is 13
    addOperation parseInput $(this).val()
    $(this).val ""

addOperation parseInput "add 2 3 > 1"
addOperation parseInput "add 1 0 3 > 2"