import React, {Component} from "react";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import axios from "axios";
import Chat from "../Chat";


export default class FriendsCard extends Component {
    state = {
        data: '',
        room: []
    };

    startChat = (username) => {
        axios.post('../api/chat/?user1=' + localStorage.getItem('user') + '&user2=' + username).then(
            response => {
                 console.log("@@", response);
                if (response.data !== "NO") {
                    console.log(response);
                    this.setState({
                        room: this.state.room.push(
                            {
                                id: response.data.id,
                                user1: response.data.user1,
                                user2: response.data.user2,
                            })
                    });
                    console.log(this.state);
                }

            }
        );
    };

    componentDidMount() {
        axios.get('../api/chat/?user_chat=' + localStorage.getItem('user')).then(
            response => {
                let aux = [];
                for (let i of response.data) {
                    aux.push(
                        {
                            id: i.id,
                            user1: i.user1,
                            user2: i.user2,
                        }
                    )
                }
                console.log(response);
                this.setState({
                    room: aux
                });
                console.log(this.state);
            }
        );
    }


    render() {
        return (
            <Container>
                <div className="row">
                    <Card className='card'>
                        <CardContent>
                            <h3>Amigos</h3>
                            <List component="nav">
                                {this.props.friendList.map((friend) => {
                                    return (<ListItem button onClick={() => this.startChat(friend.userr)}>

                                        <ListItemAvatar>
                                            <Avatar
                                                src={friend.user_photo}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText primary={friend.userr}/>
                                    </ListItem>)
                                })}
                            </List>
                        </CardContent>
                    </Card>
                </div>

                <div className="row">
                    {this.state.room.map((room, index) => {
                        return <Chat key={index} data={room}/>
                    })}
                </div>
            </Container>
        )
    }
}
