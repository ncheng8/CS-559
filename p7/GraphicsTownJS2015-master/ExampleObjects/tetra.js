var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var Tetra = undefined;
var SpinningTetra = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";
    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Tetras
    Tetra = function Tetra(name, position, size, stretch, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
		this.stretch = stretch || 1.0;
        this.color = color || [.7,.8,.9];
    }
    Tetra.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        // create the shaders once - for all Tetras
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
					// bottom half
                    .5,0,.5,	-.5,0,.5,	0,-.5,0,
					-.5,0,.5,	-.5,0,-.5,	0,-.5,0,
					-.5,0,-.5,	.5,0,-.5,	0,-.5,0,
					.5,0,-.5,	.5,0,.5,	0,-.5,0,
					
					//top half
					.5,0,.5,	-.5,0,.5,	0,.5,0,
					-.5,0,.5,	-.5,0,-.5,	0,.5,0,
					-.5,0,-.5,	.5,0,-.5,	0,.5,0,
					.5,0,-.5,	.5,0,.5,	0,.5,0,
                ] },
                vnormal : {numComponents:3, data: [
                    0,-1,1,		0,-1,1,		0,-1,1,
					-1,-1,0,	-1,-1,0,	-1,-1,0,
					0,-1,-1,	0,-1,-1,	0,-1,-1,
					1,-1,0,		1,-1,0,		1,-1,0,
					
					0,1,1,		0,1,1,		0,1,1,
					-1,1,0,		-1,1,0,		-1,1,0,
					0,1,-1,		0,1,-1,		0,1,-1,
					1,1,0,		1,1,0,		1,1,0,
                ]}
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };
    Tetra.prototype.draw = function(drawingState) {
        // we make a model matrix to place the Tetra in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
		twgl.m4.scale(modelM, [this.size, this.stretch, this.size], modelM);
		var theta = Number(drawingState.realtime)/200.0;
        twgl.m4.rotateY(modelM, theta, modelM);
        twgl.m4.setTranslation(modelM,this.position,modelM);
		var bob = 100 * Math.sin(Number(drawingState.realtime) * Math.PI * 2);
		var newPos = [this.position[0], bob + this.position[1], this.position[2]];
		twgl.m4.setTranslation(modelM, newPos, modelM);
		//twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Tetra.prototype.center = function(drawingState) {
        return this.position;
    }
})();
grobjects.push(new Tetra("Tetra1",[0,2,0],1,1,[0,1,1]) );

