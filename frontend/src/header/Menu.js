import React, {Component} from "react";
import Menu from "@material-ui/core/Menu/Menu";
import MenuItem from "@material-ui/core/MenuItem";

export default class HeaderMenu extends Component {

    state = {
        menuOpened: false,
        anchorEl: null,
    };

    handleProfileMenuOpen = (event) => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleMenuClose = () => {
        this.setState({anchorEl: null});
    };

    render() {
        return(
            <Menu
                anchorEl={this.state.anchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                getContentAnchorEl={null}
                id='elem-menu'
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={this.state.menuOpened}
                onClose={this.handleMenuClose}
            >
                <MenuItem onClick={this.handleMenuClose}>Profile</MenuItem>
                <MenuItem onClick={this.handleMenuClose}>Log out</MenuItem>
            </Menu>
        );
    }
    }
