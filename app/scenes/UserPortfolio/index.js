import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import UserService from '../../services/UserService';
import { COLOR_WHITE } from "../../common/colors";
import StandardInput from "../../components/StandardInput";
import StandardButton from "../../components/StandardButton";
import axios from "axios";
import StandardModal from "../../components/StandardModal";

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
        };
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
            console.log("sucess", success);
        })
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

    componentDidMount() {
        let { classes, client, match: { params } } = this.props;

        UserService.getUser({client, user_id: params.user_id}).then((user) => {
            console.log("user,", user);
            user = user || {};
            this.setState({
                user,
                first_name: user.first_name,
                last_name: user.last_name
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

    render() {
        let { classes, client, match: { params } } = this.props;

        return (<div className={classes.container}>

            <input type={"file"} onChange={(e) => (this.fileUploaded(e))}/>

            {this.state.editingHeader ?
                <div onClick={() => (this.setEditingHeader(false))}>Done Editin Header</div> :
                <div >Edit Header</div>
            }

            <StandardButton label={"Edit Header"} outline={true} onClick={() => (this.setEditingHeader(true))}/>

            <StandardModal open={true}/>
            {this.state.editingHeader ?

                <div>
                    <StandardInput value={this.state.first_name} update={(v) => {this.setState({first_name: v})}}/>
                    <StandardInput value={this.state.last_name} update={(v) => {this.setState({last_name: v})}}/>
                    <div onClick={() => (this.submitEdit())}>Save</div>
                </div> :
                <div>
                    USER GOES HERE {params.username} {this.state.user ? this.state.user.first_name : null}

                </div>

            }
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(UserPortfolio)));

