import React, { Component } from "react";
import axios from "axios";
import logo from "./assets/logocute.png";
import {Link} from "react-router-dom";


export default class Login extends Component {
    state = {
        username:'',
        password:''
    };
    onSubmit = (event) => {
        event.preventDefault();

        axios.post('../auth/', this.state).then (
            r => {
            localStorage.setItem('session', r.data.token);
            localStorage.setItem('user', r.data.user.username);
            if (r.status === 200){
                window.location.assign("/posts/");
            }
            else {
                window.alert("Usuario o contraseña incorrectos");
            }
        });
    };
    onChangeTextField = (event) => {
        let value = event.target.value;
        let name = event.target.name;
        if (name === 'username'){
            this.setState({
                username:value,
            });
        }
        if (name === 'password'){
            this.setState({
                password:value,
            });
        }
    };

    render() {
        let{on_login} =this.props;
        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <div className="container">
                        <img  src={logo} height={100} width={100}/>
                        <form onSubmit={(e) => {this.onSubmit(e)}}>
                            <h3>Sign In</h3>

                            <div className="form-group">
                                <label>Username</label>
                                <input type="text" className="form-control" placeholder="Enter username" id="username" name = "username"
                                       onChange={this.onChangeTextField}/>
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" className="form-control" placeholder="Enter password" id="password" name ="password"
                                       onChange={this.onChangeTextField}/>
                            </div>

                            <div className="form-group">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="customCheck1" />
                                    <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary btn-block btn-principal">Submit</button>
                            <p className="forgot-password text-right">
                                Not registered? <Link to="/register">Register</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
