import React from "react";

import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import injectSheet from 'react-jss';

const Styles = {
    container: {
        border: "1px solid black",
        borderRadius: "20px",
        padding: "0 30px",
        fontSize: "15px",
        marginBottom: "40px"
    },
    body: {
        lineHeight: "auto",
        fontSize: "15px"
    }
};

class FAQ extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        };
    }

    componentDidMount() {

    }

    render() {
        let { classes, prompt, answer } = this.props;

        return (<div className={classes.container} style={{minHeight: this.state.expanded ? "initial" : "60px", lineHeight: "60px"}}>
            <div style={{display: "flex"}}>
                <div style={{flex: 1}}>
                    <div>{prompt}</div>
                    <div className={classes.body} style={{display: this.state.expanded ? "initial" : "none"}}>{answer}</div>
                </div>
                <div onClick={() => {this.setState({expanded: !this.state.expanded})}} style={{flex: "0 0 21px",
                    fontSize: "30px", cursor: "pointer"}}><div style={{transform: this.state.expanded ? "rotateY(0deg) rotate(45deg)" : null}}>+</div></div>
            </div>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(FAQ)));

