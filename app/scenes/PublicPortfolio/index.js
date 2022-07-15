import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import UserService from '../../services/UserService';
import UserEducationService from '../../services/UserEducationService';
import UserExperienceService from '../../services/UserExperienceService';
import UserLinkService from '../../services/UserLinkService';
import UserGalleryService from '../../services/UserGalleryService';

import STYLES from "../../common/index";
import COMMON from "../../common/index";
import { mc, formatDuration } from "../../common/helpers";
import NavBar from "../../components/NavBar";
import CoverImageHolder from "../../components/CoverImageHolder";
import {FONT_CAPTION_2, FONT_CAPTION_2_BOLD} from "../../common/fonts";
import PortfolioHeader from "./components/PortfolioHeader";
import {DARK_GREY} from "../../common/colors";
import Slider from "react-slick";
import PortfolioCarousel from "./components/PortfolioCarousel";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    pageContainer: {
        padding: "0 50px",
        '@media (max-width: 768px)': {
            padding: "0 19px",
        },
    },
    pageSection: {
        paddingTop: "35px",
        '@media (max-width: 768px)': {
            paddingTop: "20px",
        },
    },
    sectionContainer: {
        border: `1px solid ${STYLES.COLORS.COLOR_BORDER_GREY}`,
        borderRadius: "6px",
        overflow: "hidden",
        padding: "25px 35px",
        background: STYLES.COLORS.COLOR_WHITE,
        marginTop: "10px",
        '@media (max-width: 768px)': {
            padding: "11px 11px",
        },
    },
    sectionPortfolio: {
        extend: 'sectionContainer',
        paddingBottom: "25px",
        '@media (max-width: 768px)': {
            // paddingBottom: "1px",
        },
    },
    sectionExperienceContainer: {
        border: `1px solid ${STYLES.COLORS.COLOR_BORDER_GREY}`,
        borderRadius: "6px",
        overflow: "hidden",
        padding: "0",
        background: STYLES.COLORS.COLOR_WHITE,
        marginTop: "10px"
    },
    sectionExperiencePadding: {
        padding: "25px 35px",
        '@media (max-width: 768px)': {
            padding: "11px 11px",
        },
    },
    sectionExperienceShowMore: {
        padding: "10px",
        textAlign: "center",
        cursor: "pointer",
        borderTop: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`,
        ...COMMON.FONTS.FONT_SUBHEADER_BOLD,
        color: COMMON.COLORS.COLOR_TEXT_GREY,
        '@media (max-width: 768px)': {
            padding: "11px 11px",
            ...COMMON.FONTS.FONT_CAPTION_1_BOLD,

        },
    },
    cardContainer: {
        padding: "15px",
        marginTop: "10px",
        overflow: "hidden",
        ...STYLES.STYLES.GREY_BORDER_6,
        '@media (max-width: 768px)': {
            marginTop: "10px",
            padding: "10px 12px",
        },
    },
    cardImageContainer: {
        flex: "0 0 51px",
        height: "51px",
        marginRight: "15px",
        overflow: "hidden",
        ...STYLES.STYLES.GREY_BORDER_6,
        '@media (max-width: 768px)': {
            flex: "0 0 45px",
            height: "45px",
            marginRight: "11px",
        },
    },
    cardTitle: {
        ...STYLES.FONTS.FONT_SUBHEADER_BOLD,
        marginTop: "0px",
        lineHeight: "19px",
        '@media (max-width: 768px)': {
            ...STYLES.FONTS.FONT_FOOTNOTE_BOLD,
            marginTop: "0px",
            lineHeight: "inherit"
        },
    },
    cardEducationTitle: {
        extend: 'cardTitle',
        marginTop: "9.5px",
        '@media (max-width: 768px)': {
            marginTop: "6.5px",
            ...STYLES.FONTS.FONT_FOOTNOTE_BOLD,
        },
    },
    cardSubTitle: {
        ...STYLES.FONTS.FONT_FOOTNOTE,
        lineHeight: "16px",
        marginTop: "0px",
        '@media (max-width: 768px)': {
            ...STYLES.FONTS.FONT_CAPTION_2,
            marginTop: "0px",
            lineHeight: "inherit"
        },
    },
    cardBody: {
        ...STYLES.FONTS.FONT_FOOTNOTE,
        color: STYLES.COLORS.DARK_GREY,
        lineHeight: "16px",
        marginTop: "0px",
        '@media (max-width: 768px)': {
            ...STYLES.FONTS.FONT_CAPTION_2,
            marginTop: "0px",
            lineHeight: "inherit"
        },
    },
    linkText: {
        position: "absolute",
        width: "100%",
        bottom: "25px",
        color: COMMON.COLORS.COLOR_WHITE,
        padding: "0 25px",
        ...COMMON.FONTS.FONT_SUBHEADER_BOLD,
        '@media (max-width: 768px)': {
            ...STYLES.FONTS.FONT_CAPTION_2_BOLD,
            padding: "0 12px",
            bottom: "11px",
        },
    },
    linkContainer: {
        height: "384px",
        width: "100%",
        borderRadius: "6px",
        overflow: "hidden",
        position: "relative",
        '@media (max-width: 768px)': {
            // height: "191px",
        },
    },
    sectionTitle: {
        ...STYLES.FONTS.FONT_HEADLINE_BOLD,
        '@media (max-width: 768px)': {
            ...STYLES.FONTS.FONT_CAPTION_2_BOLD,
        },
    },
    centerAlignContainer: {
        position: "relative"
    },
    centerAlignObject: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
    },
    ...COMMON.STYLES.MOBILE_STYLES
};

class PublicPortfolio extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: {},
            user_educations: [],
            editingHeader: false,
            first_name: "",
            last_name: "",
            loading_user: true,
            limit: true
        };

        this.portfolioLinkRef = React.createRef();
    }

    componentDidMount() {
        let { classes, client, match: { params } } = this.props;

        UserService.getUser({client, username: params.username}).then((user) => {
            console.log("user,", user);
            user = user || {};
            this.setState({
                user,
                loading_user: false,
                first_name: user.first_name,
                last_name: user.last_name
            });

            if (user && user.user_id) {
                this.loadUser(user.user_id)
            }
        })

        setTimeout(() =>{
            this.setHeightRatio();
        }, 2000)

        window.addEventListener('resize', this.setHeightRatio.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setHeightRatio.bind(this));
    }

    setHeightRatio() {
        const RATIO = 9/16;
        const DELAY = 1;

        if (!this.portfolioLinkRef || !this.portfolioLinkRef.current)
            return;

        clearInterval(this.holdForResize);

        this.holdForResize = setTimeout(() => {

            const node = this.portfolioLinkRef.current;
            const currentWidth = node.clientWidth;
            const currentHeight = currentWidth * RATIO;

            console.log("RESIZED", node.clientWidth, currentHeight, node.clientHeight)

            this.setState({
                currentWidth,
                currentHeight
            });
        }, DELAY);
    }

    setEditingHeader(editing) {
        this.setState({
            editingHeader: editing
        })
    }


    renderInput(field) {
        return (
            <input value={this.state[field]} onChange={(e) => (this.setState({[field]: e.target.value}))}/>
        )
    }

    submitEdit() {
        let { classes, client, match: { params } } = this.props;

        const user = this.state.user || {};
        const { user_id } = user;
        const { first_name, last_name } = this.state;

        UserService.editUser({client, user_id, first_name, last_name}).then((success) => {
            console.log("sucess", success);
        })
    }


    loadUser(user_id) {
        let { client } = this.props;

        this.loadLinks(user_id);
        this.loadEducation(user_id);
        this.loadExperience(user_id);
        this.loadGalleries(user_id);
    }

    loadLinks(user_id) {
        let { client } = this.props;
        UserLinkService.getUserLink({client, user_id}).then((user_links) => {
            user_links = user_links || [];
            user_links = user_links.sort((a, b) => { return (a.link_order - b.link_order)});
            console.log("user_links", user_links)
            this.setState({user_links});
            this.setHeightRatio();
        })
    }

    loadGalleries(user_id) {
        let { client } = this.props;
        UserGalleryService.getUserGallery({client, user_id}).then((user_galleries) => {
            user_galleries = user_galleries || [];
            user_galleries = user_galleries.sort((a, b) => { return (a.gallery_order - b.gallery_order)});
            console.log("user_galleries", user_galleries)
            this.setState({user_galleries});
            this.setHeightRatio();
        })
    }

    loadEducation(user_id) {
        let { client } = this.props;
        UserEducationService.getUserEducation({client, user_id}).then((user_educations) => {
            user_educations = user_educations || [];
            user_educations = user_educations.map((user_education) => {
                const time = `${moment(parseFloat(user_education.start_date)).format("YYYY")} - ${moment(parseFloat(user_education.end_date)).format("YYYY")}`
                return { ...user_education, time }
            })
            user_educations = user_educations.sort((a, b) => { return (a.start_date - b.start_date) * -1});
            this.setState({user_educations});
        })
    }

    loadExperience(user_id) {
        let { client } = this.props;
        UserExperienceService.getUserExperiences({client, user_id}).then((user_experiences) => {
            user_experiences = user_experiences || [];
            let company_map = {};
            user_experiences = user_experiences.map((user_experience) => {
                const TEMP_PADDING = 1000*60*60*48;

                const start = moment(parseFloat(user_experience.start_date) + TEMP_PADDING);
                const end = moment(parseFloat(user_experience.end_date ? user_experience.end_date : new Date().getTime()));


                const time = `${start.format("MMM YYYY")} - ${user_experience.end_date ? end.format("MMM YYYY") : "Present"}`
                const diff = end.diff(start);
                const duration = moment.duration(diff);

                company_map[user_experience.company_name] = company_map[user_experience.company_name] || 0;
                company_map[user_experience.company_name]++;

                return { ...user_experience, time, diff, duration, timeElapsed: formatDuration(duration) };
            });


            let experiences = [];
            let company_roles = {};

            user_experiences.forEach((user_experience) => {
                const { company_name  } = user_experience;
                if (company_map[user_experience.company_name] > 1) {

                    company_roles[company_name] = company_roles[company_name] || {};
                    company_roles[company_name].company_name = company_name;
                    company_roles[company_name].company_logo_url = user_experience.company_logo_url;
                    company_roles[company_name].start_date =  company_roles[company_name].start_date && user_experience.start_date > company_roles[company_name].start_date ?  company_roles[company_name].start_date : user_experience.start_date;
                    company_roles[company_name].end_date =  company_roles[company_name].end_date && user_experience.end_date < company_roles[company_name].end_date ?  company_roles[company_name].end_date : user_experience.end_date;


                    const start = moment(parseFloat(company_roles[company_name].start_date))
                    const end = moment(parseFloat(company_roles[company_name].end_date ))


                    const time = `${start.format("MMM YYYY")} - ${end.format("MMM YYYY")}`
                    const diff = end.diff(start);
                    const duration = moment.duration(diff);

                    company_roles[company_name].time = time;
                    company_roles[company_name].diff = diff;
                    company_roles[company_name].duration = duration;
                    company_roles[company_name].timeElapsed = formatDuration(duration);

                    company_roles[company_name].roles = company_roles[company_name].roles || [];
                    company_roles[company_name].roles.push(user_experience)

                } else {
                    experiences.push(user_experience)
                }
            });

            console.log("experiences", experiences)
            console.log("company_roles", company_roles)

            user_experiences = [...experiences, ...Object.values(company_roles)]




            user_experiences = user_experiences.sort((a, b) => {

                const c = a.end_date ? a.end_date : new Date().getTime();
                const d = b.end_date ? b.end_date : new Date().getTime();
                return (c - d) * -1}
            );
            console.log("user_experiences", user_experiences)
            console.log("company_map", company_map)

            this.setState({user_experiences});
        })
    }

    renderCard({title, company, time, logo}) {
        let { classes  } = this.props;

        return (
            <div className={mc(classes.cardContainer)}>
                <div style={{display: "flex"}}>
                    <div className={mc(classes.cardImageContainer)}>
                        <img src={logo} width={"100%"}/>
                    </div>
                    <div style={{flex: 1}}>
                        <div className={mc(classes.cardEducationTitle)}>{title}</div>
                        <div className={mc(classes.cardBody)}><span>{company}</span> • <span>{time}</span></div>
                    </div>
                </div>
            </div>
        )
    }

    renderCompanyCard({title, company, time, timeElapsed, logo}) {
        let { classes  } = this.props;

        return (
            <div className={mc(classes.cardContainer)}>
                <div style={{display: "flex"}}>
                    <div className={mc(classes.cardImageContainer)}>
                        <CoverImageHolder url={logo}/>
                    </div>
                    <div style={{flex: 1}}>
                        <div className={mc(classes.cardTitle)}>{title}</div>
                        <div className={mc(classes.cardSubTitle)}>{company}</div>
                        <div className={mc(classes.cardBody)}><span>{timeElapsed}</span> • <span>{time}</span></div>
                    </div>
                </div>
            </div>
        )
    }

    renderMultiCompanyCard({company, totalTimeElapsed, logo, roles}) {
        let { classes  } = this.props;

        return (
            <div className={mc(classes.cardContainer)}>
                <div style={{display: "flex"}}>
                    <div className={mc(classes.cardImageContainer)}>
                        <CoverImageHolder url={logo}/>
                    </div>
                    <div style={{flex: 1}}>
                        <div className={mc(classes.cardTitle)} style={{marginTop: "8px"}}>{company}</div>
                        <div className={mc(classes.cardSubTitle)}>{totalTimeElapsed}</div>
                    </div>
                </div>
                {roles.map((role) => {

                    return (
                        <div style={{display: "flex", marginTop: "10px"}}>
                            <div className={mc(classes.cardImageContainer)} style={{border: "none", height: "11px", textAlign: "center"}}>
                                <div style={{
                                    background: COMMON.COLORS.COLOR_BORDER_GREY,
                                    height: "100%",
                                    width: "5px",
                                    borderRadius: "100%",
                                    margin: "auto",
                                    marginTop: "6px"
                                }}/>
                            </div>
                            <div style={{flex: 1}}>
                                <div className={mc(classes.cardTitle)}>{role.role_name}</div>
                                <div className={mc(classes.cardBody)}><span>{role.timeElapsed}</span> • <span>{role.time}</span></div>
                            </div>
                        </div>
                    );

                })}
            </div>
        )
    }

    renderSmallLink({ link, url, link_name}) {
        let { classes  } = this.props;
        link = link || "";

        console.log(link_name, link_name.length);

        let maxWidth = link_name && link_name.length && link_name.length > 60 ? 400 : 500;

        let clean_link = link.replace("http://" ,"").replace("https://" ,"")

        return (
            <a style={{cursor: "pointer"}} href={link} target={"_blank"} >

                <div style={{padding: "15px", borderRadius: "6px", color: COMMON.COLORS.DARK_GREY, textDecoration: "none", border: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`}}>
                    <div style={{display: "flex", height: "51px"}}>
                        <div style={{flex: "0 0 51px", marginRight: "15px", overflow: "hidden", borderRadius: "6px", border: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`}}>
                            <CoverImageHolder url={url}/>
                        </div>
                        <div style={{flex: 1}}>
                            <div>
                                <div style={{...COMMON.FONTS.FONT_SUBHEADER_BOLD, color: COMMON.COLORS.OSIRIS_BLACK, marginTop: "8px"}}>{link_name}</div>
                                <div style={{...COMMON.FONTS.FONT_FOOTNOTE}}>{clean_link}</div>
                            </div>
                        </div>
                        <div style={{flex: "0 0 20px", fontSize: "13px"}} className={mc(classes.centerAlignContainer)}>
                            <i className={mc("fa-solid fa-arrow-right", classes.centerAlignObject)}/>
                        </div>
                    </div>

                </div>
            </a>
        )
    }

    renderLink({ link, url, link_name}) {
        let { classes  } = this.props;

        console.log(link_name, link_name.length);

        let maxWidth = link_name && link_name.length && link_name.length > 60 ? 400 : 500;

        return (
            <a style={{cursor: "pointer"}} href={link} target={"_blank"} >
                <div className={mc(classes.linkContainer)} style={{height: this.state.currentHeight ? this.state.currentHeight : null}} ref={this.portfolioLinkRef}>
                    <CoverImageHolder url={url}/>

                    <div className={mc(classes.linkText)}>
                        <div style={{display: "flex"}}>
                            <div style={{flex: 1}}>
                                <div style={{maxWidth}}>
                                    {link_name}
                                </div>
                            </div>
                            <div className={mc(classes.centerAlignContainer)} style={{flex: "0 0 20px"}}>
                                <i className={mc("fa-solid fa-link", classes.centerAlignObject)}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        )
    }

    render() {
        let { classes, client, match: { params } } = this.props;

        let { user, user_educations, user_experiences, user_links, user_galleries } = this.state;

        // const instagram_link = "https://www.instagram.com/jasonmayden/";
        // const twitter_link = "https://twitter.com/JasonMayden?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor";

        user = {
            ...user,
            // instagram_link,
            // twitter_link
        }

        return (<div className={classes.container}>
            <div className={mc(classes.pageContainer)}>
                <div style={{maxWidth: "600px", margin: "auto"}}>

                    <div className={mc(classes.pageSection)} style={{paddingBottom: "50px"}}>

                        <PortfolioHeader user={user}/>

                        <div className={mc(classes.sectionPortfolio)} style={{display: (user_links && user_links.length) || (user_galleries && user_galleries.length) ? null : "none"}}>
                            {user_galleries && user_galleries.length ? <div style={{marginTop: 0}}>
                                <PortfolioCarousel height={this.state.currentHeight ? this.state.currentHeight : null} user_galleries={user_galleries} portfolioLinkRef={this.portfolioLinkRef}/>
                            </div> : null }
                            <div style={{marginTop: user_galleries && user_galleries.length ? "10px" : 0}}>
                                {user_links && user_links.length ? user_links.map((user_link, i) => {
                                    if (user_link.link_type === "youtube") {
                                        return (<div style={{height: this.state.currentHeight ? this.state.currentHeight : null, marginTop: i === 0 ? "0px" : "10px"}} className={mc(classes.linkContainer)}>
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={user_link.link_url}
                                                frameBorder="0"
                                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                title="Embedded youtube"
                                            />
                                        </div>);
                                    } else if (user_link.link_type === "small") {
                                        return (<div style={{marginTop: i === 0 ? "0px" : "10px"}}>
                                            {this.renderSmallLink({ link: user_link.link_url, url: user_link.link_image_url, link_name: user_link.link_name})}
                                        </div>);
                                    } else {
                                        return (<div style={{marginTop: i === 0 ? "0px" : "10px"}}>
                                            {this.renderLink({ link: user_link.link_url, url: user_link.link_image_url, link_name: user_link.link_name})}
                                        </div>);
                                    }
                                }) : null }

                            </div>


                        </div>

                        <div className={mc(classes.sectionExperienceContainer)} style={{display: user_experiences && user_experiences.length ? null : "none"}}>
                            <div className={classes.sectionExperiencePadding}>
                                <div className={mc(classes.sectionTitle)}>Experience</div>
                                {user_experiences && user_experiences.length ? user_experiences.map((user_experience, i) => {

                                    if (i >= 3 && this.state.limit)
                                        return null;

                                    if (user_experience.roles) return this.renderMultiCompanyCard({company: user_experience.company_name, totalTimeElapsed: user_experience.timeElapsed, logo: user_experience.company_logo_url, roles: user_experience.roles})

                                    return this.renderCompanyCard({title: user_experience.role_name, company: user_experience.company_name, time: user_experience.timeElapsed, timeElapsed: user_experience.time, logo: user_experience.company_logo_url});
                                }) : null }
                            </div>
                            {user_experiences && user_experiences.length && user_experiences.length > 3 ? <div onClick={() => {
                                this.setState({limit: !this.state.limit})
                            }} className={classes.sectionExperienceShowMore}>
                                {this.state.limit ? "Show" : "Hide"} all experiences<i style={{marginLeft: "5px"}} className={`fa-solid fa-arrow-${this.state.limit ? "down" : "up"}`}/>
                            </div>: null}
                        </div>
                        <div className={mc(classes.sectionContainer)} style={{display: user_educations && user_educations.length ? null : "none"}}>
                            <div className={mc(classes.sectionTitle)}>Education</div>
                            {user_educations && user_educations.length ? user_educations.map((user_education) => {
                                return this.renderCard({title: user_education.school_name, company: user_education.degree_name, time: user_education.time, logo: user_education.school_logo_url})
                            }) : null }
                        </div>
                        <div style={{textAlign: "center", marginTop: "35px", cursor: "pointer", display: "none"}}>

                            <Link to={"/"}>
                                <img src={"https://stripe-camo.global.ssl.fastly.net/a7a50b12a67746e3b93823ebacb2a536a3df879019a01863632fe7a8325a0949/68747470733a2f2f66696c65732e7374726970652e636f6d2f66696c65732f4d44423859574e6a6446387853307734536d6447616d70474d4464544e555a6b66475a6662476c325a563930596a4a3665576c72624664614e6a646b52455979516b78725931425a62455130306b676c7149777753"}
                                     style={{width: "35px", height: "35px",  margin: "auto", marginBottom: "10px", borderRadius: "100%"}}/>
                                <div style={{...COMMON.FONTS.FONT_CAPTION_2_BOLD, color: COMMON.COLORS.COLOR_BLACK}}>JOIN OSIRIS</div>
                            </Link>

                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(PublicPortfolio)));

