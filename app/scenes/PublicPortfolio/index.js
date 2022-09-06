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

import COMMON from "../../common/index";
import {mc, formatDuration, httpSafeLink} from "../../common/helpers";
import NavBar from "../../components/NavBar";
import CoverImageHolder from "../../components/CoverImageHolder";
import PortfolioHeader from "./components/PortfolioHeader";
import PortfolioCarousel from "./components/PortfolioCarousel";
import SmallLink from "./components/SmallLink";
import EducationCard from "./components/EducationCard";
import ExperienceCard from "./components/ExperienceCard";
import BannerLink from "./components/BannerLink";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    ...COMMON.STYLES.PORTFOLIO.PortfolioPageStyles,
    ...COMMON.STYLES.PORTFOLIO.StandardCardStyles,
    ...COMMON.STYLES.GENERAL.AlignmentStyles,
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

        this.galleryRef = React.createRef();
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

            user.user_instagram_link = httpSafeLink(user.user_instagram_link);
            user.user_tiktok_link = httpSafeLink(user.user_tiktok_link);
            user.user_clubhouse_link = httpSafeLink(user.user_clubhouse_link);
            user.user_instagram_link = httpSafeLink(user.user_instagram_link);
            user.user_website_link = httpSafeLink(user.user_website_link);
            user.user_vimeo_link = httpSafeLink(user.user_vimeo_link);
            user.user_youtube_link = httpSafeLink(user.user_youtube_link);

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
        const DELAY = 100;

        if (this.portfolioLinkRef && this.portfolioLinkRef.current) {
            clearInterval(this.holdForResize);

            this.runResize(this.portfolioLinkRef);
            this.holdForResize = setTimeout(() => {
                this.runResize(this.portfolioLinkRef, false);
            }, DELAY);
        }

        if (this.galleryRef && this.galleryRef.current) {
            clearInterval(this.holdForResize);

            this.runResize(this.galleryRef, true);
            this.holdForResize = setTimeout(() => {
                this.runResize(this.galleryRef, true);
            }, DELAY);
        }
    }

    runResize(ref, gallery) {
        if (!ref || !ref.current)
            return;

        const RATIO = 9/16;

        const node = ref.current;
        const currentWidth = node.clientWidth;
        const currentHeight = currentWidth * RATIO;


        if (gallery) {
            console.log("RESIZED GALLERY", node.clientWidth, currentHeight, node.clientHeight)

            this.setState({
                currentGalleryWidth: currentWidth,
                currentGalleryHeight: currentHeight
            });
        } else {
            console.log("RESIZED LINK", node.clientWidth, currentHeight, node.clientHeight)

            this.setState({
                currentWidth,
                currentHeight
            });
        }
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

    convertType (link) {
        if (link.link_type === "small") {
            return 3
        } else if (link.link_type === "youtube") {
            return 1
        } else {
            return 2
        }
    }

    loadLinks(user_id) {
        let { client } = this.props;
        UserLinkService.getUserLink({client, user_id, is_hidden: false}).then((user_links) => {
            user_links = user_links || [];
            user_links = user_links.sort((a, b) => {
                return (this.convertType(a) - this.convertType(b))
            });
            console.log("user_links", user_links)

            user_links = user_links.map((user_link) => {
                if (user_link.link_type !== "youtube") {
                    if ((user_link.link_url || "").indexOf("http") === -1) {
                        user_link.link_url = `https://${user_link.link_url}`;
                        return user_link;
                    } else {
                        return user_link;
                    }
                } else {
                    return user_link
                }
            });

            this.setState({user_links});
            this.setHeightRatio();
        })
    }

    loadGalleries(user_id) {
        let { client } = this.props;
        UserGalleryService.getUserGallery({client, user_id, is_hidden: false}).then((user_galleries) => {
            user_galleries = user_galleries || [];
            user_galleries = user_galleries.sort((a, b) => { return (a.gallery_order - b.gallery_order)});
            console.log("user_galleries", user_galleries)
            this.setState({user_galleries});
            this.setHeightRatio();
        })
    }

    loadEducation(user_id) {
        let { client } = this.props;
        UserEducationService.getUserEducation({client, user_id, is_hidden: false}).then((user_educations) => {
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
        UserExperienceService.getUserExperiences({client, user_id, is_hidden: false}).then((user_experiences) => {
            user_experiences = user_experiences || [];
            let company_map = {};
            user_experiences = user_experiences.map((user_experience) => {
                const TEMP_PADDING = 1000*60*60*48;

                const start = moment(parseFloat(user_experience.start_date) + TEMP_PADDING);
                const end = moment(parseFloat(user_experience.end_date && !user_experience.is_current ? user_experience.end_date : new Date().getTime()));


                const time = `${start.format("MMM YYYY")} - ${user_experience.end_date && !user_experience.is_current ? end.format("MMM YYYY") : "Present"}`
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

    render() {
        let { classes, client, match: { params } } = this.props;

        let embedded = false;
        if (window.location.pathname.indexOf("/ue/") !== -1) {
            embedded = true;
        }

        console.log("embedded" , embedded)
        let { user, user_educations, user_experiences, user_links, user_galleries } = this.state;


        return (<div className={classes.container}>
            <div className={mc(classes.pageContainer)} style={{padding: embedded ? 0 : null}}>
                <div style={{maxWidth: "600px", margin: "auto"}}>

                    <div className={mc(classes.pageSection)} style={{paddingBottom: "50px"}}>

                        <PortfolioHeader user={user}/>

                        <div className={mc(classes.sectionPortfolio)} style={{display: (user_links && user_links.length) || (user_galleries && user_galleries.length) ? null : "none"}}>
                            {user_galleries && user_galleries.length ? <div style={{marginTop: 0}}>
                                <PortfolioCarousel height={this.state.currentGalleryHeight ? this.state.currentGalleryHeight : null} user_galleries={user_galleries} portfolioLinkRef={this.galleryRef}/>
                            </div> : null }
                            <div style={{marginTop: user_galleries && user_galleries.length ? "10px" : 0}}>
                                {user_links && user_links.length ? user_links.map((user_link, i) => {
                                    if (user_link.link_type === "youtube") {


                                        let { link_url } = user_link;

                                        if (link_url.indexOf("embed") === -1 ) {
                                             const getId = (url) => {
                                                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                                                const match = url.match(regExp);

                                                return (match && match[2].length === 11)
                                                    ? match[2]
                                                    : null;
                                            }
                                            link_url = `https://www.youtube.com/embed/${getId(link_url)}`
                                        }


                                        return (<div style={{height: this.state.currentHeight ? this.state.currentHeight : null, marginTop: i === 0 ? "0px" : "10px"}} ref={this.portfolioLinkRef} className={mc(classes.linkContainer)}>
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={link_url}
                                                frameBorder="0"
                                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                title="Embedded youtube"
                                            />
                                        </div>);
                                    } else if (user_link.link_type === "small") {
                                        return (<div style={{marginTop: i === 0 ? "0px" : "10px"}}>
                                            <SmallLink {...{link: user_link.link_url, url: user_link.link_image_url, link_name: user_link.link_name}}/>
                                        </div>);
                                    } else {
                                        return (<div style={{marginTop: i === 0 ? "0px" : "10px"}}>
                                            <BannerLink {...{link: user_link.link_url, url: user_link.link_image_url, link_name: user_link.link_name, currentHeight: this.state.currentHeight, portfolioLinkRef: this.portfolioLinkRef}}/>
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

                                    return (<ExperienceCard {...{
                                        time: user_experience.timeElapsed,
                                        company_name: user_experience.company_name,
                                        role_name: user_experience.role_name,
                                        company_logo_url: user_experience.company_logo_url,
                                        timeElapsed: user_experience.time,
                                    }}/>);
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
                                return (<EducationCard {...user_education}/>)
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

