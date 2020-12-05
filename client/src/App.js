
import React from 'react';
import { BrowserRouter as Router, Switch, Redirect, Route, useHistory } from 'react-router-dom';

import './App.css';

import Index from './components/Index';
import Watch from './components/Watch';

class App extends React.Component {
	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route path="/watch/:path" component={Watch_} />
						<Route path="/index/:index" component={Index_Path} />
						<Route exact path="/index" component={Index_Start} />
						<Route render={() => {
							return <Redirect to="/index" />;
						}} />
					</Switch>
				</Router>
			</div>
		);
	}

}

const updateDocumentTitle = (text) => {
	document.title = "Movie Time!";

	if(text !== undefined) {
		document.title += " - " + text;
	}
}

const Watch_ = () => {
	return (
		<Watch updateDocumentTitle={updateDocumentTitle} history={useHistory()} />
	)
}

const Index_Start = () => {
	return (
		<Index updateDocumentTitle={updateDocumentTitle} history={useHistory()} path={""} />
	)
}

const Index_Path = ({ match }) => {
	return (
		<Index updateDocumentTitle={updateDocumentTitle} history={useHistory()} path={match.params.index} />
	)
}

export default App;
