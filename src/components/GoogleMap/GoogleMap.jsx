import { GoogleMap,DrawingManager, useJsApiLoader } from "@react-google-maps/api";
import React, { useState } from "react";
import {  Polygon } from "react-google-maps";

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const librarires = ['drawing'];

const GoogleMapComponent = ({color='FF0000'}) =>{
    const [polygons, setPolygons] = useState([]);
    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey:apiKey,
        libraries:librarires
    });

    const PolygonComplete =(polygon) =>{
        const path = polygon.getPath().getArray().map(latLng =>({
            lat:latLng.lat(),
            lng:latLng.lng(),
        }));

        setPolygons(prev => [...prev, path]);
        polygon.setMap(null);
    }

    return(
        isLoaded ? (
            <GoogleMap
            mapContainerStyle = {{width:'100%',height:'500px'}}
            center={{lat:40.0691, lng:45.0382 }}
            zoom={15}
            >
                <DrawingManager
                    drawingControl={true}
                    drawingControlOptions={{
                        position:window.google.maps.ControlPosition.TOP_CENTER,
                        drawingModes:[
                            window.google.maps.drawing.OverlayType.POLYGON,
                            window.google.maps.drawing.OverlayType.CIRCLE,
                            window.google.maps.drawing.OverlayType.RECTANGLE
                        ]
                    }}

                    polygonOptions={{
                        fillColor:color,
                        strokeWeight:2,
                        fillOpacity:0.5,
                        draggable:true,
                        editable:true
                    }}

                    rectangleOptions={{
                        fillColor:'blue',
                        strokeWeight:2,
                        fillOpacity:0.5,
                        editable:true                        
                    }}

                    circleOptions={{
                        fillColor:'yellow',
                        strokeWeight:2,
                        fillOpacity:0.5,
                        editable:true  
                    }}

                    onPolygonComplete={PolygonComplete}
                />
               {polygons.map((path,index) => (
                <Polygon
                    key={index}
                    paths={path}
                    options={{
                        fillColor:color,
                        strokeWeight:2,
                        fillOpacity:0.5,
                        draggable:true,
                        editable:true
                    }                       
                    }
                />
               ))}
            </GoogleMap>
        ) : null
    )
}



export default GoogleMapComponent;