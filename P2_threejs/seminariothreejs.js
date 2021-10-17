

// Objetos estándar en Three.js
let renderer, scene, camera;

function init() {

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( new THREE.Color(0x0000AA), 1.0 );

    document.body.appendChild( renderer.domElement );

    scene = new THREE.Scene();

    let aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera( 75, aspectRatio, 0.1, 100 );
    camera.position.set( 2, 1, 6 );

}

function loadSceneIntro() {

    let geometria = new THREE.TetrahedronGeometry();
    let material = new THREE.MeshBasicMaterial( {color:0xFF0000, wireframe: true} );
    let tetraedro = new THREE.Mesh( geometria, material );

    scene.add(tetraedro);

}

function loadSceneEsferaCubo() {

    let geometriaCubo = new THREE.CubeGeometry( 2, 2, 2 );
    let geometriaEsfera = new THREE.SphereGeometry( 1 );
    let material = new THREE.MeshBasicMaterial( {color:0xFF0000, wireframe: true} );
    let cubo = new THREE.Mesh( geometriaCubo, material );
    let esfera = new THREE.Mesh( geometriaEsfera, material );
    let esferaCubo = new THREE.Object3D();

    esferaCubo.add(cubo);
    esferaCubo.add(esfera);
    scene.add(esferaCubo);

}

function loadParaguas() {

    let material = new THREE.MeshBasicMaterial( {color:"red", wireframe: true} );

    let ms = new THREE.Matrix4();
    let mt = new THREE.Matrix4();

    let tela = new THREE.Mesh( new THREE.CylinderGeometry( 0.0, 1.0, 1.0 ), material );
    tela.matrixAutoUpdate = false;

    mt.makeTranslation( 0, 1.5, 0 );
    ms.makeScale( 2, 0.5, 2 );

    tela.matrix = mt.multiply( ms );

    let baston = new THREE.Mesh( new THREE.CylinderGeometry( 1, 1, 1 ), material );

    baston.position.y = 0.5;
    baston.scale.set ( 0.05, 3, 0.05 );

    let mango = new THREE.Mesh( new THREE.CubeGeometry( 1, 1, 1 ), material );

    mango.scale.set( 0.2, 0.4, 0.2 );
    mango.position.set( 0, -1, 0 );

    paraguas = new THREE.Object3D();
    paraguas.add( tela );
    paraguas.add( baston );
    paraguas.add( mango );
    paraguas.position.set( 1.6, 0, 0 );
    paraguas.rotation.x = Math.PI/6;

    scene.add( paraguas );

}

let antes = Date.now();
let angulo = 0;

function update() {

    /*
    let ahora = Date.now();
    angulo += Math.PI/30 * (ahora-antes)/1000;
    antes = ahora;
    paraguas.rotation.y = angulo;
    */

}

function render() {

    requestAnimationFrame( render );
    update();
    renderer.render( scene, camera );

}

init();
loadSceneIntro();
render();
