let const_time_acceleration = 5;
let throwing_speed = 25;

function getDartY(velocity, height, angle, x) {
      // Fórmula obtenida de https://www.desmos.com/calculator/gjnco6mzjo
      // gracias a https://www.scienceforums.com/topic/34423-dart-trajectory/
      x = Math.abs(x);
      return height - 4.9 * Math.pow( ( x / velocity * Math.cos( angle * Math.PI / 180 ) ) , 2 ) + Math.tan( angle * Math.PI / 180 ) * x;
}

function dartNotInsideDartboard( dart_x, dart_y ) {
      return Math.hypot(diana.position.x-dart_x, diana.position.y-dart_y) > radio_diana;
}

function throwDart(angle, dart) {

      let velocity = throwing_speed;

      let starting_x = player.position.x;
      let starting_y = player.position.y;
      let starting_z = player.position.z;
      let actual_z = starting_z;

      let dart_position_x = [];
      let dart_position_y = [];
      let dart_position_z = [];

      let dart_in_ground = false;
      let dart_in_the_ceiling = false;
      while( actual_z > (diana.position.z+7) ) {
            new_y = getDartY( velocity, starting_y, angle, actual_z-starting_z );
            if ( new_y < 0 ) {
                  dart_in_ground = true;
                  break;
            }
            if ( new_y > 200 ) {
                  dart_in_the_ceiling = true;
                  break;
            }
            dart_position_x.push(starting_x);
            dart_position_y.push(new_y);
            dart_position_z.push(actual_z);
            actual_z -= 1;
      }

      let t_animation = Math.abs(actual_z - starting_z)/(velocity*const_time_acceleration) * 1000;

      let tween_mov = new TWEEN.Tween( dart.position )
                  .to( {x: dart_position_x,
                        y: dart_position_y,
                        z: dart_position_z }, t_animation )
                  .easing( TWEEN.Easing.Linear.None );

      let end_point_x = dart_position_x.slice(-1)[0];
      let end_point_y = dart_position_y.slice(-1)[0];
      let end_point_z = dart_position_z.slice(-1)[0];

      if ( dart_in_the_ceiling ) {

            let t_to_ground = Math.sqrt( 2*end_point_y/9.8 ) * 1000 / const_time_acceleration;

            let tween_mov_to_ground = new TWEEN.Tween( dart.position )
                  .to( {x: [end_point_x, end_point_x],
                        y: [end_point_y/2, 0],
                        z: [end_point_z+3, end_point_z+5] }, t_to_ground )
                  .easing( TWEEN.Easing.Linear.None );

            tween_mov.chain(tween_mov_to_ground);

      }
      else if ( dartNotInsideDartboard(end_point_x, end_point_y) && !dart_in_ground ) {

            let t_to_ground = Math.sqrt( 2*end_point_y/9.8 ) * 1000;
            let final_z = end_point_y/3;

            let tween_mov_to_ground = new TWEEN.Tween( dart.position )
                  .to( {x: [end_point_x, end_point_x],
                        y: [end_point_y/2, 0],
                        z: [end_point_z+final_z/1.3, end_point_z+final_z] }, t_to_ground )
                  .easing( TWEEN.Easing.Quartic.Out );

            tween_mov.chain(tween_mov_to_ground);
      }

      tween_mov.start();

}