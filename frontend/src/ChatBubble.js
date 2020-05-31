import React, {Component} from "react";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent";

import Container from "@material-ui/core/Container";


class ChatBubble extends Component {

    render(){
        return(
            <Container style={{float: "right", borderColor: "#538c09"}}>
                <Card className='card'>
                    <CardContent>
                        <h4>{this.props.m.message}</h4>
                    </CardContent>
                </Card>
                <p>{this.props.m.username}</p>
            </Container>
        );

    }
} export default ChatBubble;


