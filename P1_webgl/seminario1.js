

let VSHADER_SOURCE =
'attribute vec4 position;\n' + // attribute variable
'attribute float size;\n' +
'void main() {\n' +
'gl_Position = position;\n' +
'gl_PointSize = size;\n' +
'}';

let FSHADER_SOURCE =
'precision mediump float;\n' +
'uniform highp vec3 color;\n' +
'void main(){  \n' +
'gl_FragColor = vec4( color, 1.0 ); \n' +
'}\n';


function main() {

    let canvas = document.getElementById('canvas');

    if (!canvas) {
        console.log("ERROR CANVAS");
        return ;
    }

    let gl = getWebGLContext(canvas);

    if (!gl) {
        console.log("ERROR GL CONTEXT");
        return ;
    }

    if ( !initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE) ) {
        console.log("ERROR INIT SHADERS");
        return ;
    }

    gl.clearColor( 0.0, 0.0, 0.3, 1.0 );

    gl.clear( gl.COLOR_BUFFER_BIT );

    let coordenadas = gl.getAttribLocation( gl.program, 'position' );

    let size = gl.getAttribLocation( gl.program, 'size' );

    let color = gl.getUniformLocation( gl.program, 'color' );

    canvas.onmousedown = function( evento ) { click( evento, gl, canvas, coordenadas, size, color ); };

}

let puntos = [];

function click( evento, gl, canvas, coordenadas, size, color ) {

    let x = evento.clientX;
    let y = evento.clientY;
    let rect = evento.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2) * 2/canvas.width;
    y = (canvas.height/2 - (y - rect.top)) * 2/canvas.height;

    puntos.push(x);
    puntos.push(y);

    gl.clear(gl.COLOR_BUFFER_BIT);

    let distance_to_origin, size_v, color_v = null;

    for( let i = 0; i < puntos.length; i += 2) {

        gl.vertexAttrib3f( coordenadas, puntos[i], puntos[i+1], 0.0 );

        distance_to_origin = Math.sqrt(puntos[i]*puntos[i] + puntos[i+1]*puntos[i+1]);

        size_v = (1/distance_to_origin)+5;
        color_v = 1-(distance_to_origin/Math.sqrt(2));

        gl.uniform3f( color, color_v, color_v, color_v );
        gl.vertexAttrib1f( size, size_v );

        gl.drawArrays( gl.POINTS, 0, 1 );

    }

}