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



export default class FriendsCard extends Component{
    state = {
        data : '',
        friendList : [],
        connected : [],
        disconnected : [],
    };

    startChat =(username)=>{
            axios.post('../api/chat/?user1=' + localStorage.getItem('user') + '&user2=' + username).then(
            response => {
                console.log(response);
            }
        );
    };


    render()
    {
        return(
            <Container>
                <Card className='card'>

                    <CardContent>
                        <h3>Amigos</h3>
                        <List component="nav">
                            {this.props.friendList.map( (friend) => {return(<ListItem button onClick={() => this.startChat(friend.userr)}     >

                                <ListItemAvatar >
                                    <Avatar
                                        src={friend.user_photo}
                                    />
                                </ListItemAvatar>
                                <ListItemText primary={friend.userr}  />
                            </ListItem >)})}
                        </List>
                    </CardContent>
                </Card>
            </Container>
        )
    }
}
