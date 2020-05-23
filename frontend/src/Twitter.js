import React, { Component } from "react";
import {TwitterTimelineEmbed} from "react-twitter-embed";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";



export default class Twitter extends Component {

    render() {
        return (
            <Container>
             <Card className='card'>
                 <CardContent>
                    <TwitterTimelineEmbed
                      sourceType="list"
                      ownerScreenName="_lalusi"
                      slug="cuarentena"
                      options={{height: 400}}
                    />
                 </CardContent>
             </Card>
            </Container>
        );
    }
}

