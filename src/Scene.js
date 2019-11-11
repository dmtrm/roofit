import React, { Component } from 'react'
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'

class Scene extends Component {
  constructor(props) {
    super(props)

    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.animate = this.animate.bind(this)
    this.state = {
       width: 100,
       height: 100,
       depth: 100,
       a: 100,
       b: 400,
       c: 100,
       d: 100,
       f: 100,
       bigRoofHeight: 200,
       smallRoofHeight: 200,
    }
  }

  setVertices() {
    // create an array of vertices by way of
    // and array of vector3 instances
    const width = this.state.b;

    const bottomDepthOffset = 100 - this.state.f * 2;
    const topDepthOffset = 100 - this.state.f;

    const fRBottomLeftOffset = this.state.c - 100;
    const fRBottomRightOffset = fRBottomLeftOffset + this.state.d * 2;
    const fRTopOffset = fRBottomLeftOffset + this.state.d;
    // const cOffset = this.state.b - this.state.c - 1;
    const vertices = [
      new THREE.Vector3(-100, -100,  100),  // 0
      new THREE.Vector3( this.state.b - 100, -100,  100),  // 1
      new THREE.Vector3(-100,  this.state.bigRoofHeight - 100,  topDepthOffset),  // 2
      new THREE.Vector3( this.state.b - 100,  this.state.bigRoofHeight - 100,  topDepthOffset),  // 3
      new THREE.Vector3(-100, -100, bottomDepthOffset),  // 4
      new THREE.Vector3( this.state.b - 100, -100, bottomDepthOffset),  // 5
      // new THREE.Vector3(-1,  1, -1),  // 6
      // new THREE.Vector3( 1,  1, -1),  // 7

      // front pyramid
      new THREE.Vector3(fRBottomLeftOffset,  -100, this.state.a + 100),  // 6
      new THREE.Vector3(fRBottomRightOffset,  -100, this.state.a + 100),  // 7
      new THREE.Vector3(fRTopOffset,  this.state.smallRoofHeight - 100, this.state.a + 100),  // 8
      new THREE.Vector3(fRBottomLeftOffset,  -100, 0),  // 9
      new THREE.Vector3(fRTopOffset,  this.state.smallRoofHeight - 100, 0),  // 10
      new THREE.Vector3(fRBottomRightOffset,  -100, 0),  // 11
    ];
    this.geometry.vertices = vertices;
    this.geometry.verticesNeedUpdate = true;
  }

  componentDidMount() {
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true  })
    const material = new THREE.MeshBasicMaterial({ color: 'lightslategray' })
    const colors = [
    new THREE.Color(0xff0000),
    new THREE.Color(0x00ff00),
    new THREE.Color(0x0000ff)];
    const normal = new THREE.Vector3(0, 0, 1);
    this.geometry = new THREE.Geometry()

    /*
         6----7
        /|   /|
       2----3 |
       | |  | |
       | 4--|-5
       |/   |/
       0----1
  */

    this.setVertices();

    this.geometry.faces.push(
      // front
      new THREE.Face3(0, 3, 2),
      new THREE.Face3(0, 1, 3),
      // right
     // new THREE.Face3(1, 7, 3),
      new THREE.Face3(1, 5, 3),
      // back
      // new THREE.Face3(4, 5, 7),
      new THREE.Face3(5, 4, 3),
      new THREE.Face3(4, 2, 3),
      // left
      // new THREE.Face3(4, 2, 6),
      new THREE.Face3(4, 0, 2),
      // top
      // new THREE.Face3(2, 7, 6),
      // new THREE.Face3(2, 3, 7),
      // bottom
      new THREE.Face3(4, 1, 0),
      new THREE.Face3(4, 5, 1),

      // front pyramid
      // front
      new THREE.Face3(6, 7, 8),
      // right
      new THREE.Face3(7, 10, 8),
      new THREE.Face3(7, 11, 10),
      //bottom
      new THREE.Face3(9, 7, 6),
      new THREE.Face3(9, 11, 7),

      // left
      new THREE.Face3(6, 8, 10),
      new THREE.Face3(6, 10, 9),
    );

       // compute Normals
    this.geometry.computeVertexNormals();

    // normalize the geometry
    this.geometry.normalize();

    const cube = new THREE.Mesh(this.geometry, material)

    // camera.position.z = 4
    camera.position.z = 4
    scene.add(cube)

    // adding vertices info
    const showVerticesInfo = false;
    if (showVerticesInfo) {
      const loader = new THREE.FontLoader();
      loader.load('//raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        console.log(font);
        for (let i = 0; i < cube.geometry.vertices.length; i++) {
          // console.log('verice!!!! ', cube.geometry.vertices[i]);
          console.log('i ', i);
          const textGeo = new THREE.TextGeometry(`${i}`, {
            size: 0.1,
            height: 0.2,
            curveSegments: 6,
            font: font,
            style: "normal"
          });

          const textMaterial = new THREE.MeshLambertMaterial({color: 0xFF00FF});
          const text = new THREE.Mesh(textGeo, textMaterial);

          text.position.x = cube.geometry.vertices[i].x;
          text.position.y = cube.geometry.vertices[i].y;
          text.position.z = cube.geometry.vertices[i].z;
          // text.rotation = camera.rotation;
          // text.rotation = camera.rotation;
          scene.add(text);

        }
      });
    }

    const axesHelper = new THREE.AxesHelper( 200 );
    scene.add(axesHelper);

    // grid
	var gridXZ = new THREE.GridHelper(100, 10, new THREE.Color(0x006600), new THREE.Color(0x006600) );
	// gridXZ.position.set( 100,0,100 );
	scene.add(gridXZ);

	var gridXY = new THREE.GridHelper(100, 10, new THREE.Color(0x000066), new THREE.Color(0x000066));
	//gridXY.position.set( 100,100,0 );
	gridXY.rotation.x = Math.PI/2;
	scene.add(gridXY);
	var gridYZ = new THREE.GridHelper(100, 10, new THREE.Color(0x660000), new THREE.Color(0x660000));
	// gridYZ.position.set( 0,100,100 );
	gridYZ.rotation.z = Math.PI/2;
	scene.add(gridYZ);

    // light
	// const pointLight = new THREE.PointLight(0xffffff);
	// pointLight.position.set(100,250,100);
	// scene.add(pointLight);

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5);
    scene.add( directionalLight );

	// // skybox
	// const skyBoxGeometry = new THREE.BoxGeometry( 10000, 10000, 10000 );
	// const skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
	// const skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
	// scene.add(skyBox);

    const loaderTexture = new THREE.CubeTextureLoader();
    const texture = loaderTexture.load( [
        'skybox/meadow_ft.jpg', 'skybox/meadow_bk.jpg', 'skybox/meadow_up.jpg', 'skybox/meadow_dn.jpg', 'skybox/meadow_rt.jpg', 'skybox/meadow_lf.jpg',
    ] );

    // scene.background = new THREE.Color(0x9999ff);
    scene.background = texture;


	var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );

    // renderer.setClearColor('#000000')
    renderer.setSize(width, height)

    this.scene = scene
    this.camera = camera
    this.renderer = renderer
    this.material = material
    this.cube = cube

    this.mount.appendChild(this.renderer.domElement)
    // this.controls = new THREE.OrbitControls( camera, this.renderer.domElement );
    this.controls = new OrbitControls( camera, this.renderer.domElement );
    // this.start()

    // this.cube.rotation.x += 0.3
    // this.cube.rotation.y += 0.5

    // this.cube.rotation.x += 0.3
    // this.cube.rotation.y += 0.5

    // this.renderScene()
    this.start()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
      console.log('scale ', this.state);
      // this.cube.scale.x = this.state.width;
      // this.cube.scale.y = this.state.height;
      // this.cube.scale.z = this.state.depth;
      this.setVertices();
      // compute Normals
      this.geometry.computeVertexNormals();
      // normalize the geometry
      this.geometry.normalize();
      this.renderScene()
  }

  componentWillUnmount() {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId)
  }

  animate() {
    // this.cube.rotation.x += 0.01
    // this.cube.rotation.y += 0.01

    this.frameId = window.requestAnimationFrame(this.animate)
    this.controls.update();
    this.cube.geometry.verticesNeedUpdate = true;
    this.cube.geometry.elementsNeedUpdate = true;
    this.renderScene()
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera)
  }

  render() {
    return (
      <div>
        <div
          style={{ width: '800px', height: '800px' }}
          ref={(mount) => { this.mount = mount }}
        />
        <img src="https://www.karukatus.ee/wp-content/uploads/2018/10/Rooftype_big_4.jpg" width="700" style={{position: 'absolute', top: 0, right: 0}} />
        <input name='a' type="number" placeholder="Enter a" onChange={(e) => { this.setState({ a: Number(e.target.value) }); }}/>
        <input name='b' placeholder="Enter b" onChange={(e) => { this.setState({ b: Number(e.target.value) }); }}/>
        <input name='c' placeholder="Enter c" onChange={(e) => { this.setState({ c: Number(e.target.value) }); }} />
        <input name='d' type="number" placeholder="Enter d" onChange={(e) => { this.setState({ d: Number(e.target.value) }); }}/>
        <input name='e' disabled placeholder="Enter e" onChange={(e) => { this.setState({ e: Number(e.target.value) }); }}/>
        <input name='f' placeholder="Enter f" onChange={(e) => { this.setState({ f: Number(e.target.value) }); }} />
        <input name='g' type="number" placeholder="Enter g" onChange={(e) => { this.setState({ g: Number(e.target.value) }); }}/>
        <input name='h' disabled placeholder="Enter h" onChange={(e) => { this.setState({ h: Number(e.target.value) }); }}/>
        <input name='bigRoofHeight' type="number" placeholder="Enter big roof height" onChange={(e) => { this.setState({ bigRoofHeight: Number(e.target.value) }); }}/>
        <input name='smallRoofHeight' placeholder="Enter small roof height" onChange={(e) => { this.setState({ smallRoofHeight: Number(e.target.value) }); }}/>
      </div>
    )
  }
}

export default Scene