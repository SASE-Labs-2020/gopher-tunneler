import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export function NoPaths() {
	return (
		<Card text="dark">
			<Card.Body>
				<Card.Title>Path not found</Card.Title>
				<Card.Subtitle className="mb-2 text-muted">You can't use the Gopher Way to get between the two buildings you selected. Try looking at the map for possible paths.</Card.Subtitle>
				<Button variant="secondary" href={`${process.env.PUBLIC_URL}/`}>Try again</Button>
			</Card.Body>
		</Card>
	);
}

export async function getData(url) {
	const response = await fetch(url);
	return response.json()
}