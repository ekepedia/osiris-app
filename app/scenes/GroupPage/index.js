import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link, useHistory} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../../services/DataService';
import {COLOR_WHITE, N400, PIE_CHART_WHITE} from "../../common/colors";
import COMMON from "../../common";
import { PieChart } from 'react-minimal-pie-chart';
import CompanyDemographicService from "../../services/CompanyDemographicService";
import {formatLargeNumber, mc} from "../../common/helpers";
import GroupHeader from "./components/GroupHeader";
import NavBar from "../../components/NavBar";
import RacePieChart from "../../components/charts/RacePieChart";
import GenderPieChart from "../../components/charts/GenderPieChart";
import StandardBadge from "../../components/StandardBadge";
import JobsService from "../../services/JobsService";
import CoverImageHolder from "../../components/CoverImageHolder";
import GroupService from "../../services/GroupService";
import GroupSearchBar from "./components/GroupSearchBar";
import CompanyHeader from "../CompanyPage/components/CompanyHeader";
import PostJobModal from "./components/modals/PostJobModal";
import TrackingService from "../../services/TrackingService";
import EventService from "../../services/EventService";
import AuthService from "../../services/AuthService";
import UserService from '../../services/UserService';
import {FONT_HEADLINE_BOLD, H600} from "../../common/fonts";
import GroupMemberService from "../../services/GroupMemberService";
import GroupPostService from "../../services/GroupPostService";
import Lottie from "react-lottie";
import StandardButton from "../../components/StandardButton";
import loadingCircles from "../../common/lottie/loading-circles";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0 20px",
        },
    },
    jobCardContainer: {height: "68px", cursor: "pointer", borderRadius: "4px", border: `1px solid ${COMMON.COLORS.N400}`, padding: "15px"},
    jobCardImgContainer: {
        flex: "0 0 38px", overflow: "hidden", height: "38px", marginRight: "8px", borderRadius: "4px", border: `1px solid ${COMMON.COLORS.N400}`
    },
    jobCardTitle: {
        ...COMMON.FONTS.H400,
        color: COMMON.COLORS.N900,
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
    },
    profileBarContainer : {
        flex: "0 0 320px",
        marginRight: "50px",
        width: "320px",
        height: "fit-content",
        maxHeight: "calc(100vh - 147px)",
        overflow: "scroll",
        borderRadius: "4px",
        border: `1px solid ${N400}`,
        '@media (max-width: 1000px)': {
            display: "none"
        },
    },
    groupProfileContainer: {
        marginRight: "15px",
        height: "30px",
        width: "30px",
        borderRadius: "100%",
        border: `2px solid ${COMMON.COLORS.N900}`,
        overflow: "hidden",
        cursor: "pointer",
    },
    jobCardCompany: {
        ...COMMON.FONTS.P100,
        color: COMMON.COLORS.N700,
        marginTop: "-2px"
    },
    ...COMMON.STYLES.GENERAL.NavigationStyles,
    ...COMMON.STYLES.GROUP.GroupPageStyles,
    ...COMMON.STYLES.GROUP.GroupProfilePageStyles,
    ...COMMON.STYLES.PORTFOLIO.PortfolioHeaderStyles,
    ...COMMON.STYLES.GROUP.GroupRowStyles,
    racePieChartHolder: {
        marginTop: "20px"
    },
    profileNameText: {
        color: COMMON.COLORS.G_900,
        textAlign: "center",

        //Text sm/Semibold
        fontFamily:"Inter",
        lineHeight: "20px",
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: "600",
    },
    postContainer: {
        background: COLOR_WHITE,
        marginTop: "15px",
        width: "100%",
        alignSelf: "stretch",
        alignItems: "flex-start",
        display: "flex",
        height: "auto",
        cursor: "pointer",
        borderRadius: "4px",
        border: `1px solid ${COMMON.COLORS.N400}`,
        padding: "15px",
        flex: 1,
        overflow: "hidden"},

};

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingCircles,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

class GroupPage extends React.Component {


    constructor(props) {
        super(props);
        let user = {};
        let userstring = localStorage.user;

        if (userstring && userstring !== "undefined") {
            user = JSON.parse(userstring)
        }
        this.state = {
            loaded_group: false,
            loaded_group_member: false,
            selectedState: 1,
            user,
            first_name: "",
            last_name: "",
            bio: "",
            profile_photo_url: "",
            cover_photo_url: "",
            username: "",
            openShareNewJobModal: false
        };
    }

    componentDidMount() {
        this.loadUser(true);
        this.loadGroup();
        this.loadPosts(true);
        //this.loadGroupJobs();
        EventService.on(EventService.events.UPDATE_USER, () => {
            this.loadUser();
        })
    }

    loadUser(first) {
        let { client, match: { params }, user} = this.props;
        if(first){
            this.setState({loading_user: true});
        }

        const user_id = AuthService.getCurrentUserIdSync();
        UserService.getUser({client, user_id}).then((user) => {
            console.log("loaded user,", user);
            user = user || {};
            this.setState({
                user,
                first_name: user.first_name,
                last_name: user.last_name,
                bio: user.bio,
                username: user.username,
                profile_photo_url: user.profile_photo_url,
                cover_photo_url: user.cover_photo_url,
                loading_user: false
            })
        })
    }

    loadPosts(first) {
        let {client, match: {params}} = this.props;
        if (first){
            this.setState({
                loading_posts: true
            })
        }
        GroupPostService.getGroupPosts({
            client,
            group_id: params.group_id
        }).then((posts) => {
            console.log("LOADED POSTS", posts);
            posts = posts || [];
            let posts_map = {};
            console.log("entered this 12345", posts);

            posts.forEach((post) => {
                posts_map[post.post_id] = post;
            })
            console.log("entered this 123456", posts);

            posts = posts.sort((a, b) => {
                let nameA = a.post_date || "";
                let nameB = b.post_date || "";

                return nameA.localeCompare(nameB);
            });
            this.setState({
                posts,
                posts_map,
                loading_posts: false
            })
        })
    }

    loadGroup(first) {
        let { client, match: { params }} = this.props;
        if(first){
            this.setState({loading_group: true});
        }
        const user_id = AuthService.getCurrentUserIdSync();
        GroupService.getGroupsByIds({client, group_ids: params.group_id}).then((group) => {
            console.log("LOADED GROUP", group);
            this.setState({
                group,
                loaded_group: true,
                loading_group: false
            })
        })

        GroupMemberService.getGroupMembers({client, user_id, group_id: params.group_id}).then((group_member) =>{
            console.log("LOADED GROUP MEMBER", group_member);
            this.setState({
                group_member,
                loaded_group_member: true
            })
        })
    }

    //loadGroupJobs() {
    //    let { client, match: { params } } = this.props;

    //    GroupService.getGroups({
    //        client,
    //        group_id: params.group_id,
    //        is_user_submitted: false
    //    }).then((groups) => {
    //        console.log("LOADED GROUPS", groups);
    //        this.setState({
    //            groups: groups || []
    //        })
    //    })
    //}

    render() {
        console.log("7");
        let { classes, client, match: { params }, history } = this.props;

        let { group, group_member, user, selectedState, groups, posts, posts_map } = this.state;

        group = group || {};


        const {
            group_id
        } = group;

        user = user || {};

        return (

            <div className={classes.masterContainer}>
                <div className={classes.masterNavContainer}>
                    <NavBar />
                </div>
                <div className={classes.masterBodyContainer}>
                    <div className={classes.mainGroupContainer} style={{display:"flex", flexGrow:"100"}}>
                        <div className={classes.LHSGroupContainer}>
                            <div className={classes.groupFilterContainer}>
                                <div style={{
                                    ...COMMON.FONTS.H600,
                                    color: COMMON.COLORS.N900,
                                    paddingBottom: "10px",
                                    marginBottom: "20px",
                                    borderBottom: `1px solid ${COMMON.COLORS.N400}`
                                }}>
                                    <div style={{ flex: user && user.user_id ? "0 0 30px" : 0}} align={"center"}>
                                        {user && user.user_id ? <Link to={"/profile"} onClick={() => {
                                            TrackingService.trackClick({page: "navbar", value: "profile"});
                                        }}>
                                            <div title="Profile" id="profile-link" className={classes.groupProfileContainer}>
                                                <div style={{border: `1px solid ${COMMON.COLORS.N0}`, borderRadius: "100%", height: "100%", width: "100%", overflow: "hidden"}}>
                                                    <CoverImageHolder url={user.profile_photo_url || "/img/generic-user.jpeg"}/>
                                                </div>
                                            </div>
                                            <div className={classes.profileNameText}>
                                                {this.state.first_name} {this.state.last_name}
                                            </div>
                                        </Link> : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={classes.RHSGroupContainer}>
                            <div className={mc(classes.headerContainer)}>
                                <GroupHeader {...{group, group_member: this.state.group_member, selectedState: this.state.selectedState}} setSelectedState={(selectedState) => {
                                    this.setState({selectedState})
                                }}/>
                            </div>

                            <div style={{display: selectedState === 1 ? null : "none"}}>
                                <div className={mc(classes.groupSearchBarContainer)}>
                                    <GroupSearchBar style={{width: "100%"}}/>
                                </div>
                                <div className={mc(classes.groupPostContainer)}>{posts && posts.length && !this.state.loading_user && !this.state.loading_group && !this.state.loading_posts ? <div>
                                    {posts.map((post) => {
                                        console.log("GROUP POST POST", post)
                                        let primary_post = posts_map ? ((posts_map[posts.post_id] || {})) : {};
                                        //let group_name = group.group_id && groups_map ? (groups_map[group.group_id] || {}).group_name : group.group_name
                                        //add in company affiliation to posts
                                        if (!posts_map)
                                            return;
                                        return (<div className={classes.postContainer}
                                                     key={post.post_id}
                                                     onClick={() => {this.setState({selectedPost: post});}}
                                        >

                                            <div className={classes.groupRowImgContainer}>
                                                <CoverImageHolder url={("https://i.imgur.com/tM97NWQ.png")}/>
                                            </div>
                                            <div style={{flex: 1, overflow: "hidden"}}>
                                                <div className={classes.groupRowTitle} >
                                                    Post Group Name: {post.poster_id}
                                                </div>
                                            </div>
                                        </div>)
                                    })}
                                </div> : (this.state.loading_user || this.state.loading_group || this.state.loading_posts) ? <div>
                                    <div style={{padding: "20px", textAlign: "center"}}>
                                        <div style={{textAlign: "center"}}>
                                            <Lottie options={defaultOptions}
                                                    height={96}
                                                    width={96}/>
                                        </div>
                                        <div>Loading Posts</div>
                                        <div>One Moment Please</div>
                                    </div>
                                </div> : <div>
                                    <div style={{padding: "20px", textAlign: "center"}}>
                                        <div style={{fontSize: "14px"}}>This group does not have any posts! Click below to create a new post</div>
                                        <div style={{marginTop: "20px"}}>
                                            <StandardButton label={"Share Job"} onClick={() => (

                                                this.setState({openShareNewJobModal: true}))
                                            }/>
                                        </div>
                                    </div>
                                </div>
                                } </div>
                            </div>
                            <div  style={{display: selectedState === 2 ? null : "none"}} className={mc(classes.sectionContainer)}>
                                <div className={mc(classes.sectionMainTitle)}>Overview</div>
                                <div className={mc(classes.sectionSubHeader)}>Identified by OSIRIS from {group.group_name}</div>
                                <div className={mc(classes.aboutBody)}>{group.group_about}</div>
                                <div className={mc(classes.sectionSubtitle)}>Website</div>
                                <div className={mc(classes.groupWebsite)}><a target={"_blank"} href={group.group_website}>{group.group_website}</a></div>
                                <div className={mc(classes.sectionSubtitle)}>Industry</div>
                                <div className={mc(classes.overviewSection)}>{group.group_industry_affiliation}</div>
                                {group.group_size ? <div>
                                    <div className={mc(classes.sectionSubtitle)}>Group Size</div>
                                    <div className={mc(classes.overviewSection)}>{formatLargeNumber(group.group_size)} members</div>
                                </div> : null}

                                <div className={mc(classes.sectionSubtitle)}>Founded</div>
                                <div className={mc(classes.overviewSection)}>{group.group_founded_year || "--"}</div>

                                <div className={mc(classes.sectionSubtitle)}>Specialties</div>
                                <div className={mc(classes.overviewSection)}>
                                    <StandardBadge style={{marginTop: "15px"}} label={group.group_industry_affiliation}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

}

export default withApollo(withRouter(injectSheet(Styles)(GroupPage)));