import { GoogleMap, DrawingManager, useJsApiLoader, Polygon } from "@react-google-maps/api";
import React, { useState, useEffect } from "react";
import './Dashboard.scss';
import { useNavigate } from "react-router-dom";
import { notification } from "antd";

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const libraries = ['drawing', 'places'];

const GoogleMapEditor = () => {
    const [polygons, setPolygons] = useState([]);
    const [selectedPolygon, setSelectedPolygon] = useState(null);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: apiKey,
        libraries: libraries
    });
    const [user, setUser] = useState(null);
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

        notification.info({
            message: 'Dear editor',
            description: 'You can use only Polygon shape',
          });
    }, []);

    const saveShapesToStorage = (shapes) => {
        localStorage.setItem("shapes", JSON.stringify(shapes));
    };

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

    const handlePolygonComplete = async (polygon) => {
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

    const clearShapes = () => {
        localStorage.removeItem("shapes");
        setPolygons([]);
    };

    const logout = () => {
        sessionStorage.removeItem("user");
        localStorage.removeItem('shapes')
        navigate("/login");
    };
const handlePolygonClick = (polygonData) =>{
    setSelectedPolygon(polygonData)
}

const handlePolygonClickSideBar = (polygonData) => {
    setSelectedPolygon(polygonData)
}


    if (!isLoaded) {
        return <div>Loading...</div>;
    }
 

    return (
        <div className="app-container">
            <header className="app-header">
                <h1> Google Map Drawing App (Editor)</h1>
                {user && (
                    <div className="user-info">
                        <span>{user.name} {user.role}</span>
                        <button onClick={logout}>Log Out</button>
                    </div>
                )}
            </header>


            <div className="map-container">
                <GoogleMap
                    className="google-map-container"
                    mapContainerStyle={{ width: "100%", height: "500px" }}
                    center={{ lat: 40.0691, lng: 45.0382 }}
                    zoom={15}
                >
                    <DrawingManager
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
                        onPolygonComplete={handlePolygonComplete}
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
                                    onClick={() => handlePolygonClick(shape)}
                                />
                            );
                        }
                        return null;
                    })}
                </GoogleMap>


            <div className="main-container">
                <aside className="sidebar">
                    <h2> Created Shapes</h2>
                    <button onClick={clearShapes}>Clear All Shapes</button>
                    {polygons.map((shape, index) => (
                        <div 
                        key={index} 
                        className={`shape-item ${selectedPolygon === shape ? 'selected' : ''}`} 
                                onClick={() => handlePolygonClickSideBar(shape)} 
                            >
                            <strong>Type:</strong> {shape.type} <br />
                            <strong>Creator:</strong> {shape.creator} <br />
                            <strong>Place:</strong> {shape.place} <br />
                            <strong>Coordinates:</strong><br/>
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
                <span>Center: ({shape.center.lat.toFixed(4)},{shape.center.lng.toFixed(4)}),Radius: {shape.radius} meters</span>
            )}<br/>
                            <strong>Created At:</strong> {shape.createdAt} <br />
                        </div>
                    ))}
                </aside>
            </div>
            </div>
        </div>
    );
};

export default GoogleMapEditor;