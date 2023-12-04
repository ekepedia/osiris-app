import React from "react";
import _ from "lodash";
import moment from "moment";


import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import COMMON from "../../../common/index";
import {httpSafeLink, mc} from "../../../common/helpers";
import CoverImageHolder from "../../../components/CoverImageHolder";
import StandardButton from "../../../components/StandardButton";
import StandardBadge from "../../../components/StandardBadge";

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
        border: `1px solid ${COMMON.COLORS.LIGHT_GREY}`,
        textAlign: "center",
        cursor: "pointer"
    },
    cameraIcon: {
        fontSize: "13px",
        lineHeight: "23px"
    },
    ...COMMON.STYLES.PORTFOLIO.PortfolioHeaderStyles,
    ...COMMON.STYLES.GROUP.GroupHeaderStyles,
};

class PortfolioHeader extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userIsAdminOrCreator: false,
            loadedGroupMember: false
        };

        this.portfolioLinkRef = React.createRef();
        this.groupProfileUpload = React.createRef();
        this.groupCoverUpload = React.createRef();
    }

    componentDidMount() {
        setTimeout(() =>{
            this.setHeightRatio();
        }, 5);
        console.log("ok")

        window.addEventListener('resize', this.setHeightRatio.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setHeightRatio.bind(this));
    }

    testAdminPrivileges(){

    }

    setHeightRatio() {
        if (!this.portfolioLinkRef || !this.portfolioLinkRef.current)
            return;

        let DELAY = 100;

        clearInterval(this.holdForResize);

        this.runResize();
        this.holdForResize = setTimeout(() => {
            this.runResize();
        }, DELAY);
    }

    runResize() {
        let RATIO = 150/681;
        const node = this.portfolioLinkRef.current;
        const currentWidth = node.clientWidth;

        if (currentWidth < 500) {
            RATIO = 100/250;
        }

        const currentHeight = currentWidth * RATIO;

        // console.log("RESIZED HEADER", node.clientWidth, currentHeight, node.clientHeight, "ratio:", RATIO)

        this.setState({
            currentWidth,
            currentHeight
        });
    }

    uploadGroupCoverPhoto() {
        if (!this.groupCoverUpload || !this.groupCoverUpload.current)
            return;

        this.groupCoverUpload.current.click();
    }

    uploadGroupProfilePhoto() {
        if (!this.groupProfileUpload || !this.groupProfileUpload.current)
            return;

        this.groupProfileUpload.current.click();
    }

    render() {
        let { uploadGroupCoverPhoto, uploadGroupProfilePhoto, classes, group, group_member, selectedState, setSelectedState, has_demographics, has_jobs} = this.props;

        //Fix - not working
        let {userIsAdminOrCreators} = this.state;
        console.log("groupie", this.props.group_member);
        if(this.props.group_member !== undefined) {
            if (group_member[0].type_id === "1" || group_member[0].type_id === "2"){
                userIsAdminOrCreators = true
            }
        }
        console.log("testing", userIsAdminOrCreators);
        //if(group_member !== undefined && !this.loadedGroupMember) {
          //  console.log("reached", group_member[0]);
            //if (group_member[0].type_id === "1" || group_member[0].type_id === "2") {
              //  console.log("reached 2", group_member);

                //if(!this.loadedGroupMember){
                  //  this.setState({
                    //    userIsAdminOrCreator: true,
                      //  loadedGroupMember: true
                    //})
           // }
        //}
        group = group || {};

        console.log("creator", this.state);

        let {
            cover_photo_url,
            group_name,
            group_logo_url,
            group_website
        } = group;
        console.log("groupHEader", selectedState, group_member, group[0]);

        let center_align = "calc( 50% - 12.5px)";
        let center_style_cover = {top: cover_photo_url ? 20: center_align, right: cover_photo_url ? 20: center_align, border: cover_photo_url ? null: "none"};
        let center_style_logo = {top: group_logo_url ? null : center_align, right: group_logo_url ? null : center_align, border: group_logo_url ? null: "none"};

        //<div className={classes.cameraIconContainer} style={{...center_style_cover}} onClick={() => {this.uploadCoverPhoto()}}>
        //    <i className={mc("fa-solid fa-camera", classes.cameraIcon)}/>
        //    <input type={"file"} style={{display: "none"}} ref={this.profileCoverUpload} onChange={(e) => {
        //        uploadCoverPhoto ? uploadCoverPhoto(e) : null
        //    }}/>
        //</div>

        return (<div className={classes.container}>
            <div className={classes.superContainer}>
                <div className={classes.profileCover} ref={this.portfolioLinkRef} style={{height: this.state.currentHeight ? this.state.currentHeight : null}}>
                    {userIsAdminOrCreators && group[0] ? <div>
                            <CoverImageHolder url={group[0].cover_photo_url || "https://i.imgur.com/tM97NWQ.png"}/>
                            <div className={classes.cameraIconContainer} style={{...center_style_cover}} onClick={() => {this.uploadGroupCoverPhoto()}}>
                                <i className={mc("fa-solid fa-camera", classes.cameraIcon)}/>
                                <input type={"file"} style={{display: "none"}} ref={this.groupCoverUpload} onChange={(e) => {
                                    uploadGroupCoverPhoto ? uploadGroupCoverPhoto(e) : null
                                }}/>
                            </div>
                        </div> : (group[0]) ? <div>
                            <CoverImageHolder url={group[0].cover_photo_url || "https://i.imgur.com/tM97NWQ.png"}/>
                        </div> :
                    <CoverImageHolder url={"https://i.imgur.com/tM97NWQ.png"}/>
                            }</div>
                <div className={classes.profileHeaderContainer} style={{paddingBottom: 0}}>
                    <div className={classes.profileImageContainer}>
                        <div className={classes.profileImage} style={{overflow: "hidden"}}>
                            {userIsAdminOrCreators && group[0] ? <div>
                                <CoverImageHolder url={group[0].group_logo_url || "https://t4.ftcdn.net/jpg/02/01/10/87/360_F_201108775_UMAoFXBAsSKNcr53Ip5CTSy52Ajuk1E4.jpg"}/>
                                <div style={{...center_style_logo}} className={classes.cameraIconContainer} onClick={() => {this.uploadGroupProfilePhoto()}} >
                                    <i className={mc("fa-solid fa-camera", classes.cameraIcon)}/>
                                    <input type={"file"} style={{display: "none"}} ref={this.groupProfileUpload} onChange={(e) => {
                                        uploadGroupProfilePhoto ? uploadGroupProfilePhoto(e) : null
                                    }}/>
                                </div>
                            </div> : (group[0]) ? <div>
                                    <CoverImageHolder url={group[0].group_logo_url || "https://t4.ftcdn.net/jpg/02/01/10/87/360_F_201108775_UMAoFXBAsSKNcr53Ip5CTSy52Ajuk1E4.jpg"}/>
                            </div> :
                                <CoverImageHolder url={"https://t4.ftcdn.net/jpg/02/01/10/87/360_F_201108775_UMAoFXBAsSKNcr53Ip5CTSy52Ajuk1E4.jpg"}/>
                            }</div>
                    </div>
                    <div className={classes.editHeaderButtonContainer}>
                        <div className={classes.editHeaderButton}>
                            <a target={"_blank"} href={httpSafeLink(group.group_website)}>
                                <StandardButton icon={"fa-classic fa-plus"} label={"Invite"} outline={false}/>
                            </a>
                        </div>
                    </div>
                    <div className={classes.groupHeaderButtonContainer}>
                        <div className={classes.editHeaderButton}>
                            <a target={"_blank"} href={httpSafeLink(group.group_website)}>
                                <StandardButton icon={"fa-regular fa-heart"} label= {"Follow"} outline={false} secondary={true}/>
                            </a>
                        </div>
                    </div>
                    <div className={classes.profileHeaderName}>{group.group_name}</div>
                    <div style={{marginTop: "10px"}}>
                        {group.group_industry_affiliation ? <StandardBadge tooltip={`Members of ${group.group_name} are interested in ${group.group_industry_affiliation}`} label={`INDUSTRY AFFILIATION ${group.group_industry_affiliation}`} icon={"fa-solid fa-star"} iconLeft={true} style={{background: COMMON.COLORS.G200, color: COMMON.COLORS.G600}}/> : null}
                        {group.group_school_affiliation ? <StandardBadge tooltip={`Members of ${group.group_name} are interested in ${group.group_school_affiliation}`} label={`SCHOOL AFFILIATION ${group.group_school_affiliation}`} icon={"fa-solid fa-bed"} iconLeft={true} style={{background: COMMON.COLORS.V100, color: COMMON.COLORS.V600}}/> : null}
                        {group.group_role_affiliation ? <StandardBadge tooltip={`Members of ${group.group_name} are interested in ${group.group_role_affiliation}`} label={`ROLE AFFILIATION ${group.group_role_affiliation}`} icon={"fa-solid fa-gavel"} iconLeft={true} style={{background: COMMON.COLORS.B200, color: COMMON.COLORS.B500}}/> : null}
                        {group.group_company_affiliation ? <StandardBadge tooltip={`Members of ${group.group_name} are interested in ${group.group_company_affiliation}`} label={`COMPANY AFFILIATION ${group.group_company_affiliation}`} icon={"fa-solid fa-dollar-sign"} iconLeft={true} style={{background: COMMON.COLORS.O100, color: COMMON.COLORS.O600}}/> : null}
                    </div>
                    <div className={classes.groupTabs}>
                        <div className={mc(classes.groupMenuContainer)} onClick={() => {setSelectedState ? setSelectedState(1) : null}}>
                            <span style={{color: selectedState === 1 ? COMMON.COLORS.B400 : null}}>Discussion</span>
                            {selectedState === 1 ? <div className={classes.groupMenuSelectBar}/> : null}
                        </div>
                        <div className={mc(classes.groupMenuContainer)} onClick={() => {setSelectedState ? setSelectedState(2) : null}}>
                            <span style={{color: selectedState === 2 ? COMMON.COLORS.B400 : null}}>About</span>
                            {selectedState === 2 ? <div className={classes.groupMenuSelectBar}/> : null}
                        </div>
                        <div style={{display: has_demographics ? null : "none"}} className={mc(classes.groupMenuContainer)} onClick={() => {setSelectedState ? setSelectedState(3) : null}}>
                            <span style={{color: selectedState === 3 ? COMMON.COLORS.B400 : null}}>DE&I</span>
                            {selectedState === 3 ? <div className={classes.groupMenuSelectBar}/> : null}
                        </div>
                        <div style={{display: has_jobs ? null : "none"}} className={mc(classes.groupMenuContainer)} onClick={() => {setSelectedState ? setSelectedState(4) : null}}>
                            <span style={{color: selectedState === 4 ? COMMON.COLORS.B400 : null}}>Jobs</span>
                            {selectedState === 4 ? <div className={classes.groupMenuSelectBar}/> : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(PortfolioHeader)));

