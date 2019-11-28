import React, { Component } from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';

class Scene extends Component {
  constructor(props) {
    super(props)

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
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

       // show info toggles about geometry
       wireframe: false,
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

    const vertices = [
      new THREE.Vector3(-100, -100,  100),  // 0
      new THREE.Vector3( this.state.b - 100, -100,  100),  // 1
      new THREE.Vector3(-100,  this.state.bigRoofHeight - 100,  topDepthOffset),  // 2
      new THREE.Vector3( this.state.b - 100,  this.state.bigRoofHeight - 100,  topDepthOffset),  // 3
      new THREE.Vector3(-100, -100, bottomDepthOffset),  // 4
      new THREE.Vector3( this.state.b - 100, -100, bottomDepthOffset),  // 5

      // front pyramid
      new THREE.Vector3(fRBottomLeftOffset,  -100, this.state.a + 100),  // 6
      new THREE.Vector3(fRBottomRightOffset,  -100, this.state.a + 100),  // 7
      new THREE.Vector3(fRTopOffset,  this.state.smallRoofHeight - 100, this.state.a + 100),  // 8
      new THREE.Vector3(fRBottomLeftOffset,  -100, 100),  // 9
      new THREE.Vector3(fRTopOffset,  this.state.smallRoofHeight - 100, topDepthOffset),  // 10
      new THREE.Vector3(fRBottomRightOffset,  -100, 100),  // 11

      // hacky way to display some faces
      new THREE.Vector3(fRBottomLeftOffset,  -100, 102),  // 12
      new THREE.Vector3(fRTopOffset,  this.state.smallRoofHeight - 100, topDepthOffset+2),  // 13
      new THREE.Vector3(fRBottomRightOffset,  -100, 102),  // 14
    ];
    this.geometry.vertices = vertices;
    this.geometry.verticesNeedUpdate = true;
  }

  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true  });
    const material = new THREE.MeshBasicMaterial({ color: 'lightslategray' });
    const colors = [
    new THREE.Color(0xff0000),
    new THREE.Color(0x00ff00),
    new THREE.Color(0x0000ff)];


    this.geometry = new THREE.Geometry()

    this.setVertices();

    this.geometry.faces.push(
      // front
      new THREE.Face3(0, 3, 2),
      new THREE.Face3(0, 1, 3),
      // right
      new THREE.Face3(1, 5, 3),
      // back
      // new THREE.Face3(4, 5, 7),
      new THREE.Face3(5, 4, 3),
      new THREE.Face3(4, 2, 3),

      // new THREE.Face3(4, 2, 6),
      new THREE.Face3(4, 0, 2),
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

      // back
      new THREE.Face3(11, 10, 9),

      // hacky way to display some faces
       new THREE.Face3(12, 13, 14),
    );

       // compute Normals
    this.geometry.computeVertexNormals();

    // normalize the geometry
    this.geometry.normalize();

    const roof = new THREE.Mesh(this.geometry, material);
    camera.position.z = 4;
    this.scene.add(roof);

    // adding vertices info. TODO: fix
    const showVerticesInfo = true;
    if (showVerticesInfo) {
      const loader = new THREE.FontLoader();
      loader.load('//raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        console.log(font);
        for (let i = 0; i < roof.geometry.vertices.length; i++) {
          // console.log('verice!!!! ', this.roof.geometry.vertices[i]);
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

          text.position.x = roof.geometry.vertices[i].x;
          text.position.y = roof.geometry.vertices[i].y;
          text.position.z = roof.geometry.vertices[i].z;
          this.scene.add(text);

        }
      });
    }

    // adding axes info
    const showAxesInfo = false;
    if (showAxesInfo) {
      const axesHelper = new THREE.AxesHelper( 200 );
      this.scene.add(axesHelper);

      // grid
      var gridXZ = new THREE.GridHelper(100, 10, new THREE.Color(0x006600), new THREE.Color(0x006600) );
      this.scene.add(gridXZ);

      var gridXY = new THREE.GridHelper(100, 10, new THREE.Color(0x000066), new THREE.Color(0x000066));
      gridXY.rotation.x = Math.PI/2;

      this.scene.add(gridXY);
      var gridYZ = new THREE.GridHelper(100, 10, new THREE.Color(0x660000), new THREE.Color(0x660000));
      gridYZ.rotation.z = Math.PI/2;

      this.scene.add(gridYZ);
    }

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5);
    this.scene.add( directionalLight );

    const loaderTexture = new THREE.CubeTextureLoader();
    const texture = loaderTexture.load( [
        'skybox/meadow_ft.jpg', 'skybox/meadow_bk.jpg', 'skybox/meadow_up.jpg', 'skybox/meadow_dn.jpg', 'skybox/meadow_rt.jpg', 'skybox/meadow_lf.jpg',
    ] );

    this.scene.background = texture;


	var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    this.scene.add( light );

    renderer.setSize(width, height)

    // this.scene = scene
    this.camera = camera;
    this.renderer = renderer;
    this.material = material;
    this.roof = roof;

    this.mount.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls( camera, this.renderer.domElement);

    this.start()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
      this.setVertices();
      // compute Normals
      this.geometry.computeVertexNormals();
      // normalize the geometry
      this.geometry.normalize();
      this.renderScene()
  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId);
  }

  animate() {

    this.frameId = window.requestAnimationFrame(this.animate);
    this.controls.update();
    this.roof.geometry.verticesNeedUpdate = true;
    this.roof.geometry.elementsNeedUpdate = true;
    this.material.wireframe = this.state.wireframe;
    this.material.color.setColorName(this.state.wireframe ? 'black' : 'lightslategray');
    const oldEdges = this.scene.getObjectByName('edges');
    this.scene.remove(oldEdges);
    const edges = new THREE.EdgesGeometry( this.geometry);
    const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 'black', linewidth: 3, linejoin: 'bevel' } ) );
    line.name = 'edges';
    this.scene.add(line);

    this.renderScene()
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera)
  }

  render() {
    return (
      <Container fluid className="mt-5 pl-5 pr-5">
        <Row>
          <Col md="6">
              <img className="pb-5" src="./images/Rooftype_big_4.jpg" width="700" style={{float: 'left', top: 0, right: 0}} />
              <FormGroup className='w-50 pr-5 d-inline-block'>
                <Input name='a' type="number" placeholder="Enter a" onChange={(e) => { this.setState({ a: Number(e.target.value) }); }}/>
              </FormGroup>
              <FormGroup className='w-50 pr-5 d-inline-block'>
                <Input name='b' placeholder="Enter b" onChange={(e) => { this.setState({ b: Number(e.target.value) }); }}/>
              </FormGroup>
              <FormGroup className='w-50 pr-5 d-inline-block'>
                <Input name='c' placeholder="Enter c" onChange={(e) => { this.setState({ c: Number(e.target.value) }); }} />
              </FormGroup>
              <FormGroup className='w-50 pr-5 d-inline-block'>
                <Input name='d' type="number" placeholder="Enter d" onChange={(e) => { this.setState({ d: Number(e.target.value) }); }}/>
              </FormGroup>
              <FormGroup className='w-50 pr-5 d-inline-block'>
                <Input name='e' disabled placeholder="Enter e" onChange={(e) => { this.setState({ e: Number(e.target.value) }); }}/>
              </FormGroup>
              <FormGroup className='w-50 pr-5 d-inline-block'>
                <Input name='f' placeholder="Enter f" onChange={(e) => { this.setState({ f: Number(e.target.value) }); }} />
              </FormGroup>
              <FormGroup className='w-50 pr-5 d-inline-block'>
                <Input name='g' disabled type="number" placeholder="Enter g" onChange={(e) => { this.setState({ g: Number(e.target.value) }); }}/>
              </FormGroup>
              <FormGroup className='w-50 pr-5 d-inline-block'>
                <Input name='h' disabled placeholder="Enter h" onChange={(e) => { this.setState({ h: Number(e.target.value) }); }}/>
              </FormGroup>
              <FormGroup className='w-50 pr-5 d-inline-block'>
                <Input name='bigRoofHeight' type="number" placeholder="Enter big roof height" onChange={(e) => { this.setState({ bigRoofHeight: Number(e.target.value) }); }}/>
              </FormGroup>
              <FormGroup className='w-50 pr-5 d-inline-block'>
                <Input name='smallRoofHeight' placeholder="Enter small roof height" onChange={(e) => { this.setState({ smallRoofHeight: Number(e.target.value) }); }}/>
              </FormGroup>
          </Col>
          <Col md="6">
            <div
                md="6"
                style={{ width: '800px', height: '800px', float: 'right' }}
                ref={(mount) => { this.mount = mount }}
            />
          </Col>
        </Row>
        <Row>
            <Col md="12">
                <h1>Info</h1>
                <FormGroup check>
                    <Label check>
                        <Input name="wireframe" type="checkbox" id="wireframe" onChange={(e) => { this.setState({ wireframe: e.target.checked })}} />
                        Wireframe
                    </Label>
                </FormGroup>
            </Col>
        </Row>
      </Container>
    )
  }
}

export default Scene