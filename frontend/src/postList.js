import React, {Component} from 'react';
import './App.css';
import CardPost from "./card";
import AddPostCard from "./addPostCard"
import ProfileCard from "./profile/profile";
import axios from "axios";
import FriendsCard from "./friends/friends";
import Chat from "./Chat";
import PetitionCard from "./PetitionCard";
import Twitter from "./Twitter";

const config = {
    headers: {
        Authorization: `JWT ${localStorage.getItem("session")}`
    }
};

export default class PostList extends Component {
    state = {
        posts:[],
        temp_photo: '',
        username:null,
        friendRequest: [],
        friendList:[],
        friendGestor:[],
        user_photo:null
    };

    onDelete = (postId) => {
        axios.delete('../api/posts/' + postId, config).then(r=>{
            if (r.status === 200){
                window.alert("Post eliminado")

            }
        });
    };
    /*sortByKey(array, key) {
        return array.sort(function (a, b) {
            var x = a[key];
            var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    };*/

    componentDidMount() {
        axios.get('../api/users/?user=' + localStorage.getItem("user")).then((r) => {
            console.log("datosCard", r.data);
            let aux = [];
            let aux2 = [];
            let aux3 = [];
            aux3.push(r.data[0].friends);
            for (let x of r.data[0].friends) {
                if (x.friendship === false)
                    aux.push(x);
                else
                    aux2.push(x);
            }
            this.setState({
                friendRequest: aux,
                friendList: aux2,
                friendGestor:aux3,
                user_photo: r.data[0].banner_photo
            });
            console.log("FOTOOO",this.state.user_photo)
        });
        let url;
        if (this.props.match.params.username){
            url = '../api/posts/?user=' + this.props.match.params.username;
        }
        else{
            url = '../api/posts/'
        }
        axios.get(url, config).then( (r) => {
            let aux_posts = [];
            let post_dict= {'username':'', 'profile_image':'','title':'','content':''
                , 'image':'','date':'','likes':'', 'id':''};
            for (let x in r.data)
            {
                post_dict.username = r.data[x]['user']['username'];
                post_dict.profile_image = r.data[x]['user']['banner_photo'];
                post_dict.title = r.data[x]['title'];
                post_dict.content = r.data[x]['content'];
                post_dict.image = r.data[x]['image'];
                post_dict.date = r.data[x]['date'];
                post_dict.likes = r.data[x]['likes'];
                post_dict.id = r.data[x]['id'];

                aux_posts.push(post_dict);

                post_dict = {'username':'', 'profile_image':'','title':'','content':''
                    , 'image':'','date':'','likes':'', 'id':''};
            }
            //this.setState({temp_photo: r.data[0]['user']['profile_']});
            this.setState({posts: aux_posts});

        });
    }

render () {
        console.log("PHOTO",this.state.user_photo);
        let user_search = this.props.match.params.username;
    return (
        <div className="post-list">
                <div className="col-3 col-sm-3 col-lg-3">
                    <div className="row">
                        {this.props.match.params.username
                            ?<ProfileCard username={this.props.match.params.username} friends = {this.state.friendGestor} user_photo ={this.state.user_photo}/>
                            :<ProfileCard username={localStorage.getItem("user")} friends = {this.state.friendGestor} user_photo ={this.state.user_photo}/>
                        }
                    </div>
                    <div className="row">
                        <PetitionCard friendRequests={this.state.friendRequest}/>
                    </div>
                    <div className="row">
                        <Twitter/>
                    </div>
                </div>

                <div className="col-6 col-sm-6 col-lg-6">
                    <div className="post" >

                        {user_search !== undefined && user_search !== localStorage.getItem("user")
                            ?<div/>
                            :<AddPostCard />
                        }

                        {this.state.posts.map((post) => {return(<CardPost data={post} on_click_delete={this.onDelete}/>)})}
                    </div>
                </div>

                <div className="col-3 col-sm-3 col-lg-3">
                    <div className="row">
                        <FriendsCard friendList={this.state.friendList}/>
                    </div>
                    <div className="row">
                        <Chat/>
                    </div>
                </div>
        </div>
    );
}
}

