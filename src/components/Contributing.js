import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default class Contributing extends Component {
    constructor(props) {
        super(props);
    }

    render() {
		return (
			<Card text="dark">
				<Card.Body>
					<Card.Title>Contributing</Card.Title>
					<Card.Subtitle className="mb-2 text-muted">Do you know something about the Gopher Way not included on the app? YOU can add to it!</Card.Subtitle>
					<Card.Text>
The preferred way of contributing is to create an issue on GitHub. You do not need any programming knowledge to do this. All you need is an email to create an account.
					</Card.Text>
					<Button variant="secondary" href="https://github.com/SASE-Labs-2020/SASE-Labs-2020.github.io/issues/new">Create an issue</Button>
					<Card.Text>
If you do not want to create a GitHub account, you may submit an anonymous Google form.
					</Card.Text>
					<Button variant="primary" href="https://forms.gle/PUGtoRsrAP3jrcj67">Submit the form</Button>
				</Card.Body>
			</Card>
		)
    }
}
