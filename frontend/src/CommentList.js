import React, {Component} from 'react';
import './App.css';
import Comment from "./Comment";
import AddComment from "./AddComment";
import axios from "axios";



export default class CommentList extends Component {
    state = {
        comments: [],
    };
    /*sortByKey(array, key) {
        return array.sort(function (a, b) {
            var x = a[key];
            var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    };*/
    onDelete = (commentId) => {
        axios.delete('../api/comments/' + commentId).then(r=>{
            if (r.status === 200){
                window.alert("comentario eliminado")

            }
        });
    };

    componentDidMount() {
        axios.get('../api/comments/?post=' +  this.props.comments).then( (r) => {
            let aux_comments = [];
            let comment_dict= {'username':'', 'profile_image':'','content':''
                , 'date':'','likes':'', 'id':''};
            for (let x in r.data)
            {
                comment_dict.username = r.data[x]['user']['username'];
                comment_dict.profile_image = r.data[x]['user']['banner_photo'];
                comment_dict.content = r.data[x]['content'];
                comment_dict.date = r.data[x]['date'];
                comment_dict.likes = r.data[x]['likes'];
                comment_dict.id = r.data[x]['id'];

                aux_comments.push(comment_dict);
                //this.sortByKey(aux_comments,'date');
                comment_dict = {'username':'', 'profile_image':'','content':''
                    , 'date':'','likes':'', 'id':''};
            }
            //this.setState({temp_photo: r.data[0]['user']['profile_']});
            this.setState({comments: aux_comments});
        });
    }

    render () {
        return (
                <div className="comment-list">
                        <div className="comment" >
                            {this.state.comments.map((comment) => {return(<Comment data={comment} on_click_delete={this.onDelete}/>)})}
                            <AddComment post={this.props.comments}/>
                        </div>
                </div>
        );
    }
}
