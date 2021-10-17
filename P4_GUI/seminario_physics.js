// https://opensource.google/projects/datgui

/**
 * Seminario 4. Ejemplo de animación e interfaz de usuario
 *              Peonza que se mueve en un plano
 */

// Variables usuales
let renderer, scene, camera;

// Controlar la camara
let cameraControls;

// Peonza
let peonza, eje;

// Control del tiempo
let antes = Date.now();
let angulo = 0;

// Monitor
let stats;

// GUI
let effectController;

function init() {

    // Configurar el canvas y el motor
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( new THREE.Color(0x0000AA), 1.0 );
    document.getElementById('container').appendChild( renderer.domElement );

    // Escena
    scene = new THREE.Scene();

    // Camara
    let aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera( 75, aspectRatio, 0.1, 10000 );
    camera.position.set( 2, 2, 3 );
    camera.lookAt( 0, 0, 0 );

    // Instanciar el camera controls
    cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
    cameraControls.target.set( 0, 0, 0 );

    // Captura de eventos
    window.addEventListener('resize', updateAspectRatio );

    // Display de las estadísticas (monitor)
    stats = new Stats();
    stats.showPanel(0);
    document.getElementById('container').appendChild( stats.domElement );

}

function setupGUI() {

    // Objeto controlador de la interfaz
    effectController = {
        mensaje: 'Interfaz Peonza',
        vueltasXsg: 1.0,
        reiniciar: function() {
            TWEEN.removeAll();
            eje.position.set( -2.5, 0, -2.5 );
            eje.rotation.set( 0, 0, 0 );
            startAnimation();
        },
        check: true,
        colorMaterial: "rgb(255,255,0)"
    };

    let gui = new dat.GUI();
    let carpeta = gui.addFolder("Control Peonza");

    carpeta.add(effectController, "mensaje").name("De locos la peonzita");
    carpeta.add(effectController, "vueltasXsg", 0.0, 5.0, 0.025).name("Girando de pirados");
    carpeta.add(effectController, "reiniciar").name("De reinicios perturbados");
    carpeta.add(effectController, "check").name("De Checkens chifladens");
    let sensorColor = carpeta.addColor(effectController, "colorMaterial").name("Coloring de dementes");

    sensorColor.onChange(
        function(color) {
            peonza.traverse(
                function(hijo) {
                    if (hijo instanceof THREE.Mesh)
                        hijo.material.color = new THREE.Color(color);
            })
        }
     );

}

function loadScene() {

    let material = new THREE.MeshBasicMaterial({color: 'yellow', wireframe: true});

    eje = new THREE.Object3D();
    peonza = new THREE.Object3D();

    // Construir la peonza
    let cuerpo = new THREE.Mesh( new THREE.CylinderGeometry( 1, 0.2, 2, 20, 2 ), material );

    cuerpo.position.set(0, 1.5, 0);
    peonza.add(cuerpo);

    let punta = new THREE.Mesh( new THREE.CylinderGeometry( 0.1, 0, 0.5, 10, 1 ) , material );

    punta.position.set(0, 0.25, 0);
    peonza.add(punta);

    let mango = new THREE.Mesh( new THREE.CylinderGeometry( 0.1, 0.1, 0.5, 10, 1 ) , material );
    mango.position.set(0, 2.75, 0);
    peonza.add(mango);

    peonza.rotation.x = Math.PI/16;

    eje.position.set( -2.5, 0, -2.5 );
    eje.add(peonza);

    scene.add(eje);
    scene.add( new THREE.AxesHelper(2) );

    // Suelo
    Coordinates.drawGrid( {size: 6, scale: 1, orientation: "x"} );


}

function startAnimation() {

    let movtIzq = new TWEEN.Tween( eje.position )
                    .to( {  x: [-1.5, -2.5],
                            y: [   0,    0],
                            z: [   0,  2.5] }, 5000 )
                    .interpolation( TWEEN.Interpolation.Bezier )
                    .easing( TWEEN.Easing.Bounce.Out );

    let movtFrente = new TWEEN.Tween( eje.position )
                    .to( {  x: [  0, 2.5],
                            y: [  0,   0],
                            z: [  0, 2.5] }, 5000 )
                    .interpolation( TWEEN.Interpolation.Bezier )
                    .easing( TWEEN.Easing.Bounce.Out );

    let movtDer = new TWEEN.Tween( eje.position )
                    .to( {  x: [ 1.5,  2.5],
                            y: [   0,    0],
                            z: [   0, -2.5] }, 5000 )
                    .interpolation( TWEEN.Interpolation.Bezier )
                    .easing( TWEEN.Easing.Bounce.Out );

    let movtTras = new TWEEN.Tween( eje.position )
                    .to( {  x: [    0, -2.5],
                            y: [    0,    0],
                            z: [ -1.5, -2.5] }, 5000 )
                    .interpolation( TWEEN.Interpolation.Bezier )
                    .easing( TWEEN.Easing.Bounce.Out );

    movtIzq.chain( movtFrente );
    movtFrente.chain( movtDer );
    movtDer.chain( movtTras );

    movtIzq.start();

    let giro = new TWEEN.Tween( eje.rotation )
                .to( { x:0, y:Math.PI*2, z:0 }, 10000 );

    giro.repeat(Infinity);

    giro.start();

}

function updateAspectRatio() {

    // Se dispara cuando se cambia el área de dibujo
    renderer.setSize( window.innerWidth, window.innerHeight );
    let aspectRatio = window.innerWidth/window.innerHeight;
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();

}

function update() {

    let ahora = Date.now();
    let vueltasXsg = effectController.vueltasXsg;
    angulo += vueltasXsg * Math.PI * 2 * (ahora-antes)/1000;
    peonza.rotation.y = angulo;
    //eje.rotation.y = angulo/5;
    antes = ahora;

    // Para que haga el muestreo
    TWEEN.update();

}

function render() {

    requestAnimationFrame( render );
    stats.begin();
    update();
    renderer.render(scene, camera);
    stats.end();

}

init();
setupGUI();
loadScene();
render();


/*
function setupGui() {

    effectController = {
        mensaje: 'Interfaz',
        giroY: 0.0,
        separacion: [],
        sombras: true,
        colorEsfera: "rgb(255,0,0)"
    };

    let gui = new dat.GUI();

    let h = gui.addFolder("Control esferaCubo");
    h.add(effectController, "mensaje").name("Aplicacion");
    h.add(effectController, "giroY", -180.0, 180.0, 0.025).name("Giro en Y");
    h.add(effectController, "separacion", {Ninguna: 0, Media: 2, Total: 5}).name("Separacion");
    h.add(effectController, "sombras").name("Sombras");
    h.addColor(effectController, "colorEsfera").name("Color Esfera");
}
*/