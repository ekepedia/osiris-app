import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';


const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        }
    },
    section: {
        padding: "0 120px"
    },
    body: {
        fontSize: "12px"
    },
    header: {
        fontSize: "25px"
    },
    formContainer: {
        border: "1px solid #5F5F5F",
        background: "#FBFBFB",
        textAlign: "left",
        padding: "20px",
        maxWidth: "420px",
        margin: "auto",
        borderRadius: "10px",
        marginTop: "20px"
    },
    descriptionOption: {
        border: "1px solid #CACACA",
        borderRadius: "4px",
        background: "white",
        padding: "50px 40px",
        "&:hover": {
            background: "#FAFAFA"
        },
        cursor: "pointer"
    },
    descriptionOptionSelected: {
        border: "1px solid black",
        borderRadius: "4px",
        background: "#D0AE6E",
        padding: "50px 40px",
        cursor: "pointer",
        color: "white"
    },
    descriptionHeader: {
        fontSize: "25px",
    },
    descriptionBody: {
        fontSize: "15px",
        marginTop: "30px"
    },
    inputHeader: {
        fontSize: "15px",
        fontWeight: 600
    },
    inputBody: {
        fontSize: "12px"
    },
    input: {
        height: "50px",
        width: "100%",
        lineHeight: "50px",
        padding: "0 10px",
        border: "1px solid #CACACA",
        marginTop: "5px",
        marginBottom: "25px"
    },
    continueButton: {
        background: "#DAAF2B",
        cursor: "pointer",
        color: "white",
        padding: "10px 30px",
        borderRadius: "8px",
        border: "1px solid #A2A2A2",
        width: "fit-content",
        margin: "auto",
        fontSize: "15px",
        fontWeight: 600,
        letterSpacing: "0.5px"
    },
    continueButtonDisabled: {
        background: "#ECDFC5",
        color: "white",
        padding: "10px 30px",
        borderRadius: "8px",
        border: "1px solid #DADADA",
        width: "fit-content",
        margin: "auto",
        fontSize: "15px",
        fontWeight: 600,
        letterSpacing: "0.5px"
    }
};

class Apply extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            full_name: "",
            email: "",
            race: "",
            state: 1,
            type: null,
        };
    }

    componentDidMount() {

    }

    renderContinueButton() {
        let { classes } = this.props;
        let { state } = this.state;

        let { full_name, email, race, type } = this.state;

        const nextScreen = () => {
            if (!enabled)
                return;

            if (state === 1) {
                this.setState({state: 2})
            } else if (state === 2) {
                // this.setState({state: 1})
                alert("Submitted");
            }
        }

        let enabled = true;

        if (state === 1) {
            if (!full_name || !email || !race) {
                enabled = false
            }
        } else if (state === 2) {
            if (!type ) {
                enabled = false
            }
        }

        return (<div onClick={nextScreen.bind(this)} className={enabled ? classes.continueButton : classes.continueButtonDisabled}>
            {state === 2 ? "Submit" : "Continue"}
        </div>
        )
    }

    render() {
        let { classes } = this.props;

        return (<div className={classes.container}>
            <div className={classes.section} style={{paddingTop: "50px", paddingBottom: "9px"}}>
                <div style={{display: "flex"}}>
                    <div style={{flex: 1, fontSize: "25px"}}>
                        <div><Link to={"/"}><span style={{color: "#030202", textDecoration: "none"}}>OSIRIS</span></Link></div>
                    </div>
                    <div style={{flex: 1, textAlign: "right"}}>

                    </div>
                </div>
            </div>
            <div style={{paddingTop: "0", textAlign: "center", maxWidth: "700px", margin: "auto"}}>
                <div className={classes.header} style={{marginBottom: "20px"}}>
                    Apply for access to resources to build your company. Let’s start with the basics:
                </div>
                <div className={classes.body} style={{maxWidth: "600px", margin: "auto"}}>
                    Already started an application? <span style={{textDecoration: "underline", fontWeight: 500}}>Click Here to Resume Progress</span>
                </div>

                <div className={classes.formContainer} style={{display: this.state.state === 1 ? "block" : "none"}}>
                    <div className={classes.inputHeader}>Full Name</div>
                    <input value={this.state.full_name} onChange={(e) => this.setState({full_name: e.target.value})} className={classes.input}/>
                    <div className={classes.inputHeader}>Email</div>
                    <div className={classes.inputBody}>This is the email we’ll send your application code to</div>
                    <input value={this.state.email} onChange={(e) => this.setState({email: e.target.value})} name="email" className={classes.input}/>

                    <div className={classes.inputHeader}>Race</div>
                    <div className={classes.inputBody}>While all are welcome to apply, applications from BIPOC entrepreneurs will be prioritized</div>
                    <input value={this.state.race} onChange={(e) => this.setState({race: e.target.value})} className={classes.input}/>
                </div>

                <div className={classes.formContainer} style={{display: this.state.state === 2 ? "block" : "none", maxWidth: "650px"}}>
                    <div style={{fontSize: "20px", marginBottom: "20px", textAlign: "center"}}>Which best describes you:</div>
                    <div style={{display: "flex"}}>
                        <div style={{flex: 1, paddingRight: "20px"}}>
                            <div onClick={() => this.setState({type: 1})} className={ this.state.type === 1 ? classes.descriptionOptionSelected : classes.descriptionOption}>
                                <div className={classes.descriptionHeader}>I am the founder of a startup</div>
                                <div className={classes.descriptionBody}>e.g. co-founder, CEO, CTO, COO, etc </div>
                            </div>
                        </div>
                        <div style={{flex: 1}}>
                            <div onClick={() => this.setState({type: 2})} className={ this.state.type === 2 ? classes.descriptionOptionSelected : classes.descriptionOption} >
                                <div className={classes.descriptionHeader}>I am looking to join a startup</div>
                                <div className={classes.descriptionBody}>e.g. designer, engineer, marketer</div>
                            </div>
                        </div>

                    </div>
                </div>

                <div style={{marginTop: "30px"}}>

                    {this.renderContinueButton()}
                </div>
            </div>

            <div className={classes.section} style={{paddingTop: "120px", paddingBottom: "65px"}}>
                <div style={{display: "flex"}}>
                    <div style={{flex: 1}}>
                        <div>Copyright © OSIRIS  - 2022. All Right Reserved</div>
                    </div>
                    <div style={{flex: 1, textAlign: "right", fontSize: "30px"}}>
                        OSIRIS
                    </div>
                </div>
            </div>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(Apply)));

