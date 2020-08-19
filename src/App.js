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
import Header from './components/Header';
import RouteSelection from './components/RouteSelection';


function App() {
	return (
    <Header/>
  );
}

export default App;
