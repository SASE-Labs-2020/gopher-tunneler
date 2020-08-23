import React, { Component } from 'react';
import Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Map,
  Polyline,
  TileLayer,
  Marker,
  Popup
} from 'react-leaflet';
import '../map.css';
import Spinner from 'react-bootstrap/Spinner';
import { NoPaths, getData } from '../Shared';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

// pull images from cdn instead of storing locally
Leaflet.Icon.Default.imagePath = '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/';

export default class AppMap extends Component {
	constructor(props) {
		super(props);
		this.state = { data: [], markerData: [], isLoading: true, noPath: false };
	}

	async componentWillMount() {
		// urls for the direction jsons
		var urls;
		var marker_urls;
		const Dijkstra = require('node-dijkstra');
		const graph = await getData('https://SASE-Labs-2020.github.io/assets/graph.json');
		const edsger = new Dijkstra(graph);
		const names = await getData('https://SASE-Labs-2020.github.io/assets/names.json');
		if (this.props.start === 'null') {
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
						if (!names[path[0]]) {
							console.log('Please submit a contribution to fix this: ' + path[0]);
						}
						if (!names[path[1]]) {
							console.log('Please submit a contribution to fix this: ' + path[1]);
						}
						return 'https://SASE-Labs-2020.github.io/assets/directions/' + new_path.join('_') + '.json';
					}
				)
			);
			urls = [].concat.apply([], unflattened_urls);
			marker_urls = Object.values(names).map(name => 'https://SASE-Labs-2020.github.io/assets/informations/' + name + '.json');
		} else {
			const buildings = edsger.path(this.props.start, this.props.end);
			if (!buildings) {
				return this.setState({ isLoading: false, noPath: true });
			}
			// convert ['buildingA', 'buildingB', 'buildingC'] to
			// [['filenameA', 'filenameB'], ['filenameB', 'filenameC']]
			const paths = buildings.reduce((acc, cur, idx, src) => idx < src.length -1 ? acc.concat([[names[cur], names[src[idx+1]]]]) : acc, []);
			urls = paths.map(path => 'https://SASE-Labs-2020.github.io/assets/directions/' + path.join('_') + '.json');
			marker_urls = buildings.map(building => 'https://SASE-Labs-2020.github.io/assets/informations/' + names[building] + '.json');
		}
		urls.forEach(url => {
			return fetch(url)
			.then(response => response.json())
			.then((responseData) => {
				this.setState(
					(prevState) => {
						return {
							data: prevState.data.concat(responseData),
							isLoading: false
						};
					}
				);
			});
		});
		marker_urls.forEach(url => {
			return fetch(url)
			.then(response => response.json())
			.then((responseData) => {
				this.setState(
					(prevState) => {
						return {
							markerData: prevState.markerData.concat(responseData),
							isLoading: false
						};
					}
				);
			});
		});
	}

	render() {
		if (this.state.isLoading) {
			return <Spinner animation="border" variant="dark"/>;
		}
		if (this.state.noPath) {
			return <NoPaths/>;
		}
		return (
			<Tabs defaultActiveKey='map' variant='pills'>
				<Tab eventKey='map' title={this.props.start === 'null' ? 'All Buildings and Paths' : `${this.props.start} to ${this.props.end}`}>
					<Map center={[44.974208, -93.2325]} zoom={15}>
						<TileLayer
   		       			attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
   		       			url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
   		     		/>
						<Polyline color="#0668B3" positions={this.state.data.map(json => json.coordinates.map(point => [point.latitude, point.longitude]))} />
						{this.state.markerData.map(json => {
							return (
								<Marker position={[json.location.latitude, json.location.longitude]}>
									<Popup>
										<h3>{json.building}</h3>
										{json.info.university ? <h8 style={{ 'white-space': 'pre-line' }}>{json.info.university}<br/><br/></h8> : null}
										{json.info.public ? <h8 style={{ 'white-space': 'pre-line' }}>{json.info.public}<br/><br/></h8> : null}
										{json.info.accessibility ? <h8 style={{ 'white-space': 'pre-line' }}>{json.info.accessibility}<br/><br/></h8> : null}
									</Popup>
								</Marker>
							);
						})}
					</Map>
				</Tab>
				{this.props.start === 'null' ? null : <Tab eventKey='reset' title={<a href={`${process.env.PUBLIC_URL}/map?start=null&end=null`} onClick={() => window.location.href = `${process.env.PUBLIC_URL}/map?start=null&end=null`}>Reset Map</a>}/>}
			</Tabs>
		);
	}
}
