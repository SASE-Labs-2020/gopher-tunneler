import React, { Component, PureComponent } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, DirectionsRenderer } from 'react-google-maps';

const Gmap = withScriptjs(withGoogleMap((props) =>
	<GoogleMap
		defaultZoom={15}
		defaultCenter={{ lat: 44.974208, lng: -93.2325 }}
	>
		{props.data.map(json => <Path places={json.coordinates} travelMode={window.google.maps.TravelMode.WALKING}/>)}
	</GoogleMap>
));

class Path extends Component {
	state = {
		directions: null,
		error: null
	};
	
	componentDidMount() {
		const { places, travelMode } = this.props;

		const waypoints = places.map(p =>({
		    location: {lat: p.latitude, lng: p.longitude},
		    stopover: true
		}))
		if(waypoints.length >= 2) {
			const origin = waypoints.shift().location;
			const destination = waypoints.pop().location;
			
			const directionsService = new window.google.maps.DirectionsService();
			directionsService.route(
				{
					origin: origin,
					destination: destination,
					travelMode: travelMode,
					waypoints: waypoints
				},
				(result, status) => {
					if (status === window.google.maps.DirectionsStatus.OK) {
						this.setState({ directions: result });
					} 
					// else {
					// 	this.setState({ error: result });
					// }
				}
			);
		}
	}


	render() {
		if (this.state.error) {
			return <h1>{this.state.error}</h1>;
		}
		return <DirectionsRenderer directions={this.state.directions} />;
	}
}

export default class Map extends Component {
	constructor(props) {
		super(props);
		this.state = { data: [] };
	}

	async getData(url) {
		const response = await fetch(url);
		return response.json();
	}

	async componentDidMount() {
		var urls;
		const Dijkstra = require('node-dijkstra');
		const graph = await this.getData('https://SASE-Labs-2020.github.io/assets/graph.json')
		const edsger = new Dijkstra(graph);
		const names = await this.getData('https://SASE-Labs-2020.github.io/assets/names.json');
		if (this.props.start == null) {
			// convert { buildingA : { buildingB: 2, buildingC: 1 }, buldingD : { buildingE: 3 } } to
			// [[['buildingA','buildingA'],['buildingB','buildingC']], [['buildingD'], ['buildingE']]]
			const starts_ends = Object.entries(graph).map(([start, ends]) => {
				const n_ends = Object.keys(ends).length;
				return [Array(n_ends).fill(start), Object.keys(ends)];
			});
			// need something like zip in python
			const zip = rows => rows[0].map((_,index)=>rows.map(row=>row[index]));
			// convert [[['buildingA','buildingA'],['buildingB','buildingC']], [['buildingD'], ['buildingE']]] to
			// [[['buildingA', 'buildingB'], ['buildingA','buildingC']], [['buildingD', 'buildingE']]]
			const arr_paths = starts_ends.map(([starts, ends]) => zip([starts, ends]));
			// convert [[['buildingA', 'buildingB'], ['buildingA','buildingC']], [['buildingD', 'buildingE']]] to
			// ['urlAtoB', 'urlAtoC', 'urlDtoE']
			const unflattened_urls = arr_paths.map(
				(paths) => paths.map(
					(path) => {
						const new_path = [names[path[0]], names[path[1]]];
						return 'https://SASE-Labs-2020.github.io/assets/directions/' + new_path.join('_') + '.json';
					}
				)
			);
			urls = [].concat.apply([], unflattened_urls);
		} else {
			const buildings = edsger.path(this.props.start, this.props.end);
			// convert ['buildingA', 'buildingB', 'buildingC'] to
			// [['filenameA', 'filenameB'], ['filenameB', 'filenameC']]
			const paths = buildings.reduce((acc, cur, idx, src) => idx < src.length -1 ? acc.concat([[names[cur], names[src[idx+1]]]]) : acc, []);
			urls = paths.map(path => 'https://SASE-Labs-2020.github.io/assests/directions/' + path.join('_') + '.json');
		}
		urls.forEach(url => {
			return fetch(url)
			.then(response => response.json())
			.then((responseData) => {
				this.setState(
					(prevState) => {
						return {
							data: prevState.data.concat(responseData)
						};
					}
				);
			});
		});
	}

	render() {
		return (
			<Gmap
				googleMapURL={'https://maps.googleapis.com/maps/api/js?key=AIzaSyBoNSt89La0kiYqET-R-evrrX6qatlyCMw&v=3.exp&libraries=geometry,drawing,places'}
				data={this.state.data}
				loadingElement={<div style={{ height: `100%` }} />}
				containerElement={<div style={{ height: `400px` }} />}
				mapElement={<div style={{ height: `100%` }} />}
			/>
		);
	}
}
