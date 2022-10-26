import React from "react";

import {withApollo} from 'react-apollo';
import {Link, withRouter} from 'react-router-dom';

import injectSheet from 'react-jss';
import axios from "axios";

import COMMON from "../../common";
import {converMonthYearToDateObject, formatDuration, mc} from "../../common/helpers";

import UserService from '../../services/UserService';
import UserEducationService from "../../services/UserEducationService";
import UserLinkService from "../../services/UserLinkService";

import StandardButton from "../../components/StandardButton";
import EditProfileHeaderModal from "./components/EditProfileHeaderModal";
import EditEducationModal from "./components/EditEducationModal";
import AddSmallLinkModal from "./components/AddSmallLinkModal";
import EditPortfolioHeaderSection from "./components/EditPortfolioHeaderSection";
import SmallLink from "./components/SmallLink";
import moment from "moment";
import EditEducationCard from "./components/EditEducationCard";
import UserExperienceService from "../../services/UserExperienceService";
import EditExperienceCard from "./components/EditExperienceCard";
import AddUserExperienceModal from "./components/AddUserExperienceModal";
import AddUserEducationModal from "./components/AddUserEducationModal";
import EditExperienceModal from "./components/EditExperienceModal";
import EditSmallLinkModal from "./components/EditSmallLinkModal";
import AddBannerLinkModal from "./components/AddBannerLinkModal";
import EditBannerLink from "./components/EditBannerLink";
import EditBannerLinkModal from "./components/EditBannerLinkModal";
import AddYoutubeLinkModal from "./components/AddYoutubeLinkModal";
import EditYoutubeLinkModal from "./components/EditYoutubeLinkModal";
import AddGalleryModal from "./components/AddGalleryModal";
import UserGalleryService from "../../services/UserGalleryService";
import PortfolioCarousel from "../PublicPortfolio/components/PortfolioCarousel";
import EditPortfolioCarousel from "./components/EditPortfolioCarousel";
import EditGalleryModal from "./components/EditGalleryModal";
import AddGeneralLinkModal from "./components/AddGeneralLinkModal";
import NavBar from "../../components/NavBar";


const Styles = {
    ...COMMON.STYLES.PORTFOLIO.PortfolioPageStyles,
    ...COMMON.STYLES.PORTFOLIO.StandardCardStyles,
    ...COMMON.STYLES.GENERAL.AlignmentStyles,
    ...COMMON.STYLES.PORTFOLIO.EditToggleDeleteStyles,
    ...COMMON.STYLES.GENERAL.NavigationStyles,
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    }
};

class UserPortfolio extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: null,

            first_name: "",
            last_name: "",
            bio: "",
            profile_photo_url: "",
            cover_photo_url: "",
            username: "",

            user_twitter_link: "",
            user_clubhouse_link: "",
            user_instagram_link: "",
            user_website_link: "",
            user_tiktok_link: "",
            user_youtube_link: "",
            user_vimeo_link: "",

            user_educations: null,
            editingHeader: false,
            selectedUserEducation: null,

            openEditProfileHeaderModal: false,
            openEditEducationModal: false,
            openAddSmallLinkModal: false,
            openAddUserExperienceModal: false
        };

        this.portfolioLinkRef = React.createRef();
        this.galleryRef = React.createRef();


        this.updateField = this.updateField.bind(this);
        this.updateSelectedEducation = this.updateSelectedEducation.bind(this);
        this.updateSelectedExperience = this.updateSelectedExperience.bind(this);
        this.updateSelectedSmallLink = this.updateSelectedSmallLink.bind(this);
        this.updateSelectedBannerLink = this.updateSelectedBannerLink.bind(this);
        this.updateSelectedYoutubeLink = this.updateSelectedYoutubeLink.bind(this);
    }

    componentDidMount() {
        this.loadUser();
        this.loadEducation();
        this.loadExperience();
        this.loadLinks();
        this.loadGalleries();

        setTimeout(() =>{
            this.setHeightRatio();
        }, 1000);

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
            // console.log("RESIZED GALLERY", node.clientWidth, currentHeight, node.clientHeight)

            this.setState({
                currentGalleryWidth: currentWidth,
                currentGalleryHeight: currentHeight
            });
        } else {
            // console.log("RESIZED LINK", node.clientWidth, currentHeight, node.clientHeight)

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

    submitProfilePhoto(url) {
        let { client } = this.props;

        const user = this.state.user || {};
        const { user_id } = user;
        const profile_photo_url = url;

        UserService.editUser({client, user_id, profile_photo_url}).then((success) => {
            console.log("successfully uploaded profile photo", success);
            this.loadUser();
        })
    }

    submitCoverPhoto(url) {
        let { client } = this.props;

        const user = this.state.user || {};
        const { user_id } = user;
        const cover_photo_url = url;

        UserService.editUser({client, user_id, cover_photo_url}).then((success) => {
            console.log("successfully uploaded profile photo", success);
            this.loadUser();
        })
    }

    submitEdit() {
        let { classes, client, match: { params } } = this.props;

        const user = this.state.user || {};
        const { user_id } = user;
        const {
            first_name,
            last_name,
            bio,
            username,
            profile_photo_url,
            cover_photo_url,
            user_twitter_link,
            user_clubhouse_link,
            user_instagram_link,
            user_website_link,
            user_tiktok_link,
            user_youtube_link,
            user_main_contact_email,
            user_vimeo_link } = this.state;

        UserService.editUser({
            client,
            user_id,
            first_name,
            last_name,
            bio,
            username,
            profile_photo_url,
            cover_photo_url,
            user_twitter_link,
            user_clubhouse_link,
            user_instagram_link,
            user_website_link,
            user_tiktok_link,
            user_youtube_link,
            user_vimeo_link,
            user_main_contact_email
        }).then((success) => {
            console.log("successfully updated user", success);
        })
    }

    submitEducationEdit() {
        let { classes, client, match: { params } } = this.props;

        const { selectedUserEducation } = this.state;
        const { start_month, start_year } = (selectedUserEducation || {});
        const { end_month, end_year } = (selectedUserEducation || {});

        const start_date = converMonthYearToDateObject({month: start_month, year: start_year}).getTime() + "";
        const end_date = converMonthYearToDateObject({month: end_month, year: end_year}).getTime() + "";

        UserEducationService.editUserEducation({client, ...selectedUserEducation, start_date, end_date}).then((success) => {
            console.log("successfully edited user education", success);
            this.loadEducation();
        })
    }

    submitExperienceEdit() {
        let { classes, client, match: { params } } = this.props;

        const { selectedUserExperience } = this.state;
        const { start_month, start_year } = (selectedUserExperience || {});
        const { end_month, end_year } = (selectedUserExperience || {});

        const start_date = converMonthYearToDateObject({month: start_month, year: start_year}).getTime() + "";
        const end_date = converMonthYearToDateObject({month: end_month, year: end_year}).getTime() + "";

        UserExperienceService.editUserExperience({client, ...selectedUserExperience, start_date, end_date}).then((success) => {
            console.log("successfully edited user experience", success);
            this.loadExperience();
        })
    }

    submitEditSmallLink() {
        let { classes, client, match: { params } } = this.props;
        const { selectedUserSmallLink } = this.state;

        UserLinkService.editUserSmallLink({client, ...selectedUserSmallLink}).then((success) => {
            console.log("successfully edited user link", success);
            this.loadLinks();
        })
    }

    submitEditYoutubeLink() {
        let { classes, client, match: { params } } = this.props;
        const { selectedUserYoutubeLink } = this.state;

        UserLinkService.editUserSmallLink({client, ...selectedUserYoutubeLink}).then((success) => {
            console.log("successfully edited user link", success);
            this.loadLinks();
        })
    }

    submitEditBannerLink() {
        let { classes, client, match: { params } } = this.props;
        const { selectedUserBannerLink } = this.state;

        UserLinkService.editUserSmallLink({client, ...selectedUserBannerLink}).then((success) => {
            console.log("successfully edited user link", success);
            this.loadLinks();
        })
    }

    updateField(field, value) {
        this.setState({
            [field]: value
        })
    }

    updateSelectedEducation(field, value) {
        let { selectedUserEducation } = this.state;
        selectedUserEducation[field] = value;
        this.setState({
            selectedUserEducation
        })
    }

    updateSelectedExperience(field, value) {
        let { selectedUserExperience } = this.state;
        selectedUserExperience[field] = value;
        this.setState({
            selectedUserExperience
        })
    }

    updateSelectedSmallLink(field, value) {
        let { selectedUserSmallLink } = this.state;
        selectedUserSmallLink[field] = value;
        this.setState({
            selectedUserSmallLink
        })
    }

    updateSelectedYoutubeLink(field, value) {
        let { selectedUserYoutubeLink } = this.state;
        selectedUserYoutubeLink[field] = value;
        this.setState({
            selectedUserYoutubeLink
        })
    }

    updateSelectedBannerLink(field, value) {
        let { selectedUserBannerLink } = this.state;
        selectedUserBannerLink[field] = value;
        this.setState({
            selectedUserBannerLink
        })
    }

    loadUser() {
        let { client, match: { params } } = this.props;

        UserService.getUser({client, user_id: params.user_id}).then((user) => {
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

                user_twitter_link: user.user_twitter_link,
                user_clubhouse_link: user.user_clubhouse_link,
                user_instagram_link: user.user_instagram_link,
                user_website_link: user.user_website_link,
                user_tiktok_link: user.user_tiktok_link,
                user_youtube_link: user.user_youtube_link,
                user_vimeo_link: user.user_vimeo_link,
                user_main_contact_email: user.user_main_contact_email,
            })
        })
    }

    loadEducation() {
        let { client, match: { params } } = this.props;

        UserEducationService.getUserEducation({client, user_id: params.user_id}).then((user_educations) => {
            console.log("loeaded user_educations", user_educations)
            user_educations = user_educations || [];
            user_educations = user_educations.map((user_education) => {
                const time = `${moment(parseFloat(user_education.start_date)).format("YYYY")} - ${moment(parseFloat(user_education.end_date)).format("YYYY")}`
                return { ...user_education, time }
            })
            user_educations = user_educations.sort((a, b) => { return (a.start_date - b.start_date) * -1});
            this.setState({user_educations});
        })
    }


    loadGalleries() {
        let { client, match: { params } } = this.props;
        UserGalleryService.getUserGallery({client, user_id: params.user_id}).then((user_galleries) => {
            user_galleries = user_galleries || [];
            user_galleries = user_galleries.sort((a, b) => { return (a.gallery_order - b.gallery_order)});
            console.log("user_galleries", user_galleries)
            this.setState({user_galleries});
            this.setHeightRatio();
        })
    }

    loadExperience() {
        let { client, match: { params } } = this.props;

        UserExperienceService.getUserExperiences({client, user_id: params.user_id}).then((user_experiences) => {
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
                // if (company_map[user_experience.company_name] > 1) {
                //
                //     company_roles[company_name] = company_roles[company_name] || {};
                //     company_roles[company_name].company_name = company_name;
                //     company_roles[company_name].company_logo_url = user_experience.company_logo_url;
                //     company_roles[company_name].start_date =  company_roles[company_name].start_date && user_experience.start_date > company_roles[company_name].start_date ?  company_roles[company_name].start_date : user_experience.start_date;
                //     company_roles[company_name].end_date =  company_roles[company_name].end_date && user_experience.end_date < company_roles[company_name].end_date ?  company_roles[company_name].end_date : user_experience.end_date;
                //
                //
                //     const start = moment(parseFloat(company_roles[company_name].start_date))
                //     const end = moment(parseFloat(company_roles[company_name].end_date ))
                //
                //
                //     const time = `${start.format("MMM YYYY")} - ${end.format("MMM YYYY")}`
                //     const diff = end.diff(start);
                //     const duration = moment.duration(diff);
                //
                //     company_roles[company_name].time = time;
                //     company_roles[company_name].diff = diff;
                //     company_roles[company_name].duration = duration;
                //     company_roles[company_name].timeElapsed = formatDuration(duration);
                //
                //     company_roles[company_name].roles = company_roles[company_name].roles || [];
                //     company_roles[company_name].roles.push(user_experience)
                //
                // } else {
                    experiences.push(user_experience)
                // }
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

    convertType (link) {
        if (link.link_type === "small") {
            return 3
        } else if (link.link_type === "youtube") {
            return 1
        } else {
            return 2
        }
    }

    loadLinks() {
        let { client, match: { params } } = this.props;

        UserLinkService.getUserLink({client, user_id: params.user_id}).then((user_links) => {
            console.log("loeaded user_links", user_links)
            user_links = user_links || [];
            user_links = user_links.sort((a, b) => {
                return (this.convertType(a) - this.convertType(b))
            });
            this.setState({
                user_links
            })
            setTimeout(() => {
                this.setHeightRatio();
            }, 100)

        })
    }

    fileUploaded(e, cover) {
        console.log("Files", e.target.files);
        if (e.target.files && e.target.files[0]) {

            const file = e.target.files[0];
            const formData = new FormData();

            formData.append('img', file);

            axios.post("/api/upload-user-img", formData).then((data) => {
                if (data && data.data && data.data.url) {
                    const { url } = data.data;
                    if (cover) {
                        this.submitCoverPhoto(url);
                    } else {
                        this.submitProfilePhoto(url);

                    }
                }
            })
        }
    }

    submitAddSmallLink(data) {
        console.log(data);
        let { client, match: { params } } = this.props;

        const user = this.state.user || {};
        const { user_id } = user;

        const { link_url, link_name, link_image_url } = (data || {});
        const link_type = "small";

        UserLinkService.addLink({client, user_id, link_url, link_type, link_name, link_image_url}).then((data) => {
            console.log(data);
            this.loadLinks();

        })
    }

    deleteYoutube(user_link){
        let { client, match: { params } } = this.props;

        if (!user_link || !user_link.user_link_id)
            return;

        let yes = confirm("Are you sure you want delete this youtube video? This action can not be undone!");

        if (yes) {
            UserLinkService.deleteUserLink({client, user_link_id: user_link.user_link_id}).then((d) => {
                console.log("Deleted Youtube Link", d);
                this.loadLinks();
            })
        }
    }

    toggleYoutubeActive(user_link){
        let { client, match: { params } } = this.props;

        if (!user_link || !user_link.user_link_id)
            return;

        UserLinkService.editUserSmallLink({client, user_link_id: user_link.user_link_id, is_hidden: !user_link.is_hidden}).then((d) => {
            console.log("Toggled Youtube Link", d);
            this.loadLinks();
        })
    }

    submitAddYoutubeLink(data) {
        console.log(data);
        let { client, match: { params } } = this.props;

        const user = this.state.user || {};
        const { user_id } = user;

        const { link_url, link_name, link_image_url } = (data || {});
        const link_type = "youtube";

        UserLinkService.addLink({client, user_id, link_url, link_type, link_name, link_image_url}).then((d) => {
            console.log(d);
            this.loadLinks();
        })
    }

    submitAddGallery(data) {
        console.log(data);
        let { client, match: { params } } = this.props;

        const user = this.state.user || {};
        const { user_id } = user;

        const { gallery_photo_url,
            gallery_order,
            gallery_name,
            gallery_caption } = (data || {});

        UserGalleryService.addUserGallery({client, user_id, gallery_photo_url, gallery_order, gallery_name, gallery_caption}).then((d) => {
            console.log(d);
            this.loadGalleries();
        })
    }

    submitAddBannerLink(data) {
        console.log(data);
        let { client, match: { params } } = this.props;

        const user = this.state.user || {};
        const { user_id } = user;

        const { link_url, link_name, link_image_url } = (data || {});
        const link_type = "banner";

        UserLinkService.addLink({client, user_id, link_url, link_type, link_name, link_image_url}).then((d) => {
            console.log(d);
            this.loadLinks();

        })
    }

    submitAddUserExperience(data) {
        let { client, match: { params } } = this.props;

        const user = this.state.user || {};
        const { user_id } = user;

        const {
            company_name,
            company_logo_url,
            role_name,
            is_current,
            start_month,
            start_year,
            end_month,
            end_year
        } = (data || {});
        const start_date = converMonthYearToDateObject({month: start_month, year: start_year}).getTime() + "";
        const end_date = converMonthYearToDateObject({month: end_month, year: end_year}).getTime() + "";
        console.log(data, start_date, end_date);

        UserExperienceService.addUserExperience({client, user_id, company_name,
            company_logo_url,
            role_name,
            is_current,
            start_date,
            end_date}).then((d) => {
                this.loadExperience();
                console.log(d);
        })
    }

    submitAddUserEducation(data) {
        let { client, match: { params } } = this.props;

        const user = this.state.user || {};
        const { user_id } = user;

        const {
            school_name,
            school_logo_url,
            degree_name,
            start_month,
            start_year,
            end_month,
            end_year
        } = (data || {});

        const start_date = converMonthYearToDateObject({month: start_month, year: start_year}).getTime() + "";
        const end_date = converMonthYearToDateObject({month: end_month, year: end_year}).getTime() + "";

        console.log(data, start_date, end_date);

        UserEducationService.addUserEducation({client, user_id,
            school_name,
            degree_name,
            school_logo_url,
            start_date,
            end_date}).then((d) => {
            this.loadEducation();
            console.log(d);
        })
    }

    buildUser() {
        const {
            first_name,
            last_name,
            bio,
            username,
            profile_photo_url,
            cover_photo_url,
            user_twitter_link,
            user_clubhouse_link,
            user_instagram_link,
            user_website_link,
            user_tiktok_link,
            user_youtube_link,
            user_vimeo_link,
            user_main_contact_email
        } = this.state;

        return {first_name, last_name, bio, username, profile_photo_url, cover_photo_url, user_twitter_link, user_clubhouse_link, user_instagram_link, user_website_link, user_tiktok_link, user_youtube_link, user_vimeo_link, user_main_contact_email};
    }

    render() {
        let { classes, client, match: { params } } = this.props;

        let user = this.buildUser();
        const { user_educations, user_links, user_experiences, user_galleries } = this.state;

        return (
            <div className={classes.masterContainer}>
                <div className={classes.masterNavContainer}>
                    <NavBar />
                </div>
                <div className={classes.masterBodyContainer}>
                    <div className={classes.container}>
                        <div className={mc(classes.pageContainer)}>
                            <div style={{maxWidth: "600px", margin: "auto"}}>

                                <div className={mc(classes.pageSection)} style={{paddingBottom: "50px"}}>

                                    <EditPortfolioHeaderSection
                                        user={user}
                                        uploadProfilePhoto={(e) => (this.fileUploaded(e))}
                                        uploadCoverPhoto={(e) => (this.fileUploaded(e, true))}
                                        openEditModal={() => (this.setState({openEditProfileHeaderModal: true}))}
                                    />

                                    <div className={mc(classes.sectionContainer)}>
                                        <div style={{display: "flex"}}>
                                            <div style={{flex: 1}}>
                                                <div className={mc(classes.sectionTitle)}>Links & Embeds</div>
                                                <div className={mc(classes.sectionSubTitle)}>Title hidden from users</div>
                                            </div>
                                            <div style={{flex: "0 0 20px"}}>
                                                <i className={mc("fa-solid fa-plus", classes.plusIcon)} onClick={() => (this.setState({openAddGeneralLinkModal: true}))}></i>
                                            </div>
                                        </div>
                                        {user_galleries && user_galleries.length ? <div style={{marginTop: 10}}>
                                            <EditPortfolioCarousel onEdit={() => (this.setState({openEditGalleryModal: true}))} height={this.state.currentGalleryHeight ? this.state.currentGalleryHeight : null} user_galleries={user_galleries} portfolioLinkRef={this.galleryRef}/>
                                        </div> : null }
                                        <div style={{marginTop: user_galleries && user_galleries.length ? "10px" : 10}}>
                                            {user_links && user_links.length ? user_links.map((user_link, i) => {
                                                if (user_link.link_type === "youtube") {

                                                    let { link_url, is_hidden } = user_link;

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


                                                    return (<div style={{opacity: is_hidden ? 0.5: 1, position: "relative", height: this.state.currentHeight ? this.state.currentHeight : null, marginTop: i === 0 ? "0px" : "10px"}} ref={this.portfolioLinkRef} className={mc(classes.linkContainer)}>
                                                        <iframe
                                                            width="100%"
                                                            height="100%"
                                                            src={link_url}
                                                            frameBorder="0"
                                                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                            title="Embedded youtube"
                                                        />
                                                        <div className={mc(classes.editToggleDeleteFloatingContainer)}>
                                                            <div className={mc(classes.editToggleDeleteContainer)}>
                                                                <div className={mc(classes.editToggleDeleteEdit)} onClick={() => {
                                                                    this.setState({
                                                                        openEditYoutubeLinkModal: true,
                                                                        selectedUserYoutubeLink: {...user_link}
                                                                    });
                                                                }}>
                                                                    <i className={mc("fa-solid fa-pen")}/>
                                                                </div>
                                                                <div className={mc(classes.editToggleDeleteToggle)} onClick={() => (this.toggleYoutubeActive(user_link))}>
                                                                    <i className={`fa-solid fa-toggle-${user_link.is_hidden ? "off" : "on"}`}/>
                                                                </div>
                                                                <div className={mc(classes.editToggleDeleteDelete)} onClick={() => (this.deleteYoutube(user_link))}>
                                                                    <i className="fa-solid fa-xmark"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>);
                                                } else if (user_link.link_type === "small") {
                                                    return (<div style={{marginTop: i === 0 ? "0px" : "10px"}}>
                                                        <SmallLink refetch={() => (this.loadLinks())}  {...{...user_link, link: user_link.link_url, url: user_link.link_image_url, link_name: user_link.link_name}}
                                                                   onEdit={() => (this.setState({openEditSmallLinkModal: true, selectedUserSmallLink: {...user_link}}))}/>
                                                    </div>);
                                                } else {
                                                    return (<div style={{marginTop: i === 0 ? "0px" : "10px"}}>
                                                        <EditBannerLink refetch={() => (this.loadLinks())}  onEdit={() => (this.setState({openEditBannerLinkModal: true, selectedUserBannerLink: {...user_link}}))} {...{...user_link, link: user_link.link_url, url: user_link.link_image_url, link_name: user_link.link_name, currentHeight: this.state.currentHeight, portfolioLinkRef: this.portfolioLinkRef}}/>
                                                    </div>);
                                                }
                                            }) : null }
                                        </div>


                                    </div>

                                    <div className={mc(classes.sectionContainer)}>
                                        <div style={{display: "flex"}}>
                                            <div style={{flex: 1}}>
                                                <div className={mc(classes.sectionTitle)}>Experience</div>
                                            </div>
                                            <div style={{flex: "0 0 20px"}}>
                                                <i className={mc("fa-solid fa-plus", classes.plusIcon)} onClick={() => (this.setState({openAddUserExperienceModal: true}))}></i>
                                            </div>
                                        </div>

                                        {user_experiences && user_experiences.length ? user_experiences.map((user_experience, i) => {

                                            if (i >= 3 && this.state.limit)
                                                return null;

                                            return (<EditExperienceCard
                                                refetch={() => (this.loadExperience())}
                                                onEdit={() => (this.setState({openEditExperienceModal: true, selectedUserExperience: {...user_experience}}))}
                                                {...{
                                                    ...user_experience,
                                                    time: user_experience.timeElapsed,
                                                    company_name: user_experience.company_name,
                                                    role_name: user_experience.role_name,
                                                    company_logo_url: user_experience.company_logo_url,
                                                    timeElapsed: user_experience.time,
                                                }}/>);
                                        }) : null }


                                    </div>

                                    <div className={mc(classes.sectionContainer)}>
                                        <div style={{display: "flex"}}>
                                            <div style={{flex: 1}}>
                                                <div className={mc(classes.sectionTitle)}>Education</div>
                                            </div>
                                            <div style={{flex: "0 0 20px"}}>
                                                <i className={mc("fa-solid fa-plus", classes.plusIcon)} onClick={() => (this.setState({openAddUserEducationModal: true}))}></i>
                                            </div>
                                        </div>

                                        {user_educations && user_educations.length ? <div>
                                            {user_educations.map((user_education) => {
                                                return (<div>
                                                    <EditEducationCard {...user_education} refetch={() => (this.loadEducation())} onEdit={() => (this.setState({openEditEducationModal: true, selectedUserEducation: {...user_education}}))}/>

                                                </div>)
                                            })}
                                        </div>: null}


                                    </div>


                                </div>
                            </div>
                        </div>

                        <div>

                            <AddGeneralLinkModal open={this.state.openAddGeneralLinkModal}
                                                 openGallery={() => (this.setState({openAddGalleryModal: true, openAddGeneralLinkModal: false}))}
                                                 openBannerLink={() => (this.setState({openAddBannerLinkModal: true, openAddGeneralLinkModal: false}))}
                                                 openYoutubeLink={() => (this.setState({openAddYoutubeLinkModal: true, openAddGeneralLinkModal: false}))}
                                                 openSmallLink={() => (this.setState({openAddSmallLinkModal: true, openAddGeneralLinkModal: false}))}
                                                 onClose={() => (this.setState({openAddGeneralLinkModal: false}))}/>

                            <AddGalleryModal onSubmit={(data) => (this.submitAddGallery(data))}  open={this.state.openAddGalleryModal} onClose={() => (this.setState({openAddGalleryModal: false}))}/>
                            <EditGalleryModal refetch={() => (this.loadGalleries())} onUploadNew={() => {
                                this.setState({
                                    openEditGalleryModal: false,
                                    openAddGalleryModal: true
                                })
                            }} onSubmit={(data) => (this.submitAddGallery(data))} user_galleries={user_galleries} open={this.state.openEditGalleryModal} onClose={() => (this.setState({openEditGalleryModal: false}))}/>

                            <AddYoutubeLinkModal onSubmit={(data) => (this.submitAddYoutubeLink(data))}  open={this.state.openAddYoutubeLinkModal} onClose={() => (this.setState({openAddYoutubeLinkModal: false}))}/>
                            <EditYoutubeLinkModal user_link={this.state.selectedUserYoutubeLink} updateField={this.updateSelectedYoutubeLink}  onSubmit={() => (this.submitEditYoutubeLink())}  open={this.state.openEditYoutubeLinkModal} onClose={() => (this.setState({openEditYoutubeLinkModal: false}))}/>

                            <AddSmallLinkModal onSubmit={(data) => (this.submitAddSmallLink(data))}  open={this.state.openAddSmallLinkModal} onClose={() => (this.setState({openAddSmallLinkModal: false}))}/>
                            <EditSmallLinkModal user_link={this.state.selectedUserSmallLink} updateField={this.updateSelectedSmallLink}  onSubmit={() => (this.submitEditSmallLink())}  open={this.state.openEditSmallLinkModal} onClose={() => (this.setState({openEditSmallLinkModal: false}))}/>

                            <AddBannerLinkModal onSubmit={(data) => (this.submitAddBannerLink(data))}  open={this.state.openAddBannerLinkModal} onClose={() => (this.setState({openAddBannerLinkModal: false}))}/>
                            <EditBannerLinkModal user_link={this.state.selectedUserBannerLink} updateField={this.updateSelectedBannerLink}  onSubmit={() => (this.submitEditBannerLink())}  open={this.state.openEditBannerLinkModal} onClose={() => (this.setState({openEditBannerLinkModal: false}))}/>

                            <AddUserExperienceModal onSubmit={(data) => (this.submitAddUserExperience(data))}  open={this.state.openAddUserExperienceModal} onClose={() => (this.setState({openAddUserExperienceModal: false}))}/>
                            <AddUserEducationModal onSubmit={(data) => (this.submitAddUserEducation(data))}  open={this.state.openAddUserEducationModal} onClose={() => (this.setState({openAddUserEducationModal: false}))}/>

                            <EditProfileHeaderModal user={user} onSubmit={() => (this.submitEdit())} updateField={this.updateField} open={this.state.openEditProfileHeaderModal} onClose={() => (this.setState({openEditProfileHeaderModal: false}))}/>

                            <EditEducationModal user_education={this.state.selectedUserEducation} onSubmit={() => (this.submitEducationEdit())} updateField={this.updateSelectedEducation} open={this.state.openEditEducationModal} onClose={() => (this.setState({openEditEducationModal: false}))}/>
                            <EditExperienceModal user_experience={this.state.selectedUserExperience} onSubmit={() => (this.submitExperienceEdit())} updateField={this.updateSelectedExperience} open={this.state.openEditExperienceModal} onClose={() => (this.setState({openEditExperienceModal: false}))}/>
                        </div>

                    </div>
                </div>
            </div>
            )
    }

}

export default withApollo(withRouter(injectSheet(Styles)(UserPortfolio)));

