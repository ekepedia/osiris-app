import React from "react";

import {withApollo} from 'react-apollo';
import {withRouter} from 'react-router-dom';

import injectSheet from 'react-jss';

import UserService from '../../services/UserService';
import StandardButton from "../../components/StandardButton";
import axios from "axios";
import EditProfileHeaderModal from "./components/EditProfileHeaderModal";

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
            editingHeader: false,
            first_name: "",
            last_name: "",
            openEditProfileHeaderModal: true
        };

        this.updateField = this.updateField.bind(this)
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
            console.log("success", success);
        })
    }

    submitEdit() {
        let { classes, client, match: { params } } = this.props;

        const user = this.state.user || {};
        const { user_id } = user;
        const { first_name, last_name, bio } = this.state;

        UserService.editUser({client, user_id, bio, first_name, last_name}).then((success) => {
            console.log("sucess", success);
        })
    }

    updateField(field, value) {
        this.setState({
            [field]: value
        })
    }

    componentDidMount() {
        let { classes, client, match: { params } } = this.props;

        UserService.getUser({client, user_id: params.user_id}).then((user) => {
            console.log("user,", user);
            user = user || {};
            this.setState({
                user,
                first_name: user.first_name,
                last_name: user.last_name,
                bio: user.bio,
            })
        })
    }

    fileUploaded(e) {

        console.log(e.target.files);

        if (e.target.files && e.target.files[0]) {

            const file = e.target.files[0];
            const formData = new FormData();

            formData.append('img', file);

            axios.post("/api/upload-user-img", formData).then((data) => {
                console.log("hell?", data.data)

                if (data && data.data && data.data.url) {
                    const { url } = data.data;
                    this.submitProfilePhoto(url);
                }
            })
        }
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

        return (<div className={classes.container}>

            <input type={"file"} onChange={(e) => (this.fileUploaded(e))}/>

            <StandardButton label={"Edit Profile Header"} outline={true} onClick={() => (this.setState({openEditProfileHeaderModal: true}))}/>

            <EditProfileHeaderModal user={user} onSubmit={() => (this.submitEdit())} updateField={this.updateField} open={this.state.openEditProfileHeaderModal} onClose={() => (this.setState({openEditProfileHeaderModal: false}))}/>

        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(UserPortfolio)));

