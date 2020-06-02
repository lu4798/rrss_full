import React, {Component} from "react";


class ChatInput extends Component {

    state ={
        message:''
    };

    render(){
        return(
            <form onSubmit={e =>
            {
                e.preventDefault();
                this.props.onSendMessage(this.state.message);
                this.setState({message:''});
                this.state.message.scrollIntoView({ behavior: "smooth" });
            }}>
                <input
                    type ="text"
                    placeholder="Enter message"
                    value ={this.state.message}
                    onChange={e => this.setState({message: e.target.value})}
                />
                <input type="submit"  className="btn btn-primary btn-principal" value="Enviar" />
            </form>
        );
    }
} export default ChatInput;
