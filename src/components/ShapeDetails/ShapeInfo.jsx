import React from "react";
import './ShapeDetails.scss'



const ShapeDetails = ({shape,closeModal}) => {
    return(
        <div className="shape-details-modal">
            <div className="modal-content">
                <button className="close-button" onClick={closeModal}>
                    X
                </button>
                <h2>Shape Details</h2>
               <p> <strong>Type:</strong> {shape.type}</p> <br />
                            <strong>Creator:</strong> {shape.creator} <br />
                            <strong>Place:</strong> {shape.place} <br />
                            <strong>Coordinates:</strong><br/>
                            {shape.type === 'Polygon' && shape.coordinates.map((coord,index) => (
                                <span key={index}>({coord.lat.toFixed(4)}, {coord.lng.toFixed(4)})</span>
                            ))}<br/>
                            <strong>Created At:</strong> {shape.createdAt} <br />
            </div>
        </div>
    )
}

export default ShapeDetails;
