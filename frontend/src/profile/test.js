import React from 'react';
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import CardContent from "@material-ui/core/CardContent";


export default class prueba extends React.Component{
    state = {
        edit:""
    };

    modifyEdit= () => {
        if(this.state.edit === 3)
            this.setState({edit:2});
        else
            this.setState({edit:3});
    };
    render()
    {

        return(
            <div>
                <IconButton aria-label="share" className="icon" onClick={this.modifyEdit}>
                    <EditIcon />
                </IconButton>
                { this.state.edit === 3
                    ?<h3>VALE 3</h3>
                    :<h3>VALE 2</h3>
                }

            </div>
        );
    }
}
