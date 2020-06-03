import React, {Component} from "react";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import axios from "axios"
import Login from "./login"
import SignUp from "./signup"
import PostList from "./postList";
import PrimarySearchAppBar from "./header/header";
import Redirect from "react-router-dom/es/Redirect";
import Chat from "./Chat";
import NotFound from "./NotFound";
import NoAccess from "./NoAccess";

function PrivateRoute ({component: Component, authed, ...rest}) {
    return (
        <Route
            {...rest}
            render={(props) => authed === true
                ? <Component {...props} />
                : <Redirect to={{pathname: '/', state: {from: props.location}}} />}
        />
    )
}

class App extends Component{
    state = {
        loggedIn: false
    };
    componentDidMount() {
        if (localStorage.getItem("session") != null){
            axios.defaults.headers.common['Authorization'] = `JWT ${localStorage.getItem("session")}`;
            this.setState({loggedIn:true});
        }
        axios.defaults.xsrfCookieName = 'csrftoken';
        axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
    }
    render (){
        return (<Router>
                <div >
                    <PrimarySearchAppBar/>
                    {this.state.loggedIn === true
                        ?<Switch>
                            <Route path="/posts/:username" component={PostList} exact={true}/>
                            <Route path="/posts" component={PostList}/>
                            <Route path="/chat" component={Chat}/>
                            <Route path="*" component={NotFound}/>


                        </Switch>
                        :<Switch>
                            <Route exact path='/' component={Login} />
                            <Route path="/register" component={SignUp} />
                            <Route path="*" component={NoAccess}/>
                        </Switch>
                    }

                </div>
        </Router>
        );
    }
}

export default App;

