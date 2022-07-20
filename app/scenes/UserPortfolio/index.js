import React from "react";

import {withApollo} from 'react-apollo';
import {withRouter} from 'react-router-dom';

import injectSheet from 'react-jss';
import axios from "axios";

import {converMonthYearToDateObject} from "../../common/helpers";

import UserService from '../../services/UserService';
import UserEducationService from "../../services/UserEducationService";
import UserLinkService from "../../services/UserLinkService";

import StandardButton from "../../components/StandardButton";
import EditProfileHeaderModal from "./components/EditProfileHeaderModal";
import EditEducationModal from "./components/EditEducationModal";
import AddSmallLinkModal from "./components/AddSmallLinkModal";

const Styles = {
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
            user_educations: null,
            editingHeader: false,
            selectedUserEducation: null,
            first_name: "",
            last_name: "",
            openEditProfileHeaderModal: false,
            openEditEducationModal: false,
            openAddSmallLinkModal: false,
        };

        this.updateField = this.updateField.bind(this)
        this.updateSelectedEducation = this.updateSelectedEducation.bind(this)
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
        })
    }

    submitEdit() {
        let { classes, client, match: { params } } = this.props;

        const user = this.state.user || {};
        const { user_id } = user;
        const { first_name, last_name, bio } = this.state;

        UserService.editUser({client, user_id, bio, first_name, last_name}).then((success) => {
            console.log("successfully updated user", success);
        })
    }

    submitEducationEdit() {
        let { classes, client, match: { params } } = this.props;

        const { selectedUserEducation } = this.state;
        const { start_month, start_year } = (selectedUserEducation || {});

        console.log("start_month", start_month, start_year, converMonthYearToDateObject({month: start_month, year:start_year}))

        const start_date = converMonthYearToDateObject({month: start_month, year:start_year}).getTime() + "";

        UserEducationService.editUserEducation({client, ...selectedUserEducation, start_date}).then((success) => {
            console.log("successfully edited user education", success);
            this.loadEducation();
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

    componentDidMount() {
        this.loadUser();
        this.loadEducation();
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
            })
        })
    }

    loadEducation() {
        let { client, match: { params } } = this.props;

        UserEducationService.getUserEducation({client, user_id: params.user_id}).then((user_educations) => {
            console.log("loeaded user_educations", user_educations)
            this.setState({
                user_educations
            })
        })
    }

    fileUploaded(e) {
        if (e.target.files && e.target.files[0]) {

            const file = e.target.files[0];
            const formData = new FormData();

            formData.append('img', file);

            axios.post("/api/upload-user-img", formData).then((data) => {
                if (data && data.data && data.data.url) {
                    const { url } = data.data;
                    this.submitProfilePhoto(url);
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

        UserLinkService.addLink({client, user_id, link_url, link_type, link_name, link_image_url}).then((d) => {
            console.log(d)
        })
    }

    buildUser() {
        const {
            first_name,
            last_name,
            bio
        } = this.state;

        return {first_name, last_name, bio};
    }

    render() {
        let { classes, client, match: { params } } = this.props;

        let user = this.buildUser();
        const { user_educations } = this.state;

        return (<div className={classes.container}>

            <input type={"file"} onChange={(e) => (this.fileUploaded(e))}/>

            <StandardButton label={"Edit Profile Header"} outline={true} onClick={() => (this.setState({openEditProfileHeaderModal: true}))}/>
            <StandardButton label={"Add Small Link"} outline={true} onClick={() => (this.setState({openAddSmallLinkModal: true}))}/>

            <EditProfileHeaderModal user={user} onSubmit={() => (this.submitEdit())} updateField={this.updateField} open={this.state.openEditProfileHeaderModal} onClose={() => (this.setState({openEditProfileHeaderModal: false}))}/>
            <EditEducationModal user_education={this.state.selectedUserEducation} onSubmit={() => (this.submitEducationEdit())} updateField={this.updateSelectedEducation} open={this.state.openEditEducationModal} onClose={() => (this.setState({openEditEducationModal: false}))}/>
            <AddSmallLinkModal onSubmit={(data) => (this.submitAddSmallLink(data))}  open={this.state.openAddSmallLinkModal} onClose={() => (this.setState({openAddSmallLinkModal: false}))}/>

            {user_educations && user_educations.length ? <div>
                {user_educations.map((user_education) => {
                    return (<div>
                        <div>{user_education.school_name}</div>
                        <StandardButton label={"Edit Education"} outline={true} onClick={() => (this.setState({openEditEducationModal: true, selectedUserEducation: {...user_education}}))}/>
                    </div>)
                })}
            </div>: null}

        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(UserPortfolio)));

