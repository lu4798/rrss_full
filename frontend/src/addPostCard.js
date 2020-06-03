import React, {Component} from "react";
import IconButton from "@material-ui/core/IconButton";
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import axios from "axios";

export default class AddPostCard extends Component {
    state = {
        pictures: [],
        title:'',
        content:'',
        image:null,
        username:'',
        profile_photo:'',
        user:'',
    };
    handleImageChange = (e) => {
        this.setState({
            image: e.target.files[0]
        })
    };

    componentDidMount() {
        this.setState({username: localStorage.getItem('user')}, this.getProfile );
        };

    getProfile = () => {

        axios.get('../api/users/',{
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
        if (name === 'post-input-title'){
            this.setState({
                title:value,
            });
        }
        if (name === 'post-input-content'){
            this.setState({
                content:value,
            });
        }
        if (name === 'post-input-image'){
            this.setState({
                image:value,
            });
        }
    };
    onSubmit = (e) => {
        e.preventDefault();

        let form_data = new FormData();
       if(this.state.image != null)
            form_data.append('image', this.state.image, this.state.image.name);
        form_data.append('title', this.state.title);
        form_data.append('content', this.state.content);
        form_data.append('user', this.state.user.username);
        let url = '../api/posts/';
        axios.post(url, form_data, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
            .then(res => {
                window.location.reload();
            })
            .catch(err => console.log(err))
    };


    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <div className="card add-post">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-2" >
                                <img src={this.state.profile_photo} className="rounded-circle" height="50px" width="50px" alt="avatar"></img>
                            </div>
                            <div className="col-10" >
                                <h4>@{this.state.username} </h4>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-2" />
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Add a title " id="post-input-title" name = "post-input-title"
                                       onChange={this.onChangeTextField} required/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-2" />
                            <div className="form-group">
                                <textarea className="form-control" placeholder="How was your day" id="post-input-content" name = "post-input-content"
                                          onChange={this.onChangeTextField} required/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-2">
                                <IconButton  className="icon icon-image fileContainer">
                                    <input type="file"
                                           id="image"
                                           accept="image/png, image/jpeg"  onChange={this.handleImageChange}  style={{maxWidth:"10%"}}/>
                                    <InsertPhotoIcon />
                                </IconButton >
                            </div>
                            <div className="col-10">
                                <button type="submit" className="btn btn-primary btn-block btn-principal">Post</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}
