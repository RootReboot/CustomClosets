////@ts-check

//TODO qlq alteraçao vai ter de remover todas as partes - avisar utilizador
//TODO paredes dos lados das gavetas a trollar
//TODO portas a trollar se num divisoes > 2
//TODO botao do lixo deve dar reset nas dimensoes?

const scaleSliders = 10;
const espessura = 0.4;
const min = 100, max = 300;
const materialDefault = new THREE.MeshPhongMaterial({
	map: new THREE.TextureLoader().load("./resources/img/wood1.jpg")
});
const divSize = 10; //cada divisao tem de ter 10 de comprimento

//! nao suporta mudanças atm
const nPrateleirasDiv = 3;
const nCabidesDiv = 3;
const nGavetasDiv = 8;

var nPrateleiras = 3, nCabides = 3, nGavetas = 8;

//!declare variables here
var orbitControls, dragControls, camera;
var keyPressed;
var ambientLight, light, directLight, lightCamera;
var materialAtual = materialDefault;
var prevMaterial = materialDefault;

var draggables = []; //all objects that can be dragged
var prateleiras = [];
var gavetas = [];
var portaDireita = [];
var portaEsquerda = [];
var cabides = [];
var divWalls = [];

var pontosMontagemPrateleiras = [];
var pontosMontagemGavetas = [];
var pontosMontagemCabides = [];

var closetOptions = {
	comprimento: 10,
	profundidade: 5,
	altura: 20
	//,wireframe: false
};

var espacoDiv = closetOptions.comprimento / 2 - espessura; //assuming only 1 initial div

var closetSliderOptions = {
	comprimento: closetOptions.comprimento * scaleSliders,
	profundidade: closetOptions.profundidade * scaleSliders,
	altura: closetOptions.altura * scaleSliders
}

var acabamentoMovel = {
	material: ''
}

var scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({
	antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x808080, 1); //background
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;

document.body.appendChild(renderer.domElement);
document.addEventListener('keydown', function (event) {
	keyPressed = event.key; // "a", "1", "Shift", etc.
});

window.addEventListener("resize", () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
});

//CONTROLS
orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
orbitControls.addEventListener('change', render);
orbitControls.enableZoom = true;
orbitControls.target.set(0, closetOptions.altura / 2, 0);

initDragControls(); //

//default materials
var woodMaterial = new THREE.MeshPhongMaterial({
	map: new THREE.TextureLoader().load("./resources/img/wood1.jpg")
});
var metalMaterial = new THREE.MeshPhongMaterial({
	map: new THREE.TextureLoader().load("./resources/img/metal1.jpg")
});
var stoneMaterialGround = new THREE.MeshPhongMaterial({
	map: new THREE.TextureLoader().load("./resources/img/stoneGround.jpg")
});


//ground
var geometryGround = new THREE.BoxGeometry(
	closetOptions.comprimento * 2,
	espessura,
	closetOptions.profundidade * 2.5
);

var groundEl = new THREE.Mesh(geometryGround, stoneMaterialGround);
groundEl.receiveShadow = true;

//walls
var wallLeft = new THREE.Mesh(createGeometrySides(), materialAtual);
var wallRight = new THREE.Mesh(createGeometrySides(), materialAtual);
var wallTop = new THREE.Mesh(createGeometryTB(), materialAtual);
var wallBottom = new THREE.Mesh(createGeometryTB(), materialAtual);
var wallBack = new THREE.Mesh(createGeometryBack(), materialAtual);
var wallDoorLeft = new THREE.Mesh(createGeometryDoor(), metalMaterial); wallDoorLeft.castShadow = true; wallDoorLeft.receiveShadow = true; wallDoorLeft.visible = false;
var wallDoorRight = new THREE.Mesh(createGeometryDoor(), metalMaterial); wallDoorRight.castShadow = true; wallDoorRight.receiveShadow = true; wallDoorRight.visible = false;
var wallDoorKnobLeft = new THREE.Mesh(createGeometryDrawerKnob(), metalMaterial); wallDoorKnobLeft.name = "wallDoorKnobLeft"; wallDoorKnobLeft.visible = false;
var wallDoorKnobRight = new THREE.Mesh(createGeometryDrawerKnob(), metalMaterial); wallDoorKnobRight.name = "wallDoorKnobRight"; wallDoorKnobRight.visible = false;
var dobradicaEsquerda = new THREE.Mesh(createGeometryDobradica(), metalMaterial);
var dobradicaDireita = new THREE.Mesh(createGeometryDobradica(), metalMaterial);

var movelComponents = [this.wallTop, this.wallBottom, this.wallBack, this.wallLeft, this.wallRight, this.wallDoorLeft, this.wallDoorRight, this.wallDoorKnobLeft, this.wallDoorKnobRight];


//define groups
var closet = new THREE.Group();
var ground = new THREE.Group();

//add all walls
closet.add(wallLeft);
closet.add(wallRight);
closet.add(wallTop);
closet.add(wallBottom);
closet.add(wallBack);
//closet.add(wallDoorLeft);
//closet.add(wallDoorRight);
//closet.add(wallDoorKnobLeft);
//closet.add(wallDoorKnobRight);
//closet.add(dobradicaDireita);
//closet.add(dobradicaEsquerda);

//add ground
ground.add(groundEl);

initPontos(); //init pontos de montagem

//this function takes the current dimensions and creates the objects and sets them up in the correct placement
setup();

defaultCameraSettings(); //changing the location of this line is dangerous -> controls depends on it
turnOnShadows();
turnOnAmbientLight();
criarFolders(); //folders de interaçao com o utilizador


//add groups to scene
scene.add(closet);
scene.add(ground);


//run
loop();

//------------ FUNCTIONS ------------
function criarGaveta() {
	if (gavetas.length === nGavetas) {
		window.alert("Não é possível criar mais gavetas");
	} else {
		//defaultCameraSettings(); //make closet show front side
		var drawer = new THREE.Mesh(createGavetaGeometry(), getSelectedMaterial());
		drawer.castShadow = true;
		drawer.receiveShadow = true;
		gavetas.push(drawer);
		movelComponents.push(drawer);
		draggables.push(drawer);
		scene.add(drawer);
		putComponentInStartPosGaveta(drawer);
	}
}

function abrirGavetaMovimento(drawer) {
	drawer.position.z += 0.04;
	return drawer;
}

//função utilizado no botao de abrir gaveta
function abrirGavetaAnimacao() {

	var drawer = gavetas.pop();

	if (drawer.position.z <= closetOptions.profundidade - 1) {
		requestAnimationFrame(abrirGavetaAnimacao);
		drawer = abrirGavetaMovimento(drawer);
	}

	gavetas.push(drawer);
}

//funcao utilizada quando a tecla "o" é primida juntamente com o rato
function abrirGavetaAnimacao2() {

	if (this.abrirGavetaVar.position.z <= closetOptions.profundidade - 1) {
		requestAnimationFrame(abrirGavetaAnimacao2);
		this.abrirGavetaVar = abrirGavetaMovimento(this.abrirGavetaVar);
	}
}

var animationMoveVar, abrirGavetaVar;

function abrirGavetaAnimacaoKeyPressed(drawer) {

	this.abrirGavetaVar = drawer;
	abrirGavetaAnimacao2();
}

function fecharGavetaMovimento(drawer) {
	drawer.position.z -= 0.04;
	return drawer;
}

//função utilizado no botao de fechar gaveta
function fecharGavetaAnimacao() {

	var drawer = gavetas.pop();

	if (drawer.position.z > 0) {
		requestAnimationFrame(fecharGavetaAnimacao);
		drawer = fecharGavetaMovimento(drawer);
	}

	gavetas.push(drawer);
}

//funcao utilizada quando a tecla "c" é primida juntamente com o rato
function fecharGavetaAnimacao2() {

	if (this.gavetaFecharVar.position.z > 0) {
		requestAnimationFrame(fecharGavetaAnimacao2);
		this.gavetaFecharVar = fecharGavetaMovimento(this.gavetaFecharVar);
	}
}

var animationMoveVar2, gavetaFecharVar;

function fecharGavetaAnimacaoKeyPressed(drawer) {

	this.gavetaFecharVar = drawer;
	fecharGavetaAnimacao2();
}

function startSceneRotation() {
	document.getElementById("playButton").disabled = true;
	rotateSceneAction();
}

function pauseSceneRotation() {
	cancelAnimationFrame(animationId);
}

function rotateScene() {
	scene.rotation.y += 0.01;
}

function rotateSceneAction() {
	animationId = requestAnimationFrame(rotateSceneAction);
	rotateScene();
}

function criarPrateleira() {

	if (prateleiras.length === nPrateleiras) {
		window.alert("Não é possível criar mais prateleiras");
	} else {
		//defaultCameraSettings(); //make closet show front side

		var prat = new THREE.Mesh(createPrateleiraGeometry(), getSelectedMaterial());
		prat.castShadow = true;
		prat.receiveShadow = true;

		prateleiras.push(prat);
		movelComponents.push(prat);
		draggables.push(prat);
		scene.add(prat);
		putComponentInStartPos(prat);
	}
}

function criarCabide() {

	if (cabides.length === nCabides) {
		window.alert("Não é possível criar mais cabides");
	} else {
		//defaultCameraSettings(); //make closet show front side

		var cab = new THREE.Mesh(createGeometryHanger(), metalMaterial);
		cab.castShadow = true;
		cab.receiveShadow = true;

		cabides.push(cab);
		movelComponents.push(cab);
		draggables.push(cab);
		scene.add(cab);
		putComponentInStartPosCabide(cab);
	}
}

function putComponentInStartPos(component) {
	component.position.set(-closetOptions.comprimento * 1.1, closetOptions.altura / 2 + espessura + 1, 0); //plus one is magic
}

function putComponentInStartPosCabide(component) {
	component.position.set(-closetOptions.comprimento * 1.1 + espessura, closetOptions.altura, 0);
}

function putComponentInStartPosGaveta(component) {
	component.position.set(-closetOptions.comprimento * 1.3 + espessura, closetOptions.altura, 0);
}

function dragStartCallback(event) {

	//defaultCameraSettings(); //make closet show front side
	orbitControls.enabled = false;

	let obj = event.object;
	prevMaterial = obj.material; //save current material

	let newMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.6 });
	obj.material = newMat; // set "highlight" material

	let posMoved = obj.position.y;

	if (prateleiras.includes(obj)) { //!checking for only y position can be dangerous

		for (let i = 0; i < pontosMontagemPrateleiras.length; i++) { //check if the object we are moving was already placed, if so: "clean" his position
			if (pontosMontagemPrateleiras[i].y === posMoved) {
				pontosMontagemPrateleiras[i].ocupado = false;
			}
		}
	} else if (gavetas.includes(obj)) {

		for (let i = 0; i < pontosMontagemGavetas.length; i++) { //check if the object we are moving was already placed, if so: "clean" his position
			if (pontosMontagemGavetas[i].y === posMoved) {
				pontosMontagemGavetas[i].ocupado = false;
			}
		}

	} else if (cabides.includes(obj)) {

		for (let i = 0; i < pontosMontagemCabides.length; i++) { //check if the object we are moving was already placed, if so: "clean" his position
			if (pontosMontagemCabides[i].y === posMoved) {
				pontosMontagemCabides[i].ocupado = false;
			}
		}
	}

	if (keyPressed === 'Shift') { //shift click should remove the object
		removeObject(event.object);
		keyPressed = null; //set for next
	}

	if (keyPressed === 'o') {
		abrirGavetaAnimacaoKeyPressed(event.object);
		keyPressed = null;
	}

	if (keyPressed === 'c') {
		fecharGavetaAnimacaoKeyPressed(event.object);
		keyPressed = null;
	}

	if (keyPressed === 'm') {
		changeMaterialEvent(event.object);
		keyPressed = null;
	}

	if (keyPressed === 'Escape') {
		keyPressed = null;
	}
}

function dragEndCallback(event) { //logica do encaixe

	let moved = event.object;
	moved.material = prevMaterial; //reset material after drag ends

	if (!moved) { //this means the object was deleted meanwhile	
		orbitControls.enabled = true;
		return;
	}

	let pos = moved.position;

	if (pos.x > wallLeft.position.x && pos.x < wallRight.position.x
		&& pos.y < wallTop.position.y && pos.y > wallBottom.position.y) { //check if object is within snap limits (within closet)

		if (prateleiras.includes(moved)) {
			newPos = pontoMontagemMaisProximo(pos, pontosMontagemPrateleiras);

			moved.position.set(newPos.x, newPos.y, 0); //vai para o ponto mais proximo das prateleiras

		} else if (gavetas.includes(moved)) {
			newPos = pontoMontagemMaisProximo(pos, pontosMontagemGavetas);

			moved.position.set(newPos.x, newPos.y, 0); //vai para o ponto mais proximo das gavetas

		} else if (cabides.includes(moved)) {
			newPos = pontoMontagemMaisProximo(pos, pontosMontagemCabides);

			moved.position.set(newPos.x, newPos.y, espessura); //vai para o ponto mais proximo dos cabides
		}

	}
	orbitControls.enabled = true; //enable back orbit controls as object is already placed
}

function pontoMontagemMaisProximo(pos, pontosMontagem) {
	let minDif = closetOptions.altura; //max dif
	let yRet = closetOptions.altura / 2;
	let xRet = 0;
	let index = 0;

	for (let i = 0; i < pontosMontagem.length; i++) {

		if (!pontosMontagem[i].ocupado) {
			let localDifX = Math.abs(pontosMontagem[i].x - pos.x);
			let localDifY = Math.abs(pontosMontagem[i].y - pos.y);
			let localDif = Math.sqrt(Math.pow(localDifX, 2) + Math.pow(localDifY, 2));

			if (localDif < minDif) {
				minDif = localDif;
				xRet = pontosMontagem[i].x;
				yRet = pontosMontagem[i].y;
				index = i;
			}
		}
	}
	pontosMontagem[index].ocupado = true; //dizer q ficou ocupado

	return { x: xRet, y: yRet };
}

function removeAllParts() {

	//the function call makes the array go back 1 position, so we just remove the first everytime
	while (prateleiras.length) removeObject(prateleiras[0]);
	while (cabides.length) removeObject(cabides[0]);
	while (gavetas.length) removeObject(gavetas[0]);

	//clean data structures
	prateleiras = [];
	cabides = [];
	gavetas = [];
	draggables = [];

	initDragControls(); //we have to init the controls again to refresh the 'draggables'
	resetDisponibilidadePontosMontagem(); //we should make them available again
	//setup();
}

function removeObject(obj) { //!to fully remove an object we should also change the draggables, prateleiras, etc array
	scene.remove(obj);
	try {
		obj.geometry.dispose();
		obj.material.dispose();
	} catch (e) {
		console.log(e); //error will be thrown on groups
	}
	let draggablesIndex = draggables.indexOf(obj);
	let prateleirasIndex = prateleiras.indexOf(obj);
	let cabidesIndex = cabides.indexOf(obj);
	let gavetasIndex = gavetas.indexOf(obj);

	if (draggablesIndex !== -1) {
		draggables.splice(draggablesIndex, 1);
	}
	if (prateleirasIndex !== -1) {
		prateleiras.splice(prateleirasIndex, 1);
	}
	if (cabidesIndex !== -1) {
		cabides.splice(cabidesIndex, 1);
	}
	if (gavetasIndex !== -1) {
		gavetas.splice(gavetasIndex, 1);
	}
}

function resetDisponibilidadePontosMontagem() {
	for (const ponto of pontosMontagemPrateleiras) {
		ponto.ocupado = false;
	}
	for (const ponto of pontosMontagemCabides) {
		ponto.ocupado = false;
	}
	for (const ponto of pontosMontagemGavetas) {
		ponto.ocupado = false;
	}
}

function initDragControls() {
	if (dragControls) dragControls.dispose();
	dragControls = new THREE.DragControls(draggables, camera, renderer.domElement);
	dragControls.addEventListener('dragstart', dragStartCallback);
	dragControls.addEventListener('dragend', dragEndCallback);
}

function setup() {

	showPorta(false);

	wallLeft.geometry = createGeometrySides();
	wallLeft.position.set(-closetOptions.comprimento / 2 + espessura / 2, closetOptions.altura / 2 + espessura, 0);

	wallRight.geometry = createGeometrySides();
	wallRight.position.set(closetOptions.comprimento / 2 - espessura / 2, closetOptions.altura / 2 + espessura, 0);

	wallTop.geometry = createGeometryTB();
	wallTop.position.set(0, closetOptions.altura + espessura, 0);

	wallBottom.geometry = createGeometryTB();
	wallBottom.position.set(0, espessura, 0);

	wallBack.geometry = createGeometryBack();
	wallBack.position.set(0, closetOptions.altura / 2 + espessura, -closetOptions.profundidade / 2 + espessura / 2);

	groundEl.geometry = new THREE.BoxGeometry(closetOptions.comprimento * 2, espessura, closetOptions.profundidade * 2.5);

	//atualizar geometrias dos componentes
	for (let i = 0; i < prateleiras.length; i++) {
		prateleiras[i].geometry = createPrateleiraGeometry();
	}

	for (let i = 0; i < gavetas.length; i++) {
		gavetas[i].geometry = createGavetaGeometry();
	}

	for (let i = 0; i < cabides.length; i++) {
		cabides[i].geometry = createGeometryHanger();
	}

	removeAllParts(); //TODO avisar o utilizador 
	buildDivisoes();
	buildDoor();

	//set pontos com base nas dimensoes
	let nDivs = divWalls.length + 1;
	let x = wallLeft.position.x + espacoDiv / 2 + espessura / 2; //start in the middle of the left most division

	pontosMontagemCabides = [];
	pontosMontagemPrateleiras = [];
	pontosMontagemGavetas = [];

	for (let i = 0; i < nDivs; i++) {

		pontosMontagemPrateleiras.push({ x: x, y: 3 * closetOptions.altura / 4 + espessura, ocupado: false });
		pontosMontagemPrateleiras.push({ x: x, y: closetOptions.altura / 2 + espessura, ocupado: false });
		pontosMontagemPrateleiras.push({ x: x, y: closetOptions.altura / 4 + espessura, ocupado: false });

		pontosMontagemCabides.push({ x: x, y: (closetOptions.altura + espessura) - espessura * 2, ocupado: false });
		pontosMontagemCabides.push({ x: x, y: (3 * closetOptions.altura / 4 + espessura) - espessura * 2, ocupado: false });
		pontosMontagemCabides.push({ x: x, y: (closetOptions.altura / 2 + espessura) - espessura * 2, ocupado: false });

		for (let j = 0; j < nGavetas; j++) {
			if (!divWalls.length) {
				x = wallLeft.position.x + espacoDiv / 2;
			}
			pontosMontagemGavetas.push({ x: x, y: (closetOptions.altura / 8) * j, ocupado: false });
		}

		x += espacoDiv + espessura - espessura / 2; //TODO espessura?
	}
}

function buildDivisoes() {
	if (divWalls.length) { //reset divs
		for (const div of divWalls) {
			closet.remove(div);
		}
		divWalls = [];
	}

	let nParedes = Math.floor(closetOptions.comprimento / divSize) - 1;
	let nDivs = nParedes + 1;

	nPrateleiras = nPrateleirasDiv * nDivs;
	nGavetas = nGavetasDiv * nDivs;
	nCabides = nCabidesDiv * nDivs;

	let nextX = wallLeft.position.x; //start in left
	espacoDiv = (closetOptions.comprimento / (nDivs)) - espessura;

	for (let i = 0; i < nParedes; i++) {

		nextX += espacoDiv + espessura / 2; //calculate next X based on previous
		let div = new THREE.Mesh(createGeometrySides(), materialAtual);
		div.position.set(nextX, closetOptions.altura / 2 + espessura, 0);
		div.castShadow = true;
		div.receiveShadow = true;

		divWalls.push(div);
		closet.add(div);
	}
}

var wallDoorRightObj, wallDoorLeftObj;

function buildDoor() {

	wallDoorLeft.geometry = createGeometryDoor();
	wallDoorLeft.position.set((closetOptions.comprimento / 4 - 0.1), 0, espessura / 2);

	wallDoorRight.geometry = createGeometryDoor();
	wallDoorRight.position.set(-(closetOptions.comprimento / 4 - 0.1), 0, espessura / 2);

	wallDoorKnobRight.geometry = createGeometryDrawerKnob();
	wallDoorKnobRight.position.set(-(closetOptions.comprimento / 4 - espessura * 2), 0, espessura);

	wallDoorKnobLeft.geometry = createGeometryDrawerKnob();
	wallDoorKnobLeft.position.set((closetOptions.comprimento / 4 - espessura * 2), 0, espessura);

	dobradicaDireita.geometry = createGeometryDobradica();
	dobradicaDireita.position.set(closetOptions.comprimento / 2 - 0.05, closetOptions.altura / 2 + espessura, closetOptions.profundidade / 2);

	dobradicaEsquerda.geometry = createGeometryDobradica();
	dobradicaEsquerda.position.set(-(closetOptions.comprimento / 2 - 0.05), closetOptions.altura / 2 + espessura, closetOptions.profundidade / 2);

	var wallDoorRightComponentes = new THREE.Object3D();
	wallDoorRightComponentes.add(wallDoorRight);
	wallDoorRightComponentes.add(wallDoorKnobRight);

	wallDoorRight.add(wallDoorKnobRight);

	dobradicaDireita.add(wallDoorRight);
	closet.add(dobradicaDireita);

	var wallDoorLeftComponentes = new THREE.Object3D();
	wallDoorLeftComponentes.add(wallDoorLeft);
	wallDoorLeftComponentes.add(wallDoorKnobLeft);

	wallDoorLeft.add(wallDoorKnobLeft);

	dobradicaEsquerda.add(wallDoorLeft);
	closet.add(dobradicaEsquerda);
}

function abrirPortasMovimento() {
	dobradicaEsquerda.rotation.y -= 0.02;
	dobradicaDireita.rotation.y += 0.02;
}

function abrirPortasAnimacao() {

	if (dobradicaDireita.rotation.y <= (2 * Math.PI / 3)) {
		requestAnimationFrame(abrirPortasAnimacao);
		abrirPortasMovimento();
	}
}

function fecharPortasMovimento() {
	dobradicaEsquerda.rotation.y += 0.02;
	dobradicaDireita.rotation.y -= 0.02;
}

function fecharPortasAnimacao() {

	if (dobradicaDireita.rotation.y >= 0) {
		requestAnimationFrame(fecharPortasAnimacao);
		fecharPortasMovimento();
	}
}

function showPorta(bool = false) {
	wallDoorLeft.visible = bool;
	wallDoorRight.visible = bool;
	wallDoorKnobLeft.visible = bool;
	wallDoorKnobRight.visible = bool;
}

function initPontos() {
	for (let i = 0; i < nPrateleirasDiv; i++) {
		pontosMontagemPrateleiras.push({ x: 0, y: 0, ocupado: false });
	}

	for (let i = 0; i < nCabidesDiv; i++) {
		pontosMontagemCabides.push({ x: 0, y: 0, ocupado: false });
	}

	for (let i = 0; i < nGavetasDiv; i++) {
		pontosMontagemGavetas.push({ x: 0, y: 0, ocupado: false });
	}
}

function turnOnAmbientLight() {
	ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(ambientLight);
}

function turnOffLights() {

	scene.remove(light);
	scene.remove(lightCamera);
	camera.remove(lightCamera);
	document.getElementById("buttonTurnOnLights").disabled = false;
}

function turnOnLight() {
	turnOffLights();
	light = new THREE.PointLight(0xffffff, 0.5);
	light.position.set(5, 20, 10);
	light.castShadow = true;
	light.decay = 2;
	/* Will not light anything closer than 0.1 units or further than 25 units
	light.shadow.camera.near = 10;
	light.shadow.camera.far = 35;*/
	scene.add(light);
	document.getElementById("buttonTurnOnLights").disabled = true;
}

function turnOnDirectionalLight() {
	turnOffLights();
	directLight = new THREE.DirectionalLight(0xffffff, 1);
	directLight.position.set(50, 100, 100);
	scene.add(directLight);

	directLight.castShadow = true;

	/*directLight.shadow.mapSize.width = 248;
	directLight.shadow.mapSize.height = 248;*/

	var varasd = 0;

	/*directLight.shadow.camera.left = varasd;
	directLight.shadow.camera.right = varasd;
	directLight.shadow.camera.top = varasd;
	directLight.shadow.camera.bottom = varasd;*/

	/*directLight.shadow.camera.far = 350;
	directLight.shadow.bias = - 0.0001;*/

	directionLightHelper = new THREE.DirectionalLightHelper(directLight, 10);
	scene.add(directionLightHelper);
}

function turnOnLightOnCamera() {

	turnOffLights();
	scene.add(camera); // necessario visto que a camera vai agregar um filho agora (lightCamera)

	lightCamera = new THREE.PointLight(0xffffff, 0.5);
	lightCamera.decay = 2;

	camera.add(lightCamera);
}

function turnOnShadows() {
	wallLeft.receiveShadow = true;
	wallLeft.castShadow = true;
	wallRight.receiveShadow = true;
	wallRight.castShadow = true;
	wallTop.receiveShadow = true;
	wallTop.castShadow = true;
	wallBottom.receiveShadow = true;
	wallBottom.castShadow = true;
	wallBack.receiveShadow = true;
	wallBack.castShadow = true;
}

function defaultCameraSettings() {

	camera.position.x = 0;
	camera.position.y = closetOptions.altura / 2;
	camera.position.z = 30;
	camera.lookAt(0, closetOptions.altura / 2, 0);
}

function createGeometrySides() {
	return new THREE.BoxGeometry(
		espessura,
		closetOptions.altura - espessura,
		closetOptions.profundidade
	);
}

function createGeometryTB() {
	return new THREE.BoxGeometry(
		closetOptions.comprimento,
		espessura,
		closetOptions.profundidade
	);
}

function createGeometryBack() {
	return new THREE.BoxGeometry(
		closetOptions.comprimento - espessura * 2,
		closetOptions.altura - espessura,
		espessura
	);
}

function createGeometryDoor() {
	return new THREE.BoxGeometry(
		(closetOptions.comprimento) / 2,
		closetOptions.altura + espessura,
		espessura
	);
}

function createGeometryDobradica() {
	return new THREE.BoxGeometry(
		0.1,
		closetOptions.altura - espessura,
		0.1
	);
}

function createGeometryDrawerBottom() {
	let comp = closetOptions.comprimento - espessura * 2;
	if (divWalls.length) {
		comp = espacoDiv - espessura / 2
	}

	return new THREE.BoxGeometry(
		comp,
		espessura,
		closetOptions.profundidade - espessura * 2
	);
}

function createGeometryDrawerSide() {
	return new THREE.BoxGeometry(
		espessura,
		(((closetOptions.altura - espessura) - (espessura * 3)) / 4 - espessura) / 2 - espessura,
		closetOptions.profundidade - espessura * 2
	);
}

function createGeometryDrawerFB() {
	let comp = closetOptions.comprimento - espessura * 4;
	if (divWalls.length) {
		comp = espacoDiv - espessura * 2.5;
	}
	return new THREE.BoxGeometry(
		comp,
		(((closetOptions.altura - espessura) - (espessura * 3)) / 4 - espessura) / 2 - espessura,
		espessura
	);
}

function createGeometryDrawerKnob() {
	return new THREE.SphereGeometry(
		espessura / 2,
		15
	);
}

function createPrateleiraGeometry() {
	let comprimento = closetOptions.comprimento - espessura;

	if (divWalls.length) {
		comprimento = espacoDiv;
	}

	return new THREE.BoxGeometry(comprimento, espessura, closetOptions.profundidade - espessura * 2);
}

function createGeometryHanger() {
	let comp = closetOptions.comprimento - espessura * 2;
	if (divWalls.length) {
		comp = espacoDiv;
	}
	return (new THREE.CylinderGeometry(
		0.1,
		0.1,
		comp,
		20
	)).applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2)).applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI / 2));
}

function createGavetaGeometry() {
	var drawer = new THREE.Geometry();

	var drawerBottom = new THREE.Mesh(createGeometryDrawerBottom(), getSelectedMaterial());
	var drawerSideLeft = new THREE.Mesh(createGeometryDrawerSide(), getSelectedMaterial());
	var drawerSideRight = new THREE.Mesh(createGeometryDrawerSide(), getSelectedMaterial());
	var drawerFront = new THREE.Mesh(createGeometryDrawerFB(), getSelectedMaterial());
	var drawerBack = new THREE.Mesh(createGeometryDrawerFB(), getSelectedMaterial());
	var drawerKnob = new THREE.Mesh(createGeometryDrawerKnob(), metalMaterial);

	drawerBottom.receiveShadow = true;
	drawerBottom.castShadow = true;
	drawerSideLeft.receiveShadow = true;
	drawerSideLeft.castShadow = true;
	drawerSideRight.receiveShadow = true;
	drawerSideRight.castShadow = true;
	drawerFront.receiveShadow = true;
	drawerFront.castShadow = true;
	drawerBack.receiveShadow = true;
	drawerBack.castShadow = true;
	drawerKnob.receiveShadow = true;
	drawerKnob.castShadow = true;

	let xDrawerBottom = 0;
	if (divWalls.length) {
		xDrawerBottom = -espessura / 4;
	}
	drawerBottom.position.set(xDrawerBottom, espessura * 2, 0);
	let xDrawerSideL = -(closetOptions.comprimento - espessura * 2) / 2 + espessura / 2;
	let xDrawerSideR = (closetOptions.comprimento - espessura * 2) / 2 - espessura / 2;
	if (divWalls.length) {
		xDrawerSideL = -espacoDiv / 2 + espessura / 2;
		xDrawerSideR = espacoDiv / 2 - espessura;
	}
	drawerSideLeft.position.set(xDrawerSideL, espessura * 2.5 + ((((closetOptions.altura - espessura) - (espessura * 3)) / 4 - espessura) / 2 - espessura) / 2, 0);
	drawerSideRight.position.set(xDrawerSideR, espessura * 2.5 + ((((closetOptions.altura - espessura) - (espessura * 3)) / 4 - espessura) / 2 - espessura) / 2, 0);
	let xDrawerFB = 0;
	if (divWalls.length) {
		xDrawerFB = -espessura / 4;
	}
	drawerFront.position.set(xDrawerFB, espessura * 2.5 + ((((closetOptions.altura - espessura) - (espessura * 3)) / 4 - espessura) / 2 - espessura) / 2, (closetOptions.profundidade - espessura * 2) / 2 - espessura / 2);
	drawerBack.position.set(xDrawerFB, espessura * 2.5 + ((((closetOptions.altura - espessura) - (espessura * 3)) / 4 - espessura) / 2 - espessura) / 2, -(closetOptions.profundidade - espessura * 2) / 2 + espessura / 2);
	drawerKnob.position.set(0, 0.5 * (((closetOptions.altura - espessura) - (espessura * 3)) / 4) / 2 + espessura * 2, (closetOptions.profundidade - espessura * 2) / 2 + espessura / 2);

	drawer.mergeMesh(drawerBottom);
	drawer.mergeMesh(drawerSideLeft);
	drawer.mergeMesh(drawerSideRight);
	drawer.mergeMesh(drawerFront);
	drawer.mergeMesh(drawerBack);
	drawer.mergeMesh(drawerKnob);

	return drawer;
}

function criarFolders() {

	//menu
	var gui = new dat.GUI();
	var folderDimensoes = gui.addFolder("Dimensoes");

	folderDimensoes
		.add(closetSliderOptions, "comprimento")
		.name("Comprimento(cm)")
		.min(min)
		.max(max)
		.onFinishChange(() => { //TODO ex: numa mudança de 200 -> 250 nao é necessario remover todos os componentes

			if (!confirmWithUser()) return;
			removeAllParts();

			closetOptions.comprimento = closetSliderOptions.comprimento / scaleSliders;
			setup();
		});

	folderDimensoes
		.add(closetSliderOptions, "profundidade")
		.name("Profundidade(cm)")
		.min(30) //ye, not pretty
		.max(200)
		.onFinishChange(() => {

			if (!confirmWithUser()) return;
			removeAllParts();

			closetOptions.profundidade = closetSliderOptions.profundidade / scaleSliders;
			setup();
		});

	folderDimensoes
		.add(closetSliderOptions, "altura")
		.name("Altura(cm)")
		.min(min)
		.max(max)
		.onFinishChange(() => {

			if (!confirmWithUser()) return;
			removeAllParts();

			closetOptions.altura = closetSliderOptions.altura / scaleSliders;
			setup();
		});
	folderDimensoes.open();

	var folderPecas = gui.addFolder("Peças");
	folderPecas.add({ addPrateleira: criarPrateleira }, 'addPrateleira').name("Prateleira");
	folderPecas.add({ addCabide: criarCabide }, 'addCabide').name("Cabide");
	folderPecas.add({ addGaveta: criarGaveta }, 'addGaveta').name("Gaveta");
	folderPecas
		.add({ 'Porta': false }, 'Porta')
		.listen()
		.onFinishChange(
			function (value) {
				showPorta(value);
			}
		);
	folderPecas.open();
}

function setMaterial(materialStr) {
	var materialString = './resources/img/' + materialStr + '.jpg';
	var materialSelected = new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(materialString) });
	for (let index = 0; index < movelComponents.length; index++) {
		if (!movelComponents[index].name.startsWith("wallDoorKnob") && !cabides.includes(movelComponents[index])) {
			movelComponents[index].material = materialSelected;
		}
	}
	materialAtual = materialSelected;

	for (let i = 0; i < divWalls.length; i++) { //atualizar paredes das divisoes
		divWalls[i].material = materialSelected;
	}
}

function confirmWithUser() {
	if (prateleiras.length || gavetas.length || cabides.length) { //se existem componentes
		return window.confirm("Se alterar as dimensões agora vai perder todas as configurações dos componentes. Deseja continuar?");
	}
	return true;
}

function getSelectedMaterial() {
	return materialAtual;
}

function changeMaterialEvent(object) {

	document.getElementById('Materiais').addEventListener('click', function _changeMaterial() {

		var materialName = event.target.id;
		var materialString = './resources/img/' + materialName + '.jpg';
		var materialSelected = new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(materialString) });

		object.material = materialSelected;

		document.getElementById('Materiais').removeEventListener('click', _changeMaterial, true);

	}, true);
}

function update() { };

function render() {
	renderer.render(scene, camera);
};

function loop() {
	requestAnimationFrame(loop); //run this every frame
	update();
	render();
}

var animationId;

function startSceneRotation() {
	document.getElementById("playButton").disabled = true;
	rotateSceneAction();
}

function pauseSceneRotation() {
	cancelAnimationFrame(animationId);
}

function rotateScene() {
	scene.rotation.y += 0.01;
}

function rotateSceneAction() {
	animationId = requestAnimationFrame(rotateSceneAction);
	rotateScene();
}


//---------------------------------------------------------------------------------------------
function desenharDeskLamp() {

	var deskLamp = new THREE.MTLLoader();

	deskLamp.load("./resources/models/deskLight/deskLight.mtl", function (materials) {

		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);

		objLoader.load("./resources/models/deskLight/deskLight.obj", function (mesh2) {
			mesh2.traverse(function (node) {
				if (node instanceof THREE.Mesh) {
					node.castShadow = true;
					node.receiveShadow = true;
				}
			});

			scene.add(mesh2);
			mesh2.scale.set(0.05, 0.05, 0.05);
			mesh2.position.set(4, closetOptions.altura / 2 + 3 * espessura / 2 + 1.66, 2);
			mesh2.rotation.y = +Math.PI / 6;
		});
	});
}

function desenharCoffeeMachine() {

	var deskLamp = new THREE.MTLLoader();

	deskLamp.load("./resources/models/percolateur/percolateur.mtl", function (materials) {

		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);

		objLoader.load("./resources/models/percolateur/percolateur.obj", function (mesh2) {
			//coffeeMachineGlobal = mesh2;

			mesh2.traverse(function (node) {
				if (node instanceof THREE.Mesh) {
					node.castShadow = true;
					node.receiveShadow = true;
				}
			});

			scene.add(mesh2);
			mesh2.scale.set(0.1, 0.1, 0.1);
			mesh2.position.set(0, closetOptions.altura / 4 + 3 * espessura / 2 + 1.45, 0);
			mesh2.rotation.y = +Math.PI / 6;
		});
	});
}

function desenharGreenCar() {

	var greenCar = new THREE.MTLLoader();

	greenCar.load("./resources/models/raceCarGreen.mtl", function (materials) {
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);

		objLoader.load("./resources/models/raceCarGreen.obj", function (mesh3) {
			mesh3.traverse(function (node) {
				if (node instanceof THREE.Mesh) {
					node.castShadow = true;
					node.receiveShadow = true;
				}
			});

			scene.add(mesh3);
			//mesh3.position.set(0,-closetOptions.altura / 2 - espessura / 2,4);
			mesh3.scale.set(2, 2, 2);
			mesh3.position.set(-1, closetOptions.altura / 2 + 3 * espessura / 2, 0);
			mesh3.rotation.y = -Math.PI / 6 + Math.PI;
		});
	});
}


function desenharComputador() {

	var pc = new THREE.MTLLoader();

	pc.load("./resources/models/10120_LCD_Computer_Monitor_v01_L3.123cec7599fe-42d9-472b-b37a-9b96a100f29d/10120_LCD_Computer_Monitor_v01_max2011_it2.mtl", function (materials) {
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);

		objLoader.load("./resources/models/10120_LCD_Computer_Monitor_v01_L3.123cec7599fe-42d9-472b-b37a-9b96a100f29d/10120_LCD_Computer_Monitor_v01_max2011_it2.obj", function (mesh3) {
			mesh3.traverse(function (node) {
				if (node instanceof THREE.Mesh) {
					node.castShadow = true;
					node.receiveShadow = true;
				}
			});

			scene.add(mesh3);
			//mesh3.position.set(0,-closetOptions.altura / 2 - espessura / 2,4);
			mesh3.scale.set(0.1, 0.1, 0.1);
			mesh3.position.set(0, 3 * closetOptions.altura / 4 + 3 * espessura / 2, 1);
			//mesh3.rotation.y = -Math.PI/6 + Math.PI;
			mesh3.rotation.x = -Math.PI / 2;
		});
	});
}
