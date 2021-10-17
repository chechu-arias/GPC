
let radio_diana = 25;
let material_punta = new THREE.MeshLambertMaterial( { color:"red", side: THREE.DoubleSide } );

function createRoundedSquare(top_y, bottom_y,color) {

    let material = new THREE.MeshBasicMaterial( { color: color, side: THREE.DoubleSide } );

    let rounded_square_coordenadas = [
        0, top_y, 0,
        top_y*Math.sin(Math.PI/10) , top_y*Math.cos(Math.PI/10) , 0,
        0, bottom_y, 0,
        bottom_y*Math.sin(Math.PI/10) , bottom_y*Math.cos(Math.PI/10) , 0
    ];

    let rounded_square_indices = [
        0,2,1,
        3,1,2
    ]

    let rounded_square_geometry = new THREE.Geometry();

    for (let i = 0; i < rounded_square_coordenadas.length; i += 3) {
        let vertice = new THREE.Vector3( rounded_square_coordenadas[i], rounded_square_coordenadas[i+1], rounded_square_coordenadas[i+2] );
        rounded_square_geometry.vertices.push( vertice );
    }

    for (let i = 0; i < rounded_square_indices.length; i += 3) {
        let triangulo = new THREE.Face3( rounded_square_indices[i], rounded_square_indices[i+1], rounded_square_indices[i+2] );
        rounded_square_geometry.faces.push(triangulo);
    }

    return new THREE.Mesh( rounded_square_geometry, material );

}

function createNumberPlayboard(even, rotationAngle, number_func) {

    let numbers_square, outside_small_square, outside_big_square, inside_small_square, inside_big_square, outside_circle, inside_circle;

    let large_funcs = new Set();
    large_funcs.add(create_ten);
    large_funcs.add(create_eleven);
    large_funcs.add(create_twelve);
    large_funcs.add(create_thirteen);
    large_funcs.add(create_fourteen);
    large_funcs.add(create_fifteen);
    large_funcs.add(create_sixteen);
    large_funcs.add(create_seventeen);
    large_funcs.add(create_eighteen);
    large_funcs.add(create_nineteen);
    large_funcs.add(create_twenty);

    if (even) {
        numbers_square = createRoundedSquare(25, 20, 0x000000);
        outside_small_square = createRoundedSquare(20, 18, 0xff0000);
        outside_big_square = createRoundedSquare(18, 13, 0x000000);
        inside_small_square = createRoundedSquare(13, 11, 0xff0000);
        inside_big_square = createRoundedSquare(11, 2, 0x000000);
        outside_circle = createRoundedSquare(2, 1, 0x00ff00);
        inside_circle = createRoundedSquare(1, 0, 0xff0000);
    } else {
        numbers_square = createRoundedSquare(25, 20, 0x000000);
        outside_small_square = createRoundedSquare(20, 18, 0x00ff00);
        outside_big_square = createRoundedSquare(18, 13, 0xffffff);
        inside_small_square = createRoundedSquare(13, 11, 0x00ff00);
        inside_big_square = createRoundedSquare(11, 2, 0xffffff);
        outside_circle = createRoundedSquare(2, 1, 0x00ff00);
        inside_circle = createRoundedSquare(1, 0, 0xff0000);
    }

    let number = number_func();
    number.scale.set(0.06,0.06,1);
    if (large_funcs.has(number_func)) {
        number.position.x = 1.5;
    } else {
        number.position.x = 2;
    }
    number.rotation.z = -Math.PI/20;
    number.position.y = 20.2;

    let dartboard_segment = new THREE.Object3D();
    dartboard_segment.rotation.z = rotationAngle;
    dartboard_segment.add(number);
    dartboard_segment.add(numbers_square);
    dartboard_segment.add(outside_small_square);
    dartboard_segment.add(outside_big_square);
    dartboard_segment.add(inside_small_square);
    dartboard_segment.add(inside_big_square);
    dartboard_segment.add(outside_circle);
    dartboard_segment.add(inside_circle);

    return dartboard_segment;

}

function createDartboard() {
    let ang = 0;
    let even = true;
    let numbers = [
        create_one, create_twenty, create_five, create_twelve, create_nine,
        create_fourteen, create_eleven, create_eight, create_sixteen, create_seven,
        create_nineteen, create_three, create_seventeen, create_two, create_fifteen,
        create_ten, create_six, create_thirteen, create_four, create_eighteen
    ];

    let dartboard = new THREE.Object3D();
    for(let i = 0; i < 20; i++) {
        let number_playboard = createNumberPlayboard(even, ang, numbers[i]);
        dartboard.add(number_playboard);
        ang += Math.PI/10;
        if (even)   even = false;
        else        even = true;
    }
    return dartboard;
}


function createDart() {

    let material_cuerpo = new THREE.MeshLambertMaterial( { color:"white", side: THREE.DoubleSide } );

    let ala_coordenadas = [
        0, 0, 0,
        3, 0, 0,
        1, 1, 0,
        4, 1, 0
    ];

    let ala_indices = [
        0,1,2,
        3,2,1
    ]

    let ala_geometry = new THREE.Geometry();

    for (let i = 0; i < ala_coordenadas.length; i += 3) {
        let vertice = new THREE.Vector3( ala_coordenadas[i], ala_coordenadas[i+1], ala_coordenadas[i+2] );
        ala_geometry.vertices.push( vertice );
    }

    for (let i = 0; i < ala_indices.length; i += 3) {
        let triangulo = new THREE.Face3( ala_indices[i], ala_indices[i+1], ala_indices[i+2] );
        ala_geometry.faces.push(triangulo);
    }

    let ala1 = new THREE.Mesh( ala_geometry, material_punta );

    let ala2 = new THREE.Mesh( ala_geometry, material_punta );
    ala2.rotation.x = Math.PI;

    let ala3 = new THREE.Mesh( ala_geometry, material_punta );
    ala3.rotation.x = Math.PI/2;

    let ala4 = new THREE.Mesh( ala_geometry, material_punta );
    ala4.rotation.x = -Math.PI/2;


    let cuerpo = new THREE.Mesh( new THREE.CylinderGeometry( 0.2, 0.2, 8, 10, 2 ), material_cuerpo );
    cuerpo.rotation.z = -Math.PI/2;
    cuerpo.position.set(-3, 0, 0);


    let punta = new THREE.Mesh( new THREE.CylinderGeometry( 0.2, 0, 1, 10, 1 ) , material_punta );
    punta.rotation.z = -Math.PI/2;
    punta.position.set(-7.5, 0, 0);


    let dardo = new THREE.Object3D();
    dardo.add(ala1);
    dardo.add(ala2);
    dardo.add(ala3);
    dardo.add(ala4);

    dardo.add(cuerpo);

    dardo.add(punta);

    return dardo

}

let path_pilar = './images/pilares/';
function createPilar(is_black) {

    let material_pilar;

    if (is_black) {
        material_pilar = new THREE.MeshStandardMaterial({
            aoMap: new THREE.TextureLoader().load(path_pilar + 'ao.jpg'),
            normalMap: new THREE.TextureLoader().load(path_pilar + 'norm.jpg'),
            roughnessMap: new THREE.TextureLoader().load(path_pilar + 'rough.jpg'),
            map: new THREE.TextureLoader().load(path_pilar + 'color.jpg')
        });
    } else {
        material_pilar = new THREE.MeshStandardMaterial({
            aoMap: new THREE.TextureLoader().load(path_pilar + 'ao.jpg'),
            normalMap: new THREE.TextureLoader().load(path_pilar + 'norm.jpg'),
            roughnessMap: new THREE.TextureLoader().load(path_pilar + 'rough2.jpg'),
            map: new THREE.TextureLoader().load(path_pilar + 'color2.jpg')
        });
    }

    let pilar = new THREE.Object3D();

    let pilarCylinder = new THREE.Mesh( new THREE.CylinderGeometry( 10, 10, 199, 32 ), material_pilar );

    let pilarUp = new THREE.Mesh( new THREE.ConeGeometry( 20, 30, 32 ), material_pilar );
    pilarUp.rotation.z = Math.PI;
    pilarUp.position.set(0, 80, 0);

    let pilarDown = new THREE.Mesh( new THREE.ConeGeometry( 20, 30, 32 ), material_pilar );
    pilarDown.position.set(0, -80, 0);

    pilar.add(pilarCylinder);
    pilar.add(pilarUp);
    pilar.add(pilarDown);

    return pilar;

}

function create_outer_walls() {

    let path = "images/outside/";

    let outer_walls = [
        path + "posx.jpg", path + "negx.jpg",
        path + "posy.jpg", path + "negy.jpg",
        path + "posz.jpg", path + "negz.jpg"
    ];

    let mapaEntorno = new THREE.CubeTextureLoader().load( outer_walls );

    let shader = THREE.ShaderLib.cube;

    shader.uniforms.tCube.value = mapaEntorno;

    let outer_walls_material = new THREE.ShaderMaterial({

        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide

    });

    return new THREE.Mesh( new THREE.BoxGeometry(10000, 10000, 10000), outer_walls_material );
}

function load3DElement( path, scale_factor, posi_x, posi_y, posi_z ) {

    const loader = new THREE.GLTFLoader();

    loader.load( path, function ( gltf ) {

        gltf.scene.traverse(c => {
            c.castShadow = true;
            c.receiveShadow = true;
        });

        gltf.scene.scale.set( scale_factor, scale_factor, scale_factor );
        gltf.scene.position.set( posi_x, posi_y, posi_z );
        //gltf.scene.rotation.y = Math.PI/2;

        scene.add( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );
}