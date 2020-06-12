import React, { useEffect } from 'react';
import qs from 'qs';
import axios from 'axios';

const Callback = (props) => {

    useEffect(() => {
        const code = qs.parse(props.location.search, { ignoreQueryPrefix: true }).code
        const state = qs.parse(props.location.search, { ignoreQueryPrefix: true }).state

        const spotifyCallbackAxios = axios.create();
        spotifyCallbackAxios.interceptors.request.use((config)=>{
            const token = localStorage.getItem("token");
            config.headers.Authorization = `Bearer ${token}`;
            return config;
        });
        
        spotifyCallbackAxios.post(
            "/api/spotify/auth-callback", {
                code: code,
                state: state
            }
        )
        .then(() => props.history.push("/protected"))
        .catch(error => console.log(error));
    }, [props]);

    return ( 
        <div>

        </div>
    );
}
 
export default Callback;