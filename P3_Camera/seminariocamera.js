/**
 * Seminario 3. Ejemplo de multivista
 *
 */

// Variables usuales
let renderer, scene, camera;

// Camaras adicionales planta, alzado, perfil
let planta, alzado, perfil;

// Semilado de la caja ortográfica
let L = 3;

// Controlar la camara
let cameraControls;

function setCameras( aspectRatio ) {

    // Configurar las tres cámaras ortográficas
    let camaraOrtografica;

    // width > height so left and right have to be bigger than bottom and top
    if ( aspectRatio > 1 ) {

        camaraOrtografica = new THREE.OrthographicCamera(
            -L*aspectRatio, L*aspectRatio, L, -L, -100, 100
        );

    } else {

        // x_left, x_right, y_bottom, y_top, z_near, z_far
        camaraOrtografica = new THREE.OrthographicCamera(
            -L, L, L/aspectRatio, -L/aspectRatio, -100, 100
        );

    }

    // alzado, planta y perfil son objetos que derivan de Object3D

    // Alzado es visto frontalmente
    alzado = camaraOrtografica.clone();
    alzado.position.set( 0, 0, L );
    alzado.lookAt( 0, 0, 0 );

    // Planta es visto desde arriba
    planta = camaraOrtografica.clone();
    planta.position.set( 0, L, 0 );
    planta.lookAt( 0, 0, 0 );
    // Cambiar el vector up de la cámara porque por defecto
    // es en el eje Y y entonces no miraría hacia abajo
    planta.up = ( 0,0,-1 );

    // Perfil es visto desde el costado
    perfil = camaraOrtografica.clone();
    perfil.position.set( L, 0, 0 );
    perfil.lookAt( 0, 0, 0 );

    scene.add( alzado );
    scene.add( planta );
    scene.add( perfil );

}

function init() {

    // Configurar el canvas y el motor
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    // Definir color de borrado
    renderer.setClearColor( new THREE.Color(0x0000AA), 1.0 );

    document.body.appendChild( renderer.domElement );

    // Para que no se limpie la pantalla al renderear un frame
    // Esto hará que nosotros tengamos que llamar al renderer.clear() manualmente
    renderer.autoClear = false;

    // Escena
    scene = new THREE.Scene();

    // Camara
    let aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera( 75, aspectRatio, 0.1, 10000 );
    camera.position.set( 2, 2, 3 );
    // Irrelevante cuando añades el cameraControls
    //camera.lookAt( 0, 0, 0 );

    setCameras( aspectRatio );

    // Instanciar el camera controls
    cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
    // Indicar donde está el target
    cameraControls.target.set( 0, 0, 0 );

    // Captura de eventos
    window.addEventListener('resize', updateAspectRatio );

    // Capturar el doble click
    renderer.domElement.addEventListener( 'dblclick', rotateCube );

}

function rotateCube( event ) {

    // Capturar las coordenadas del click
    let x = event.clientX;
    let y = event.clientY;

    // Zona click
    let derecha = false, abajo = false;
    let cam = null;

    if ( x > window.innerWidth/2 ) {

        derecha = true;
        x -= window.innerWidth/2;

    }

    if ( y > window.innerHeight/2 ) {

        abajo = true;
        y -= window.innerHeight/2;

    }

    if ( derecha ) {
        if ( abajo )    cam = camera;
        else            cam = perfil;
    } else {
        if ( abajo )    cam = planta;
        else            cam = alzado;
    }

    // cam es la cámara que recibe el doble click

    // Normalizar a cuadrado de 2x2
    // Siempre un cuadrado de 2x2 para el ratón

    x = ( x * 4/window.innerWidth ) - 1;
    y = - ( y * 4/window.innerHeight ) + 1;

    // Construir el rayo que perfora desde la cámara al punto normalizado (2x2)
    let rayo = new THREE.Raycaster();
    rayo.setFromCamera( new THREE.Vector2(x,y), cam );

    // El true indica si se hace en profundidad, es decir, que no solo lo
    // haga con el primer nivel, sino de manera recursiva
    let intersecciones = rayo.intersectObjects( scene.children, true );

    // Si le hemos dado a algún objeto
    if ( intersecciones.length > 0 ) {

        // Cogemos el objeto más cercano y lo rotamos en el eje X
        intersecciones[0].object.rotation.x += Math.PI / 8;

    }

}

function loadScene() {

    // 5 cubos en tirereta

    let material = new THREE.MeshBasicMaterial( { color: "yellow", wireframe: true } );

    let geometria = new THREE.BoxGeometry( 0.9, 0.9, 0.9 );

    for ( let i = 0; i < 5; i++ ) {
        let cubo = new THREE.Mesh( geometria, material );
        cubo.position.set( -2+i, 0, 0 );
        scene.add( cubo );
    }

    scene.add( new THREE.AxesHelper( 3 ) );

}

function updateAspectRatio() {

    // Se dispara cuando se cambia el área de dibujo
    renderer.setSize( window.innerWidth, window.innerHeight );
    let aspectRatio = window.innerWidth/window.innerHeight;
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();

    // Para camaras adicionales

    if ( aspectRatio > 1 ) {

        alzado.left = perfil.left = planta.left = -L*aspectRatio;
        alzado.right = perfil.right = planta.right = L*aspectRatio;
        alzado.bottom = perfil.bottom = planta.bottom = -L;
        alzado.top = perfil.top = planta.top = L;

    } else {

        alzado.left = perfil.left = planta.left = -L;
        alzado.right = perfil.right = planta.right = L;
        alzado.bottom = perfil.bottom = planta.bottom = -L/aspectRatio;
        alzado.top = perfil.top = planta.top = L/aspectRatio;

    }

    alzado.updateProjectionMatrix();
    planta.updateProjectionMatrix();
    perfil.updateProjectionMatrix();

}

function update() {
}

function render() {

    requestAnimationFrame( render );

    update();

    renderer.clear();

    // Alzado
    renderer.setViewport( 0, 0, window.innerWidth/2, window.innerHeight/2 );
    renderer.render( scene, alzado );

    // Planta
    renderer.setViewport( 0, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2 );
    renderer.render( scene, planta );

    // Perfil
    renderer.setViewport( window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight/2 );
    renderer.render( scene, perfil );

    // Perspectiva
    renderer.setViewport( window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2 );
    renderer.render( scene, camera );

}

init();
loadScene();
render();
