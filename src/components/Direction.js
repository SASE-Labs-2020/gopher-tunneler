import React, { Component } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Figure from 'react-bootstrap/Figure';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
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
			urls.forEach(async url => {
				return await fetch(url)
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
			<Accordion defaultActiveKey='0'>
				{this.state.data.map((data, idx) =>
					<Card>
						<Accordion.Toggle as={Card.Header} eventKey={`${idx}`}>
							{`${data.origin} to ${data.destination}`}
						</Accordion.Toggle>
						<Accordion.Collapse eventKey={`${idx}`}>
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
						</Accordion.Collapse>
					</Card>
				)}
			</Accordion>
		);
	}
}
