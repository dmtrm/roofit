import React, { Component } from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import { FormGroup, Label, Input } from 'reactstrap';
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
       showWireframe: false,
       showVertices: false,
       showGrid: false,
    }
  }

  setVertices() {

    const bottomDepthOffset = 100 - this.state.f * 2;
    const topDepthOffset = 100 - this.state.f;

    const fRBottomLeftOffset = this.state.c - 100;
    const fRBottomRightOffset = fRBottomLeftOffset + this.state.d * 2;
    const fRTopOffset = fRBottomLeftOffset + this.state.d;

    // calculating z of vertice number 10 for correct vertice positioning during resizing
    const z10 = 100 - this.state.f/(this.state.bigRoofHeight/this.state.smallRoofHeight);

    this.vertices = [
      // big roof
      new THREE.Vector3(-100, -100,  100),  // 0
      new THREE.Vector3( this.state.b - 100, -100,  100),  // 1
      new THREE.Vector3(-100,  this.state.bigRoofHeight - 100,  topDepthOffset),  // 2
      new THREE.Vector3( this.state.b - 100,  this.state.bigRoofHeight - 100,  topDepthOffset),  // 3
      new THREE.Vector3(-100, -100, bottomDepthOffset),  // 4
      new THREE.Vector3( this.state.b - 100, -100, bottomDepthOffset),  // 5

      // small roof
      new THREE.Vector3(fRBottomLeftOffset,  -100, this.state.a + 100),  // 6
      new THREE.Vector3(fRBottomRightOffset,  -100, this.state.a + 100),  // 7
      new THREE.Vector3(fRTopOffset,  this.state.smallRoofHeight - 100, this.state.a + 100),  // 8
      new THREE.Vector3(fRBottomLeftOffset,  -100, 100),  // 9
      new THREE.Vector3(fRTopOffset,  this.state.smallRoofHeight - 100, z10),  // 10
      new THREE.Vector3(fRBottomRightOffset,  -100, 100),  // 11

    ];
    this.geometry.vertices = this.vertices;
    this.geometry.verticesNeedUpdate = true;
  }

  displayVertices() {
      const loader = new THREE.FontLoader();
      const roof = this.roof;
      const scene = this.scene;
      let vertices = scene.getObjectByName('verticesInfo');
      if (!vertices) {
          vertices = new THREE.Group();
          vertices.name = 'verticesInfo';
          scene.add(vertices);
      }
      // removing old vertices
      for (let i = vertices.children.length - 1; i >= 0; i--) {
           vertices.remove(vertices.children[i]);
      }
      if (this.state.showVertices) {
          loader.load('./fonts/helvetiker_regular.typeface.json', function (font) {
              for (let i = 0; i < roof.geometry.vertices.length; i++) {
                  const x = roof.geometry.vertices[i].x;
                  const y = roof.geometry.vertices[i].y;
                  const z = roof.geometry.vertices[i].z;
                  const textGeo = new THREE.TextGeometry(
                      `${i}`, {
                      size: 0.1,
                      height: 0.001,
                      curveSegments: 6,
                      font: font,
                      style: "normal"
                  });

                  const textMaterial = new THREE.MeshLambertMaterial({color: 'red'});
                  const text = new THREE.Mesh(textGeo, textMaterial);

                  if ( x < 0) {
                      text.position.x = x - 0.1;
                  } else {
                      text.position.x = x;
                  }
                  text.position.y = y;
                  text.position.z = z;
                  vertices.add(text);
              }
         });
      }
  }

  displayGrid() {
      let grid = this.scene.getObjectByName('grid');
      if (!grid) {
          grid = new THREE.Group();
          grid.name = 'grid';
          this.scene.add(grid);
      }
      if (this.state.showGrid) {
          const axesHelper = new THREE.AxesHelper(200);
          axesHelper.name = 'grid';
          grid.add(axesHelper);

          // grid
          const gridXZ = new THREE.GridHelper(100, 10, new THREE.Color('red'), new THREE.Color('red'));
          grid.add(gridXZ);

          const gridXY = new THREE.GridHelper(100, 10, new THREE.Color('green'), new THREE.Color('green'));
          gridXY.rotation.x = Math.PI / 2;

          grid.add(gridXY);
          const gridYZ = new THREE.GridHelper(100, 10, new THREE.Color('blue'), new THREE.Color('blue'));
          gridYZ.rotation.z = Math.PI / 2;
          grid.add(gridYZ);
      } else {
         const grid = this.scene.getObjectByName('grid');
         this.scene.remove(grid);
      }
  }

  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const material = new THREE.MeshBasicMaterial({ color: 'lightslategray', side: THREE.FrontSide });

    this.geometry = new THREE.Geometry();

    this.setVertices();

    this.geometry.faces.push(
      // front
      new THREE.Face3(0, 3, 2),
      new THREE.Face3(0, 1, 3),
      // right
      new THREE.Face3(1, 5, 3),
      // back
      new THREE.Face3(5, 4, 3),
      new THREE.Face3(4, 2, 3),

      new THREE.Face3(4, 0, 2),
      // bottom
      new THREE.Face3(4, 1, 0),
      new THREE.Face3(4, 5, 1),

      // small roof
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

    );

       // compute Normals
    this.geometry.computeVertexNormals();

    // normalize the geometry
    this.geometry.normalize();

    const roof = new THREE.Mesh(this.geometry, material);
    camera.position.z = 4;
    this.scene.add(roof);

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5);
    this.scene.add( directionalLight );

    const loaderTexture = new THREE.CubeTextureLoader();
    const texture = loaderTexture.load( [
        'skybox/meadow_ft.jpg', 'skybox/meadow_bk.jpg', 'skybox/meadow_up.jpg', 'skybox/meadow_dn.jpg', 'skybox/meadow_rt.jpg', 'skybox/meadow_lf.jpg',
    ] );

    this.scene.background = texture;


	var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    this.scene.add(light);

    renderer.setSize(width, height);

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
      this.displayVertices();
      this.displayGrid();
      // // compute Normals
      this.geometry.computeVertexNormals();
      // // normalize the geometry
      this.geometry.normalize();
      this.renderScene();
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

  drawOutline() {
     const blackOutline = new THREE.LineBasicMaterial( { color: 'black', linewidth: 3 } );
     // variables contain vertices coordinates
     // small roof edges
     const edgesSmallRoofGeometry = new THREE.Geometry();
     edgesSmallRoofGeometry.vertices.push(
        this.vertices[7],
        this.vertices[8],
        this.vertices[6],
        this.vertices[7],
        // changing z of vertices 10, 11 to make outline more prominent in this region
        new THREE.Vector3(this.vertices[11].x, this.vertices[11].y, this.vertices[11].z + 0.01),
        new THREE.Vector3(this.vertices[10].x, this.vertices[10].y, this.vertices[10].z + 0.01),
        this.vertices[10],
        this.vertices[8],
        // changing z of vertices 10, 9 to make outline more prominent in this region
        new THREE.Vector3(this.vertices[10].x, this.vertices[10].y, this.vertices[10].z + 0.01),
        new THREE.Vector3(this.vertices[9].x, this.vertices[9].y, this.vertices[9].z + 0.01),
        this.vertices[6],
     );
     const oldSmallRoofEdges = this.scene.getObjectByName('smallRoofEdges');
     this.scene.remove(oldSmallRoofEdges);
     const smallRoofEdges = new THREE.Line(edgesSmallRoofGeometry, blackOutline);
     smallRoofEdges.name = 'smallRoofEdges';
     this.scene.add(smallRoofEdges);

     // big roof edges
     const edgesBigRoofGeometryB = new THREE.Geometry();
     edgesBigRoofGeometryB.vertices.push(
        this.vertices[9],
        this.vertices[0],
        this.vertices[4],
        this.vertices[5],
        this.vertices[1],
        this.vertices[11],
     );
     const oldBigRoofEdgesB = this.scene.getObjectByName('bigRoofEdgesB');
     this.scene.remove(oldBigRoofEdgesB);
     const bigRoofEdgesBase = new THREE.Line(edgesBigRoofGeometryB, blackOutline);
     bigRoofEdgesBase.name = 'bigRoofEdgesB';
     this.scene.add(bigRoofEdgesBase);

     const edgesBigRoofGeometryL = new THREE.Geometry();
     edgesBigRoofGeometryL.vertices.push(
        this.vertices[0],
        this.vertices[2],
        this.vertices[4],
     );
     const oldBigRoofEdgesL = this.scene.getObjectByName('bigRoofEdgesL');
     this.scene.remove(oldBigRoofEdgesL);
     const bigRoofEdgesL = new THREE.Line(edgesBigRoofGeometryL, blackOutline);
     bigRoofEdgesL.name = 'bigRoofEdgesL';
     this.scene.add(bigRoofEdgesL);

     const edgesBigRoofGeometryR = new THREE.Geometry();
     edgesBigRoofGeometryR.vertices.push(
        this.vertices[1],
        this.vertices[3],
        this.vertices[5],
     );
     const oldBigRoofEdgesR = this.scene.getObjectByName('bigRoofEdgesR');
     this.scene.remove(oldBigRoofEdgesR);
     const bigRoofEdgesR = new THREE.Line(edgesBigRoofGeometryR, blackOutline);
     bigRoofEdgesR.name = 'bigRoofEdgesR';
     this.scene.add(bigRoofEdgesR);

     const edgesBigRoofGeometryT = new THREE.Geometry();
     edgesBigRoofGeometryT.vertices.push(
        this.vertices[3],
        this.vertices[2],
     );
     const oldBigRoofEdgesT = this.scene.getObjectByName('bigRoofEdgesT');
     this.scene.remove(oldBigRoofEdgesT);
     const bigRoofEdgesT = new THREE.Line(edgesBigRoofGeometryT, blackOutline);
     bigRoofEdgesT.name = 'bigRoofEdgesT';
     this.scene.add(bigRoofEdgesT);

  }

  animate() {

    this.frameId = window.requestAnimationFrame(this.animate);
    this.controls.update();
    // dynamic geometry update
    this.roof.geometry.verticesNeedUpdate = true;
    this.roof.geometry.elementsNeedUpdate = true;
    // wireframe
    this.material.wireframe = this.state.showWireframe;
    this.material.color.setColorName(this.state.showWireframe ? 'black' : 'lightslategray');

    this.drawOutline();
    this.renderScene();
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
            </Col>
            <Col md="2">
                <FormGroup check>
                    <Label check>
                        <Input name="wireframe" type="checkbox" onChange={(e) => { this.setState({ showWireframe: e.target.checked })}} />
                        Wireframe
                    </Label>
                </FormGroup>
            </Col>
            <Col md="2">
                <FormGroup check>
                    <Label check>
                        <Input name="vertices" type="checkbox"  onChange={(e) => { this.setState({ showVertices: e.target.checked })}} />
                        Vertices
                    </Label>
                </FormGroup>
            </Col>
            <Col md="2">
                <FormGroup check>
                    <Label check>
                        <Input name="grid" type="checkbox" onChange={(e) => { this.setState({ showGrid: e.target.checked })}} />
                        Grid
                    </Label>
                </FormGroup>
            </Col>
        </Row>
      </Container>
    )
  }
}

export default Scene