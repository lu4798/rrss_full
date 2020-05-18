import React, {Component} from "react";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import axios from 'axios';
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import default_photo from "../assets/logocute.png"

const config = {
    headers: {
        Authorization: `JWT ${localStorage.getItem("session")}`
    }
};


export default class FriendsCard extends Component{
    state = {
        data : '',
        friendList : [],
        connected : [],
        disconnected : []
    };
    componentDidMount() {

    }



    render()
    {


        return(
            <Container style={{float: "right", borderColor: "#538c09"}}>
                <Card className='card'>

                    <CardContent>
                        <h3>Amigos</h3>
                        <List component="nav">
                            {this.props.friendList.map( (friend) => {return(<ListItem button>
                                <ListItemAvatar >
                                    <Avatar
                                        src={friend.user_photo}
                                    />
                                </ListItemAvatar>
                                <ListItemText primary={friend.userr} />
                            </ListItem>)})}
                        </List>
                    </CardContent>
                </Card>
            </Container>
        )
    }

}
