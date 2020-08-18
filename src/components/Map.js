import React, { Component } from 'react';
import ReactMapboxGl, {
  ScaleControl,
  ZoomControl,
  Layer,
  Feature
} from 'react-mapbox-gl';
import Spinner from 'react-bootstrap/Spinner';

const GlMap = ReactMapboxGl({ accessToken: { token: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA' }})
const lineLayout = {
  'line-cap': 'round',
  'line-join': 'round'
};

const linePaint = {
  'line-color': '#4790E5',
  'line-width': 12
};

export default class Map extends Component {
	constructor(props) {
		super(props);
		this.state = { data: [], isLoading: true };
	}

	async getData(url) {
		const response = await fetch(url);
		return response.json();
	}

	async componentWillMount() {
		var urls;
		const Dijkstra = require('node-dijkstra');
		const graph = await this.getData('https://SASE-Labs-2020.github.io/assets/graph.json');
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
						if (!names[path[0]]) {
							console.log(path[0]);
						}
						if (!names[path[1]]) {
							console.log(path[1]);
						}
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
							data: prevState.data.concat(responseData),
						};
					}
				);
			});
		});
		this.setState({ isLoading: false });
	}

	render() {
		if (this.state.isLoading) {
			return <Spinner animation="border" variant="dark"/>;
		}
		return (
			<GlMap
				center={[44.974208, -93.2325]}
				zoom={[15]}
			>
				<ScaleControl/>
				<ZoomControl/>
				{this.state.data.map(json => 
					<Layer type="line" layout={lineLayout} paint={linePaint}>
						<Feature coordinates={json.coordinates.map(point => [point.longitude, point.latitude])}/>
					</Layer>
				)}
			</GlMap>
		);
	}
}
