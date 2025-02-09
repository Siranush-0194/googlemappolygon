import { GoogleMap, DrawingManager, useJsApiLoader, Polygon, Rectangle, Circle } from "@react-google-maps/api";
import React, { useState, useEffect } from "react";
import './Dashboard.scss'; 
import { useNavigate } from "react-router-dom";
import Search from "../Search/Search";
import ShapeDetails from "../ShapeDetails/ShapeInfo";
import Header from "../Header/Header";





const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const libraries = ['drawing', 'places'];

const GoogleMapAdmin = () => {
    const [polygons, setPolygons] = useState([]);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: apiKey,
        libraries: libraries
    });
    const [user, setUser] = useState(null);
    const [searchTerm,setSearchTerm] = useState('');
    const [selectedShape, setSelectedShape] = useState(null)
    const navigate = useNavigate();



    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const storedShapes = localStorage.getItem("shapes");
        if (storedShapes) {
            setPolygons(JSON.parse(storedShapes));
        }
    }, []);

    const saveShapesToStorage = (shapes) => {
        localStorage.setItem("shapes", JSON.stringify(shapes));
    };

    const getPlaceName = async (lat, lng) => {
        if (typeof window.google === 'undefined' || !window.google.maps) {
            console.error("Google Maps is not loaded");
            return;
        }

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
        if (typeof window.google === 'undefined' || !window.google.maps) {
            console.error("Google Maps not loaded");
            return;
        }

        const user = JSON.parse(sessionStorage.getItem("user"));
        const path = polygon.getPath().getArray().map(latLng => ({
            lat: latLng.lat(),
            lng: latLng.lng(),
        }));

        try {
            const placeName = await getPlaceName(path[0].lat, path[0].lng);
            const shapeData = {
                type: "Polygon",
                creator: user?.name,
                coordinates: path,
                createdAt: new Date().toLocaleString(),
                place: placeName
            };
            

            setPolygons(prev => {
                const updatedShapes = [...prev, shapeData];
                saveShapesToStorage(updatedShapes);
                return updatedShapes;
            });

            polygon.setMap(null);
        } catch (error) {
            console.error("Error fetching place name:", error);
        }

   
    };

    const RectangleComplete = async (rectangle) => {
        if (typeof window.google === 'undefined' || !window.google.maps) {
            console.error("Google Maps not loaded");
            return;
        }

        const bounds = rectangle.getBounds();
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const center = {
            lat: (ne.lat() + sw.lat()) / 2,
            lng: (ne.lng() + sw.lng()) / 2
        };

        try {
            const placeName = await getPlaceName(center.lat, center.lng);
            const shapeData = {
                type: "Rectangle",
                creator: user?.name,
                coordinates: [
                    { lat: ne.lat(), lng: ne.lng() },
                    { lat: sw.lat(), lng: sw.lng() }
                ],
                createdAt: new Date().toLocaleString(),
                place: placeName
            };

            setPolygons(prev => {
                const updatedShapes = [...prev, shapeData];
                saveShapesToStorage(updatedShapes);
                return updatedShapes;
            });

            rectangle.setMap(null);
        } catch (error) {
            console.error("Error fetching place name:", error);
        }
    };

    const CircleComplete = async (circle) => {
        if (typeof window.google === 'undefined' || !window.google.maps) {
            console.error("Google Maps not loaded");
            return;
        }

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

            setPolygons(prev => {
                const updatedShapes = [...prev, shapeData];
                saveShapesToStorage(updatedShapes);
                return updatedShapes;
            });

            circle.setMap(null);
        } catch (error) {
            console.error("Error fetching place name:", error);
        }
    };

    const clearShapes = () => {
        localStorage.removeItem("shapes");
        setPolygons([]);
    };

    const logout = () => {
        sessionStorage.removeItem("user");
        localStorage.removeItem('shapes')
        navigate("/login");
        
    };


    const filteredPolygons = polygons.filter((shape) => {
        const matchesCreator = shape.creator === user?.name;
        const matchesSearch =
            searchTerm === "" ||
            shape.place?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (shape.type && shape.type.toLowerCase().includes(searchTerm.toLowerCase()));
    
        return matchesCreator && matchesSearch})


        const handleShapeClick = (shape) =>{
            setSelectedShape(shape)
        }

    if (!isLoaded) {
        return <div>Loading...</div>;
    }


  
    const deleteShape = (shapeIndex) =>{
        setPolygons((prevPolygons) => {
            const shapeDeleted = prevPolygons[shapeIndex];
            if(shapeDeleted?.mapObject) {
                shapeDeleted?.mapObject.setMap(null);
            }
            const updatedShapes = prevPolygons.filter((_,index) => index !== shapeIndex)
            // setPolygons(updatedShapes);
            localStorage.setItem("shapes", JSON.stringify(updatedShapes)) ;
            return updatedShapes;
        })
   
    };


    return (
        <div className="app-container">
            
            <Header user={user} logout={logout}/>
<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        

            <div className="map-container">
                <GoogleMap
                    className="google-map-container"
                    mapContainerStyle={{ width: "100%", height: "500px" }}
                    center={{ lat: 40.0691, lng: 45.0382 }}
                    zoom={15}
                >
                    <DrawingManager
                        className="drawing-manager"
                        drawingControl={true}
                        drawingControlOptions={{
                            position: window.google.maps.ControlPosition.TOP_CENTER
                        }}
                        polygonOptions={{
                            fillColor: '#FFE047',
                            strokeWeight: 2,
                            fillOpacity: 0.5,
                            draggable: true,
                            editable: true
                        }}
                        rectangleOptions={{
                            fillColor: "#4A89F3",
                            strokeWeight: 2,
                            fillOpacity: 0.5,
                            editable: true
                        }}
                        circleOptions={{
                            fillColor: "#DD4B3E",
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
                                        fillColor: '#FFE047',
                                        strokeWeight: 2,
                                        fillOpacity: 0.5,
                                        draggable: true,
                                        editable: true
                                    }}
                                    onClick={()=> handleShapeClick(shape)}
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
                                        fillColor: "#4A89F3",
                                        strokeWeight: 2,
                                        fillOpacity: 0.5,
                                        editable: true
                                    }}
                                    onClick={()=> handleShapeClick(shape)}
                                />
                            );
                        } else if (shape.type === "Circle") {
                            return (
                                <Circle
                                    key={index}
                                    center={shape.center}
                                    radius={shape.radius}
                                    options={{
                                        fillColor: "#DD4B3E",
                                        strokeWeight: 2,
                                        fillOpacity: 0.5,
                                        editable: true
                                    }}
                                    onClick={()=> handleShapeClick(shape)}
                                />
                            );
                        }
                        return null;
                    })}
                </GoogleMap>

                {selectedShape && (
                        <ShapeDetails shape={selectedShape} closeModal={() => setSelectedShape(null)}/>
                    )}
                <div className="main-container">
                <aside className="sidebar">
                    <h2> Created Shapes</h2>
                    <button onClick={() => { clearShapes(); }}>
                        Clear All Shapes
                    </button>
                    {filteredPolygons.map((shape, index) => (
                        <div key={index} className="shape-item" >
                            <button style={{color:"white",background:"red"}}onClick={()=>{deleteShape(index) }}>Delete</button>
                            <strong>Type:</strong> {shape.type} <br />
                            <strong>Creator:</strong> {shape.creator} <br />
                            <strong>Place:</strong> {shape.place} <br />
                            <strong>Coordinate:</strong> <br />
                            {shape.type === 'Polygon' && shape.coordinates.map((coord,index) => (
                                <span key={index}>({coord.lat.toFixed(4)}, {coord.lng.toFixed(4)})</span>
                            ))}
                            {shape.type === "Rectangle" && (
                <>
                    <span>({shape.coordinates[0].lat.toFixed(4)}, {shape.coordinates[0].lng.toFixed(4)})</span> &mdash; 
                    <span>({shape.coordinates[1].lat.toFixed(4)}, {shape.coordinates[1].lng.toFixed(4)})</span>
                </>
            )}
            {shape.type === "Circle" && (
                <span>Center: ({shape.center.lat.toFixed(4)}, {shape.center.lng.toFixed(4)}), Radius: {shape.radius} meters</span>
            )}
            <br />
                            
                            <strong>Created At:</strong> {shape.createdAt} <br />
                        </div>
                    ))}
                </aside>
            </div>
            </div>
        </div>
    );
};

export default GoogleMapAdmin;