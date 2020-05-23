import React, { Component } from "react";
import {Link} from "react-router-dom";




export default class NoAccess extends Component {

    render() {
        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <div className="container">
                        <h3>You can't see this content</h3>
                        <h3><Link to="/">Login</Link></h3>
                    </div>
                </div>
            </div>
        );
    }
}




