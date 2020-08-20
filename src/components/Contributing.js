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
					<Card.Subtitle className="mb-2 text-muted">Know something about the Gopher Way not included yet? YOU can add to it!</Card.Subtitle>
					<Card.Text>
						Option 1 (preferred): Create a GitHub Issue
					</Card.Text>
					<Card.Subtitle className="mb-2 text-muted">
						No programming knowledge needed. Only an email for an account.
					</Card.Subtitle>
					<Button variant="secondary" href="https://github.com/SASE-Labs-2020/SASE-Labs-2020.github.io/issues/new">Create an Issue</Button>
					
					<Card.Text>
						Option 2: Submit a Google Form
					</Card.Text>
					<Card.Subtitle className="mb-2 text-muted">
						If you would prefer not to make a GitHub account, we also have an anonymous form.
					</Card.Subtitle>
					<Button variant="secondary" href="https://forms.gle/PUGtoRsrAP3jrcj67">Submit the Form</Button>
				</Card.Body>
			</Card>
		)
    }
}
