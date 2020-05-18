import React, { Component } from "react";
import logo from './assets/logocute.png'
import axios from "axios";
import {Link} from "react-router-dom";



export default class SignUp extends Component {
    state = {
        username:'',
        name:'',
        password:'',
    };
    onChangeTextField = (event) => {
        let value = event.target.value;
        let name = event.target.name;
        if (name === 'username'){
            this.setState({
                username:value,
            });
        }
        if (name === 'name'){
            this.setState({
                name:value,
            });
        }
        if (name === 'password'){
            this.setState({
                password:value,
            });
        }
    };
    onSubmit =(e) => {
        e.preventDefault();
        console.log("register state",this.state);
        axios.post('../api/users/', this.state).then (
            r => {
                console.log(r);
                console.log(r.data);
                console.log("token",r.data.token);
                console.log("token",r.data.profile_photo);
                localStorage.setItem('session', r.data.token);
                localStorage.setItem('user', r.data.username);
                console.log("status",r.status);
                if (r.status === 201) {
                    window.location.assign("/posts/");
                } else {
                    window.alert("Usuario o contraseña incorrectos");
                }
            }
        );
    };

    render() {
        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <div className="container">
                        <img  src={logo} height="100" width={100}></img>

                        <form onSubmit={event => {this.onSubmit(event)}}>
                            <h3>Sign Up</h3>

                            <div className="form-group">
                                <label>Username</label>
                                <input type="text" className="form-control" placeholder="Username" id="username" name = "username"
                                       onChange={this.onChangeTextField}/>
                            </div>

                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" className="form-control" placeholder="Enter name" id="name" name = "name"
                                       onChange={this.onChangeTextField}/>
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" className="form-control" placeholder="Enter password" id="password" name = "password"
                                       onChange={this.onChangeTextField}/>
                            </div>

                            <button type="submit" className="btn btn-primary btn-block btn-principal">Sign Up</button>
                            <p className="forgot-password text-right">
                                Already registered? <Link to="/">Login</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}




