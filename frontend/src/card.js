import React, {Component} from "react";
import './App.css';
import IconButton from "@material-ui/core/IconButton";
import ShareIcon from "@material-ui/icons/Share";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DeleteIcon from "@material-ui/icons/Delete";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble"
import Collapse from '@material-ui/core/Collapse';
import CommentList from "./CommentList";
import axios from "axios";
import { useHistory } from "react-router-dom";
import {Scope as browserHistory} from "@babel/traverse";

export default class CardPost extends Component {

    state = {
        expanded: false,
        friends: false,
        friendIcon: '',
        profile_photo:'',
        title:'',
        content:'',
        image:'',
        deleteIcon:'',
    };

    goToProfile = (username) => {
        const history = useHistory();
        history.push("/posts/"+username);
    };

    shareOnTwitter  = () => {
        //window.open("http://www.google.com", 'popup-example');
        window.open('https://twitter.com/intent/tweet?button_hashtag=cuarentena&text=Hey!%20Check%20this%20post%20on%20Cuarentena&url=http://www.google.com','popup','width=600,height=600');
        return false;
    };



    componentDidMount() {
        if (this.props.data.username === localStorage.getItem('user')){
            this.setState({deleteIcon: <DeleteIcon/>});
        }
        else {
            this.setState({deleteIcon: ""});
        }

    }
    render() {
        return (

        <div className="card" key = {this.props.data.id}>
                <div className="card-body d-flex flex-row">
                    <img src={this.props.data.profile_image}  className="rounded-circle mr-3" height="50px" width="50px" alt="avatar"/>
                    <div className="card-t">
                        <h5 className="card-title font-weight-bold mb-2"  onClick = {() => {window.location = "/posts/" + this.props.data.username}} style={{textDecoration:"underline",cursor:"pointer"}}
> @{this.props.data.username} </h5>
                        <h4 className="card-title  mb-2">{this.props.data.title}</h4>
                        <p className="card-text">{this.props.data.date}</p>
                    </div>
                    <IconButton className="icon" aria-label="delete" onClick={() => {this.props.on_click_delete(this.props.data.id)}}>
                        {this.state.deleteIcon}
                    </IconButton>
                </div>

                <div className="view overlay">
                    { this.props.image == null
                        ?<img className="card-img-top rounded-0" src={this.props.data.image}/>
                        :<div></div>
                    }

                </div>
                <div className="card-body">
                    <p>{this.props.data.content}</p>
                    <IconButton className="icon" aria-label="share"
                            onClick={this.shareOnTwitter}>
                        <ShareIcon />
                    </IconButton>
                    <IconButton  aria-label="comment"  className="icon" onClick={() =>this.setState({ expanded: !this.state.expanded })}>
                        <ChatBubbleIcon/>
                    </IconButton>

                    <Collapse in={this.state.expanded} timeout="auto" unmountOnExit className="expanded">
                        <CommentList comments = {this.props.data.id}/>
                    </Collapse>
                </div>
            </div>
        );
    }
}
