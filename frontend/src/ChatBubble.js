import React, {Component} from "react";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent";

import Container from "@material-ui/core/Container";


class ChatBubble extends Component {

    render(){
        return(
            <Container style={{float: "right", borderColor: "#538c09"}}>
                <Card className='card bubble'>
                    {console.log(this.props)}
                    <CardContent>
                        <p>{this.props.data.username}</p>
                        <h5>{this.props.data.message}</h5>
                    </CardContent>
                </Card>

            </Container>
        );

    }
} export default ChatBubble;


