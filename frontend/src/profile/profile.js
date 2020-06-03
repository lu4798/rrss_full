import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';
import YouTubeIcon from '@material-ui/icons/YouTube';
import EditIcon from '@material-ui/icons/Edit';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import axios from "axios";
import Button from "@material-ui/core/Button";
import {Input, TextField} from "@material-ui/core";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";

import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonAddDisabledIcon from "@material-ui/icons/PersonAddDisabled";

export default class ProfileCard extends Component {
    state = {
        expanded: false,
        username: '',
        description: '',
        profile_photo: null,
        banner_photo: null,
        banner_replaced_photo: null,
        youtube: '',
        instagram: '',
        twitter: '',
        name: '',
        editable: false,
        userInProfile: false,
        new_description: '',
        new_name: '',
        new_yt: '',
        new_insta: '',
        new_twitter: '',
        friends: [],
        logged_user_profile_photo: null
    };

    handleExpandClick = () => {
        this.setState({expanded: !this.state.expanded});
    };

    update_profile = (e) => {
        e.preventDefault();

        let form_data = new FormData();
        form_data.append('name', this.state.new_name);
        form_data.append('yt', this.state.new_yt);
        form_data.append('insta', this.state.new_insta);
        form_data.append('twitter', this.state.new_twitter);
        form_data.append('description', this.state.new_description);
        if (this.state.banner_replaced_photo != null)
            form_data.append('banner_photo', this.state.banner_replaced_photo, this.state.banner_replaced_photo.name);
        console.log("photo", this.state.banner_photo);
        let url = '../api/users/?user=' + this.props.username;
        axios.put(url, form_data, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
            .then(res => {
                console.log("caca", res.data);
                window.location.reload();
            })
            .catch(err => console.log(err))
    };
    handleBannerPhoto = (e) => {
        this.setState({
            banner_replaced_photo: e.target.files[0]
        });
    };


    editable = () => {
        console.log(this.state.editable);
        if (this.state.editable === false)
            this.setState({editable: true});
        else
            this.setState({editable: false});
        this.setState({new_description: this.state.description});
        this.setState({new_name: this.state.name});
        this.setState({new_yt: this.state.youtube});
        this.setState({new_insta: this.state.instagram});
        this.setState({new_twitter: this.state.twitter});
    };


    componentDidMount() {
        this.setState({
            username: localStorage.getItem('user'),
            userInProfile: this.state.username === localStorage.getItem('user')
        });

        axios.get('../api/users/?user=' + this.props.username).then((r) => {

            this.setState({
                username: r.data[0]['username'],
                name: r.data[0]['name'],
                description: r.data[0]['description'],
                banner_photo: r.data[0]['banner_photo'],
                youtube: r.data[0]['youtube'],
                instagram: r.data[0]['instagram'],
                twitter: r.data[0]['twitter'],
            }, this.edit);
        });
    }

    logout() {
        localStorage.clear();
    }

    delete_friend = () => {
        //añadir al props username el campo de amigos a false
        let form_data = new FormData();
        form_data.append('friend', localStorage.getItem('user'));
        axios.put('../api/users/?user=' + this.props.username + "&&friendship=delete_friend", form_data).then(r => {
        })
    };
    add_friend = () => {
        //añadir al props username el campo de amigos a false
        let form_data = new FormData();


        form_data.append('friend', localStorage.getItem('user'));

        axios.put('../api/users/?user=' + this.props.username + "&&friendship=add_friend", form_data).then(r => {
        })
    };
    isFriend = () => {
        if (this.props.username === localStorage.getItem("user"))
            return <div/>;
        for (let friend of this.props.friends) {

            for (let x in friend) {
                if (friend[x]['userr'] === this.props.username && friend[x]['friendship'] === true)
                    return <IconButton><PersonAddDisabledIcon onClick={this.delete_friend}/></IconButton>;
                else if (friend[x]['userr'] === this.props.username && friend[x]['friendship'] !== true)
                    return <div/>;
            }

        }
        return <IconButton><PersonAddIcon onClick={this.add_friend}/></IconButton>;
    };

    render() {
        return (
            <Container style={{float: "left", borderColor: "#538c09"}}>
                <Card className='card'>
                    {this.state.editable === true
                        ? <CardMedia className='profile-media'
                                     image={this.state.banner_photo}>
                            <input type="file"
                                   id="image"
                                   accept="image/png, image/jpeg" onChange={this.handleBannerPhoto}/>
                        </CardMedia>

                        : <CardMedia className='profile-media'
                                     image={this.state.banner_photo}/>}

                    <CardContent>
                        <div className="row">
                            <div className="col-7">
                                <h3>@{this.state.username}</h3>
                            </div>
                            <div className={"col-0"}>
                                {localStorage.getItem("user") === this.props.username && this.state.editable === false
                                    ? <IconButton><EditIcon onClick={this.editable}/></IconButton>
                                    : <div/>
                                }
                                {this.isFriend()}
                                {this.state.editable === true
                                    ? <IconButton onClick={this.update_profile}><CheckCircleIcon/></IconButton>
                                    : <div/>
                                }
                                {this.state.editable === true
                                    ? <IconButton onClick={this.editable}><CancelIcon/></IconButton>
                                    : <div/>
                                }
                            </div>

                        </div>
                        <div className="row">
                            <div className="col">
                                {this.state.editable === false
                                    ? <Typography variant="body2" color="textPrimary" component="p">
                                        {this.state.name}
                                    </Typography>
                                    : <Input placeholder={"Nombre"} value={this.state.new_name}
                                             onChange={e => this.setState({new_name: e.target.value})}/>
                                }
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                {this.state.editable === true
                                    ? <TextField placeholder={"Descripcion"} value={this.state.new_description}
                                                 onChange={e => this.setState({new_description: e.target.value})}/>
                                    : <Typography variant="body2" color="textSecondary" component="p">
                                        {this.state.description}
                                    </Typography>
                                }
                            </div>
                        </div>
                    </CardContent>
                    <CardActions disableSpacing>
                        <IconButton aria-label="share" className="icon">
                            {this.state.editable}
                        </IconButton>
                        <IconButton aria-label="share" className="icon">
                            <QuestionAnswerIcon/>
                        </IconButton>
                        <IconButton
                            className='icon'
                            onClick={this.handleExpandClick}
                            aria-expanded={this.state.expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon className="icon"/>
                        </IconButton>

                    </CardActions>
                    <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <Grid
                                container
                                direction="row"
                                justify="space-evenly"
                                alignItems="center"
                            >
                                {this.state.editable === true
                                    ? <Input value={this.state.new_twitter}
                                             onChange={e => this.setState({new_twitter: e.target.value})}
                                             placeholder={"Twitter"}/>
                                    : <IconButton aria-label="share" className={"twitter"} href={this.state.twitter}
                                                  target={"_blank"}>
                                        <TwitterIcon/>
                                    </IconButton>
                                }
                                {this.state.editable === true
                                    ? <Input value={this.state.new_insta}
                                             onChange={e => this.setState({new_insta: e.target.value})}
                                             placeholder={"Instagram"}/>
                                    : <IconButton aria-label="share" className={"insta"} href={this.state.instagram}
                                                  target={"_blank"}>
                                        <InstagramIcon/>
                                    </IconButton>
                                }
                                {this.state.editable === true
                                    ? <Input value={this.state.new_yt}
                                             onChange={e => this.setState({new_yt: e.target.value})}
                                             placeholder={"Youtube"}/>
                                    : <IconButton aria-label="share" className={"youtube"} href={this.state.youtube}
                                                  target={"_blank"}>
                                        <YouTubeIcon/>
                                    </IconButton>
                                }
                            </Grid>

                        </CardContent>
                        {localStorage.getItem("user") === this.props.username && this.state.editable === false
                            ? <CardContent>
                                <Button variant="contained" style={{width: '100%'}} color="secondary"
                                        onClick={this.logout}
                                        href={'/'}>
                                    Cerrar sesión
                                </Button>
                            </CardContent>
                            : <div/>
                        }
                    </Collapse>
                </Card>
            </Container>
        );
    }
}