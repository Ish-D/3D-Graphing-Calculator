import * as THREE from 'https://cdn.skypack.dev/three@0.137.4';
import { ParametricGeometry } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/geometries/ParametricGeometry.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, cube, controls, draughts, box, axes, blueMaterial, defaultMaterial, object;


function init() {

	box = document.querySelector('.canvas');
	let width = box.offsetWidth;
	let height = box.offsetHeight;

	console.log(width);
	console.log(height);

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );

	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setSize( width, height );
    scene.background = new THREE.Color(0x101010);
	box.appendChild( renderer.domElement );

    camera.position.z = 5;
    camera.position.y = 2;
    
    controls = new OrbitControls(camera, renderer.domElement);

    // lights
    const light = new THREE.AmbientLight( 0x6b6b6b );
    scene.add( light );

    const point1 = new THREE.PointLight(0xFFFFFF, 1, 50);
    point1.position.set(10, 15, 10);
    scene.add(point1);

    const point2 = new THREE.PointLight(0xFFFFFF, 1, 25);
    point2.position.set(10, -10, 10);
    scene.add(point2);

    // Materials
    const defaultMaterial = new THREE.LineBasicMaterial( { color: 0xFFFFFF } );
    const UV = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load("https://threejs.org/examples/textures/uv_grid_opengl.jpg"), side: THREE.DoubleSide } );

    addGridAxes();
    addAxesLabelX();
    addAxesLabelY();
    addAxesLabelZ();
    addAxesScale();
    animate();
    //addGraph();

    const mf = document.querySelector('#formula');
    mf.addEventListener('input', plotGraph);
    plotGraph();

    // uncomment here down to show plain text math

    // const latexField = document.querySelector('#latex');
    // latexField.addEventListener('input', () => 
    //   mf.setValue(latexField.value)
    // );

    // function updateLatex() {
    //   document.querySelector('#latex').value = mf.getValue('ascii-math');
    // }
    // mf.addEventListener('input', updateLatex);
    // updateLatex();
}

// Add Grid & Axes
function addGridAxes() {
    const gridColor = new THREE.Color(0x888888);
    const grid = new THREE.GridHelper(6,12, gridColor, gridColor);
    scene.add(grid);

    const axes1 = new THREE.AxesHelper(6);
    axes1.setColors(gridColor, gridColor, gridColor);
    axes1.scale.multiplyScalar(0.6)
    const axes2 = new THREE.AxesHelper(6);

    axes2.setColors(gridColor, gridColor, gridColor);
    axes2.rotation.set(0,3*Math.PI/2,Math.PI);
    axes2.scale.multiplyScalar(0.6)

    scene.add(axes1);
    scene.add(axes2);
}

function addAxesLabelX() {
    var canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    
    var ctx = canvas.getContext("2d");
    ctx.font = "44pt Helvetica";
    ctx.fillStyle = "white";
    ctx.fillText("X", 128, 128);
    var tex = new THREE.Texture(canvas);
    tex.needsUpdate = true;
    var spriteMat = new THREE.SpriteMaterial({map: tex, transparent:true, alphaTest:0.5, color:0xF1F1F1});
    
    var sprite = new THREE.Sprite(spriteMat);
    sprite.position.set(3, 0.1, 0);
    sprite.scale.multiplyScalar(0.7);
    scene.add(sprite);
}

function addAxesLabelY() {
    var canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    var ctx = canvas.getContext("2d");
    ctx.font = "44pt Helvetica";
    ctx.fillStyle = "white";
    ctx.fillText("Y", 128, 128);
    var tex = new THREE.Texture(canvas);
    tex.needsUpdate = true;
    var spriteMat = new THREE.SpriteMaterial({map: tex, transparent:true, alphaTest:0.5, color:0xF1F1F1});
    var sprite = new THREE.Sprite(spriteMat);
    
    sprite.scale.multiplyScalar(0.7);
    sprite.position.set(0, 0.1, -3);
    scene.add(sprite);
}

function addAxesLabelZ() {
    var canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    var ctx = canvas.getContext("2d");
    ctx.font = "44pt Helvetica";
    ctx.fillStyle = "white";
    ctx.fillText("Z", 128, 128);
    var tex = new THREE.Texture(canvas);
    tex.needsUpdate = true;
    var spriteMat = new THREE.SpriteMaterial({map: tex, transparent:true, alphaTest:0.5, color:0xF1F1F1});
    var sprite = new THREE.Sprite(spriteMat);
    
    sprite.scale.multiplyScalar(0.7);
    sprite.position.set(0, 3.7, 0);
    scene.add(sprite);
}

function addAxesScale() {
    for (let i = -6; i<=6; i++) {

        var canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
    
        var ctx = canvas.getContext("2d");
        ctx.font = "44pt Helvetica";
        ctx.fillStyle = "white";
        ctx.lineWidth = 1;
        ctx.fillText(i, 128, 128);
    
        var tex = new THREE.Texture(canvas);
        tex.needsUpdate = true;
        var spriteMat = new THREE.SpriteMaterial({
            map: tex,
            transparent:true,
            alphaTest:0.5,
            color:0xF1F1F1
          });
        var sprite = new THREE.Sprite(spriteMat);
        sprite.scale.multiplyScalar(0.7)
        sprite.position.set((i/2), -0.15, 0.05);
        scene.add(sprite);
    
        if (i!=0) {
            var sprite = new THREE.Sprite(spriteMat);
            sprite.scale.multiplyScalar(0.7);
            sprite.position.set(-0.1, -0.15, -i/2);
            scene.add(sprite);
        
            var sprite = new THREE.Sprite(spriteMat);
            sprite.scale.multiplyScalar(0.7);
            sprite.position.set(0, i/2, 0);
            scene.add(sprite);
        }
    }    
}

function cot(x) {return 1/Math.tan(x);}
function sec(x) {return 1/Math.cos(x);}
function csc(x) {return 1/Math.sin(x);}

function parse(func) {
    let regex = /([0-9]|pi|e|x|y|z+)([a-zA-Z]+)/g;

    func = func.replace(regex, "$1*$2");
    String.prototype.mapReplace = function(map) {
        var regex = [];
        for(var key in map)
            regex.push(key.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"));
        return this.replace(new RegExp(regex.join('|'),"g"),function(word){
            return map[word];
        });
    };

    func = func.mapReplace({"sin":  "Math.sin",
                            "cos":  "Math.cos",
                            "tan":  "Math.tan",
                            "arctan": "Math.atan",  
                            "arcsin": "Math.asin",  
                            "arccos": "Math.acos",  
                            "log":  "Math.log10",
                            "ln":   "Math.log2",
                            "pi":   "Math.PI",
                            "sqrt": "Math.sqrt",
                            "e":    "Math.E",
                            "^":    "**",  
                            "⋅":    "*"                      
    });
    func = func.replace(regex, "$1*$2");
    func = func.replace("sMath.E*c", "sec");
    func = func.mapReplace({"Math.sin **(-1)":"Math.asin",
                            "Math.cos **(-1)":"Math.acos",
                            "Math.tan **(-1)":"Math.atan"})

    func = func.replace(/(\)+)(\(+)/g, "$1*$2");

    return func;
}

function plotGraph() {

    const mf = document.querySelector('#formula');

    // let func = mf.getValue('ascii-math');
    let eq = parse(mf.getValue('ascii-math'));

    // CHANGE FROM HERE
    let xMax, xMin, yMax, yMin;

    // Allow user to change range of x/y for each
    // Also change name of visible variable depending on x=/y=/z= 
    xMax = 6;
    xMin = -6;
    
    yMax = 6;
    yMin = -6;
    
    var parametricFunction = function ( u, v, target) {
    
        var xRange = xMax - xMin;
        var yRange = yMax - yMin;
        
        var x = xRange*u + xMin;
        var y = yRange*v + yMin;

        if (/^x=/.test(eq)) {    
            let eqX = eq.replace(/^x=/, "")

            if (!/x/g.test(eqX)) {
                eqX = eqX.replace(/z/g, "x");
                var z = eval(eqX);
                target.set(z,y,x); 
            }
        }
        else if (/^y=/.test(eq)) {
            let eqY = eq.replace(/^y=/, "");
            if (!/y/g.test(eqY)) {
                eqY = eqY.replace(/z/g, "y");
                var z = eval(eqY);
                target.set(x,z,y);
            }
        }
        else {
            eq = eq.replace(/^z=/, "");
            var z = eval(eq); 
            target.set(x,y,z);
        }
    }
    
    let paraGeometry;
    scene.remove( object );    

    // allow user to change color/opacist of material along with equation
    blueMaterial = new THREE.MeshLambertMaterial({color:0x5555FF, opacity: 0.9, transparent:true, side:THREE.DoubleSide});
    
    // Possible allow user to change mesh quality setting (the 2 125s)
    paraGeometry = new ParametricGeometry(parametricFunction, 125, 125, true);
    object = new THREE.Mesh( paraGeometry, blueMaterial);
    object.scale.multiplyScalar(0.5);
    object.rotation.set(-Math.PI/2,0,0);
    scene.add( object );    
}

function animate() {
    controls.update();
	renderer.render(scene, camera);
    requestAnimationFrame( animate );
};

function onWindowResize() {
	let width = box.offsetWidth;
	let height = box.offsetHeight;

	console.log(width);
	console.log(height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

function windowToggle() {
    console.log("closeNav");

    var sidenav = document.querySelector(".sidenav");
    var canvas = document.querySelector(".canvas");

    sidenav.classList.toggle("sidenav-small");
    canvas.classList.toggle("canvas-large");
    onWindowResize();
}

window.addEventListener('resize', onWindowResize, false);
window.onload = init;
window.onWindowResize = onWindowResize;
window.windowToggle = windowToggle;
