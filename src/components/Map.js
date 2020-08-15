import React, { Component, PureComponent } from 'react';
import GoogleMapReact from 'google-map-react';

class Polyline extends PureComponent {
	componentWillUpdate() {
		this.line.setMap(null);
	}

	componentWillUnmount() {
		this.line.setMap(null);
	}

	getPaths() {
		return this.coordinates;
		// const { origin, destination } = this.props;
		// return [
		// 	{ lat: Number(origin.lat), lng: Number(origin.lng) },
		// 	{ lat: Number(destination.lat), lng: Number(destination.lng) }
		// ];
	}

	render() {
		const Polyline = this.props.maps.Polyline;
		const renderedPolyline = this.renderPolyline();
		const paths = { path: this.getPaths() };
		this.line = new Polyline(Object.assign({}, renderedPolyline, paths));
		this.line.setMap(this.props.map);
		return null;
	}

	renderPolyline() {
		throw new Error('Implement renderPolyline method');
	}
}

class Line extends Polyline {
	renderPolyline() {
		return {
			geodesic: true,
			strokeColor: this.props.color || '#ffffff',
			strokeOpacity: 1,
			strokeWeight: 4
		}
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
		console.log('graph');
		console.log(graph);
		const names = await this.getData('https://SASE-Labs-2020.github.io/assets/names.json');
		console.log('names');
		console.log(names);
		if (this.props.start == null) {
			// convert { buildingA : { buildingB: 2, buildingC: 1 }, buldingD : { buildingE: 3 } } to
			// [[['buildingA','buildingA'],['buildingB','buildingC']], [['buildingD'], ['buildingE']]]
			const starts_ends = Object.entries(graph).map(([start, ends]) => {
				const n_ends = Object.keys(ends).length;
				return [Array(n_ends).fill(start), Object.keys(ends)];
			});
			console.log('first');
			console.log(starts_ends);
			// need something like zip in python
			const zip = rows => rows[0].map((_,index)=>rows.map(row=>row[index]));
			// convert [[['buildingA','buildingA'],['buildingB','buildingC']], [['buildingD'], ['buildingE']]] to
			// [[['buildingA', 'buildingB'], ['buildingA','buildingC']], [['buildingD', 'buildingE']]]
			const arr_paths = starts_ends.map(([starts, ends]) => zip([starts, ends]));
			console.log('second');
			console.log(arr_paths);
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
			console.log('third');
			console.log(unflattened_urls);
			urls = [].concat.apply([], unflattened_urls);
			console.log('not given');
		} else {
			const buildings = edsger.path(this.props.start, this.props.end);
			// convert ['buildingA', 'buildingB', 'buildingC'] to
			// [['filenameA', 'filenameB'], ['filenameB', 'filenameC']]
			const paths = buildings.reduce((acc, cur, idx, src) => idx < src.length -1 ? acc.concat([[names[cur], names[src[idx+1]]]]) : acc, []);
			urls = paths.map(path => 'https://SASE-Labs-2020.github.io/assests/directions/' + path.join('_') + '.json');
			console.log('given');
		}
		console.log(urls);
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
			<div style={{ height: '100vh', width: '100%' }}>
				<GoogleMapReact
					bootstrapURLKeys={{ key: 'AIzaSyBoNSt89La0kiYqET-R-evrrX6qatlyCMw' }}
					defaultCenter={{
						lat: 44.974208,
						lng: -93.2325
					}}
					defaultZoom={15}
					onGoogleApiLoaded={({map, maps}) => { this.setState({ map:map, maps:maps, mapLoaded: true }) }}
					yesIWantToUseGoogleMapApiInternals
				>
					{this.state.mapLoaded && this.state.data.map(json => {
							return <Line coordinates={json.coordinates} map={this.state.map} maps={this.state.maps}/>;
							// console.log('json coordinates');
							// console.log(json.coordinates);
							// const origin_destination = json.coordinates.reduce((acc, cur, idx, src) => idx < src.length -1 ? acc.concat([cur, src[idx+1]]) : acc, []);
							// console.log('origin to destination');
							// console.log(origin_destination);
							// return origin_destination.map(([origin, destination]) => <Line origin={{ lat: origin.latitude, lng: origin.longitude }} destination={{ lat: destination.latitude, lng: destination.longitude }}/>);
						})
					}
				</GoogleMapReact>
			</div>
		);
	}
}
