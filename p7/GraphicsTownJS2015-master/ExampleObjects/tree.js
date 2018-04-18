var grobjects = grobjects || [];

var Tree = undefined;

(function() {
	"use strict";
	var shaderProgram = undefined;
	var buffers = undefined;
	var textures = undefined;
	
	Tree = function Tree(name, position, size, height, color) {
		this.name = name;
		this.position = position || [0,0,0];
		this.size = size || 1.0;
		this.height = height || 1.0;
		this.color = color || [.7, .8, .9];
	}
	Tree.prototype.init = function(drawingState) {
		var gl = drawingState.gl;
		if (!shaderProgram) {
			shaderProgram = twgl.createProgramInfo(gl, ["tree-vs", "tree-fs"]);
		}
		if (!buffers) {
			var arrays = {
				vpos : {numComponents: 3, data: [
				//trunk
				-.25,0.0,-.25,  .25,0.0,-.25,  .25,.5,-.25,        -.25,0.0,-.25,  .25,.5,-.25, -.25,.5,-.25,    // back
                -.25,0.0, .25,  .25,0.0, .25,  .25,.5, .25,        -.25,0.0, .25,  .25,.5, .25, -.25,.5, .25,    // front
                -.25,0.0,-.25,  .25,0.0,-.25,  .25,0.0, .25,        -.25,0.0,-.25,  .25,0.0, .25, -.25,0.0, .25,    // bottom
                -1.0,.5,-1.0,	1.0,.5,-1.0,	1.0,.5,1.0,    	-1.0,.5,-1.0,  1.0,.5, 1.0, -1.0,.5, 1.0,    //top: note bottom of tree leaves
                -.25,0.0,-.25, -.25,.5,-.25, -.25,.5, .25,        -.25,0.0,-.25, -.25,.5, .25, -.25,0.0, .25,    // left
                 .25,0.0,-.25,  .25,.5,-.25,  .25,.5, .25,         .25,0.0,-.25,  .25,.5, .25,  .25,0.0, .25,     // right
				 
				// leaves
				-1.0,.5,1.0,	1.0,.5,1.0,	0.0,2.0,0.0,	//front
				-1.0,.5,-1.0,	1.0,.5,-1.0,	0.0,2.0,0.0,	//back
				-1.0,.5,-1.0,	-1.0,.5,1.0,   0.0,2.0,0.0,	//left
				1.0,.5,-1.0,	1.0,.5,1.0,    0.0,2.0,0.0	//right
				]},
				
				vnormal : {numComponents: 3, data: [
				//trunk
				0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,	//top, new normal
                -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,
				
				//leaves 
				0,1,1, 0,1,1, 0,1,1,
				0,1,-1, 0,1,-1, 0,1,-1,
				-1,1,0, -1,1,0, -1,1,0,
				1,1,0, 1,1,0, 1,1,0
				]}
				/*vtex : {numComponents:2, data: [
				
				
				]}*/
			};
			buffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);
		}
		/*if (!textures) {
			texture = twgl.createTexture(gl, {
				src:
		}*/
	};
	Tree.prototype.draw = function(drawingState) {
		var modelM = twgl.m4.scaling([this.size, this.size, this.size]);
		twgl.m4.scale(modelM, [this.size, this.height, this.size], modelM);
		twgl.m4.setTranslation(modelM,this.position,modelM);
		var gl = drawingState.gl;
		gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
	Tree.prototype.center = function(drawingState) {
		return this.position;
    }
})();
			grobjects.push(new Tree("tree1", [0,0,4], 1, 1, [1,1,.2]));
			grobjects.push(new Tree("tree2", [0,0,-4], 1, 1, [1,1,.2]));
			grobjects.push(new Tree("tree3", [4,0,0], 1, 1, [1,1,.2]));
			grobjects.push(new Tree("tree4", [-4,0,0], 1, 1, [1,1,.2]));
			
			grobjects.push(new Tree("tree5", [4,0,4], 1, 2, [0,1,.2]));
			grobjects.push(new Tree("tree6", [4,0,-4], 1, 2, [0,1,.2]));
			grobjects.push(new Tree("tree7", [-4,0,4], 1, 2, [0,1,.2]));
			grobjects.push(new Tree("tree8", [-4,0,-4], 1, 2, [0,1,.2]));