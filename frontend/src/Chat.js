import React, {Component} from "react";
import ChatInput from "./ChatInput";
import ChatBubble from "./ChatBubble";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import default_photo from "./assets/logocute.png";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Container from "@material-ui/core/Container";
import CardPost from "./card";


class Chat extends Component {


    ws = new WebSocket('ws://' + window.location.hostname +'/ws/chat/');
    state = {
        data : '',
        friendList : [],
        connected : [],
        disconnected : [],
        messages: [],
        room_id:[]
    };

    componentDidMount() {
        console.log(this.ws);
        this.ws.onopen = () => {
            console.log("Conectado al chat");
            this.sendMessage("Se ha conectado al chat");
             //this.ws.send("{target: 1234}")
        };


        this.ws.onmessage = event => {

            console.log(event);
            const message_data = JSON.parse(event.data);


            this.setState(state => ({messages: [...state.messages, message_data]}));
            console.log("State", this.state);
        };

        this.ws.onclose = () => {
            console.log("Desconectado");
            this.sendMessage("Se ha desconectado del chat");
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
                         <h3>{this.props.data.user2} - {this.props.data.user1} </h3>

                    <CardContent className='chat'>

                       {this.state.messages.map((m, i) => {
                           return(<ChatBubble data={m}/>)
                        })
                       }
                       <div id = "div_end"/>

                    </CardContent>
                     <ChatInput onSendMessage={(msg) =>this.sendMessage(msg)}/>
                      </CardContent>
                </Card>
            </Container>
        );

    }
} export default Chat;


