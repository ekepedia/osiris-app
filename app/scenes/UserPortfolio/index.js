import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import UserService from '../../services/UserService';
import { COLOR_WHITE } from "../../common/colors";

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

    componentDidMount() {
        let { classes, client, match: { params } } = this.props;

        UserService.getUser({client, username: params.username}).then((user) => {
            console.log("user,", user);
            user = user || {};
            this.setState({
                user,
                first_name: user.first_name,
                last_name: user.last_name
            })
        })
    }


    render() {
        let { classes, client, match: { params } } = this.props;

        return (<div className={classes.container}>

            {this.state.editingHeader ?

                <div onClick={() => (this.setEditingHeader(false))}>Done Editin Header</div> :
                <div onClick={() => (this.setEditingHeader(true))}>Edit Header</div>

            }

            {this.state.editingHeader ?

                <div>

                    {this.renderInput("first_name")}
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

