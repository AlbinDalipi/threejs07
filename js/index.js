//setup scene
var scene = new THREE.Scene();
//setup camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
//setup renderer
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor("#e5e5e5");
renderer.setSize(window.innerWidth, window.innerHeight);

//create a canvas
document.body.appendChild(renderer.domElement);
//update the following every time we resize

//transform control
transform = new THREE.TransformControls(camera, renderer.domElement);


transform.addEventListener('change', () => {
    if (currentObject)
        var currentObjectModel = objectsCollection.find(model => {
            return model.get("uuid") === currentObject.uuid
        });
    if (currentObjectModel) {
        currentObjectModel.set("position", {
            "x": currentObject.position.x,
            "y": currentObject.position.y,
            "z": currentObject.position.z,
        })
        currentObjectModel.set("rotation", {
            "x": currentObject.rotation.x,
            "y": currentObject.rotation.y,
            "z": currentObject.rotation.z,
        })

    }

});
var objectView;
var objectsView;
var panoramaView;
var panoramasView;

var updateViews = () => {
    if (objectView) objectView.render();
    if (objectsView) objectsView.render();
    if (panoramaView) panoramaView.render();
    if(panoramasView) panoramasView.render();
};

transform.addEventListener('mouseDown', function () {
    orbit.enabled = false;
});
transform.addEventListener('mouseUp', function () {
    orbit.enabled = true;
});
scene.add(transform);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();


})


//define geometry
var geometry = new THREE.BoxGeometry(1, 1, 1); //radius,width,height
//define material
var cubeMaterials = [new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('https://i.imgur.com/FWMrgKF.jpg'),
    side: THREE.DoubleSide
}),
    new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('https://i.imgur.com/FWMrgKF.jpg'),
        side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('https://i.imgur.com/FWMrgKF.jpg'),
        side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('https://i.imgur.com/FWMrgKF.jpg'),
        side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('https://i.imgur.com/FWMrgKF.jpg'),
        side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('https://i.imgur.com/FWMrgKF.jpg'),
        side: THREE.DoubleSide
    })]
var material = new THREE.MeshFaceMaterial(cubeMaterials);
//define the mesh
var mesh = new THREE.Mesh(geometry, material);
//create collecctions instances \
var objectsCollection = new ObjectsCollection();
var panoramasCollection = new PanoramasCollection();
// scene.add(mesh);

//add orbit controls

orbit = new THREE.OrbitControls(camera, renderer.domElement);
orbit.update();


//add light

var light = new THREE.PointLight(0xFFFFFF, 1, 700) //color,intensity,distance
//add light position
light.position.set(10, 0, 25)

objectsView = new ObjectsView({
        el: "#objectsContainer",

        model: objectsCollection,


    });
panoramasView = new PanoramasView({
        el: "#PanoramaContainer",

        model: panoramasCollection,


    }
);


function AddCube() {

    var cube = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: 0xFFCC00}));
    cube.position.x = (Math.random() - 0.5) * 10;
    cube.position.y = (Math.random() - 0.5) * 10;
    cube.position.z = (Math.random() - 0.5) * 10;
    scene.add(cube);
    camera.lookAt(cube.position);
    //assign attributes to the new model
    var objectModel = new ObjectModel({
        class: cube,
        name: 'cube',
        uuid: cube.uuid,
        position: {
            "x": cube.position.x,
            "y": cube.position.y,
            "z": cube.position.z,
        }, rotation: {
            "x": cube.rotation.x,
            "y": cube.rotation.y,
            "z": cube.rotation.z,
        },
    });

    //add model to collection instance
    objectsCollection.add(objectModel);


    if (objectsView) {

        //assign a view to the model and render
        var element = document.createElement("div")
        element.id = "#cube-container-" + objectModel.get("uuid");
        element.classList.add("cube");
        $(element).on('click',event=>{
            // change panorama
            console.log(event.target.dataset.uuid);
        })
        document.body.appendChild(element);
        var objectView = new ObjectView({el: element, model: objectModel});
        objectView.initialize();

        objectsView.$el.append(objectView.render().$el);

    }

}

//https://i.imgur.com/ds4CeaBl.jpg lowres image
//high res https://i.imgur.com/ds4CeaB.jpg'
//1- load lowres
//2- show lowres
//3- load highres
//4- show highres
//5- hide lowres
//create views ,collections,models for spheres , on click change sphere image ,(model : id,name,highres-imgurl, lowres-imgurl)

const loader = new THREE.TextureLoader();


var lowresimg = "https://i.imgur.com/ds4CeaBl.jpg";
var highresimg = "https://i.imgur.com/ds4CeaB.jpg";
var sphereMaterial;



sphereMaterial = new THREE.MeshBasicMaterial({map: loader.load(lowresimg), side: THREE.DoubleSide})
var mesh = new THREE.Mesh(new THREE.SphereGeometry(0.8, 20, 20), sphereMaterial);
mesh.position.set(0, 0, 0);
scene.add(mesh);
camera.position.set(0, 0, 0.01);
mesh.scale.x *= -1;


//   mesh.material.map = loader.load(highresimg);

//CHANGE IMAGE


function ChangeToGarden() {

    var lowregarden = "https://i.imgur.com/nrrCafhb.jpg";
    var highresgarden = "https://i.imgur.com/jeWh8N2b.jpg";

    console.log("Changed to garden");

    sphereMaterial.map = loader.load(lowregarden);

    function Change() {

        sphereMaterial.map = loader.load(highresgarden);

    }

    setTimeout(Change, 2500);


}


var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var currentObject;

function onMouseMove(event) {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components


    mouse.x = ((event.clientX - $(renderer.domElement).offset().left) / window.innerWidth) * 2 - 1;
    mouse.y = -((event.clientY - $(renderer.domElement).offset().top) / window.innerHeight) * 2 + 1;
// https://i.imgur.com/FWMrgKF.jpg

    raycaster.setFromCamera(mouse, camera);

    for (var i = 0; i < objectsCollection.models.length; i++) {
        const object = scene.getObjectByProperty("uuid", objectsCollection.models[i].get("uuid"));
        if (object) {

            object.material.color = new THREE.Color("#ffff00");
            // object.material.needsUpdate = true;
        }

    }

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length) {
        currentObject = intersects[0].object;

        transform.attach(currentObject);
    } else {
        transform.detach();
        currentObject = null;
    }


    /*for ( var i = 0; i < intersects.length; i++ ) {

        intersects[ i ].object.material.color.set( 0xff0000 );

    }*/

}

function onMouseDown(event) {

}


window.addEventListener('mousemove', onMouseMove.bind(this), false);
window.addEventListener('mousemove', onMouseDown.bind(this), false);

scene.add(light);


var render = function () {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();









//find lowres and highres equirectangular
//load panoramas (){ for each datajson.panoramas{var panorama Model = new Model(fields , adduuid , addhighres,addlowres)  , }}
function LoadPanoramas(){

    for (var i  = 0 ; i < dataJSON.panoramas.length; i ++){


        ID =  THREE.Math.generateUUID();

        var panoramaModel = new PanoramaModel({
            name : dataJSON.panoramas[i].name,
            uuid  : ID,
            lowres: dataJSON.panoramas[i].lowres,
            highres: dataJSON.panoramas[i].highres
        }
            );

        //add model to collection instance
        panoramasCollection.add(panoramaModel);

        if (panoramasView) {

            //assign a view to the model and render
            var element = document.createElement("div")
            element.id = "#Panorama-container-" + panoramaModel.get("uuid");
            element.classList.add("panorama");
            $(element).on('click',event=>{
//show spin
                const element = event.target;

                var currentObjectModel = panoramasCollection.find(model => {
                    return model.get("uuid") === element.dataset.uuid;
                });
                if(currentObjectModel){
                    currenthighres = currentObjectModel.get("highres");
                }


                loader.load(currenthighres, (texture) => {
                    //hide spin
                    var oldMaterial = mesh.material;
                    mesh.material.map = texture;
                    oldMaterial.dispose();

                });
            })
            document.body.appendChild(element);
            var panoramaView = new PanoramaView({el: element, model: panoramaModel});
            panoramaView.initialize();

            panoramasView.$el.append(panoramaView.render().$el);

        }
        else{console.log("error panoramasView not defined")};


    }





}