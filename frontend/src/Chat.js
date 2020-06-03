import React, {Component} from "react";
import ChatInput from "./ChatInput";
import ChatBubble from "./ChatBubble";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";


class Chat extends Component {

    ws = new WebSocket('ws://' + window.location.hostname + '/ws/chat/?room_name=' + this.props.data.id);

    state = {
        data: '',
        expanded: false,
        messages: [],
    };

    componentDidMount() {

        console.log(this.props.data);
        console.log(this.ws);
        this.ws.onopen = () => {
            console.log("Conectado al chat");
            this.sendMessage("Se ha conectado al chat");
            //this.ws.send("{target: 1234}")
        };


        this.ws.onmessage = event => {
            const message_data = JSON.parse(event.data);


            this.setState(state => ({messages: [...state.messages, message_data]}));

        };

        this.ws.onclose = () => {
            console.log("Desconectado");
            this.sendMessage("Se ha desconectado del chat");
        };
    }

    sendMessage = (msg) => {
        this.ws.send(msg)
    };


    render() {
        return (
            <Card className='card friends'>
                <CardContent>
                    <div className='row chaty'>
                        <h4>{this.props.data.user2.username} - {this.props.data.user1.username}</h4>
                        <IconButton aria-label="comment" className="icon"
                                    onClick={() => this.setState({expanded: !this.state.expanded})}>
                            <ExpandMoreIcon/>
                        </IconButton>
                    </div>

                    <Collapse in={this.state.expanded} timeout="auto" unmountOnExit className="expanded">

                        <CardContent className='chat'>

                            {this.state.messages.map((m, i) => {
                                return (<ChatBubble key = {i} data={m}/>)
                            })
                            }
                            <div id="div_end"/>

                        </CardContent>
                        <ChatInput onSendMessage={(msg) => this.sendMessage(msg)}/>
                    </Collapse>

                </CardContent>
            </Card>
        );

    }
}

export default Chat;


