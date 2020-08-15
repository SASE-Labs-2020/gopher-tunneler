import React from 'react';
import './bootstrap.css';
import Direction from './components/Direction';
import Contributing from './components/Contributing';
import Map from './components/Map';
import {
  BrowserRouter as Router,
  Link,
  useLocation
} from "react-router-dom";


function App() {
	return (
		<Map start={null}/>
	);
}

export default App;
