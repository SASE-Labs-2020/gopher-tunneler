import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { getData } from '../Shared';
import { Link } from 'react-router-dom';

export default class RouteSelection extends Component {
    constructor(props) {
        super(props);
        this.state = { data: [], start: null, end: null };
    }

    async getData(url) {
		const response = await fetch(url);
		return response.json();
	}

    async componentDidMount() {
        const names = Object.keys(await getData('https://SASE-Labs-2020.github.io/assets/names.json'));
        this.setState({ data: names });
    }

    logStart(e) {
        this.setState({ start: e.target.value });
    }

    logEnd(e) {
        this.setState({ end: e.target.value });
    }

    render() {
        return (
            <Card text="dark">
                <Form as='form' id='rs'>
                    <Form.Group controlId="start">
                        <Form.Label>Choose a Start Building</Form.Label>
                        <Form.Control as="select" name="start" id="start" form='rs' onChange={(e) => this.logStart(e)} required>
                            {this.state.data.map(name => <option value={name}>{name}</option>)}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="end">
                        <Form.Label>Choose an End Building</Form.Label>
                        <Form.Control as="select" name="end" id="end" form='rs' onChange={(e) => this.logEnd(e)} required>
                            {this.state.data.map(name => <option value={name}>{name}</option>)}
                        </Form.Control>
                    </Form.Group>
                    <Button variant="secondary">
                        <Link to={`/directions?start=${this.state.start}&end=${this.state.end}`}>
                            Submit
                        </Link>
                    </Button>
                </Form>
            </Card>
        );
    }
}