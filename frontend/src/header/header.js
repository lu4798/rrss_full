import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';

import "./header.css"
import makeStyles from "@material-ui/core/styles/makeStyles";
import perfil from "../assets/logocute.png"
import {Link} from "react-router-dom";
import HeaderMenu from "./Menu";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";


import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default class PrimarySearchAppBar extends Component {


render() {


    return (
            <div>
                <AppBar className={"navbar"}>
                    {localStorage.getItem('user')
                    ? <h1>Hola, {localStorage.getItem('user')}! </h1>
                        : <h1/>
                    }
                    <Link className={"topLink"}><img src={perfil} className={"clickable"} onClick={() => {
                        window.location = "/posts/";
                        window.scrollTo(0, 0);
                    }}/></Link>
                    {localStorage.getItem('user')
                        ? <Paper>
                            <InputBase

                                id={"search_input"}
                                placeholder="Search user"
                            />
                            <IconButton type="submit" aria-label="search">
                                <SearchIcon onClick={() => window.location = "/posts/" + document.getElementById("search_input").value}/>
                            </IconButton>

                        </Paper>
                        : <div/>
                    }
                </AppBar>
                <HeaderMenu/>
            </div>
        );
}
}
