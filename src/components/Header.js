import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Direction from './Direction';
import Contributing from './Contributing';
import RouteSelection from './RouteSelection';
import AppMap from './AppMap';
import { Nav } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  useLocation,
  Link,
  Switch,
  Route
} from "react-router-dom";
import logo from '../sase_logo.png';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// the query parameter hook is only usable in function components
// wrap all of our components as a function for use

function AMComponent() {
	let query = useQuery();

	return <AppMap start={query.get('start')} end={query.get('end')}/>;
}

function DComponent() {
	let query = useQuery();

	return <Direction start={query.get('start')} end={query.get('end')}/>;
}

var routes = [
	{
		path: '/',
		exact: true,
		main: () => <RouteSelection/>
	},
	{
		path: '/map',
		main: () => <AMComponent/>
	},
	{
		path: '/directions',
		main: () => <DComponent/>
	},
	{
		path: '/contributing',
		main: () => <Contributing/>
	}
]

function HeaderComponent() {
	let query = useQuery();

	return (
		<div>
			<Navbar bg='primary'>
				<Navbar.Brand href="https://saseumn.org">
					<img src={logo} alt='SASE Logo' height='30vh'/>{' '}
				</Navbar.Brand>
				<Nav>
					<Nav.Link><Link to={`/?start=${query.get('start')}&end=${query.get('end')}`}>Route Selection</Link></Nav.Link>
					<Nav.Link><Link to={`/map?start=${query.get('start')}&end=${query.get('end')}`}>Map</Link></Nav.Link>
					<Nav.Link><Link to={`/directions?start=${query.get('start')}&end=${query.get('end')}`}>Directions</Link></Nav.Link>
					<Nav.Link><Link to={`/contributing?start=${query.get('start')}&end=${query.get('end')}`}>Contributing</Link></Nav.Link>
				</Nav>
			</Navbar>
			<Switch>
				<div style={{ 'padding-top': 20 }}>
					{routes.map((route, index) => (
						<Route
							key={index}
							path={route.path}
							exact={route.exact}
							children={<route.main/>}
						/>
					))}
				</div>
			</Switch>
		</div>
	);
}

export default function Header() {
	document.title = 'Gopher Tunneler'
	return (
		<Router basename={`${process.env.PUBLIC_URL}/`}>
			<HeaderComponent/>
		</Router>
	);
}
