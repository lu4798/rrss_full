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


class Chat extends Component {


    ws = new WebSocket('ws://' + window.location.hostname +'/ws/chat/',  ['auth_token', localStorage.getItem("session")]);
    state = {
        data : '',
        friendList : [],
        connected : [],
        disconnected : []
    };

    componentDidMount() {
        console.log(this.ws);
        this.ws.onopen = () => {
            console.log("Conectado al chat");
        };

        this.ws.onmessage = event => {

            console.log("Mensaje recibido: ", event.data);
            const message = JSON.parse(event.data);
        };

        this.ws.onclose = () => {
            console.log("Desconectado");
        };
    }
    sendMessage = (msg) => {
        this.ws.send(msg)
    };


    render(){
        return(
            <Container style={{float: "right", borderColor: "#538c09"}}>
                <Card className='card'>
                    <CardContent>
                        <h3>Chat</h3>
                        <List component="nav">
                            {this.state.friendList.map( (friend) => {return(<ListItem button>
                                <ListItemAvatar>
                                    <Avatar
                                        src={default_photo}
                                    />
                                </ListItemAvatar>
                                <ListItemText primary={friend} />
                            </ListItem>)})}
                        </List>
                    <ChatInput onSendMessage={(msg) => this.sendMessage(msg)}/>
                    </CardContent>
                </Card>
            </Container>
        );

    }
} export default Chat;


