import React, { useState, useEffect, useContext } from 'react';
import './styles.scss';
import { motion } from "framer-motion"
import AuthContext from '../../contexts/AuthContext';


const SignUpForm = (props) => {
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ populatedCreds, setPopulatedCreds ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");

    const { signup } = useContext(AuthContext);

    const handleOnSubmit = (event) => {
        event.preventDefault()
    }

    const handleOnChangeUsername = (event) => {
        setUsername(event.target.value);
    }

    const handleOnChangePassword = (event) => {
        setPassword(event.target.value);
    }

    useEffect(() => {
        (username !== "" && password !== "" )? setPopulatedCreds(true) : setPopulatedCreds(false);
    }, [username, password]);

    const fakeUsernameValidation = () => {
        setIsLoading(true);
        signup({
            username: username,
            password: password,
            errorMessage: errorMessage
        })
        .then(()=> props.history.push("/protected"))
        .catch(err => {
            setIsLoading(false);
            setErrorMessage(err.response.data.message);
            setPopulatedCreds(false);
        })
    };

    return (
        <div>
            <img className="half-image" src="/logo_transparent.png" alt="" />
            <div className="container signin-card">
                { !isLoading ? (
                    <div>
                        <div className="row">
                            <div className="signin-title mx-auto">Sign Up to IFUM</div>
                        </div>
                        <div className="row">
                            <form className="signin-form mx-auto" onSubmit={handleOnSubmit} >
                                <div className="row">
                                    <input 
                                        type="text"
                                        name="username"
                                        placeholder="Username"
                                        className="signin-input"
                                        autoComplete="off"
                                        onChange={handleOnChangeUsername}
                                    />
                                    <input 
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        className="signin-input"
                                        autoComplete="off"
                                        onChange={handleOnChangePassword}
                                    />
                                </div>
                                <div className="row">
                                    <motion.button
                                        className={'continue-button ' + 
                                            ((username !== "" && password !== "") ? (
                                                populatedCreds ? 'isPopulated' : 'isNotPopulated'
                                                ) : "" )}
                                        onClick={fakeUsernameValidation}
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.96 }}
                                    >
                                        Sign Up
                                    </motion.button>
                                </div>
                                {
                                    errorMessage && (
                                        <p style={{color: "red"}}>{errorMessage}</p>
                                    )
                                }
                            </form>
                        </div>
                    </div>) : (
                    <div>  
                        <div className="loading-text">Please wait ...</div>
                        <div className="nb-spinner" />
                    </div>
                    )
                }
            </div>
        </div>

    );
}
 
export default SignUpForm;