'use strict';

var sceneManager = new SceneManager();
var colladaModel = null;

var changeMotion = function (rX, rY, rZ) {
    if (colladaModel)
        colladaModel.rotation.set(rX, rY, rZ);
};

var create3D = setInterval(function () {
    if (document.getElementById('3d-screen')) {
        sceneManager.initScene({
            camera: {
                x: 10,
                y: 30,
                z: 40
            },
            light: {
                x: 50,
                y: 80,
                z: 100
            },
            plane: true,
            helper: true,
            axis: true

        });
        sceneManager.initSceneControl();
        // sceneManager.startAnimate();

        var droneController = new KinematicController('models/Drone.dae');
        droneController.modelLoad(function (dae) {
            colladaModel = dae;

            dae.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeFaceNormals();
                    child.material.shading = THREE.FlatShading;
                }
            });

            dae.scale.x = dae.scale.y = dae.scale.z = 100.0;
            dae.position.y = 15;
            dae.updateMatrix();

            droneController.showShadow(dae);
            scene.add(dae);
        });

        clearInterval(create3D);
    }
}, 500);