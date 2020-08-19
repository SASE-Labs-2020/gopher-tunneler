import React from 'react';
import './bootstrap.css';
import Direction from './components/Direction';
import Contributing from './components/Contributing';
import AppMap from './components/AppMap';
import {
  BrowserRouter as Router,
  Link,
  useLocation
} from "react-router-dom";
import RouteSelection from './components/RouteSelection';


function App() {
	return (
    <AppMap start={null}/>
  );
}

export default App;
