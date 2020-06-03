import React, {Component} from "react";
import IconButton from "@material-ui/core/IconButton/index";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DeleteIcon from "@material-ui/icons/Delete";

export default class Comment extends Component {
    state = {
        deleteIcon: "",
    };

    componentDidMount() {
        if (this.props.data.username === localStorage.getItem('user')) {
            this.setState({deleteIcon: <DeleteIcon/>});
        } else {
            this.setState({deleteIcon: ""});
        }

    }

    render() {
        return (
            <div className="card comment ">
                <div className="card-body">
                    <div className="row">
                        <div className="col-1">
                            <img src={this.props.data.profile_image} className="rounded-circle" height="50px"
                                 width="50px" alt="avatar"></img>
                        </div>
                        <div className="col-9 ">
                            <h5 onClick={() => {
                                window.location = "/posts/" + this.props.data.username
                            }} style={{textDecoration: "underline", cursor: "pointer"}}
                            >@{this.props.data.username}</h5>
                        </div>
                        <div className="col-2">
                            <IconButton className="icon" aria-label="delete" onClick={() => {
                                this.props.on_click_delete(this.props.data.id)
                            }}>
                                {this.state.deleteIcon}
                            </IconButton>
                        </div>
                    </div>
                    <div className="comment-content">
                        <p>{this.props.data.content}</p>
                    </div>
                </div>
            </div>
        );
    }
}
