import React from "react";
import './Modal.scss';


const Modal = ({user,closeModal, isModalOpen}) => {

   const RoleContent = () => {
    switch(user?.role) {
        case "admin" : return (
            <>
            <strong style={{color:'red'}}>Admin Opportunities</strong> <br/>
            <p><strong>Draw:</strong>Create all type of  shapes</p>

            <p><strong>Delete:</strong>Remove all shapes or specific ones</p>
            <p><strong>Search:</strong>Find shapes by type and Place Name</p>
            <p><strong>Info:</strong>Click on the shape to see information. </p>
            </>
        );
        case "editor" :
            return (
                <>
                 <strong style={{color:'red'}}>Editor Opportunities</strong>
            <p><strong>Draw:</strong>Create only Polygon shapes</p>
            <p><strong>Delete:</strong>Remove all shapes or specific ones</p>
            <p><strong>Search:</strong>Find shapes by type and Place Name</p>
            <p><strong>Info:</strong>Click on the shape to see information. </p>
                </>
            );
            default:
                return <p>No role assigned</p>
    }
   };
   return (
    <div className={`modal-overlay ${isModalOpen ? 'open' : ''}`}>
        <div className={`modal-content ${user.role.toLowerCase()}`}>
            <button className="close-button" onClick={closeModal}>X</button>
            <h2>User Information</h2>
            <p>Name: {user.name}</p>
            <p>Role: {user.role}</p>
            
            {RoleContent()}
        </div>
    </div>
   )
}

export default Modal