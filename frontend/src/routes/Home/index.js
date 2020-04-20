import React, { Fragment } from 'react';

import { Link } from 'react-router-dom';

const Home = () => {
    return ( 
        <Fragment> 
            <Link to="/signin"><button>Sign In</button></Link>
            <Link to="/signup"><button>Sign Up</button></Link>
        </Fragment>
    );
}
 
export default Home;