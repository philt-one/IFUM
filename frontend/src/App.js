import React from 'react';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import Home from './routes/Home';
import Protected from './routes/Protected';
import ProtectedRoute from './components/ProtectedRoute';
import UnprotectedRoute from './components/UnprotectedRoute';

import {
	Switch,
	Route
} from "react-router-dom";


function App() {

	return (
		<Switch>
			<Route exact path="/" component={Home} />
			<UnprotectedRoute path="/signin" component={SignInForm} />
			<UnprotectedRoute path="/signup" component={SignUpForm} />
			<ProtectedRoute path="/protected" component={Protected} />
		</Switch>
	);
}

export default App;
