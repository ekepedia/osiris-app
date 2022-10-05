import React from "react";
import _ from "lodash";
import moment from "moment";

import { gql } from 'apollo-boost';
import { Query } from '@apollo/react-components';
import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../services/DataService';

import COMMON from "../common/index";
import { mc } from "../common/helpers";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
};

class YouTubeIFrame extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };

        this.youTubeRef = React.createRef();

    }

    componentDidMount() {
        this.resizeFrame();
        window.addEventListener('resize', this.resizeFrame.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeFrame.bind(this));
    }

    resizeFrame() {
        const ref = this.youTubeRef;

        console.log("ref", ref)

        const RATIO = 9/16;

        const node = ref.current;
        console.log("node", node)

        const currentWidth = node.clientWidth;
        const currentHeight = currentWidth * RATIO;
        console.log("currentWidth", currentWidth)
        console.log("currentHeight", currentHeight);
        this.setState({
            currentWidth,
            currentHeight
        })
    }

    render() {
        let { classes, client, match: { params }, link_url } = this.props;
        const { currentHeight } = this.state;

        if (link_url && link_url.indexOf("embed") === -1 ) {
            const getId = (url) => {
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                const match = url.match(regExp);

                return (match && match[2].length === 11)
                    ? match[2]
                    : null;
            }
            link_url = `https://www.youtube.com/embed/${getId(link_url)}`
        }

        return (<div className={classes.container}>
            <div style={{height: 0, width: "100%", opacity: 0}} ref={this.youTubeRef}/>
            {link_url ? <iframe
                width="100%"
                height={currentHeight ? currentHeight : "100%"}
                src={link_url}
                style={{borderRadius: "6px"}}
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded youtube"
            /> : <div
                style={{
                    width: "100%",
                    height: currentHeight ? currentHeight : "100%",
                    background: COMMON.COLORS.BACKGROUND_GREY,
                    borderRadius: "6px",
                    border: `1px solid ${COMMON.COLORS.LIGHT_GREY}`
                }}
            />}

        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(YouTubeIFrame)));

