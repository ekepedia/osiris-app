import React from "react";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
};

class CoverImageHolder extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        let { classes, url } = this.props;

        return (<div style={{
                height: "100%",
                width: "100%",
                backgroundImage: `url("${url}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}/>
        )
    }

}

export default withApollo(withRouter(injectSheet(Styles)(CoverImageHolder)));

