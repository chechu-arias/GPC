
let renderer, scene, camera;

let planta;
let L = 100;

let cameraControls;

let robot, base, brazo, antebrazo, mano, pinza1, pinza2;

// Monitor
let stats;

// GUI
let effectController;

// Keyboard
let keyboard;
let movement_dist = 10;

function setMiniCamera() {

    let camaraOrtografica = new THREE.OrthographicCamera(-L, L, L, -L, 0, L*3);

    planta = camaraOrtografica.clone();
    planta.position.set( 0, L*2.25, 0 );
    planta.lookAt( 0, 0, 0 );
    planta.up = ( 0,0,-1 );

    scene.add( planta );

}

function init() {

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( new THREE.Color(0xFFFFFF), 1.0 );
    document.body.appendChild( renderer.domElement );

    renderer.autoClear = false;

    scene = new THREE.Scene();

    let aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera( 75, aspectRatio, 0.1, 10000 );
    camera.position.set( -10, 250, -275 );

    setMiniCamera();

    cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
    cameraControls.target.set( 0, 0, 0 );
    cameraControls.enableKeys = false;

    window.addEventListener('resize', updateAspectRatio );

    // Display de las estadísticas (monitor)
    stats = new Stats();
    stats.showPanel(1);
    //document.body.appendChild( stats.domElement );

    // Keyboard

    keyboard = new THREEx.KeyboardState();
    renderer.domElement.setAttribute("tabIndex", "0");
    renderer.domElement.focus();

    document.addEventListener('keydown', function (event) {
        if ( keyboard.eventMatches(event, 'a') || keyboard.eventMatches(event, 'left') ) {
            robot.position.x += movement_dist;
        }
        if ( keyboard.eventMatches(event, 'd') || keyboard.eventMatches(event, 'right') ) {
            robot.position.x -= movement_dist;
        }
        if ( keyboard.eventMatches(event, 's') || keyboard.eventMatches(event, 'down') ) {
            robot.position.z -= movement_dist;
        }
        if ( keyboard.eventMatches(event, 'w') || keyboard.eventMatches(event, 'up') ) {
            robot.position.z += movement_dist;
        }
    })

    // Add listeners?

}

function setupGUI() {

    // Objeto controlador de la interfaz
    effectController = {
        mensaje: 'Interfaz del Robot',
        giro_base_y: 0,
        giro_brazo_z: 0,
        giro_antebrazo_y: 0,
        giro_antebrazo_z: 0,
        giro_pinza_z: 0,
        distancia_pinza_z: 15,
        colorMaterial: "rgb(255, 0, 0)"
    };

    let gui = new dat.GUI();
    let carpeta = gui.addFolder("Control del Robot");

    carpeta.add(effectController, "giro_base_y", -180.0, 180.0, 1).name("Giro de la base");
    carpeta.add(effectController, "giro_brazo_z", -45.0, 45.0, 1).name("Giro del brazo");
    carpeta.add(effectController, "giro_antebrazo_y", -180.0, 180.0, 1).name("Giro del antebrazo en Y");
    carpeta.add(effectController, "giro_antebrazo_z", -90.0, 90.0, 1).name("Giro del antebrazo en Z");
    carpeta.add(effectController, "giro_pinza_z", -40.0, 220.0, 1).name("Giro de la pinza");
    carpeta.add(effectController, "distancia_pinza_z", 0.0, 15.0, 1).name("Distancia de las pinzas entre sí");


    let sensorColor = carpeta.addColor(effectController, "colorMaterial").name("Color del robot");

    sensorColor.onChange(
        function(color) {
            robot.traverse(
                function(hijo) {
                    if (hijo instanceof THREE.Mesh)
                        hijo.material.color = new THREE.Color(color);
            })
        }
     );

}

function loadRobot() {

    let material = new THREE.MeshBasicMaterial( {color:"red", wireframe: true} );

    let suelo = new THREE.Mesh( new THREE.PlaneGeometry( 1000, 1000, 10, 10 ),
                                new THREE.MeshBasicMaterial( {color:"red", wireframe: true} ) );
    suelo.position.set(0, 0, 0);
    suelo.rotation.x = -Math.PI/2;
    suelo.rotation.z = Math.PI/4;

    let baseCilindro = new THREE.Mesh( new THREE.CylinderGeometry( 50, 50, 15, 40 ), material );

    let brazoEsfera = new THREE.Mesh( new THREE.SphereGeometry( 20, 20, 20 ), material );
    brazoEsfera.position.set(0, 120, 0);

    let brazoCaja = new THREE.Mesh( new THREE.BoxGeometry( 18, 120, 12 ), material );
    brazoCaja.position.set(0, 60, 0);

    let brazoCilindro = new THREE.Mesh( new THREE.CylinderGeometry( 20, 20, 18, 40 ), material );
    brazoCilindro.rotation.x = Math.PI/2;
    brazoCilindro.rotation.z = Math.PI/5;

    let antebrazoBase = new THREE.Mesh( new THREE.CylinderGeometry( 22, 22, 6, 40 ), material );

    let antebrazoNervioGeometria = new THREE.BoxGeometry( 4, 80, 4 );

    let antebrazoNervio1 = new THREE.Mesh( antebrazoNervioGeometria, material );
    antebrazoNervio1.position.set(4, 40, 4);

    let antebrazoNervio2 = new THREE.Mesh( antebrazoNervioGeometria, material );
    antebrazoNervio2.position.set(4, 40, -4);

    let antebrazoNervio3 = new THREE.Mesh( antebrazoNervioGeometria, material );
    antebrazoNervio3.position.set(-4, 40, 4);

    let antebrazoNervio4 = new THREE.Mesh( antebrazoNervioGeometria, material );
    antebrazoNervio4.position.set(-4, 40, -4);

    let antebrazoCilindro = new THREE.Mesh( new THREE.CylinderGeometry( 15, 15, 40, 40 ), material );
    antebrazoCilindro.position.set(0, 0, 0);
    antebrazoCilindro.rotation.x = Math.PI/2;
    //antebrazoCilindro.rotation.z = Math.PI/5;

    let pinzas_coordenadas = [
        0, 0, 0,
        0, 0, 4,
        0, 20, 0,
        0, 20, 4,
        19, 0, 0,
        19, 0, 4,
        19, 20, 0,
        19, 20, 4,
        38, 3, 0,
        38, 3, 2,
        38, 17, 0,
        38, 17, 2
    ];

    let pinzas_indices = [
        0,2,1, 0,3,2,
        0,2,6, 0,6,4,
        0,1,4, 0,5,4,
        7,6,3, 7,2,3,
        7,5,1, 7,5,3,
        7,11,10, 7,10,6,
        7,11,9, 7,9,5,
        8,4,5, 8,5,9,
        8,10,11, 8,11,9,
        8,4,6, 8,6,10
    ]

    let pinza1_geometry = new THREE.Geometry();

    for (let i = 0; i < pinzas_coordenadas.length; i += 3) {
        let vertice = new THREE.Vector3( pinzas_coordenadas[i], pinzas_coordenadas[i+1], pinzas_coordenadas[i+2] );
        pinza1_geometry.vertices.push( vertice );
    }

    for (let i = 0; i < pinzas_indices.length; i += 3) {
        let triangulo = new THREE.Face3( pinzas_indices[i], pinzas_indices[i+1], pinzas_indices[i+2] );
        pinza1_geometry.faces.push(triangulo);
    }

    pinza1 = new THREE.Mesh( pinza1_geometry, material );
    pinza1.position.set( 0, -10, 19 );
    pinza1.rotation.y = Math.PI;

    pinza2 = new THREE.Mesh( pinza1_geometry, material );
    pinza2.position.set( 0, -10, -16 );
    pinza2.rotation.y = Math.PI;

    robot = new THREE.Object3D();
    base = new THREE.Object3D();
    brazo = new THREE.Object3D();
    antebrazo = new THREE.Object3D();
    antebrazo.position.y = 120;
    mano = new THREE.Object3D();
    mano.position.y = 80;

    robot.add(base);

    base.add(baseCilindro);
    base.add(brazo);

    brazo.add(brazoEsfera);
    brazo.add(brazoCaja);
    brazo.add(brazoCilindro);
    brazo.add(antebrazo);

    antebrazo.add(antebrazoNervio1);
    antebrazo.add(antebrazoNervio2);
    antebrazo.add(antebrazoNervio3);
    antebrazo.add(antebrazoNervio4);
    antebrazo.add(antebrazoBase);
    antebrazo.add(mano);

    mano.add(antebrazoCilindro);
    mano.add(pinza1);
    mano.add(pinza2);

    robot.position.set( 0, 0, 0 );

    scene.add(suelo);
    scene.add(robot);

}

function updateAspectRatio() {

    renderer.setSize( window.innerWidth, window.innerHeight );
    let aspectRatio = window.innerWidth/window.innerHeight;
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();

    planta.left = -L;
    planta.right = L;
    planta.bottom = -L;
    planta.top = L;

    planta.updateProjectionMatrix();

}

function update() {

    // No hace nada?
    cameraControls.update();

    base.rotation.y = effectController.giro_base_y*Math.PI/180;
    brazo.rotation.z = effectController.giro_brazo_z*Math.PI/180;
    antebrazo.rotation.y = effectController.giro_antebrazo_y*Math.PI/180;
    antebrazo.rotation.z = effectController.giro_antebrazo_z*Math.PI/180;
    mano.rotation.z = effectController.giro_pinza_z*Math.PI/180;
    pinza1.position.z = ( effectController.distancia_pinza_z + 4 );
    pinza2.position.z = ( - effectController.distancia_pinza_z - 1 );

}

function render() {

    requestAnimationFrame( render );
    stats.begin();
    renderer.clear();
    update();
    renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );

    let aspectRatio = window.innerWidth/window.innerHeight;

    if (aspectRatio > 1)    renderer.setViewport( 0, 0, window.innerHeight/4, window.innerHeight/4 );
    else                    renderer.setViewport( 0, 0, window.innerWidth/4, window.innerWidth/4 );
    renderer.render( scene, planta );
    stats.end();

}

init();
setupGUI();
loadRobot();
render();
