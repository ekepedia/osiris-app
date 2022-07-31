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
import axios from "axios";
import CoverImageHolder from "./CoverImageHolder";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    cameraIconContainer: {
        position: "absolute",
        height: "25px",
        width: "25px",
        borderRadius: "100%",
        top: "-12.5",
        right: "-12.5",
        background: COMMON.COLORS.COLOR_WHITE,
        border: `1px solid ${COMMON.COLORS.DARK_GREY}`,
        textAlign: "center",
        cursor: "pointer"
    },
    cameraIcon: {
        fontSize: "13px",
        lineHeight: "23px"
    },
    uploadButton: {
        padding: "6px 8px",
        background: COMMON.COLORS.OSIRIS_GREEN,
        border: `1px solid ${COMMON.COLORS.OSIRIS_GREEN}`,
        borderRadius: "6px",
        color: COMMON.COLORS.COLOR_WHITE,
        whiteSpace: "nowrap",
        cursor: "pointer",
        ...COMMON.FONTS.FONT_CAPTION_2_BOLD,
    },
    ...COMMON.STYLES.GENERAL.AlignmentStyles
};

class ThumbnailUpload extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };

        this.photoReUploadButton = React.createRef();

    }

    fileUploaded(e) {

        let { updateLoading, onURL } = this.props;

        updateLoading = updateLoading || (() => {});
        onURL = onURL || (() => {});

        if (e.target.files && e.target.files[0]) {

            updateLoading(true);

            const file = e.target.files[0];
            const formData = new FormData();

            formData.append('img', file);
            console.log("FILE", file)

            let file_name = file && file.name ? file.name : undefined;

            axios.post("/api/upload-user-img", formData).then((data) => {
                this.setState({uploading: false});

                if (data && data.data && data.data.url) {
                    const { url } = data.data;
                    onURL({
                        url,
                        file_name,
                    });
                }
            })
        }
    }

    componentDidMount() {


    }

    clickPhotoReUploadButton() {
        if (!this.photoReUploadButton || !this.photoReUploadButton.current)
            return;

        this.photoReUploadButton.current.click();
    }


    render() {
        let { classes, client, match: { params }, url } = this.props;

        return (<div className={classes.container}>
            {url && url.length ? <div style={{height: "100%", width: "100%", position: "relative"}}>
                <CoverImageHolder url={url}/>
                <div className={classes.cameraIconContainer} style={{top: "5%", right: "5%"}} onClick={() => {this.clickPhotoReUploadButton()}}>
                    <i className={mc("fa-solid fa-camera", classes.cameraIcon)}/>
                    <input type={"file"} style={{display: "none"}} ref={this.photoReUploadButton} onChange={(e) => (this.fileUploaded(e))}/>
                </div>
            </div>: <div className={classes.centerAlignContainer} style={{height: "100%", width: "100%", backgroundColor: COMMON.COLORS.BACKGROUND_GREY}}>
                <div className={classes.centerAlignObject}>
                    <div className={classes.uploadButton} onClick={() => {this.clickPhotoReUploadButton()}}>Upload <i className="fa-solid fa-arrow-up"></i></div>
                    <input type={"file"} style={{display: "none"}} ref={this.photoReUploadButton} onChange={(e) => (this.fileUploaded(e))}/>
                </div>
            </div>}
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(ThumbnailUpload)));

