import { Input } from "antd";
import React from "react";
import './Search.scss'
import { FaMapMarkerAlt } from "react-icons/fa";

const Search = ({searchTerm, setSearchTerm}) => {
    return (
        <div className="search-bar">
            <input
            type="text"
            className="search-input"
            value={searchTerm}
            placeholder="Search polygons"
            onChange={(e) => setSearchTerm(e.target.value)}
            
            /> 
            
            <button className="search-button">
             <FaMapMarkerAlt/>


            </button>
          
        </div>
    )
}


export default Search;