import React from "react"
import { Route, Redirect } from "react-router-dom";

function ProtectedRoute(props) {

    const token = localStorage.getItem("token");
    const { component: Component, ...rest } = props;

    return (
        token ?
            <Route {...rest} component={Component} /> :
            <Redirect to="/signin" />
    )
}

export default ProtectedRoute;