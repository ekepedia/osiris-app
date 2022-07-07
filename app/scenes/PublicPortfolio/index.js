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

import STYLES from "../../common/index";
import COMMON from "../../common/index";
import { mc, formatDuration } from "../../common/helpers";
import NavBar from "../../components/NavBar";
import CoverImageHolder from "../../components/CoverImageHolder";
import {FONT_CAPTION_2, FONT_CAPTION_2_BOLD} from "../../common/fonts";

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
            padding: "0 25px",
        },
        height: "100%",
        overflow: "hidden"
    },
    pageSection: {
        height: "100%",
        overflow: "hidden",
        overflowY: "scroll",
        paddingTop: "35px",
        '@media (max-width: 768px)': {
            paddingTop: "20px",
        },
    },
    profileHeaderContainer: {
        padding: "75px 35px", position:"relative", paddingBottom: "25px", background: STYLES.COLORS.COLOR_WHITE,
        '@media (max-width: 768px)': {
            padding: "40px 25px",
            paddingBottom: "20px"
        },
    },
    profileCover: {
        height: "150px", width: "100%", overflow: "hidden",
        '@media (max-width: 768px)': {
            height: "100px",
        },
    },
    profileImageContainer: {
        position: "absolute",
        top: "-50px",
        '@media (max-width: 768px)': {
            top: "-25px",
        },
    },
    profileImage:{
        height: "100px",
        width: "100px",
        border: `1px solid ${STYLES.COLORS.COLOR_BORDER_GREY}`,
        borderRadius: "4px",
        overflow: "hidden",
        backgroundSize: "cover",
        '@media (max-width: 768px)': {
            height: "50px",
            width: "50px",
        },
    },
    socialLink: {
        background: STYLES.COLORS.COLOR_GREEN,
        color: STYLES.COLORS.COLOR_WHITE,
        height: "22px",
        width: "22px",
        textAlign: "center",
        fontSize: "10.5px",
        borderRadius: "6px",
        paddingTop: "5.75px",
        display: "inline-block",
        marginRight: "5px",
    },
    profileHeaderName:{
        ...STYLES.FONTS.FONT_TITLE_2_BOLD,
        '@media (max-width: 768px)': {
            ...STYLES.FONTS.FONT_HEADLINE_BOLD,
        },
    },
    profileHeaderBio:{
        ...STYLES.FONTS.FONT_SUBHEADER,
        '@media (max-width: 768px)': {
            ...STYLES.FONTS.FONT_FOOTNOTE,
        },
    },
    sectionContainer: {
        border: `1px solid ${STYLES.COLORS.COLOR_BORDER_GREY}`,
        borderRadius: "6px",
        overflow: "hidden",
        padding: "15px 15px",
        background: STYLES.COLORS.COLOR_WHITE,
        marginTop: "10px"
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
        padding: "15px 15px",
    },
    sectionExperienceShowMore: {
        padding: "10px",
        textAlign: "center",
        cursor: "pointer",
        borderTop: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`,
        ...COMMON.FONTS.FONT_SUBHEADER_BOLD,
        color: COMMON.COLORS.COLOR_TEXT_GREY
    },
    cardContainer: {
        padding: "15px",
        marginTop: "10px",
        overflow: "hidden",
        ...STYLES.STYLES.GREY_BORDER_6
    },
    cardImageContainer: {
        flex: "0 0 45px",
        height: "45px",
        marginRight: "15px",
        overflow: "hidden",
        ...STYLES.STYLES.GREY_BORDER_6
    },
    cardTitle: {
        ...STYLES.FONTS.FONT_FOOTNOTE_BOLD,
        marginTop: "0px"
    },
    cardSubTitle: {
        ...STYLES.FONTS.FONT_CAPTION_2,
        marginTop: "1px"
    },
    cardBody: {
        ...STYLES.FONTS.FONT_CAPTION_2,
        color: STYLES.COLORS.COLOR_TEXT_GREY,
        marginTop: "2px"
    },
    linkContainer: {
        height: "384px", width: "100%", borderRadius: "6px", overflow: "hidden", position: "relative",
        '@media (max-width: 768px)': {
            height: "191px",
        },
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
        const DELAY = 100;

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

    loadEducation(user_id) {
        let { client } = this.props;
        UserEducationService.getUserEducation({client, user_id}).then((user_educations) => {
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

            let company_map = {};
            user_experiences = user_experiences.map((user_experience) => {
                const start = moment(parseFloat(user_experience.start_date));
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
                    const end = moment(parseFloat(company_roles[company_name].end_date))

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
                        <div className={mc(classes.cardTitle)}>{title}</div>
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
                                    height: "5px",
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

    renderLink({ link, url, link_name}) {
        let { classes  } = this.props;

        return (
            <a style={{cursor: "pointer"}} href={link} target={"_blank"} >
                <div className={mc(classes.linkContainer)} style={{height: this.state.currentHeight ? this.state.currentHeight : null}} ref={this.portfolioLinkRef}>
                    <CoverImageHolder url={url}/>

                    <div style={{position: "absolute", bottom: "10px", color: COMMON.COLORS.COLOR_WHITE, padding: "0 12px"}}>
                        <div style={{display: "flex"}}>
                            <div style={{flex: 1, ...COMMON.FONTS.FONT_CAPTION_2_BOLD}}>
                                {link_name}
                            </div>
                            <div style={{flex: "0 0 20px"}}>
                                <i className="fa-solid fa-link-horizontal"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        )
    }

    render() {
        let { classes, client, match: { params } } = this.props;

        const { user, user_educations, user_experiences, user_links } = this.state;

        const instagram_link = "https://www.instagram.com/jasonmayden/";
        const twitter_link = "https://twitter.com/JasonMayden?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor";

        const user_profile_url = "https://dl.airtable.com/.attachmentThumbnails/0caaf4ff150561069d1b3e4cc2a0f0f4/e6453bd6";
        const mckinsey_logo = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUSERMVFRUWFxUXFRgYFxcYGRUYFxcWFxYYHhobHSggGh4lHRUVITEjJSorLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0mICYtLS0rMi0tLS0yLy0tLS0tLS0tKy0tLi0wLS0tLS0tLS0tLS0wLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAAAQIDBAUGB//EAEYQAAIBAgIFBgoHCAIBBQAAAAECAwARITEEEkFRYRMiMnGBkRRCUmJykqGxwdEFIzNTgrLSFUNzk6LC4fAGY4M0RKPT8f/EABoBAAMBAQEBAAAAAAAAAAAAAAABAgMEBQb/xAA+EQABAgIHBAcFCAICAwAAAAABAAIRIQMSMUFRYXGBkaHwBCJSscHR4RMyQpLSM2JygrLC4vEFFCOiFUNT/9oADAMBAAIRAxEAPwD8jdSCQRYjAg7DUV7mk6KJQCGDMcI5chLb91L5Mw2E514rKQSCCCMCDmCNld9LRGjORs55xsK87o/SBSjAi0c/2LCAQQq0pSslulKUoQlKUoQlKUoQlKUoQlKUoQlKUoQlKUoQlKVNCEqaUpoSlKU0JSlKaSValbaJoxkNhltO6tGUbnuDWiJKRIAiVhSvb/ZkXnd4pXof+LpsW7z5LP2zVnA92YBQkpwkgfmxT+iD0JNo9lbaToo0hdZb8ovM5+D32Qy7n2LJk2RxtXHOzKFTSlLp4kikFwPMkykXzT7K645ytnZ9dRzF0hBew+70hMyvA4jYahpBBY/bGRGZF34h1TfVJn5NIxzXCko7boTBugDf+E9YXVgJeE6kEgggjAg5g7qrX1On/R3hK6yWE4W4F7rOg2q/jjc2YybfXzDqQSCCCMCDmDXDTUBojOw2Fen0bpLadpIkRaFWlKViulKUpQhKUpQhKUpQhKUpQhKUpQhKUqaEJU0pTQlKUpoSlKU0kq1K6ND0UyHDADM7q0o6Nz3BrRElIkARKromjGQ2GA2ndXrkhBqIMs8bdrnxR7TUsQgCIDwAxZuI3ema45HF9UjXOyJLlQd7nNzXssYzorYAxcZE+Al3AkmEiLOZzy85KeUXy9H/AJR+VKtyc33MXqL86Uqz+yfkf9SiIxG8eSwjSaFSV1JIjnb6yI+kPEPcanRZFLa0D8i5wKSG8T8Ax2cH76zj0OZOfCdbzoHv3gc7vFVbSkfCaOx2vFZX/EvRf2V5sakA6WAMYflcJj9OJKlza4JbA4ltv5mGR4HABepos+o2pq8i978k51Y2Plwv+7fhiDlXZ9JfR40tS8eE64OpGoW8118R9zZH8vkRRvq6qFNKi+7N+UXqQ85Pw3rs+jtLxAjLsVwCOQNITgjHCRPNa1dbSHNqPEjpwI6ph935RMrgpGOY/wBpRmY143iODvmMGgfPupBIIIIwIOYNVr676R0BdMUvHYTLgcNXX811OKP197bPlJEKkqwIIwIOYNedTUDqIzmDYV63RulNp2ykRaMPTOWipSlKwXSlKUoQlKUoQlKUoQlKVNCEqaUpoSlKU0JSlKaSValehof0ffnSYLsG01tQ0D6V1VnoMyecoqXOAE1joWhF8TgozPyr05JFQBVwGwAXZvRT+49xqNInAsow3IBeTsTJOtseFc7ki+sREDnjrTN1n5kV67Ws6O0tZM3nwmRVGpBNs7FyueXnLnCJ4aqJmtcOeTBzRDrSN6bbP9wqFDleaBEh2k2v1scW7KzjkxtDGSfKI127uitJIDe80gB3X5R+4YDvrmLy6YnmDAaVjDc0NBxVQAMD5n5RHeSTmqeCR/er6jUqfqd8vqp+ulYeyZ2WfMfrV1zi7d/FZeASpzlVvTjs3tjJqW+kWOEqpJ/EFnH4xZq5wskeNpIzvs6V0L9JvkxEg3SKr+0i/trna9rJRc3ESI2g1RvBSLHPnBrsDMbiKx4hTaBsVaSFtl+egPBk547q6WEpH1iJpKDx0OtIPxrzvXFcgnibpw6vGJiP6H1hVooor3jmdDs5RSD68d61a4AGBGw1Y6teA07gsntJIjHKIjDRzDWG0leloWm4jUcuRgBKQky8Fl6LjzWr0NM0VNLwP1c4GFxqEjc6bR56XH5a8giZhzki0obwRI/rKQ3fUxaUq2UtJHuSdS6D0WFnj666w8VatKJZ9XvJG2tHBq4XUJrVqIzGE4bgDDIttm5xXmaXorxMUkUqR7eIO0VjX2sTJpKCOVdfyZEYSAHg4xT8Yx414H0t9AyQ3Yc9PKAxHpjZ15VyU/Q3UYrsm3iOcRwku3o/Tm0hqPk7gdPJeTSlK4l3pSlKEJSlTQhKmlKaEpSlNCUpU0JKK0hiLGyi5rv0P6JZsX5o/qPZs7a9QBIgVWy2HWTf2mvS6P8A457xWpOq3jsjZqdyxdTASbMrm0P6OVMW5zZ8B/u81V9K1zYEsd0WJ7ZNn4e+mkO0ljyJsNsx1E69XC/aa55Hws8wA8mIYezVHvrupKVtE32dEIDdHa6r+++IsC541zbHj3R4w1UtdcC0cI2hOdIesjHvIrnEsa9FC53yH+0fE05WJeipbjI1h3Jb31dNLkP2a6v8OP42J9tcBeCYRBwlWI31WjKqAFqGkXbyAOEXbyrlZ3GRVd2ESfAVkNHQdOVDwQFz39H21J0KZsWR+uQ2/OaDRLZyxevrfkvTcxxMS0k4uJ9O9Jr22BwGTR/cdyfU75fVT9VKnkI/vh6knypSn2Wbx9ScR2nbv4rkTTpVylkH4zWv7Tkbpaknpoh+FVOmf9Oj/wAofCnhu+HR/Ucf31zh8BKlPH1QWCM6IcPRSNNU9KCI+hrp7mtQvAc45V9BwfY6fGg0xdsEXZyg/uqfCovuF7HkHxpF8TEuadW/wiipKAa4fm/kqiOA5SSL6cV/aj/CuxJXAsulRMN0jG3dIhrk5aH7g/zm/TUGSD7qQdUg/wDrpspGNMQWjQ0g8PBS5jnCYcdRRnneu+KF73EMTHytHkCH+liPZXv/AEX9JMdWJ45lN85U6XDXFhrcbY+2vkT4P5M3rIf7KvFNEvRfSl6nSuqh6Sxhk4b/AODY7SVy03RXPbCqd38nbgNy+l076Fhn5yERuSRhkSM7phjvyNfPab9CzRYldZfKTEdozFe19G/Sgcol5SyXsZFX63ct74Sbn5vGu/RdLwTpYu17x21T5D26L+fbVNbu6PQU4iJHEQ4iJHOi52dI6R0c1TMYHbYbbvS1fCVNfcz6NFLjJHckkE6pDjrIx/FitefL/wAbiPQd1ubAGzX6t/fXI/8AxtKPdIPDv813s/yNGfeBHHunwXzFK9x/+NN4siHZiCMey9Yn/jk2+L1n/RWP+j0jsHh5rb/coe13+S8mlewv/HJNrRj1j8K1X/j4F9eXLOwt7SaodA6Qfh4jzT/2qLHvXhVaOMsbKCTuAvX00X0VCuwsbXxYY9lxXSjhbBVsNW+Gp8DjXVR/4t3/ALHAaT74DvWR6WPhG+S8PRvoVz0yEG7M16mjaLHHbUUkk2va5445Cra7c3myZEmxHwGJ4ZVz2J1bxyHNsSThvwGLcBXo0PR6GhgWNniQY90BulO4FZGkc/3jLnNaTy4G5AGuOm4wHECuGfScTadEB2RqST22HvqkrNl4KxFycRLt2m22sTI4/wDbxjrikPvNc3SOkF0hLY/wDfVWALBPa3xJVXaE4kzMfwL79Y1HhMYyiH42Z/dq1PhLD91EP/EPjU/tF9moOpEHwrgL2Cwj5AeJMeK2qPNo/wCx7gIKF09h0REvoxr8b0OlTN40h6r/AAqT9Jy/ekdRA9wqh02U5yyeuaftQbXu5/MgUZuY3f8AxUeDSH93IfwGtV+j5fupPVtWRmc5yOfxmqHjU/8AFcDvA8CrhS3kbvULq/Zsv3Z9nzqK5dSlOLMDvH0og/Ebj9SfUb9IPZGP7jVgYPJmPW6D3Cg+jpfGXU9Mqn5iKeBgZyxdhLn+gGsqtL/8wNWw4uUA0fbJ2+ScrDshY9ch+CU8JTZAna8h+NQUhGckjeglvzmgkhGUcjem9vyCp6wtLBsaf0tKcAbA7eR3kJ4aNkMParn3tRdNvlFo/ZEp996HTAMooR1guf6yasunzNgrN1RqB+QVYpiDAPMfutA+k8EjRXlss3E+YW0TznoRW6oEUd+pWjSaR40yJ1yIPYmNcz6HL+8fV/iyW9hN/ZVOQhXOQtwjW3tf5VqXUgMy8fifV4QjxWdRhsDdjY8bF0tKfG0x+pDKfkK9H6P09ZGVQzl1QqC9lWYD92+LC+ODG3XXjrMl7Rw6588s59QWHsroflbWkkEQ8gWB9WPHvq6OlcetbjCsQNXPcGjcVFLQNIq2Ye73NETpHuivYiFgjahVU1idZjysHbfnQ45XqdHlAEYulmdmBjjvDIbnpYcx+3CuLRNJV2GrczIhCO5KCS3iPY7sAWzyNbRtsFlIQ8toyqh1/KKWIa5GOesK62UgIi2zLKF4qjYC4wmIiS4X0ZaTWlrnHG7AynJ0HdZdJ0k3VWOoxkJCyyC5HmMrZelVXnO/VJkylPInDcydPtrm0ZrIpRbwjWdlk5QyJvKHHDHBh200Y3VSn10YLFjLcyR2ztzd21b1q2kMtN4xhAEjEwAGUFVSZ5xlkZSBt7RXTpGkW1rnUvIADKAAerUxPbTSZWGuSJQCQAYzyl8vFxCjrNcujOWA5BywMhJE2uThcjUXAHDycaxDJiQZNHJkxJuC+O8kutjT9rIOBlrxiZERNsQAZAuk1aBk4Qs17rbsHa49M0obldUxNgAQ621fSYAgnhcVWUHnExXAQDWjuS3o6hbVHbVdJL2PLRBwXGpqXzFsTIObiN4rEhCXKSlWwDM+IA3BhZRQXGMPTHtSzhESmQxpqnVrZRHnh2YcQrEx3sQ6FU2EFYjwuBcntNcrPGwAWV47bChz2klCb1tpcky46vKRZAkLMpttL42PaK5FnibpR24xMR/S+sK46elEaktocI6VbpQJgIwkA0NDdmEuERMfdc136vVack2zSI/5rqf6gKt4NpOxpG9CUt+V6y5GFujKV4SKfzpcUH0fJmmo/GNg/sGPsrEB3wg/ld4dY8QkS34nD8zfGQO5WMukrm2kDraX41H7Sm+9ftPzrPlZY8NaVeBLr7K1/aMu1g/pqr+8Uva3V3Dj+4dyoUMohjDw/ae9SPpKXy/Yvyp4e/mHrjj+VPCwc4ouxSv5WFTykJzR19B7/nBqg591Idpd696dVt9GNlXz8FXww7UhP/ij+VSNL/6oP5Y+FWVYTtlXrVD7jU+DKejNH+LXT4WqgaW50doSIor2w/KfAQ4qvhX/AEwep/mlT4J/2QfzP8Uqv+bmCmPR+YryiKtFGzYKCx4An3V0HSlHQijHF7yH22HsqJdOkbAubbhgO4V5lSiFro6DxMP0lddZ5uhqfAeasdAcdMonpsAe7OhSFc3d/wCGth3v8q5UUk2AJO4YmurwFhjIVjHnnH1RjVs63uMjC8mMNT1WjaFDoj3nbuSdyHSUHQiTrkJkPwHsqG02V+aGb0UFvYlTrQrkGkO881e4Ynvqr6c5FlIjG6ManuxNX7QtEHUkMmeMIN3VtEqkbG7/AFiVbwIjGRlj9M3f1BjQNEuStId781O4Y+2oXQWzciMHa+Z6kzNSZY06C658qTLsjHxJoDAy1ob+LrH5YbiWj8SIl15Okhv9di1jlmcczmJt1LRoOtv81lycSdImQ7kwTtY4nsqzJJKNZ2so2vgo6h8qjlUToDXbynGHYvzq3GIDn7C+fysw1i3MJAQkNw8Sf71WoMjL4sMfDmA/3PXZBOspsuM6p9XK69K2xrZNbAMe2uCSI31p2N9i5yHsyQf7apUs4IW0cYz3dpzc8K2DnB04xwPvfSwC3EWiSzdRtcJSzF28EujfjqvS1gXvcDSkW1rlEYjZ6dvFuAaqGDMpZgmkKMEEhRCRaw81zjzb48KrHMJgUQkSBAFkIxlAvzHIF1bEWbhY1PK65aMm06JblStr6l7o/jDCw166A4GyYJuAmco+88QEz1dkFzFpEiIQGZgN02Ts+HiIZw7KJrLML6ttcpc4rrqMj1dtXLsCizKXc3YOAAyob4q5Fn344Cqh+dyMnKayoU5Sw1022N8Smy9744VC60QCaoaEjXYkko4NrlCDgdmGN86oRjHO2+Ih71xcL3mTJwnALQCMBtAjrNhllLDKZiGNh/6eTXGsS56Ti1zzo9osM8b1zvpUUnNKsi3JDR2t2p+k1doiyhtHY2XEqMJVO1s+cOI7qy8MST7dcfvIwA/41yf2GuekpJVRCG9pyBtAjabSZuIgrtJIiYYScNRfzAFWTRZE58L64GZiJuPTXMdoqg08N9pGj+eOY/rLge0VD6K8f1kbayjJ4ycPS2oeureGh/tkDeenNk78n7RWMavViW5Gbdb98Dqn73Wk7MdV22YnjMfhUCGJuhIUO6Yf3ph3gVSXQpE5xU28tOenrjCthoIfGFw/mHmyeqcH7DWEcjxtgXRhnmD2ik4D4m7RyRsBCpjnGTHRhc63wI1IK0i0+UC2uSNz2cdz3q3hSnpxRnigMZ9l19lW8NDfaxo3Ecx+8YHtFPB4m6EmqfJmFv6lw7wK0BeZB0cj5GW4pVWCbmQzHm2e8AZqBHCcA8i8XCsO9LH2VPgBPQaN+AcA9xsapPociC7KbeUMU9YYVgBSJAMHN8PTgrbEiLHxGw90DvJWskDp01desEVmK3h0qROi7gbr4d2Va+GX6ccbcbap70tVBrDfDX08k40gtAOhhwP1LlpXXysX3R/mt8qVVQYjj5I9o7sHe36lwDQWGMhWIeecfVFzU60K5B5Dx+rTuGJ9lchNbw6G7C4Fl8o4KO01wMMTCjZE59Y+X/VWRe93h68VY6c9rLaMboxqe0YnvrGGJmNlBY8Ma3tEmZMh4XWPvzPsqJNMYjVFlXyUGqO3f203z+1fGFwnD9o2ROSG4MbDWXC3YreDKv2r4+THz27T0R7ajwzV+yUR8c5PWOXZVNH0RmxAsozY4KO35Vrrxp0Ryjb2FkHUmZ7a0bWArNgwY3nQ2n8tUYm9IgGTuscLhznErOPRne7HAbXc2Hft7KuXjTojXbynHNHUm3tqpMkrbWPsA9wFWskedpG3fux2+P7qTAIVmSHadjkJzyESMQEGcnbh45bhknJvJz3ay+U+Q4Df1CrCcJhEDfyyOceoeL76qA8puTgMycFUe4dQpy4TCLPbIc/wDxffVAw68SPvGbj+HDWOr7k4XcLhzyFIiCYy4tnqXx63OzqzqxBcaznVQZWGHUg2moEQTGTFswnxc7OrOli/PkNlGA/Sgqw2HUhC+rHjSOlAC2EtG2lWzjt8AP71Km5cFVGpGM7+9jtPCu5ZBpAMd3DAIA5t9YBgEk444HHjXDjJ5ka9w/Uxp0+avNiXE3953nhWjXHWMsKwnIdlgvOshMNh9GHZEWZWb4wmPRdokDBoXEgEYChycVKE2Vwc0xyzGFqzllMLcm8QaMjonHlFOIkSQZHbrCpEy6QOTJIkFuTZzg9gAEk3Phg3ZWME+qDDOpKAn+JC+0p8UyNOkpBccq37TKTRxtIIs54QBbV1bZ+Ztm7HB1sSaLqjloGJQY3ykjO57fnGFX5ZJvteY/3ijBv4ij84qrxvAwdGuD0JF6Ei7Rb3oavyCTYxAJJtj8RuMZOR8w9lZC0gCd7bjp6TwMFRIgHOMRc4WjJ2WMtQCIrJklhYEEqTkyG6OODZOOFaGWKXpjkn8pB9WfTXxete6s9G0po7ow1kvzo3yv70biK1OiK41oCTtMZ+0Xq8terHhQyMIMnkfD0gd8VT5GNJI9oS34aOi3CcljpGhutiQGU5Oh1kPU3+mtV09rasgEi7nxI9F8xWWj6S8d9U4HpKcUPBkOBre0UmX1T7jcxHqOaduFNn3DDLmR0O8qngiVKIgXi7ZaNQTsUchG/2b6h8mXL8LjD1rVjPozobOpHuPUcjTSNGZDZ1I3bj1EYHsrSDS3QWBuu1HGsh/CfhT6pMCIc4Hw2BMVwIsNYZ+BEeIOqzgmZDdGK9Rt/+10+FhvtI0bzk5j+zA9op9S++Ju1ox/entqk2huo1rXXykOunrDLtqwHNEjEb+Bs2qSaNzusIOzkdhFugJ0WhgjboSap3S4f1Lcd9qpNobpiym28Yr3jCsBWsE7J0GK9Rz7NtUKptENPIq6rxYY6+YntgTmsqV2/tGTzfUj+VKqq3E7vVKtSYDefpXn8tGn2aax8qTHuUYd9655p2c3Zifh1DIVaDR2fojAZk4AdZ2Vp9Wn/Y3dGPi/srz4PpGzIazcNwm45wOZWvVaZTO88bOAwCz0fRmfEDAZscFHWTWl40y+sbecIx2Zt24VnpGkM/SOAyAwA6hVoNFLDWJCr5Ry7N56qGEAwomxOJ8rAMyTDEJkS6x571WadnPON9w2DqAwFajRwuMptuUdM9fkdtT4SEwiGPlnpdg8X31jBAzk26yTkOJNOArdt51I83d0LyAicMBzu79FeXSiRqqNVfJG3rOZNXXRwmMuexB0j1+SPbTlVjwjxb7wjL0Bs6zVIoS12Y2Xax37hvNVa6fXdwA7iBgOoLZiQLsBxPO/S+Xd5CFAwGSjADj/k1flFj6BDPtbYvofOqSz4akYsv9Tdfyq4UR9KxfYuxeJ3nhVgmJcDO9xuybnhl7oAEUoXcPNQsIA15NuIXa3E7h76AF+c5sow6vNUVCJrXkkJtftY7h/uFTjIdiqvcg+J99MAQAAkbG3u+844Xw4wrOT5/pTfXwHNRe5eJ3k1SaW/NXBRkN/E8aTS35q4KMuJ3njWVRSUloBjG045DBo2RhhABgKK9JHGkAI5AlGCOcpBsjc+VsD9hrzqmoY6rpeOeBuUUlGHjAiw4emIvXZo85iLRyKShNnQ4EHevkON9V0vRNUBlOtGTg21T5DjxH9+yt0kGkAIxAlGEbnJxsjc79z9hrHR53iZgR5jo4wbgw+NakCABmLjeMvTaFzgurEtEH3i52Y8Dsdlqs6zc2Y6r5LLv3CTePPz66wnheJrHA5qQcCNjoRmOIrXSNFUrysNynjKenETsbeu56aNpdl5OQa8e7ap8pDsPsNUZyfbjjrjrvTo5CNEJXtw0jYcRYbiIz0GkJLhNzX2SKM/4ijPrGPXWGkaI0dr4g9Fhijei1X0nRNUa6HXjJsG2g+Q48RvfUaNpTJcYMp6SPih+R4iqMzB+/wA8dbdU2SFaisw8o+6cjLJpU6NpbKNXBk2o+K9m1TxFbCCOT7JtVvIkP5GyPUcaeCrJjBe+2JumPQ+8HtritVTAgZi70PhZkgBriSyRv9RYdb7iryRFTqsCCMwRY1eCdkN0YqeG3rGRraPTTYLIBIoyDYsvoNmPdV/Ag+MLa3mHCQdmT9ndVNZe31TdSQEKUSxtHGzbLAlOXjf7RNXzo8O9cj2Wo2hEi8ZEg8zFx1pmK5bVdCQbg2O8VoDG1Hsy33DDWY2XjKBgMFGqdx7qV1ftGX7x/WNKcG57vVFalwHzH6V4+kaSz5nAZKMFHUKrDCzmyi593XurcaMFxlNtyDpnr8ntqk2kkjVUBV8kbes5seuvLcwg1qYmOF+3AYRicGwW4NzfT15mr2SPdI3/AMY/X7qxmmZzdjfduHADZSGFnNlF9+4DeTsrflFj6FmfyjkPQBz6zTm9vZZ3+LjwF5aiQOJ53DmahNFCjWluBsUdJvkOJqmkaQWFgAqjJRl1neeNZqGdtrMe0mum6x5WZ9+ar1bzxyqm9Zpq9VthJmTlK0/dEBjZFF85nnmKqsAUa0nYm08TuFVkdpGAA4KoyA4VWONnJ72Y7OJNaSTADVjyPSba3yHCn1auDOLiOfwtwLrS/PuVtcR4KbvtbYvBfnVYoQBrvlsG1v8AHGkcQUazj0V38TuHvoAZCSTgMzsUf7kK0gYgFs/hbcI3nvnba7qwBFOMhubAAdijcKrNLfmrgoy4neeNJpb81cFGW8neeNZVFJSQiAYk2nHIZbo6QCYCUpVqxATSopVqpCi1elG4nARyBKBZHOUg2Rud+5+w151WtWjHQ55545UlGHjAiw4emIvW0MjwvcXVluCCO9GG0cK6ZIFkBeEWIxeLau903pwzFSjicBHNpQLI58cbI5Dv3P2GuQa0b7VdT1FSK2gAMQed/AhYglxweLcCO8iNhtadoNtE0hozdTngQcVYbmG0V0nR1lBaEWbNocyN5jPjr5uYqxRZsUAWXNkGCy72Tc+9NuyuNSQcLgg9RBHuNMCAgZhA65rN6rhb64jAiGRFiqMOyu5dIWTCbpbJFHO/GPHHHOp5RZenZJNj5I/p7m8/vrmmgZDqsCCP97asAtsmObQnEUhg4QcOYg3jGUO0LlfSdFZLE2KnosuKN2/CsRW+jaQyXAsVPSVsUbrHxrfwdZMYcG2xscfwHx+rOrDQbNyPaFn2lmN23DX3cxYoXTA2Ey625hhIO3x+2pfQzbWjOuu22Lj0lzFcpW2BrSNypupII2jA1oDG1Hsqv2csrvMbJYgqlK7f2nLv9i/KlVAcj1TrUmA+Y/SvnSdprpj0aw1pDqrsHjN1DYOJqwZI8rO+/wAReryjxyrlkcsbsbk7TXjVW0XvTOFw1N+gvvtC6Ik2WLabSbjVUaqeSNvEnaajR9HLXOSjNjkPmeFXjgAAaTAbF8ZvkONU0jSC2GSjJRkP88asj4qWZuFkv2jASJuABiDJq0knAGrHcDafGb5DhVNH0e+JOqozPwG81aKEAaz4LsG1urcONVnnLW2AYADIdVN0oPpdjbJaXDi62+sgYDepmnuNVRZRs2nid5q6oEGs4u3iru4t8qkKI8Ti+wbE4njwrOOMuSSeLMdlaQcHdab7hLq7LIi4WNtdCYClDLvUopckk8WY7P8Ad1Jpb81cFGW8neeNJpb81cFHeTvPGsqh7g0FrTEm04+MI2n4tIBNKUq1ZAJpUUq1UhKClWqgEkpSpAqkJavRRhOAjm0gwRz442Rud+5+w1wUrVpgsqSjD4XEWHDm8X7ldkKsQQVZTjsIIruBWbBiFm2Nksu4P5/nbdtInE4COQJBgjnxt0bn3N2VxSRlSVYEEYEHZWoENCsvtJGTxh3iNrTeDwIBUyRlSVYEEYEHMV1QaSCAkoLIOiR009E7RwOFXSdZQElNiMEk3eY+9eOYrCeBkbVYWI9u4g7RxqwITHOqcn9R4gRP1ae+8WETV9J0UpZgQyHosMjwO5vNNYit9G0hkvaxU9JWxRhxHxrWTRgwLw3IGLIemn6k87vrQNjYj2hozB+w+eBzsORMFK6Qr4TXJ2OOmPS8se2qT6KUxwZTky4qfkeBrnAro0fSGTLI5g4qesVoJ2pezLPc3XbMO7HFY2pXb4TH9wnrN86VVUYo9o7sHe36l82ikmwFychXVZY87M+7NY+veeGVQ0wUasfa+09W4VzIpJsBcnIV4gLaL3ZuxuGlxOcIdmNo6rbbOee9TI5Y3JuTtrpEYTFxdtkfxb5VNxHlYyb8xH8z7q5gCx2knvJp/Zmc374HO2LspgXxMQC3Tnnmcu5c3OJP+gCujCPjJ7I/m3uoWEeC4vtbyeA48aygh1juAxJ2AVYrMdATeeBvnYXYmMG4xmC3Tnh3pDEWJxsM2J2VaaW/NXBR3k7zxpNLcaq4KO8neeNZVLnBgqt2nHIXwj82iEpSprNNTUUq1UhKCgq1UAklKirCqCEFWpSrASSpFAKtWgCSi1elE4mARyBIMEc+MNkb/Bq88CptWrZLOkZWyIsOHN4v3Qu8ZUlWBBGBB2GuqCcFRHLcr4rDpx9W9N61pG4mARzaQYI58bdG59zVyPGVJVgQRgQdlaAQmFnKkFR4gROXAtOH9ELXSdGKGxsQcVYdFhvFZxOVIZSQRkRW+i6RYajjWjOY2qfLQ7G99W0nRdWzA6yHosPc3ktwrQC8Ia8xqP2YO2Y3kbpLTmzbkk7kf9L+w1zvGVJDAgjMGqAV2x6QGAWW5tgrjpr+peFagRUgGj92YwvGmIy3XBcdqV3eAj76Hvf9NKuCX+xR5/K7yXzMURY2A/xxO4Vu0oQaseJyaTfwXcPfUSzC2qmC7d7cT8qzhiLGw/wBvO4V4LeqatHNxlEdzfqkcICJPbbbzr5KsUZY2Aua6HkCDVQ3J6TfAcOO2oklCjVT8TbW4cBVIItY7gMSdgFNgq9Sjm43i7IXaulYYECZLZlNHh1uAGZ2AVaaW41VwUd5O80mluNVcFHeTvNZUiQwVWbTjkMu/SAQlKmorJNKtSlUAhTQUq1WAklRSpFUAhBV6UqwEkqQKCpqwEkqwFAKkVoAkgqwoKkVoAhLV6ETiYBHNnGCOfG3Rufca4QKtatmhZUjK+RFhw5vF+4i7xlSVYWIwIOyttF0gpcW1lPSU5H5HjW0biUBHNnGCOdu5H+BrmeMqSGFiMCDsrQBQCHgseJ3+Yy4g5refRxbXjN02+VGfJf57awArXR5ihuvUQcQRuI2iuiSEMNePIdJMyvEb047K1ASDiyTzK4+BzzvstkeO1TVqVpVW0CvD0eEscNmJJyA3mryzC2onR2nax3nhwqJprjVUWUd5O81GjxFjuAxJOQFfOCX/HRzJkTjkMsSbYWhsltmUgh1juAxJ2AVaaUEaq4KO8neaTSgjVXBR3k7zWNBcGCq3acchl+rSCAEq1RSsk0q1KVSEqRQVarASSopVhVIQVIqaVYCSVIFAKmrASSrAVAFXFaAJIKkUFSBWgCEAqwFAKsK1a1JBVgKAVIFatapQCu+NxKAjmzjBGO3cj/A1xgVIFatas3srZEWHDm8Xq7xlSQRYjAjdV4XKkFTYiumNxKArmzjBGO3cj/A1g0ZUkEWIzFbNapa6t1XCd4xGWS6PDj91B/L/wA1NclqmrqrP/Vouyvm66x9gfTHupSvmOj/AB/gd3L0DdquSppSsU1NTU0qghQKtSlUhBVhSlUEkqRSlWkpqRSlWhWqamlWEkFXFKVoEkFWpStWpKwq1RStAkripFKVs1JWFaCopWzUlYV6H0r0k/hR/lpStBaFzv8AtWaP/auOlKVstl//2Q==";
        const jpmorgan_logo = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcqxgQys8HdSZNTvvF3exCfFycRYYw3rdNJ7ugnKysdC0h0WzJMbU-nBBF8kwtlwZ8jSI&usqp=CAU";
        const nike_logo = "https://dl.airtable.com/.attachmentThumbnails/f02af521f0da9ad66a801284eccbf677/2c28c4b5";
        const harvard_logo = "https://1000logos.net/wp-content/uploads/2017/02/Harvard-symbol.jpg";
        const stanford_logo = "https://dl.airtable.com/.attachmentThumbnails/a3b575705e7044d1b51ec55e9d2b5d82/9edea624";
        const ccs_logo = "https://dl.airtable.com/.attachmentThumbnails/abf1031e1956a44a57b27d5ecff3a4be/e5a90fc2";


        return (<div className={classes.container}>

            <div style={{display: "flex", flexDirection: "column", height: "100%", overflow: "scroll"}}>
                {/*<div style={{flex: "0 0 50px"}}>*/}
                {/*    <NavBar/>*/}
                {/*</div>*/}
                <div style={{flex: 1,}}>
                    <div className={mc(classes.pageContainer)}>
                        <div style={{maxWidth: "600px", margin: "auto"}}>

                            <div className={mc(classes.pageSection)} style={{flex: 2, paddingBottom: "50px"}}>

                                <div style={{border: `1px solid ${STYLES.COLORS.COLOR_BORDER_GREY}`, borderRadius: "6px", overflow: "hidden"}}>
                                    <div className={classes.profileCover}>
                                        <CoverImageHolder url={user.cover_photo_url}/>
                                    </div>
                                    <div className={classes.profileHeaderContainer}>
                                        <div className={classes.profileImageContainer}>
                                            <div className={classes.profileImage}>
                                                <CoverImageHolder url={user.profile_photo_url}/>
                                            </div>
                                        </div>
                                        <div className={classes.profileHeaderName}>{user.first_name} {user.last_name}</div>
                                        <div className={classes.profileHeaderBio}>{user.bio}</div>
                                        <div style={{marginTop: "15px"}}>
                                            <a href={instagram_link} target={"_blank"}>
                                                <div className={mc(classes.socialLink)}>
                                                    <div><i className={mc("fa-brands fa-instagram")}></i></div>
                                                </div>

                                            </a>
                                            <a href={twitter_link} target={"_blank"}>
                                                <div className={mc(classes.socialLink)}>
                                                    <div>
                                                        <i className={mc("fa-brands fa-twitter")}></i>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className={mc(classes.sectionContainer)}>
                                    {user_links && user_links.length ? user_links.map((user_link) => {
                                        return this.renderLink({ link: user_link.link_url, url: user_link.link_image_url, link_name: user_link.link_name})
                                    }) : null }
                                </div>
                                <div className={mc(classes.sectionExperienceContainer)}>
                                    <div className={classes.sectionExperiencePadding}>
                                        <div style={{...STYLES.FONTS.FONT_HEADLINE_BOLD}}>Experience</div>
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
                                <div className={mc(classes.sectionContainer)}>
                                    <div style={{...STYLES.FONTS.FONT_HEADLINE_BOLD}}>Education</div>
                                    {user_educations && user_educations.length ? user_educations.map((user_education) => {
                                        return this.renderCard({title: user_education.school_name, company: user_education.degree_name, time: user_education.time, logo: user_education.school_logo_url})
                                    }) : null }
                                </div>
                                <div style={{textAlign: "center", marginTop: "35px", cursor: "pointer"}}>

                                    <Link to={"/"}>
                                        <img src={"https://stripe-camo.global.ssl.fastly.net/a7a50b12a67746e3b93823ebacb2a536a3df879019a01863632fe7a8325a0949/68747470733a2f2f66696c65732e7374726970652e636f6d2f66696c65732f4d44423859574e6a6446387853307734536d6447616d70474d4464544e555a6b66475a6662476c325a563930596a4a3665576c72624664614e6a646b52455979516b78725931425a62455130306b676c7149777753"}
                                             style={{width: "35px", height: "35px",  margin: "auto", marginBottom: "10px", borderRadius: "100%"}}/>
                                        <div style={{...COMMON.FONTS.FONT_CAPTION_2_BOLD, color: COMMON.COLORS.COLOR_BLACK}}>JOIN OSIRIS</div>
                                    </Link>

                                </div>
                            </div>

                            {/*<div className={mc(classes.pageSection, classes.hideOnMobile)} style={{flex: 1, marginLeft: "50px", opacity: 0, }}>*/}
                            {/*    <div style={{padding: "25px 40px", textAlign: "center", background: STYLES.COLORS.COLOR_WHITE, border: `1px solid ${STYLES.COLORS.COLOR_BORDER_GREY}`}}>*/}
                            {/*        <div style={{marginBottom: "20px", ...STYLES.FONTS.FONT_CAPTION_2}}>Ad</div>*/}
                            {/*        <div>*/}
                            {/*            <div>*/}
                            {/*                <img style={{width: "80px", margin: "auto", marginBottom: "10px"}} src={"https://upload.wikimedia.org/wikipedia/commons/b/ba/Warner_Cable_logo.png"} />*/}
                            {/*            </div>*/}
                            {/*            <div style={{...STYLES.FONTS.FONT_SUBHEADER_BOLD}}>*/}
                            {/*                Miles, explore jobs at Warner Music Group that match your skills*/}
                            {/*            </div>*/}
                            {/*            <div style={{marginTop: "20px"}}>*/}
                            {/*                <Link to={"/jobs"}>*/}
                            {/*                    <div style={{...STYLES.STYLES.STYLE_BUTTON_SUBHEADER, margin: "auto", padding: "6px 22.5px"}}>See Jobs</div>*/}
                            {/*                </Link>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(PublicPortfolio)));

