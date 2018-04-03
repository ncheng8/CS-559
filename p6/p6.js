// draw a textured cube using WebGL
//
// written by sifakis on October 18, 2015

function start() { "use strict";

    // Get canvas, WebGL context, twgl.m4
    var canvas = document.getElementById("mycanvas");
    var gl = canvas.getContext("webgl");
    var m4 = twgl.m4;

    // Sliders at center
    var slider1 = document.getElementById('slider1');
    slider1.value = 0;
    var slider2 = document.getElementById('slider2');
    slider2.value = 0;

    // Read shader source
    var vertexSource = document.getElementById("vs").text;
    var fragmentSource = document.getElementById("fs").text;

    // Compile vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader,vertexSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(vertexShader)); return null; }
    
    // Compile fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,fragmentSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(fragmentShader)); return null; }
    
    // Attach the shaders and link
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialize shaders"); }
    gl.useProgram(shaderProgram);	    
    
    // with the vertex shader, we need to pass it positions
    // as an attribute - so set up that communication
    shaderProgram.PositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
    gl.enableVertexAttribArray(shaderProgram.PositionAttribute);
    
    shaderProgram.ColorAttribute = gl.getAttribLocation(shaderProgram, "vColor");
    gl.enableVertexAttribArray(shaderProgram.ColorAttribute);    
	
	shaderProgram.NormalAttribute = gl.getAttribLocation(shaderProgram, "vNormal");
	gl.enableVertexAttribArray(shaderProgram.NormalAttribute);    
    
    // this gives us access to the matrix uniform
    shaderProgram.MVPmatrix = gl.getUniformLocation(shaderProgram,"uMVP");
	
	shaderProgram.NormalMatrix = gl.getUniformLocation(shaderProgram,"normalMatrix");
    

    // Data ...
    
    // vertex positions
    var vertexPos_first = new Float32Array(
        [  1, 1, 1,  -1, 1, 1,  -1,-1, 1,   1,-1, 1,
           1, 1, 1,   1,-1, 1,   1,-1,-1,   1, 1,-1,
           1, 1, 1,   1, 1,-1,  -1, 1,-1,  -1, 1, 1,
          -1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1,
          -1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1,
           1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1,-1 ]);

    var vertexPos_second = new Float32Array(
        [  3, 3, 1,   1, 3, 1,   1, 1, 1,   3, 1, 1,
           3, 3, 1,   3, 1, 1,   3, 1, -1,   3, 3, -1,
           3, 3, 1,   3, 3, -1,   1, 3, -1,   1, 3, 1,
           1, 3, 1,   1, 3, -1,   1, 1, -1,   1, 1, 1,
           1, 1, -1,   3, 1, -1,   3, 1, 1,   1, 1, 1,
           3, 1, -1,   1, 1, -1,   1, 3, -1,   3, 3, -1]);

	var vertexPos_third = new Float32Array(
		[  -3,3,-1,  -1,3,-1,  -1,1,-1,  -3,1,-1,
		   -3,3,-1,  -3,1,-1,  -3,1,1,  -3,3,1,
		   -3,3,-1,  -3,3,1,  -1,3,1,  -1,3,-1,
		   -1,3,-1,  -1,3,1,  -1,1,1,  -1,1,-1,
		   -1,1,1,  -3,1,1,  -3,1,-1,  -1,1,-1,
		   -3,1,1,  -1,1,1,  -1,3,1,  -3,3,1 ]);
    // vertex colors
    var vertexColors_first = new Float32Array(
        [  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
           1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
           0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
           1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,
           1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,
           0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1 ]);
    
    var vertexColors_second = new Float32Array(
        [  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
           1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
           0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
           1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,
           1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,
           0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1 ]);
		   
    var vertexColors_third = new Float32Array(
        [  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
           1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
           0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
           1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,
           1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,
           0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1 ]);
    // element index array
    var triangleIndices_first = new Uint8Array(
        [  0, 1, 2,   0, 2, 3,    // front
           4, 5, 6,   4, 6, 7,    // right
           8, 9,10,   8,10,11,   // top
          12,13,14,  12,14,15,    // left
          16,17,18,  16,18,19,    // bottom
	      20,21,22,  20,22,23 ]); // back

    var triangleIndices_second = new Uint8Array(
        [  0, 1, 2,   0, 2, 3,    // front
           4, 5, 6,   4, 6, 7,    // right
           8, 9,10,   8,10,11,   // top
          12,13,14,  12,14,15,    // left
          16,17,18,  16,18,19,    // bottom
	      20,21,22,  20,22,23 ]); // back
	
	var triangleIndices_third = new Uint8Array(
        [  0, 1, 2,   0, 2, 3,    // front
           4, 5, 6,   4, 6, 7,    // right
           8, 9,10,   8,10,11,   // top
          12,13,14,  12,14,15,    // left
          16,17,18,  16,18,19,    // bottom
	      20,21,22,  20,22,23 ]); // back	
	var vertexNormals = new Float32Array(
	[
    // Front
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,

    // Back
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,

    // Top
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,

    // Bottom
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,

    // Right
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,

    // Left
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0
  ]);
    // we need to put the vertices into a buffer so we can
    // block transfer them to the graphics hardware
    var trianglePosBuffer_first = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer_first);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPos_first, gl.STATIC_DRAW);
    trianglePosBuffer_first.itemSize = 3;
    trianglePosBuffer_first.numItems = 24;
    
    var trianglePosBuffer_second = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer_second);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPos_second, gl.STATIC_DRAW);
    trianglePosBuffer_second.itemSize = 3;
    trianglePosBuffer_second.numItems = 24;
	
	var trianglePosBuffer_third = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer_third);
	gl.bufferData(gl.ARRAY_BUFFER, vertexPos_third, gl.STATIC_DRAW);
	trianglePosBuffer_third.itemSize = 3;
	trianglePosBuffer_third.numItems = 24;
    
    // a buffer for colors
    var colorBuffer_first = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer_first);
    gl.bufferData(gl.ARRAY_BUFFER, vertexColors_first, gl.STATIC_DRAW);
    colorBuffer_first.itemSize = 3;
    colorBuffer_first.numItems = 24;

    var colorBuffer_second = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer_second);
    gl.bufferData(gl.ARRAY_BUFFER, vertexColors_second, gl.STATIC_DRAW);
    colorBuffer_second.itemSize = 3;
    colorBuffer_second.numItems = 24;
	
	var colorBuffer_third = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer_third);
	gl.bufferData(gl.ARRAY_BUFFER, vertexColors_third, gl.STATIC_DRAW);
	colorBuffer_third.itemSize = 3;
	colorBuffer_third.numItems = 24;

    // a buffer for indices
    var indexBuffer_first = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer_first);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleIndices_first, gl.STATIC_DRAW);    

    var indexBuffer_second = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer_second);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleIndices_second, gl.STATIC_DRAW);    
	
	var indexBuffer_third = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer_third);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleIndices_third, gl.STATIC_DRAW);
	
	// buffer for normals
	var normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertexNormals, gl.STATIC_DRAW);


                  // Scene (re-)draw routine
    function draw() {
    
        // Translate slider values to angles in the [-pi,pi] interval
        var angle1 = slider1.value*0.01*Math.PI;
        var angle2 = slider2.value*0.01*Math.PI;
    
        // Circle around the y-axis
        var eye = [400*Math.sin(angle1),500.0,400.0*Math.cos(angle1)];
        var target = [0,0,0];
        var up = [0,1,0];
    
        var tModel1 = m4.scaling([100,100,100]);
        var tModel2 = m4.multiply(m4.scaling([100,100,100]),m4.axisRotation([1,1,0],angle2));
		var tModel3 = m4.multiply(m4.scaling([100,100,100]),m4.axisRotation([-1,1,0],-angle2));
		
		//var n2 = m4.transpose(m4.inverse(tModel2));
		//var n3 = m4.transpose(m4.inverse(tModel3));
		
        var tCamera = m4.inverse(m4.lookAt(eye,target,up));
		var n1 = m4.transpose(m4.inverse(m4.multiply(tCamera,tModel1)));
        var tProjection = m4.perspective(Math.PI/3,1,10,1000);
    
        var tMVP1=m4.multiply(m4.multiply(tModel1,tCamera),tProjection);
        var tMVP2=m4.multiply(m4.multiply(tModel2,tCamera),tProjection);
		var tMVP3=m4.multiply(m4.multiply(tModel3,tCamera),tProjection);
        // Clear screen, prepare for rendering
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
        // Set up uniforms & attributes for triangle 1
        gl.uniformMatrix4fv(shaderProgram.MVPmatrix,false,tMVP1);
                 
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer_first);
        gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuffer_first.itemSize,
          gl.FLOAT, false, 0, 0);
        
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer_first);
        gl.vertexAttribPointer(shaderProgram.ColorAttribute, colorBuffer_first.itemSize,
          gl.FLOAT,false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer_first);
			//stuff for normals
		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
		gl.vertexAttribPointer(shaderProgram.NormalAttribute,3,gl.FLOAT,false,0,0);
		
		gl.uniformMatrix4fv(shaderProgram.NormalMatrix,false,n1);

        // Do the drawing
        gl.drawElements(gl.TRIANGLES, triangleIndices_first.length, gl.UNSIGNED_BYTE, 0);

        // Set up uniforms & attributes
        gl.uniformMatrix4fv(shaderProgram.MVPmatrix,false,tMVP2);
                 
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer_second);
        gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuffer_second.itemSize,
          gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer_second);
        gl.vertexAttribPointer(shaderProgram.ColorAttribute, colorBuffer_second.itemSize,
          gl.FLOAT,false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer_second);

        // Do the drawing
        gl.drawElements(gl.TRIANGLES, triangleIndices_second.length, gl.UNSIGNED_BYTE, 0);
		
		// Set up uniforms & attributes
        gl.uniformMatrix4fv(shaderProgram.MVPmatrix,false,tMVP3);
                 
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer_third);
        gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuffer_third.itemSize,
          gl.FLOAT, false, 0, 0);
        
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer_third);
        gl.vertexAttribPointer(shaderProgram.ColorAttribute, colorBuffer_third.itemSize,
          gl.FLOAT,false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer_third);

        // Do the drawing
        gl.drawElements(gl.TRIANGLES, triangleIndices_third.length, gl.UNSIGNED_BYTE, 0);
    }

    slider1.addEventListener("input",draw);
    slider2.addEventListener("input",draw);
    draw();
}
