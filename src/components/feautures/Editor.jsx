import {
  GoogleMap,
  DrawingManager,
  useJsApiLoader,
  Polygon,
} from "@react-google-maps/api";
import React, { useState, useEffect } from "react";
import "../styles/Dashboard.scss";
import { useNavigate } from "react-router-dom";

import Header from "../common/Header";
import ShapeInfo from "./AllShapesInfo";
import { notification } from "antd";

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const libraries = ["drawing", "places"];

const GoogleMapEditor = () => {
  const [polygons, setPolygons] = useState([]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: libraries,
  });
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
      message: "Dear editor",
      description: "You can use only Polygon shape",
    });
  }, []);

  const saveShapesToStorage = (shapes) => {
    localStorage.setItem("shapes", JSON.stringify(shapes));
  };

  const getPlaceName = async (lat, lng) => {
    if (typeof window.google === "undefined" || !window.google.maps) {
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
    if (typeof window.google === "undefined" || !window.google.maps) {
      console.error("Google Maps not loaded");
      return;
    }

    const user = JSON.parse(sessionStorage.getItem("user"));
    const path = polygon
      .getPath()
      .getArray()
      .map((latLng) => ({
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
        place: placeName,
      };

      setPolygons((prev) => {
        const updatedShapes = [...prev, shapeData];
        saveShapesToStorage(updatedShapes);
        return updatedShapes;
      });

      polygon.setMap(null);
    } catch (error) {
      console.error("Error fetching place name:", error);
    }
  };
  const logout = () => {
    sessionStorage.removeItem("user");
    localStorage.removeItem("shapes");
    navigate("/login");
  };

  if (!isLoaded || !window.google || !window.google.maps) {
    return <div>Loading...</div>;
  }

  const filteredPolygonsLast = polygons.slice(-1);

  return (
    <div className="app-container">
      <Header
        user={user}
        logout={logout}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="dashboard-container">
        <div className="main-content">
          <div className="sidebar"></div>
          <ShapeInfo
            className="shape-info"
            shapes={polygons}
            searchTerm={searchTerm}
            setPolygons={setPolygons}
          />
          <div className="map-container">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "55vh" }}
              className="google-map"
              center={{ lat: 40.0691, lng: 45.0382 }}
              zoom={15}
            >
              {isLoaded && (
                <DrawingManager
                  drawingControl={true}
                  drawingControlOptions={{
                    position: window.google.maps.ControlPosition.TOP_CENTER,
                  }}
                  polygonOptions={{
                    fillColor: "#FFE047",
                    strokeWeight: 2,
                    fillOpacity: 0.5,
                    draggable: true,
                    editable: true,
                  }}
                  onPolygonComplete={PolygonComplete}
                />
              )}

              {polygons.map((shape, index) => {
                if (shape.type === "Polygon") {
                  return (
                    <Polygon
                      key={index}
                      paths={shape.coordinates}
                      options={{
                        fillColor: "#FFE047",
                        strokeWeight: 2,
                        fillOpacity: 0.5,
                        draggable: true,
                        editable: true,
                      }}
                    />
                  );
                }
                return null;
              })}
            </GoogleMap>
            <div className="created-shapes-container">
              <h2>Last Created Shape</h2>

              {filteredPolygonsLast.map((shape, index) => (
                <div key={index} className="shape-info">
                  <div className="creator-section">
                    <img
                      className="user-icon"
                      src={`https://robohash.org/${user.email}?size=50x50`}
                      alt="User Icon"
                    />
                    <strong>{shape.creator}</strong>
                    <span className="email">{shape.email}</span>
                  </div>

                  <div className="details-section">
                    <div className="detail">
                      <strong>Type:</strong>
                      <span>{shape.type}</span>
                    </div>
                    <div className="detail">
                      <strong>Place:</strong>
                      <span>{shape.place}</span>
                    </div>
                    <div className="detail">
                      <strong>Created At:</strong>
                      <span>{shape.createdAt}</span>
                    </div>
                    <div className="coordinates">
                      <strong>Coordinates:</strong>
                      <br />
                      {shape.type === "Polygon" &&
                        shape.coordinates.map((coord, i) => (
                          <span key={i}>
                            ({coord.lat.toFixed(4)}, {coord.lng.toFixed(4)})
                          </span>
                        ))}
                      {shape.type === "Rectangle" && (
                        <>
                          <span>
                            ({shape.coordinates[0].lat.toFixed(4)},{" "}
                            {shape.coordinates[0].lng.toFixed(4)})
                          </span>{" "}
                          —{" "}
                          <span>
                            ({shape.coordinates[1].lat.toFixed(4)},{" "}
                            {shape.coordinates[1].lng.toFixed(4)})
                          </span>
                        </>
                      )}
                      {shape.type === "Circle" && (
                        <span>
                          Center: ({shape.center.lat.toFixed(4)},{" "}
                          {shape.center.lng.toFixed(4)}), Radius: {shape.radius}{" "}
                          meters
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapEditor;
