let renderer, scene, camera;

// Monitor
let stats;

// GUI
let effectController;

let keyboard;
let movement_dist = 10;

let diana;

let dart;

let dartboard_light;

let dartboard_camera;

let dart_thrown = false;
let number_of_darts_thrown = 0;
function loadPunctuation(){

    var fontLoader = new THREE.FontLoader();
    fontLoader.load("../webgl/fonts/helvetiker_regular.typeface.json",function(tex){
        var  textGeo = new THREE.TextGeometry('Lanzamientos: ' + number_of_darts_thrown, {
                size: 2,
                height: 0,
                curveSegments: 6,
                font: tex,
        });
        var  textMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
        text = new THREE.Mesh(textGeo , textMaterial);
        text.scale.set(5,5,5);
        text.position.set(-140, 125 , -199);
        scene.add(text);
    });
}

// Movement and player idea from SO (https://stackoverflow.com/questions/52240901/three-js-a-and-d-movement-in-first-person-controls)
// but fixed some errors
let player;
let movement_speed = 0.8;
let rotation_speed = 0.002;

function init() {

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( new THREE.Color(0x00AAAA), 1.0 );
    document.body.appendChild( renderer.domElement );

    renderer.autoClear = false;

    scene = new THREE.Scene();

    let aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera( 75, aspectRatio, 0.1, 10000 );
    camera.position.set(0, 0, 0);

    player = new THREE.Object3D();
    player.position.set(0, 50, 0);
    player.add(camera);
    scene.add(player);

    setDartboardCamera();

    window.addEventListener('resize', updateAspectRatio );

    // Display de las estadísticas (monitor)
    stats = new Stats();
    stats.showPanel(1);
    //document.body.appendChild( stats.domElement );


    renderer.domElement.onclick = () =>
    renderer.domElement.requestPointerLock()
    document.addEventListener('pointerlockchange', lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

    // Keyboard

    keyboard = new THREEx.KeyboardState();
    renderer.domElement.setAttribute("tabIndex", "0");
    renderer.domElement.focus();

    document.addEventListener('keydown', function (event) {
        if ( keyboard.eventMatches(event, 'e') ) {
            let vector = new THREE.Vector3();
            let angle = camera.getWorldDirection(vector).y * 180;
            if (angle > 0) {
                dart = createDart();
                dart_thrown = true;
                number_of_darts_thrown++;
                dart.rotation.y = -Math.PI/2;
                dart.position.set(player.position.x-2, player.position.y-1, player.position.z-2);
                scene.add(dart);
                throwDart(angle, dart);
            }
        }

        if ( keyboard.eventMatches(event, 'z') ) {
            dart = createDart();
            dart.rotation.y = -Math.PI/2;
            dart.position.set(player.position.x-2, player.position.y-1, player.position.z-2);
            scene.add(dart);
        }
    })


    // Shadow setting

    renderer.shadowMap.enabled = true;
    renderer.antialias = true;

    //renderer.gammaOutput = true;
    //renderer.gammaFactor = 1.5;

    // Ilumination

    let luzAmbiente = new THREE.AmbientLight( 0xffffff, 0.4 );
    scene.add(luzAmbiente);

    dartboard_light = new THREE.SpotLight( 0xffffff, 0.7 );
    dartboard_light.position.set( -100, 60, -125 );
    dartboard_light.target.position.set( -100, 60, -199 );
    dartboard_light.angle = Math.PI/4;
    dartboard_light.penumbra = 0.3;
    dartboard_light.castShadow = true;
    dartboard_light.shadow.camera.far = 200;
    scene.add(dartboard_light.target);
    scene.add(dartboard_light);

    let pooltable_light = new THREE.SpotLight( 0xffffff, 0.4 );
    pooltable_light.position.set( 75, 100, -25 );
    pooltable_light.target.position.set( 75, 0, -25 );
    pooltable_light.angle = Math.PI/3;
    pooltable_light.penumbra = 0.3;
    pooltable_light.castShadow = true;
    pooltable_light.shadow.camera.far = 200;
    scene.add(pooltable_light.target);
    scene.add(pooltable_light);

    scene.add(THREE.AxisHelper(100));

}

function setupGUI() {

    // Objeto controlador de la interfaz
    effectController = {
        mensaje: 'Interfaz del Robot',
        player_speed: movement_speed,
        dart_speed: throwing_speed,
        dart_color: "rgb(255, 0, 0)"/*,
        giro_brazo_z: 0,
        giro_antebrazo_y: 0,
        giro_antebrazo_z: 0,
        giro_pinza_z: 0,
        distancia_pinza_z: 15,
        colorMaterial: "rgb(255, 0, 0)"*/
    };

    let gui = new dat.GUI();
    let carpeta = gui.addFolder("Control del Robot");

    carpeta.add(effectController, "player_speed", 0.2, 4.0, 0.1).name("Velocidad del movimiento");
    carpeta.add(effectController, "dart_speed", 25, 40, 1).name("Velocidad de lanzamiento del dardo");

    /*carpeta.add(effectController, "giro_brazo_z", -45.0, 45.0, 1).name("Giro del brazo");
    carpeta.add(effectController, "giro_antebrazo_y", -180.0, 180.0, 1).name("Giro del antebrazo en Y");
    carpeta.add(effectController, "giro_antebrazo_z", -90.0, 90.0, 1).name("Giro del antebrazo en Z");
    carpeta.add(effectController, "giro_pinza_z", -40.0, 220.0, 1).name("Giro de la pinza");
    carpeta.add(effectController, "distancia_pinza_z", 0.0, 15.0, 1).name("Distancia de las pinzas entre sí");*/


    let sensorColor = carpeta.addColor(effectController, "dart_color").name("Color de los dardos");
    sensorColor.onChange(
        function(color) {
            material_punta = new THREE.MeshLambertMaterial( { color:color, side: THREE.DoubleSide } );
        }
     );

}

function create_wall_with_mid_gap() {

    let path_paredes = './images/wall/';

    let material_paredes = new THREE.MeshStandardMaterial({
        aoMap: new THREE.TextureLoader().load(path_paredes + 'ao.jpg'),
        normalMap: new THREE.TextureLoader().load(path_paredes + 'norm.png'),
        roughnessMap: new THREE.TextureLoader().load(path_paredes + 'rough.jpg'),
        map: new THREE.TextureLoader().load(path_paredes + 'ao.jpg'),
        lightMapIntensity: 0.1
    });

    let parte_izquierda = new THREE.Mesh( new THREE.PlaneGeometry( 75, 200, 10, 10 ), material_paredes );
    parte_izquierda.position.set(-125, 0, 0);

    let parte_centro = new THREE.Mesh( new THREE.PlaneGeometry( 75, 200, 10, 10 ), material_paredes );
    parte_centro.position.set(0, 0, 0);

    let parte_derecha = new THREE.Mesh( new THREE.PlaneGeometry( 75, 200, 10, 10 ), material_paredes );
    parte_derecha.position.set(125, 0, 0);

    let parte_debajo = new THREE.Mesh( new THREE.PlaneGeometry( 400, 40, 10, 10 ), material_paredes );
    parte_debajo.position.set(0, -80, 0);

    let wall = new THREE.Object3D();
    wall.add(parte_izquierda);
    wall.add(parte_centro);
    wall.add(parte_derecha);
    wall.add(parte_debajo);

    return wall;

}

function loadScene() {

    // Materiales
    let path_suelo = './images/floor/';
    let path_paredes = './images/wall/';
    let path_techo = './images/ceiling/';

    let material_suelo = new THREE.MeshStandardMaterial({
        aoMap: new THREE.TextureLoader().load(path_suelo + 'ao.jpg'),
        displacementMap: new THREE.TextureLoader().load(path_suelo + 'disp.jpg'),
        normalMap: new THREE.TextureLoader().load(path_suelo + 'norm.jpg'),
        map: new THREE.TextureLoader().load(path_suelo + 'rough.jpg')
    });

    let material_paredes = new THREE.MeshStandardMaterial({
        aoMap: new THREE.TextureLoader().load(path_paredes + 'ao.jpg'),
        normalMap: new THREE.TextureLoader().load(path_paredes + 'norm.png'),
        roughnessMap: new THREE.TextureLoader().load(path_paredes + 'rough.jpg'),
        map: new THREE.TextureLoader().load(path_paredes + 'ao.jpg'),
        lightMapIntensity: 0.1
    });

    let material_techo = new THREE.MeshStandardMaterial({
        aoMap: new THREE.TextureLoader().load(path_techo + 'ao.jpg'),
        normalMap: new THREE.TextureLoader().load(path_techo + 'norm.jpg'),
        roughnessMap: new THREE.TextureLoader().load(path_techo + 'rough.jpg'),
        map: new THREE.TextureLoader().load(path_techo + 'color.jpg')
    });

    let suelo = new THREE.Mesh( new THREE.PlaneGeometry( 400, 400, 10, 10 ), material_suelo );
    suelo.position.set(0, 0, 0);
    suelo.rotation.x = -Math.PI/2;

    let pared_frontal = new THREE.Mesh( new THREE.PlaneGeometry( 400, 200, 10, 10 ), material_paredes );
    pared_frontal.position.set(0, 100, -200);

    //let pared_izquierda = new THREE.Mesh( new THREE.PlaneGeometry( 400, 200, 10, 10 ), material_paredes );
    let pared_izquierda = create_wall_with_mid_gap();
    pared_izquierda.position.set(-200, 100, 0);
    pared_izquierda.rotation.y = Math.PI/2;

    //let pared_derecha = new THREE.Mesh( new THREE.PlaneGeometry( 400, 200, 10, 10 ), material_paredes );
    let pared_derecha = create_wall_with_mid_gap();
    pared_derecha.position.set(200, 100, 0);
    pared_derecha.rotation.y = -Math.PI/2;

    //let pared_trasera = new THREE.Mesh( new THREE.PlaneGeometry( 400, 200, 10, 10 ), material_paredes );
    let pared_trasera = create_wall_with_mid_gap();
    pared_trasera.position.set(0, 100, 200);
    pared_trasera.rotation.y = Math.PI;

    let techo = new THREE.Mesh( new THREE.PlaneGeometry( 400, 400, 10, 10 ), material_techo );
    techo.position.set(0, 200, 0);
    techo.rotation.x = Math.PI/2;

    scene.add(suelo);
    scene.add(pared_frontal);
    scene.add(pared_izquierda);
    scene.add(pared_derecha);
    scene.add(pared_trasera);
    scene.add(techo);

    let path = "images/outside/";
    let walls = [
        path + "posx.jpg", path + "negx.jpg",
        path + "posy.jpg", path + "negy.jpg",
        path + "posz.jpg", path + "negz.jpg"
    ];
    let mapaEntorno = new THREE.CubeTextureLoader().load( walls );
    let shader = THREE.ShaderLib.cube;
    shader.uniforms.tCube.value = mapaEntorno;
    let wallsMaterial = new THREE.ShaderMaterial({

        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide

    });
    let habitacion = new THREE.Mesh( new THREE.BoxGeometry(10000, 10000, 10000), wallsMaterial );
    scene.add(habitacion);



    diana = createDartboard();
    diana.position.set(-100, 60, -199);
    scene.add(diana);

    load3DElement( './3ds/pooltable/scene.gltf', 5, 75, 1, -100 );
    load3DElement( './3ds/footballtable/scene.gltf', 0.6, 75, 25, 50 );

    let pilar = createPilar(true);
    pilar.position.set(-100, 100, 150);

    let pilar2 = createPilar(false);
    pilar2.position.set(100, 100, 150);

    scene.add(pilar);
    scene.add(pilar2);

}


function updateAspectRatio() {

    renderer.setSize( window.innerWidth, window.innerHeight );
    let aspectRatio = window.innerWidth/window.innerHeight;
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();

    dartboard_camera.left = -semilado;
    dartboard_camera.right = semilado;
    dartboard_camera.bottom = -semilado;
    dartboard_camera.top = semilado;

    dartboard_camera.updateProjectionMatrix();


}

function update() {

    movement_speed = effectController.player_speed;
    throwing_speed = effectController.dart_speed;

    TWEEN.update();

    if (dart_thrown) {
        scene.remove(text);
        loadPunctuation();
        dart_thrown = false;
    }

    let vector = new THREE.Vector3();
    let angle = camera.getWorldDirection(vector);
    let text_angle_y = document.createElement('div');
    text_angle_y.style.position = 'absolute';
    //text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
    text_angle_y.style.width = 150;
    text_angle_y.style.height = 20;
    text_angle_y.style.backgroundColor = "white";
    text_angle_y.innerHTML = "Angulo del eje Y: " + Math.round(angle.y*180);
    text_angle_y.style.top = 25 + 'px';
    text_angle_y.style.left = 250 + 'px';
    document.body.appendChild(text_angle_y);


    if(keys["w"] || keys["W"]) {
        player.position.x -= Math.sin(player.rotation.y) * movement_speed;
        player.position.z -= Math.cos(player.rotation.y) * movement_speed;
    }
    if(keys["s"] || keys["S"]) {
        player.position.x += Math.sin(player.rotation.y) * movement_speed;
        player.position.z += Math.cos(player.rotation.y) * movement_speed;
    }

    if(keys["d"] || keys["D"]) {

        if ( angle.x > 0 && angle.z < 0 ) {
            player.position.x += movement_speed * Math.sin(player.rotation.y + Math.PI / 2);
            player.position.z -= movement_speed * Math.cos(player.rotation.y - Math.PI / 2);
        } else if ( angle.x > 0 && angle.z > 0 ) {
            player.position.x += movement_speed * Math.sin(player.rotation.y + Math.PI / 2);
            player.position.z -= movement_speed * Math.cos(player.rotation.y - Math.PI / 2);
        }
        else if ( angle.x <0 && angle.z > 0 ) {
            player.position.x += movement_speed * Math.sin(player.rotation.y + Math.PI / 2);
            player.position.z -= movement_speed * Math.cos(player.rotation.y - Math.PI / 2);
        }
        else {
            player.position.x += movement_speed * Math.sin(player.rotation.y + Math.PI / 2);
            player.position.z -= movement_speed * Math.cos(player.rotation.y - Math.PI / 2);
        }

    }
    if(keys["a"] || keys["A"]) {

        if ( angle.x > 0 && angle.z < 0 ) {
            player.position.x -= movement_speed * Math.sin(player.rotation.y + Math.PI / 2);
            player.position.z += movement_speed * Math.cos(player.rotation.y - Math.PI / 2);
        } else if ( angle.x > 0 && angle.z > 0 ) {
            player.position.x -= movement_speed * Math.sin(player.rotation.y + Math.PI / 2);
            player.position.z += movement_speed * Math.cos(player.rotation.y - Math.PI / 2);
        }
        else if ( angle.x <0 && angle.z > 0 ) {
            player.position.x -= movement_speed * Math.sin(player.rotation.y + Math.PI / 2);
            player.position.z += movement_speed * Math.cos(player.rotation.y - Math.PI / 2);
        }
        else {
            player.position.x -= movement_speed * Math.sin(player.rotation.y + Math.PI / 2);
            player.position.z += movement_speed * Math.cos(player.rotation.y - Math.PI / 2);
        }

    }

    //console.log(player.position);
    if (player.position.z > 199) player.position.z = 199;
    else if (player.position.z < -198) player.position.z = -198;

    if (player.position.x > 199) player.position.x = 199;
    else if (player.position.x < -199) player.position.x = -199;

}

function render() {

    requestAnimationFrame( render );

    stats.begin();

    update();

    renderer.clear();

    renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );

    let aspectRatio = window.innerWidth/window.innerHeight;
    if (aspectRatio > 1)    renderer.setViewport( 0, 0, window.innerHeight/4, window.innerHeight/4 );
    else                    renderer.setViewport( 0, 0, window.innerWidth/4, window.innerWidth/4 );
    renderer.render( scene, dartboard_camera );

    stats.end();

}

init();
setupGUI();
loadScene();
loadPunctuation();
render();