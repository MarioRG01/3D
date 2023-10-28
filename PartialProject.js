var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_FragColor;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjMatrix;
  void main() {
    gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
    v_FragColor = a_Color;
    gl_PointSize = 10.0;
  }`;

var FSHADER_SOURCE =`
  precision mediump float;
  varying vec4 v_FragColor;
  void main(){
    gl_FragColor = v_FragColor;
  }`;

function changeAxis() {
  var xAxis = document.getElementById("x-axis");
  var yAxis = document.getElementById("y-axis");
  var zAxis = document.getElementById("z-axis");

  if(xAxis.checked){
    kendoConsole.log("X Rotation Axis selected");
    rotAxis = [1,0,0];
    axisIndex = 0;
    $("#rotationSlider").data("kendoSlider").value(rotX);
    $("#translationSlider").data("kendoSlider").value(transX);
    $("#scaleSlider").data("kendoSlider").value(scaleX);
  }
  if(yAxis.checked){
    kendoConsole.log("Y Rotation Axis selected");
    rotAxis = [0,1,0];
    axisIndex = 1;
    $("#rotationSlider").data("kendoSlider").value(rotY);
    $("#translationSlider").data("kendoSlider").value(transY);
    $("#scaleSlider").data("kendoSlider").value(scaleY);
  }
  if(zAxis.checked){
    kendoConsole.log("Z Rotation Axis selected");
    rotAxis = [0,0,1];
    axisIndex = 2;
    $("#rotationSlider").data("kendoSlider").value(rotZ);
    $("#translationSlider").data("kendoSlider").value(transZ);
    $("#scaleSlider").data("kendoSlider").value(scaleZ);
  }
}
//restart - Reset the program to original.
function restart(){
  index = 0;
  g_points = [];
  g_colors = [];
  g_rotations = [];
  g_translations = [];
  g_scales = [];
  kendoConsole.log("Restart.");
  main();
}
function rotationSliderOnSlide(e){
  kendoConsole.log("Slide :: new slide value is: " + e.value);
  angle = e.value;
  if(axisIndex == 0){
    rotX = angle;
  }
  if(axisIndex == 1){
    rotY = angle;
  }
  if(axisIndex == 2){
    rotZ = angle;
  }
  main();
}
function rotationSliderOnChange(e){
  kendoConsole.log("Change :: new value is: "+ e.value);
  angle =  e.value;
  if(axisIndex == 0){
    rotX = angle;
  }
  if(axisIndex == 1){
    rotY = angle;
  }
  if(axisIndex == 2){
    rotZ = angle;
  }
  main();
}

function translationSliderOnSlide(e){
  kendoConsole.log("Slide :: new slide value is: " + e.value);
  translation = e.value;
  if(axisIndex == 0){
    transX = translation;
  }
  if(axisIndex == 1){
    transY = translation;
  }
  if(axisIndex == 2){
    transZ = translation;
  }
  main();
}
function translationSliderOnChange(e){
  kendoConsole.log("Change :: new value is: "+ e.value);
  translation =  e.value;
  if(axisIndex == 0){
    transX = translation;
  }
  if(axisIndex == 1){
    transY = translation;
  }
  if(axisIndex == 2){
    transZ = translation;
  }
  main();
}

function scaleSliderOnSlide(e){
  kendoConsole.log("Slide :: new slide value is: " + e.value);
  scale = e.value;
  if(axisIndex == 0){
    scaleX = scale;
  }
  if(axisIndex == 1){
    scaleY = scale;
  }
  if(axisIndex == 2){
    scaleZ = scale;
  }
  main();
}
function scaleSliderOnChange(e){
  kendoConsole.log("Change :: new value is: "+ e.value);
  scale =  e.value;
  if(axisIndex == 0){
    scaleX = scale;
  }
  if(axisIndex == 1){
    scaleY = scale;
  }
  if(axisIndex == 2){
    scaleZ = scale;
  }
  main();
}
function rangeslideronSlide(e){
  kendoConsole.log("Slide :: new slide values are: " + e.value.toString().replace(",", " - "));
}

function rangesliderOnChange(e){
  kendoConsole.log("Change :: new values are: " + e.value.toString().replace(",", " - "));
  var slider = $('#rotationSlider').data("kendoSlider");
  slider.min(e.value[0]);
  slider.max(e.value[1]);

  if(slider.value() < e.value[0]){
    slider.value(e.value[0]);
  }else if(slider.value() > e.value[1]){
    slider.value(e.value[1]);
  }
  slider.resize();
  angle = slider.value();
  main();
}

var minRotation = -360;
var maxRotation = 360;
var minTranslation = -1;
var maxTranslation = 1;
var minScale = 1;
var maxScale = 10;
$(document).ready(function(){
  $('#rotationSlider').kendoSlider({
    change: rotationSliderOnChange,
    slide: rotationSliderOnSlide,
    min: minRotation,
    max: maxRotation,
    smallStep: 10,
    largeStep: 60,
    value: 0
  });
  $('#translationSlider').kendoSlider({
    change: translationSliderOnChange,
    slide: translationSliderOnSlide,
    min: minTranslation,
    max: maxTranslation,
    smallStep: 0.1,
    largeStep: 0.5,
    value: 0
  });
  $('#scaleSlider').kendoSlider({
    change: scaleSliderOnChange,
    slide: scaleSliderOnSlide,
    min: minScale,
    max: maxScale,
    smallStep: 0.2,
    largeStep: 1,
    value: 1
  });
  $('#rangerslider').kendoRangeSlider({
    change: rangesliderOnChange,
    slide: rangeslideronSlide,
    min: minRotation,
    max: maxRotation,
    smallStep: 10,
    largeStep: 60,
    tickPlacement: "both"
  });
});
function main(){
  var canvas = document.getElementById('webgl');
  var gl = getWebGLContext(canvas);

  if(!gl){
    console.log('Failed to get the WebGL context');
    return;
  }

  if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
    console.log('Failed to initialize shaders');
    return;
  }

  canvas.onclick = function(ev){ click(ev, gl, canvas); }
  canvas.oncontextmenu = function(ev){ rightclick(ev, gl); return false; }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  draw(gl);
}

function keyPressed(event){
   if(event.keyCode == '17'){
      //pressing ctrl key (pushes the z coordenate to front)
      z += 0.1;
      console.log(z);
   }
   if(event.keyCode == '16'){
      //pressing shift key (pushes the z coordante to back)
      z -= 0.1;
      console.log(z);
   }
}

function rightclick(ev, gl){
  index++;
  draw(gl);
}

function initVertexBuffers(gl, vertices, colors, rotations, translations, scales){
  var n = vertices.length;
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0){
    console.log('Failed to get location of a_Position');
    return;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  var modelMatrix = new Matrix4();
  modelMatrix.rotate(rotX, 1, 0, 0);
  modelMatrix.rotate(rotY, 0, 1, 0);
  modelMatrix.rotate(rotZ, 0, 0, 1);
  modelMatrix.translate(transX, transY, transZ);
  modelMatrix.scale(scaleX, scaleY, scaleZ);
  console.log(modelMatrix);

  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if(!u_ModelMatrix){ console.log('Failed to get location of u_ModelMatrix'); }
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if(!u_ViewMatrix){ console.log('Failed to get location of u_ViewMatrix'); }
  var viewMatrix = new Matrix4();
  viewMatrix.setLookAt(0.0, 0.0, 1.5,   0.0, 0.0, 0.0,   0.0, 1.0, 0.0);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  
  var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  if(!u_ProjMatrix){ console.log('Failed to get location of u_ProjMatrix'); }
  var projMatrix = new Matrix4();
  projMatrix.setPerspective(60.0, 1.0, 0.1, 5.0);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);

  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(!a_Color < 0){
    console.log('Failed to get location of a_Color');
    return;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Color);

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);

  return n;
}

var index = 0;
var g_points = [];
var g_colors = [];
var g_rotations = [];
var g_translations = [];
var g_scales = [];
var angle = 0.0;
var rotX = 0.0;
var rotY = 0.0;
var rotZ = 0.0;
var translation = 0.0;
var transX = 0.0;
var transY = 0.0;
var transZ = 0.0;
var scale = 1.0;
var scaleX = 1.0;
var scaleY = 1.0;
var scaleZ = 1.0;
var rotAxis = [1,0,0];
var scaleAxis = [1,1,1];
var z = 0;
var axisIndex = 0;
function click(ev, gl, canvas){
  var x = ev.clientX;
  var y = ev.clientY;
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  if(g_points.length <= index){
    var arrayPoints = [];
    g_points.push(arrayPoints);
    var arrayColors = [];
    g_colors.push(arrayColors);
  }

  g_points[index].push(x);
  g_points[index].push(y);
  g_points[index].push(z);

  g_colors[index].push(Math.random());
  g_colors[index].push(Math.random());
  g_colors[index].push(Math.random());

  draw(gl);
}

function draw(gl){
  gl.clear(gl.COLOR_BUFFER_BIT);
  for(var i = 0; i < g_points.length; i++){
    var n = initVertexBuffers(gl, new Float32Array(g_points[i]), new Float32Array(g_colors[i]), new Float32Array(g_rotations[i]), new Float32Array(g_translations[i]), new Float32Array(g_scales[i])) / 3;
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
  }
}
