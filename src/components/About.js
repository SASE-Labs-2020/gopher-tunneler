import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default function About() {
    return (
        <Card text="dark">
            <Card.Body>
                <Card.Subtitle className="mb-2 text-muted">Are you using a mobile device?</Card.Subtitle>
                <Card.Img src='https://miro.medium.com/max/1200/0*vqtNPYkC7qCbKAqa.png' alt='Share button on Safari'/>
                <Card.Text>
                    Select 'Add to Home Screen' on Apple or Android
                </Card.Text>
                <Card.Title>About this app</Card.Title>
                <Card.Text>
                    'Gopher Tunneler' allows you to navigate the Gopher Way at the University of Minnesota's Twin Cities campus.
                    The tunnel system is a maze-like labyrinth; get a better idea of it on the 'Map' tab. 
                    <br/><br/>
                    Want to get somewhere quick? Select your start and end points on the 'Route Selection' tab. You'll get instructions to get from 
                    building to building when you hit submit. 
                    <br/><br/>
                    The app is based on incomplete research of the tunnels. If you
                    have captioned pictures and written instructions to navigate the Gopher Way, please send them to use via the
                    'Contributing' tab!
                </Card.Text>
                <Card.Subtitle className="mb-2 text-muted">SASE Labs</Card.Subtitle>
                <Card.Text>
                    'Gopher Tunneler' was developed as a project in SASE Labs. SASE Labs is the University of Minnesota's
                    Society of Asian Scientists and Engineers laboratory division. We work on interdisciplinary STEM projects
                    and learn new skills together. In just a year, our team went from not knowing how to program in JavaScript
                    to developing this app using React and learning about git, GitHub, higher-order functions, APIs, and much 
                    more along the way!
                </Card.Text>
                <Button variant="secondary" href="https://saseumn.org">Learn more about SASE</Button>{' '}<Button variant="secondary" href="https://discord.gg/Z9VEKrh">Join our discord</Button>
            </Card.Body>
        </Card>
    );
}