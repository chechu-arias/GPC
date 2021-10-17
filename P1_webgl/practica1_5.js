//DOESNT WORK

let VSHADER_SOURCE =
    `
    attribute vec3 position; +
    void main() {
        gl_Position = vec4( position, 1.0 );
        gl_PointSize = 10.0;
    }
    `;

let FSHADER_SOURCE =
    `
    uniform highp vec2 resolucion;
    uniform highp vec3 color;
    void main(){
        highp vec2 centro = resolucion.xy / 2.0;
        highp vec2 coordcentro = gl_FragCoord.xy - centro.xy;
        highp float maxdistancia = dot(centro, centro);
        highp float distancia = dot(coordcentro, coordcentro);
        distancia = max(0.0, 1.0 - sqrt(distancia/maxdistancia) );
        gl_FragColor = vec4(distancia, distancia, 0.0, 1.0);
    }
    `;


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

    gl.clearColor( 0.0, 0.0, 0.5, 1.0 );

    gl.clear( gl.COLOR_BUFFER_BIT );

    let coordenadas = gl.getAttribLocation( gl.program, 'position' );

    let bufferCoordenadas = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferCoordenadas );
    gl.vertexAttribPointer( coordenadas, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( coordenadas );

    let resolucion = gl.getUniformLocation(gl.program, 'resolucion');

    gl.uniform2f(resolucion, canvas.width, canvas.height);

    canvas.onmousedown = function( evento ) { click( evento, gl, canvas ); };

}

let puntos = [];

function click( evento, gl, canvas ) {

    let x = evento.clientX;
    let y = evento.clientY;

    let rect = evento.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2) * 2/canvas.width;
    y = (canvas.height/2 - (y - rect.top)) * 2/canvas.height;

    puntos.push(x);
    puntos.push(y);
    puntos.push(0.0);

    render( gl );

}

function render( gl ) {

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(puntos), gl.STATIC_DRAW );

    gl.drawArrays( gl.POINTS, 0, puntos.length/3 );

    gl.drawArrays( gl.LINE_STRIP, 0, puntos.length/3 );

}