import React, {Component} from "react";
import ChatInput from "./ChatInput";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import default_photo from "./assets/logocute.png";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
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
} export default Chat;


