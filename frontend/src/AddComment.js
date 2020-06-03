import React, {Component} from "react";
import axios from "axios";

export default class AddComment extends Component {
    state = {
        content:'',
        username:'',
        profile_photo:'',
        user:'',
    };
    componentDidMount() {
        this.setState({username: localStorage.getItem('user')}, this.getProfile );
    };

    getProfile = () => {

        axios.get('../api/users/?user=' + localStorage.getItem('user'),{
            params: {
                user: this.state.username
            }}).then( (r) => {
            this.setState({
                user: r.data[0],
                profile_photo: r.data[0]['banner_photo'],
                username:r.data[0]['username']
            })
        })
    };


    onChangeTextField = (event) => {
        let value = event.target.value;
        let name = event.target.name;
        if (name === 'post-comment'){
            this.setState({
                content:value,
            });
        }
    };
    onSubmit =(e) => {
        e.preventDefault();
                let form_data = new FormData();
        form_data.append('content', this.state.content);
        form_data.append('user', this.state.user.username);
        form_data.append('post', this.props.post);
        console.log(form_data);
        let url = '../api/comments/';
        axios.post(url, form_data, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
            .then(res => {
                console.log(res.data);
            })
            .catch(err => console.log(err))
    };

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <div className="card add-post">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-1" >
                                <img src={this.state.profile_photo} className="rounded-circle" height="50px" width="50px" alt="avatar"></img>
                            </div>
                            <div className="col-9" >
                                <h5>@{this.state.username}</h5>
                            </div>
                        </div>
                        <div className="comment-content">
                            <div className="form-group">
                                <textarea className="form-control" placeholder="Comment here" id="post-comment" name ="post-comment"
                                          onChange={this.onChangeTextField}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-1"/>
                            <div className="col-11">
                                <button type="submit" className="btn btn-primary btn-block btn-principal">Comment</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}