import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

export default class RouteSelection extends Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };
    }

    async getData(url) {
		const response = await fetch(url);
		return response.json();
	}

    async componentDidMount() {
        const names = Object.keys(await this.getData('https://SASE-Labs-2020.github.io/assets/names.json'));
        this.setState({ data: names })
    }

    render() {
        return (
            <Card text="dark">
                <Form as='form' action='/map' method='GET' id='rs'>
                    <Form.Group controlId="start">
                        <Form.Label>Choose a Start Building</Form.Label>
                        <Form.Control as="select" name="start" id="start" form='rs' required>
                            {this.state.data.map(name => <option value={name}>{name}</option>)}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="end">
                        <Form.Label>Choose an End Building</Form.Label>
                        <Form.Control as="select" name="end" id="end" form='rs' required>
                            {this.state.data.map(name => <option value={name}>{name}</option>)}
                        </Form.Control>
                    </Form.Group>
                    <Button variant="secondary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Card>
        );
    }
}