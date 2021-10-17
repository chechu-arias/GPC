let semilado = 40;

function setDartboardCamera() {

    let camaraOrtografica = new THREE.OrthographicCamera(
        -semilado, semilado, semilado, -semilado, -200, 200
    );

    dartboard_camera = camaraOrtografica.clone();
    dartboard_camera.position.set( -100, 60, -180 );
    dartboard_camera.lookAt( -100, 60, -200 );

    scene.add( dartboard_camera );

}