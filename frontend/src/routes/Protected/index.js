import React, { useContext, Fragment } from 'react';
import AuthContext from '../../contexts/AuthContext';
import axios from "axios";

const Protected = (props) => {

    const { logout } = useContext(AuthContext);
    
    const spotifyAxios = axios.create();
    spotifyAxios.interceptors.request.use((config)=>{
        const token = localStorage.getItem("token");
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    })

    
    const handleLogout = () => {
        logout();
        props.history.push('/');
    }

    const handleSpotify = () => {
        spotifyAxios.get("/api/spotify/auth")
        .then(res => {
            window.location = res.data;
        })
        .catch(error => console.log(error))
    };


    const handleTracks = () => {
        spotifyAxios.get("/api/spotify/get-user-tracks")
        .then(res => {
            console.log(res.data)
        })
        .catch(error => console.log(error))
    };

    const handlePlaylists = () => {
        spotifyAxios.get("/api/spotify/get-user-playlists")
        .then(res => {
            console.log(res.data)
        })
        .catch(error => console.log(error))
    };

    return ( 
        <Fragment>
            <button onClick={handleSpotify}>Spotify</button>
            <button onClick={handleTracks}>Get Tracks</button>
            <button onClick={handlePlaylists}>Get Playlists</button>
            <button onClick={handleLogout}>Logout</button>
        </Fragment>
    );
}
 
export default Protected;