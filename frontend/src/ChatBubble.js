import React, {Component} from "react";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent";

import Container from "@material-ui/core/Container";


class ChatBubble extends Component {

    setPosicion = () =>{
        if (this.props.data.username === localStorage.getItem('user')){
            return "right";
        }
        else return "left";
};

    render(){
        return(
            <Container style={{float: "right", borderColor: "#538c09"}}>
                <Card className='card bubble' style={{float: this.setPosicion}}>
                    {console.log(this.props)}
                    <CardContent className='bubble'>
                        <p>{this.props.data.username}</p>
                        <hr/>
                        <h6>{this.props.data.message}</h6>
                    </CardContent>
                </Card>

            </Container>
        );

    }
} export default ChatBubble;


