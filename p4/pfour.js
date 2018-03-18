function setup() { "use strict";
  var canvas = document.getElementById('myCanvas');
  var context = canvas.getContext('2d');
  var m4 = twgl.m4;
  
  var slider1 = document.getElementById('slider1');
  slider1.value = 0;
  var slider2 = document.getElementById('slider2');
  slider2.value = -5;
  var slider3 = document.getElementById('slider3');
  slider3.value = 0;
  var slider4 = document.getElementById('slider4');
  slider4.value = 1;
      
  var triangles = [];

  function initPyramid1(){
    triangles.push([[100,0,100],[100,0,-100],[0,150,0],"red", m4.identity,0.0,1]);
    triangles.push([[100,0,-100],[-100,0,-100],[0,150,0],"yellow",m4.identity,0.0,1]);
    triangles.push([[-100,0,-100],[-100,0,100],[0,150,0],"orange",m4.identity,0.0,1]);
    triangles.push([[-100,0,100],[100,0,100],[0,150,0],"purple",m4.identity,0.0,1]);
	triangles.push([[100,0,100],[-100,0,100],[-100,0,-100],"blue",m4.identity,0.0,1]);
	triangles.push([[100,0,100],[100,0,-100],[-100,0,-100],"blue",m4.identity,0.0,1]);
  }
  
  function initFlower(){
    triangles.push([[0,0,0],[200,250,-50],[200,250,50],"red",m4.identity,0.0,2]);
    triangles.push([[0,0,0],[-200,250,-50],[-200,250,50],"yellow",m4.identity,0.0,2]);
    triangles.push([[0,0,0],[-50,250,200],[50,250,200],"orange",m4.identity,0.0,2]);
    triangles.push([[0,0,0],[-50,250,-200],[50,250,-200],"purple",m4.identity,0.0,2]);
  }
                  
  function moveToTx(x,y,z,Tx) {
    var loc = [x,y,z];
    var locTx = m4.transformPoint(Tx,loc);
    context.moveTo(locTx[0],locTx[1]);
  }

  function lineToTx(x,y,z,Tx) {
    var loc = [x,y,z];
    var locTx = m4.transformPoint(Tx,loc);
    context.lineTo(locTx[0],locTx[1]);
  }
                
  function drawAxes(Tx) {
    // A little cross on the front face, for identification
	context.strokeStyle = "black";
    moveToTx(0,0,0,Tx);lineToTx(100,0,0,Tx);context.stroke();
    moveToTx(0,0,0,Tx);lineToTx(0,150,0,Tx);context.stroke();
    moveToTx(0,0,0,Tx);lineToTx(0,0,200,Tx);context.stroke();
  }

  function drawTriangle(triangle,Tx){
     context.beginPath();
     context.fillStyle=triangle[3];
	 context.strokeStyle = "black";
     moveToTx(triangle[0][0],triangle[0][1],triangle[0][2],Tx); 
     lineToTx(triangle[1][0],triangle[1][1],triangle[1][2],Tx); 
     lineToTx(triangle[2][0],triangle[2][1],triangle[2][2],Tx); 
	 context.stroke();
     context.closePath(); 
     context.fill();
  }

  function drawShapes() {
    for(var i=0;i<triangles.length;i++)
		drawTriangle(triangles[i],triangles[i][4]);
  }

  function sortShapes() {
	for (var i=0;i<triangles.length;i++) {
		for (var j=0;j<(triangles.length-i-1);j++) {
			if (triangles[j][5] < triangles[j+1][5]) {
				var temp = triangles[j];
				triangles[j] = triangles[j+1];
				triangles[j+1] = temp;
			}
		}	
	}
  }
  
  function draw() {
    canvas.width = canvas.width;
    
    var a1 = slider1.value*0.01*Math.PI;
    var a2 = slider2.value*0.01*Math.PI;
	var a3 = slider3.value*0.01*Math.PI;
	var z4 = slider4.value*0.05;
    var axis = [0,0,1];
  
    var Tmodel=m4.axisRotation(axis,a2);

    var eye=[700*Math.cos(a1),400,700*Math.sin(a1)];
    var target=[0,0,0];
    var up=[0,1,0];
    var Tcamera=m4.inverse(m4.lookAt(eye,target,up));

    //var Tprojection=m4.ortho(-250,250,-200,300,-2,2);
    var Tprojection=m4.perspective(Math.PI*z4,1,5,400);

    var Tviewport=m4.multiply(m4.scaling([200,-200,200]),m4.translation([200,200,0]));
    
    var Tcpv=m4.multiply(m4.multiply(Tcamera,Tprojection),Tviewport);
    var Tmcp=m4.multiply(m4.multiply(Tmodel,Tcamera),Tprojection);
    var Tmc=m4.multiply(Tmodel,Tcamera);
    var Tmcpv=m4.multiply(Tmodel,Tcpv);
	var T1 = m4.multiply(m4.translation([0,150,0]),Tmcpv);
	T1 = m4.multiply(m4.axisRotation(up,a3),T1);

    for(var i=0;i<triangles.length;i++){
	  var cam1=m4.transformPoint(Tmc,triangles[i][0]);
	  var cam2=m4.transformPoint(Tmc,triangles[i][1]);
	  var cam3=m4.transformPoint(Tmc,triangles[i][2]);
	  triangles[i][5]=-(cam1[2] + cam2[2] + cam3[2] )/ 3;
	  if (triangles[i][6] == 1) {
		  triangles[i][4] = Tmcpv;
	  } else if (triangles[i][6] == 2) {
		  triangles[i][4] = T1;
	  }
    }
	
	sortShapes();
    drawShapes();
    drawAxes(Tcpv);
  }

  slider1.addEventListener("input",draw);
  slider2.addEventListener("input",draw);
  slider3.addEventListener("input",draw);
  slider4.addEventListener("input",draw);
  initPyramid1();
  initFlower();
  draw();

}
window.onload = setup;
