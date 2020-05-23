import React, { Component } from "react";
import {Link} from "react-router-dom";



export default class NotFound extends Component {

    render() {
        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <div className="container">
                        <h3>404</h3>
                        <h3>PAGE NOT FOUND</h3>
                        <h3>Go to  <Link to="/posts">main page</Link></h3>
                    </div>
                </div>
            </div>
        );
    }
}




