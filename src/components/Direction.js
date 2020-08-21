import React, { Component } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ListGroup from 'react-bootstrap/ListGroup';
import Figure from 'react-bootstrap/Figure';
import { NoPaths, getData } from '../Shared';

export default class Direction extends Component {
	constructor(props) {
		super(props);
		this.state = { data: [], noPath: false };
	}

	async componentDidMount() {
		const Dijkstra = require('node-dijkstra');
		const graph = new Dijkstra(await getData('https://SASE-Labs-2020.github.io/assets/graph.json'));
		const buildings = graph.path(this.props.start, this.props.end);
		// convert ['nameOfBldg1', 'nameOfBldg2', 'nameOfBldg3'] to
		// [['filenameOfBldg1', 'filenameOfBldg2'], ['filenameOfBldg2', 'filenameOfBldg3']]
		if (buildings) {
			const names = await getData('https://SASE-Labs-2020.github.io/assets/names.json');
			const paths = buildings.reduce((acc, cur, idx, src) => idx < src.length - 1 ? acc.concat([[names[cur], names[src[idx+1]]]]) : acc, []);
			const urls = paths.map(path => 'https://SASE-Labs-2020.github.io/assets/directions/' + path.join('_') + '.json');
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
		} else {
			this.setState({ noPath: true });
		}
	}

	render() {
		if (this.state.noPath) {
			return <NoPaths/>;
		}
		return (
			<Tabs defaultActiveKey="0">
				{this.state.data.map((data, idx) =>
						<Tab eventKey={`${idx}`} title={`${data.origin} to ${data.destination}`}>
							<ListGroup>
								{data.info.map(item =>
										<ListGroup.Item variant="primary">
											<p>{item.instr}</p>
											<Figure>
												<Figure.Image width='90%' src={item.src ? item.src.uri : ''} style={item.src ? {} : {'display':'none'}}/>
												<Figure.Caption>{item.desc}</Figure.Caption>
											</Figure>
										</ListGroup.Item>
									)
								}
							</ListGroup>
						</Tab>
					)
				}
			</Tabs>
		)
	}
}
