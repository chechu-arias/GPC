//"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --allow-file-access-from-files

// Objetos estándar en Three.js
let renderer, scene, camera;

// Globales del seminario
let esferaCubo, angulo = 0;

function init() {

    // Instanciamos el motor, el canvas, la escena y la cámara

    // Motor
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( new THREE.Color(0x0000AA), 1.0 );

    document.getElementById("container").appendChild( renderer.domElement );

    // Escena
    scene = new THREE.Scene();

    // Cámara
    let aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera( 75, aspectRatio, 0.1, 1000 );
    camera.position.set( 0.5, 2, 7 );
    camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

}

function loadScene() {

    let material = new THREE.MeshBasicMaterial( {color:'yellow', wireframe: true} );
    let cubo = new THREE.Mesh( new THREE.BoxGeometry( 2,2,2 ), material );
    let esfera = new THREE.Mesh( new THREE.SphereGeometry(0.8, 20, 20), material );

    esferaCubo = new THREE.Object3D();
    esferaCubo.position.y = 1;
    cubo.position.x = -1;
    esfera.position.x = 1;
    esferaCubo.add( cubo );
    esferaCubo.add( esfera );
    cubo.add( new THREE.AxesHelper(1) );
    scene.add( esferaCubo );
    scene.add( new THREE.AxesHelper(3) );

    //Importar objetos externos
    let loader = new THREE.ObjectLoader();
    loader.load( 'webgl/models/soldado/soldado.json',
        function ( objeto ) {
            cubo.add(objeto);
            objeto.position.y = 1;
        }
    );

    let suelo = new THREE.Mesh( new THREE.PlaneGeometry( 10, 10, 10, 10 ), material );
    suelo.rotation.x = -Math.PI/2;
    scene.add(suelo);

}

function update() {

    angulo += 0.1;
    esferaCubo.rotation.y = angulo;

}

function render() {

    requestAnimationFrame( render );
    update();
    renderer.render( scene, camera );

}

init();
loadScene();
render();
