import { GoogleMap,DrawingManager, useJsApiLoader,Polygon ,Rectangle,Circle} from "@react-google-maps/api";
import React, { useState,useEffect } from "react";
import { isRouteErrorResponse } from "react-router-dom";

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const librarires = ['drawing','places'];

const GoogleMapComponent = ({color='FF0000'}) =>{
    const [polygons, setPolygons] = useState([]);
    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey:apiKey,
        libraries:librarires
    });
    const [user, setUser] = useState(null);

useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
}, []);



    const getPlaceName = async (lat, lng) => {
        const geocoder = new window.google.maps.Geocoder(); 
    
        return new Promise((resolve, reject) => {
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === "OK" && results[0]) {
                    resolve(results[0].formatted_address);
                } else {
                    reject("Location not found");
                }
            });
        });
    };
    
const PolygonComplete = async (polygon) => {
    const user = JSON.parse(sessionStorage.getItem("user")) || { name: "Guest" };
    
    const path = polygon.getPath().getArray().map(latLng => ({
        lat: latLng.lat(),
        lng: latLng.lng(),
    }));

    try {
        const placeName = await getPlaceName(path[0].lat, path[0].lng); 

        const shapeData = {
            type:"Polygon",
            creator: user?.name,
            coordinates: path,
            createdAt: new Date().toLocaleString(),
            place: placeName
        };
        console.log(user?.name)
        setPolygons(prev => [...prev, shapeData]);
        polygon.setMap(null);
    } catch (error) {
        console.error("Error fetching place name:", error);
    }
};

const RectangleComplete = async(rectangle) =>{
    const bounds = rectangle.getBounds();
    const ne= bounds.getNorthEast();
    const sw= bounds.getSouthWest();
    const center ={
        lat: (ne.lat() + sw.lat()) / 2,
        lng: (ne.lng() + sw.lng()) / 2
    };
    try {
        const placeName=await getPlaceName(center.lat,center.lng);
        const shapeData ={
            type:"Rectangle",
            creator:user?.name,
            coordinates:[
                { lat: ne.lat(), lng: ne.lng() },
                { lat: sw.lat(), lng: sw.lng() }
            ],
            createdAt: new Date().toLocaleString(),
            place: placeName
        };
        setPolygons(prev=>[...prev,shapeData]);
        rectangle.setMap(null);
    } catch (error) {
        console.error("Error fetching place name:",error)
    };
    
}
const CircleComplete = async (circle) => {
    const center = circle.getCenter();
    const radius = circle.getRadius();

    try {
        const placeName = await getPlaceName(center.lat(), center.lng());
        const shapeData = {
            type: "Circle",
            creator: user?.name,
            center: { lat: center.lat(), lng: center.lng() },
            radius: radius,
            createdAt: new Date().toLocaleString(),
            place: placeName
        };
        setPolygons(prev => [...prev, shapeData]);
        circle.setMap(null);
    } catch (error) {
        console.error("Error fetching place name:", error);
    }
};


    return(
        isLoaded ? (
            <>
            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "500px" }}
                center={{ lat: 40.0691, lng: 45.0382 }}
                zoom={15}
            >
                <DrawingManager
                    drawingControl={true}
                    drawingControlOptions={{
                        position: window.google.maps.ControlPosition.TOP_CENTER,
                        drawingModes: [
                            window.google.maps.drawing.OverlayType.POLYGON,
                            window.google.maps.drawing.OverlayType.RECTANGLE,
                            window.google.maps.drawing.OverlayType.CIRCLE
                        ]
                    }}
                    polygonOptions={{
                        fillColor: color,
                        strokeWeight: 2,
                        fillOpacity: 0.5,
                        draggable: true,
                        editable: true
                    }}
                    rectangleOptions={{
                        fillColor: "blue",
                        strokeWeight: 2,
                        fillOpacity: 0.5,
                        editable: true
                    }}
                    circleOptions={{
                        fillColor: "yellow",
                        strokeWeight: 2,
                        fillOpacity: 0.5,
                        editable: true
                    }}
                    onPolygonComplete={PolygonComplete}
                    onRectangleComplete={RectangleComplete}
                    onCircleComplete={CircleComplete}
                />

              
                {polygons.map((shape, index) => {
                    if (shape.type === "Polygon") {
                        return (
                            <Polygon
                                key={index}
                                paths={shape.coordinates}
                                options={{
                                    fillColor: color,
                                    strokeWeight: 2,
                                    fillOpacity: 0.5,
                                    draggable: true,
                                    editable: true
                                }}
                            />
                        );
                    } else if (shape.type === "Rectangle") {
                        return (
                            <Rectangle
                                key={index}
                                bounds={{
                                    north: shape.coordinates[0].lat,
                                    south: shape.coordinates[1].lat,
                                    east: shape.coordinates[0].lng,
                                    west: shape.coordinates[1].lng
                                }}
                                options={{
                                    fillColor: "blue",
                                    strokeWeight: 2,
                                    fillOpacity: 0.5,
                                    editable: true
                                }}
                            />
                        );
                    } else if (shape.type === "Circle") {
                        return (
                            <Circle
                                key={index}
                                center={shape.center}
                                radius={shape.radius}
                                options={{
                                    fillColor: "yellow",
                                    strokeWeight: 2,
                                    fillOpacity: 0.5,
                                    editable: true
                                }}
                            />
                        );
                    }
                    return null;
                })}
            </GoogleMap>
            <div style={{ position: "absolute", top: 10, left: 10, background: "#fff", padding: "10px", borderRadius: "5px" }}>
                <h2>Created Shapes</h2>
                {polygons.map((shape, index) => (
                    <div key={index} style={{ marginBottom: "10px" }}>
                        <strong>Type:</strong> {shape.type} <br />
                        <strong>Creator:</strong> {shape.creator} <br />
                        <strong>Place:</strong> {shape.place} <br />
                        <strong>Created At:</strong> {shape.createdAt} <br />
                        {shape.type === "Circle" && (
                            <>
                                <strong>Center:</strong> {shape.center.lat}, {shape.center.lng} <br />
                                <strong>Radius:</strong> {shape.radius} meters <br />
                            </>
                        )}
                        {shape.type === "Rectangle" && (
                            <>
                                <strong>Bounds:</strong> <br />
                                NE: {shape.coordinates[0].lat}, {shape.coordinates[0].lng} <br />
                                SW: {shape.coordinates[1].lat}, {shape.coordinates[1].lng} <br />
                            </>
                        )}
                    </div>
                ))}
            </div>
        </>
    ) : null)
}



export default GoogleMapComponent;