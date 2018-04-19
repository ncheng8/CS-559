var grobjects = grobjects || [];


var Pedastal = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all Pedastals - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Pedastals
    Pedastal = function Pedastal(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [.7,.8,.9];
    }
    Pedastal.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        // create the shaders once - for all Pedastals
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["tree-vs", "tree-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                    -.5,0,-.5,  .5,0,-.5,  .5, 1,-.5,        -.5,0,-.5,  .5, 0,-.5, -.5, 1,-.5,    // z = 0
                    -.5,0, .5,  .5,0, .5,  .5, 1, .5,        -.5,0, .5,  .5, 0, .5, -.5, 1, .5,    // z = 1
                    -.5,.25,-.5,  .5,.25,-.5,  .5,.25, .5,   -.5,.25,-.5,  .5,.25, .5, -.5,.25, .5,    // y = 0
                    //-.5, 1,-.5,  .5, 1,-.5,  .5, 1, .5,        //-.5, .5,-.5,  .5, .5, .5, -.5, .5, .5,    // y = 1
                    -.5,0,-.5, -.5, 0,.5, -.5, 1, .5,        -.5,0,-.5, -.5, 0, .5, -.5,1, -.5,    // x = 0
                     .5,0,-.5,  .5, 0,.5,  .5, 1, .5,         .5,0,-.5,  .5, 0, .5,  .5,1, -.5     // x = 1
                ] },
                vnormal : {numComponents:3, data: [
                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    //0,1,0, 0,1,0, 0,1,0,        //0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0
                ]}
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };
    Pedastal.prototype.draw = function(drawingState) {
        // we make a model matrix to place the Pedastal in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
		var theta = Number(drawingState.realtime)/500.0;
		twgl.m4.rotateY(modelM, -theta, modelM);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Pedastal.prototype.center = function(drawingState) {
        return this.position;
    }
})();
grobjects.push(new Pedastal("Pedastal1",[0,0,0],1, [1,0,1]));

