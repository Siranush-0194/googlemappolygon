import React from "react";
import "../styles/ShapesInfo.scss";

const ShapeInfo = ({ shapes, setPolygons, searchTerm }) => {
  const shapeColors = {
    Polygon: "#FFE047",
    Rectangle: "#4A89F3",
    Circle: "#DD4B3E",
  };

  if (!shapes || !Array.isArray(shapes)) {
    return <p>No shape data available</p>;
  }

  const deleteShape = (shapeIndex) => {
    setPolygons((prevPolygons) => {
      const shapeDeleted = prevPolygons[shapeIndex];
      if (shapeDeleted?.mapObject) {
        shapeDeleted?.mapObject.setMap(null);
      }
      const updatedShapes = prevPolygons.filter(
        (_, index) => index !== shapeIndex
      );
      // setPolygons(updatedShapes);
      localStorage.setItem("shapes", JSON.stringify(updatedShapes));
      return updatedShapes;
    });
  };

  const filteredShapes = shapes.filter((shape) => {
    const search = searchTerm ? searchTerm.toLowerCase() : ""; // Ensure it's a string

    const coordsString =
      shape.coordinates
        ?.map((coord) => `(${coord.lat.toFixed(4)}, ${coord.lng.toFixed(4)})`)
        .join(" ") || "";

    return (
      shape.type?.toLowerCase().includes(search) ||
      shape.place?.toLowerCase().includes(search) ||
      shape.createdAt?.includes(search) ||
      coordsString.includes(search)
    );
  });
  const clearAllShapes = () => {
    localStorage.removeItem("shapes");
    setPolygons([]);
  };

  return (
    <div className="shapes-container">
      <h2>Created Shapes Information</h2>
      <div className="button-container">
        <button className="clear-all-button" onClick={() => clearAllShapes()}>
          🗑️ Clear All Shapes
        </button>
      </div>
      <div className="shape-list">
        {filteredShapes.length > 0 ? (
          filteredShapes.map((shape, index) => (
            <div key={index} className="shape-card">
              <div className="shape-details">
                <div className="shape-row">
                  <div div className="shape-field">
                    <p className="label">Coordinates</p>
                    {shape.type === "Polygon" &&
                      shape.coordinates.map((coord, idx) => (
                        <span key={idx}>
                          ({coord.lat.toFixed(4)}, {coord.lng.toFixed(4)})
                        </span>
                      ))}
                    {shape.type === "Rectangle" && (
                      <>
                        <span>
                          ({shape.coordinates[0].lat.toFixed(4)},{" "}
                          {shape.coordinates[0].lng.toFixed(4)})
                        </span>{" "}
                        &mdash;
                        <span>
                          ({shape.coordinates[1].lat.toFixed(4)},{" "}
                          {shape.coordinates[1].lng.toFixed(4)})
                        </span>
                      </>
                    )}
                    {shape.type === "Circle" && (
                      <span>
                        <strong>Center: </strong>({shape.center.lat.toFixed(4)},{" "}
                        {shape.center.lng.toFixed(4)}), <strong>Radius:</strong>{" "}
                        {shape.radius} meters
                      </span>
                    )}
                  </div>
                  <div className="shape-field">
                    <p className="label">PLace Name</p>
                    <p className="value">{shape?.place || "N/A"}</p>
                  </div>
                  <div className="shape-field">
                    <p className="label">Created Time</p>
                    <p className="value">{shape?.createdAt || "N/A"}</p>
                  </div>
                  <div
                    className="shape-status"
                    style={{
                      backgroundColor: shapeColors[shape.type] || "#ccc",
                    }}
                  >
                    {shape.type}
                  </div>
                </div>
                <button
                  className="delete-button"
                  onClick={() => deleteShape(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No Matching Shapes found .</p>
        )}
      </div>
    </div>
  );
};

export default ShapeInfo;
