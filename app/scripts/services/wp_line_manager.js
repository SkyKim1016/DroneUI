var WaypointLineManager = (function () {
    function constructor() {
        this.myMapMan = MapManagerMaker.getInstance();
    }

    constructor.prototype = {

        addWaypointLine: function (feature, layer, lineLayer) {
            var featureOrder = feature.getProperties().order;
            // console.log("event.order:" + featureOrder);
            //var e = "wp" + featureOrder;
            var beforeF;
            var features = layer.getSource().getFeatures();
            for (var i = 0; i < features.length; i++) {
                var order = features[i].getProperties().order;
                if (order === (featureOrder - 1)) {
                    beforeF = features[i];
                    break;
                }
            }
            if (beforeF !== null && beforeF !== undefined) {
                var wpLine = lineLayer.getSource().getFeatureById('wpLine');
                //var wpLine = lineLayer.getSource().getFeatures();
                if (wpLine !== null && wpLine !== undefined) {
                    var coordinate = feature.getGeometry().getCoordinates();
                    var collection = wpLine.getGeometry().getCoordinates();
                    collection.push(coordinate);
                    wpLine.getGeometry().setCoordinates(collection);
                } else {
                    var coordinate0 = beforeF.getGeometry().getCoordinates();
                    var coordinate1 = feature.getGeometry().getCoordinates();
                    var coordinates = [coordinate0, coordinate1];

                    var wlFeatureInfo = {
                        id: 'wpLine',
                        type: 'waypointLine',
                        coordinateInfo: {
                            type: 'lineString',
                            coordinate: coordinates
                        },
                        properties: {
                            id: 'wpLine',
                            type: 'waypointLine',
                            name: 'togosWpLine'
                        }
                    }
                    
                    var wlStyle = this.setWaypointLineStyle();
                    this.myMapMan.addFeature(wlFeatureInfo, wlStyle, lineLayer);
                }
            }
        },
        setWaypointLineStyle: function () {
            var fill = this.myMapMan.getFill('rgba(255, 255, 255, 0.2)');
            var stroke = this.myMapMan.getStroke('#1E90FF', 2.2);     
            var image = this.myMapMan.getImage(1, '#1E90FF');         
            var wlStyle = this.myMapMan.makeStyle(fill, stroke, image);
            return wlStyle;
        },
        changeWpLineCoord: function (feature, lineLayer) {
            var changeOrder = feature.getProperties().order;
            var wpLine = lineLayer.getSource().getFeatureById('wpLine');
            var newCoord = feature.getGeometry().getCoordinates();
            if (wpLine !== null) {
                //console.log("wpLine is exist!")
                var oldCoord = wpLine.getGeometry().getCoordinates();
                oldCoord[changeOrder - 1] = newCoord;
                wpLine.getGeometry().setCoordinates(oldCoord);
            }
        },
        deleteWaypointLine: function (order, layer, lineLayer) {
            var wpLine = lineLayer.getSource().getFeatureById('wpLine');
            if (wpLine !== null && wpLine !== undefined) {
                var oldCollection = wpLine.getGeometry().getCoordinates();
                var newCollection = [];
                if (order === oldCollection.length) {
                    newCollection = oldCollection.slice(0, order - 1);
                    if(order === 1){
                        lineLayer.getSource().removeFeature(wpLine);
                    }else{
                        wpLine.getGeometry().setCoordinates(newCollection);
                    }
                }else if (order <= 1) { 
                    newCollection = oldCollection.slice(1, oldCollection.length);
                    wpLine.getGeometry().setCoordinates(newCollection);
                } else {
                    var temp1 = oldCollection.slice(0, order - 1);
                    var temp2 = oldCollection.slice(order, oldCollection.length);
                    newCollection = temp1.concat(temp2);
                    wpLine.getGeometry().setCoordinates(newCollection);
                }    
            }
        },
    }
    return constructor;
})();