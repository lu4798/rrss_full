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
import IconButton from "@material-ui/core/IconButton";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonAddDisabledIcon from "@material-ui/icons/PersonAddDisabled";
import axios from "axios";


class PetitionCard extends Component {



    state = {
        data : '',
        friendRequest : [],
        connected : [],
        disconnected : []
    };

    componentDidMount() {};

    refuse_friend(friend){
        let form_data = new FormData();
        form_data.append('friend', friend.userr);

        axios.put('../api/users/?user=' + localStorage.getItem('user') + "&&friendship=refuse_friend",form_data).then( r =>{
            console.log(r);
        })
    };

    accept_friend(friend){
        let form_data = new FormData();
        form_data.append('friend', friend.userr);

        axios.put('../api/users/?user=' + localStorage.getItem('user') + "&&friendship=accept_friend",form_data).then( r =>{
            console.log(r);
        })
    }

    render(){
        return(
            <Container style={{float: "right", borderColor: "#538c09"}}>
                <Card className='card'>
                    <CardContent>
                        <h3>Peticiones</h3>
                        <List component="nav">
                            {this.props.friendRequests.map( (friend) => {
                                return(<ListItem >
                                <ListItemAvatar >
                                    <Avatar
                                        src={friend.user_photo}
                                    />
                                </ListItemAvatar>
                                <ListItemText primary={friend.userr} />

                                <IconButton className="icon " aria-label="decline" >
                                    <PersonAddDisabledIcon onClick={() => this.refuse_friend(friend)}/>

                                </IconButton>
                                <IconButton className="icon" aria-label="accept">
                                    <PersonAddIcon onClick={() => this.accept_friend(friend)}/>
                                </IconButton>
                            </ListItem>)})}
                        </List>
                    </CardContent>
                </Card>
            </Container>
        );

    }
} export default PetitionCard;


