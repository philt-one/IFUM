import React, { useContext, Fragment } from 'react';
import AuthContext from '../../contexts/AuthContext';

const Protected = (props) => {

    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        props.history.push('/');
    }
    return ( 
        <Fragment>
            <button onClick={handleLogout}>Logout</button>
        </Fragment>
    );
}
 
export default Protected;