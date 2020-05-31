import React, {Component} from "react";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent";

import Container from "@material-ui/core/Container";


class ChatBubble extends Component {


    setPosicion = (data) =>{
        if (data.username === localStorage.getItem('user')){
                return <CardContent className="bubble-right">
                     <p>{data.username}</p>
                        <hr/>
                        <h6>{data.message}</h6>
                    </CardContent>
        }
        else   return <CardContent className="bubble-left">
                     <p>{data.username}</p>
                        <hr/>
                        <h6>{data.message}</h6>
                    </CardContent>
};

    render(){
        return(
            <Container style={{float: "right", borderColor: "#538c09"}}>
                <Card className='card bubble' >
                    {console.log(this.props)}
                    {this.setPosicion(this.props.data)}
                </Card>
            </Container>
        );

    }
} export default ChatBubble;


