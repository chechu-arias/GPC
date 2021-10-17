

function updatePosition(event) {
    camera.rotation.order = 'YZX';
    let { movementX, movementY } = event;
    player.rotation.y -= movementX * rotation_speed;
    camera.rotation.x -= movementY * rotation_speed;
    camera.rotation.x = Math.max(-Math.PI / 2, Math.min(camera.rotation.x, Math.PI / 2));
    camera.rotation.order = 'XYZ';
}

function lockChangeAlert() {
    if (document.pointerLockElement == renderer.domElement) {
        document.addEventListener("mousemove", updatePosition, false);
    } else {
        document.removeEventListener("mousemove", updatePosition, false);
    }
}

let keys = {}
function keyDown(event) {
    keys[event.key] = true;
}
function keyUp(event) {
    delete keys[event.key];
}

document.onkeydown = keyDown;
document.onkeyup = keyUp;