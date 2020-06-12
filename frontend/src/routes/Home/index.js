import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import './styles.scss'


const Home = () => {
    return ( 
        <Fragment>
            <div className="container">
                <div className="row">
                    <img className="home-logo" src="/logo_transparent.png" alt="IFUM logo" />
                </div>
                <div className="row home-row">
                    <Link to="/signin">
                        <div className="col-md">
                            <button className="home-button">Sign In</button>
                        </div>
                    </Link>
                    <Link to="/signup">
                        <div className="col-md">
                            <button className="home-button">Sign Up</button>
                        </div>
                    </Link>
                </div>
            </div> 
        </Fragment>
    );
}
 
export default Home;