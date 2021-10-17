
function create_number_line(points) {
    return new THREE.LineSegments( new THREE.BufferGeometry().setFromPoints( points ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
}

const zero_points = [
    new THREE.Vector3(4, 60, 0),
    new THREE.Vector3(28, 60, 0),
    new THREE.Vector3(28, 60, 0),
    new THREE.Vector3(28, 4, 0),
    new THREE.Vector3(28, 4, 0),
    new THREE.Vector3(4, 4, 0),
    new THREE.Vector3(4, 4, 0),
    new THREE.Vector3(4, 60, 0)
]

const one_points = [
    new THREE.Vector3(5, 38, 0),
    new THREE.Vector3(16, 60, 0),
    new THREE.Vector3(16, 60, 0),
    new THREE.Vector3(16, 4, 0)
];

const two_points = [
    new THREE.Vector3(4, 60, 0),
    new THREE.Vector3(28, 60, 0),
    new THREE.Vector3(28, 60, 0),
    new THREE.Vector3(28, 32, 0),
    new THREE.Vector3(28, 32, 0),
    new THREE.Vector3(4, 32, 0),
    new THREE.Vector3(4, 32, 0),
    new THREE.Vector3(4, 4, 0),
    new THREE.Vector3(4, 4, 0),
    new THREE.Vector3(28, 4, 0)
];

const three_points = [
    new THREE.Vector3(4, 60, 0),
    new THREE.Vector3(28, 60, 0),
    new THREE.Vector3(28, 60, 0),
    new THREE.Vector3(12, 32, 0),
    new THREE.Vector3(12, 32, 0),
    new THREE.Vector3(28, 32, 0),
    new THREE.Vector3(28, 32, 0),
    new THREE.Vector3(16, 4, 0),
    new THREE.Vector3(16, 4, 0),
    new THREE.Vector3(4, 4, 0)
];

const four_points = [
    new THREE.Vector3(30, 32, 0),
    new THREE.Vector3(4, 32, 0),
    new THREE.Vector3(4, 32, 0),
    new THREE.Vector3(24, 60, 0),
    new THREE.Vector3(24, 60, 0),
    new THREE.Vector3(24, 4, 0)
];

const five_points = [
    new THREE.Vector3(28, 60, 0),
    new THREE.Vector3(4, 60, 0),
    new THREE.Vector3(4, 60, 0),
    new THREE.Vector3(4, 32, 0),
    new THREE.Vector3(4, 32, 0),
    new THREE.Vector3(28, 32, 0),
    new THREE.Vector3(28, 32, 0),
    new THREE.Vector3(28, 4, 0),
    new THREE.Vector3(28, 4, 0),
    new THREE.Vector3(4, 4, 0)
];

const six_points = [
    new THREE.Vector3(28, 60, 0),
    new THREE.Vector3(4, 60, 0),
    new THREE.Vector3(4, 60, 0),
    new THREE.Vector3(4, 4, 0),
    new THREE.Vector3(4, 4, 0),
    new THREE.Vector3(28, 4, 0),
    new THREE.Vector3(28, 4, 0),
    new THREE.Vector3(28, 32, 0),
    new THREE.Vector3(28, 32, 0),
    new THREE.Vector3(4, 32, 0)
];

const seven_points = [
    new THREE.Vector3(4, 60, 0),
    new THREE.Vector3(28, 60, 0),
    new THREE.Vector3(28, 60, 0),
    new THREE.Vector3(16, 4, 0)
];

const eight_points = [
    new THREE.Vector3(28, 60, 0),
    new THREE.Vector3(4, 60, 0),
    new THREE.Vector3(4, 60, 0),
    new THREE.Vector3(4, 4, 0),
    new THREE.Vector3(4, 4, 0),
    new THREE.Vector3(28, 4, 0),
    new THREE.Vector3(28, 4, 0),
    new THREE.Vector3(28, 60, 0),
    new THREE.Vector3(4, 32, 0),
    new THREE.Vector3(28, 32, 0)
];

const nine_points = [
    new THREE.Vector3(28, 32, 0),
    new THREE.Vector3(4, 32, 0),
    new THREE.Vector3(4, 32, 0),
    new THREE.Vector3(4, 60, 0),
    new THREE.Vector3(4, 60, 0),
    new THREE.Vector3(28, 60, 0),
    new THREE.Vector3(28, 60, 0),
    new THREE.Vector3(28, 4, 0)
];

function create_one() {
    return create_number_line(one_points);
}

function create_two() {
    return create_number_line(two_points);
}

function create_three() {
    return create_number_line(three_points);
}

function create_four() {
    return create_number_line(four_points);
}

function create_five() {
    return create_number_line(five_points);
}

function create_six() {
    return create_number_line(six_points);
}

function create_seven() {
    return create_number_line(seven_points);
}

function create_eight() {
    return create_number_line(eight_points);
}

function create_nine() {
    return create_number_line(nine_points);
}

function create_ten() {
    let points = [...one_points];
    for (let i = 0; i < zero_points.length; i++) {
        points.push( new THREE.Vector3( zero_points[i]['x']+32, zero_points[i]['y'], zero_points[i]['z'] ) );
    }
    return create_number_line(points);
}

function create_eleven() {
    let points = [...one_points];
    for (let i = 0; i < one_points.length; i++) {
        points.push( new THREE.Vector3( one_points[i]['x']+32, one_points[i]['y'], one_points[i]['z'] ) );
    }
    return create_number_line(points);
}

function create_twelve() {
    let points = [...one_points];
    for (let i = 0; i < two_points.length; i++) {
        points.push( new THREE.Vector3( two_points[i]['x']+32, two_points[i]['y'], two_points[i]['z'] ) );
    }
    return create_number_line(points);
}

function create_thirteen() {
    let points = [...one_points];
    for (let i = 0; i < three_points.length; i++) {
        points.push( new THREE.Vector3( three_points[i]['x']+32, three_points[i]['y'], three_points[i]['z'] ) );
    }
    return create_number_line(points);
}

function create_fourteen() {
    let points = [...one_points];
    for (let i = 0; i < four_points.length; i++) {
        points.push( new THREE.Vector3( four_points[i]['x']+32, four_points[i]['y'], four_points[i]['z'] ) );
    }
    return create_number_line(points);
}

function create_fifteen() {
    let points = [...one_points];
    for (let i = 0; i < five_points.length; i++) {
        points.push( new THREE.Vector3( five_points[i]['x']+32, five_points[i]['y'], five_points[i]['z'] ) );
    }
    return create_number_line(points);
}

function create_sixteen() {
    let points = [...one_points];
    for (let i = 0; i < six_points.length; i++) {
        points.push( new THREE.Vector3( six_points[i]['x']+32, six_points[i]['y'], six_points[i]['z'] ) );
    }
    return create_number_line(points);
}

function create_seventeen() {
    let points = [...one_points];
    for (let i = 0; i < seven_points.length; i++) {
        points.push( new THREE.Vector3( seven_points[i]['x']+32, seven_points[i]['y'], seven_points[i]['z'] ) );
    }
    return create_number_line(points);
}

function create_eighteen() {
    let points = [...one_points];
    for (let i = 0; i < eight_points.length; i++) {
        points.push( new THREE.Vector3( eight_points[i]['x']+32, eight_points[i]['y'], eight_points[i]['z'] ) );
    }
    return create_number_line(points);
}

function create_nineteen() {
    let points = [...one_points];
    for (let i = 0; i < nine_points.length; i++) {
        points.push( new THREE.Vector3( nine_points[i]['x']+32, nine_points[i]['y'], nine_points[i]['z'] ) );
    }
    return create_number_line(points);
}

function create_twenty() {
    let points = [...two_points];
    for (let i = 0; i < zero_points.length; i++) {
        points.push( new THREE.Vector3( zero_points[i]['x']+32, zero_points[i]['y'], zero_points[i]['z'] ) );
    }
    return create_number_line(points);
}