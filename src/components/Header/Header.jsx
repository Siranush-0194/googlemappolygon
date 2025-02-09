import React, { useState } from "react";
import './Header.scss';
import { FaUserCircle } from "react-icons/fa";
import Modal from "./Modal";
const Header = ({user,logout}) => {
    const [isModalOpen,setIsModalOpen] = useState(false);

    const handleClick = () => {
        setIsModalOpen(true)
    } ;

    const closeModal = () => {
        setIsModalOpen(false)
    }

    return (
        <header className="app-header">
            <FaUserCircle className="user-info" onClick={handleClick} />
                <h1> Google Map Drawing App</h1>
                {user && (
                    <div className="user-info">
                      
                       
                        <button onClick={logout}>Log Out</button>
                    </div>
                )}

               {isModalOpen && <Modal user={user} closeModal={closeModal}/>}
            </header>
    )
} 

export default Header;