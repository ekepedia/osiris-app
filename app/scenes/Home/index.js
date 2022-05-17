import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link } from 'react-router-dom';

import injectSheet from 'react-jss';

import FAQ from "../../components/FAQ";
import { LEFT_QUESTIONS, RIGHT_QUESTIONS } from "./questions";

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
    divider: {
        width: "120px",
        marginTop: "144px",
        height: "3px",
        margin: "auto",
        background: "black"
    },
    body: {
        fontSize: "20px"
    },
    header: {
        fontSize: "30px"
    },
    applyButton: {
        background: "white",
        cursor: "pointer",
        color: "black",
        padding: "10px 30px",
        borderRadius: "8px",
        width: "fit-content",
        margin: "auto",
        marginTop: "65px",
        fontSize: "18px"
    },
    outerCircle: {
        height: "30px",
        width: "30px",
        background: "#7A7773",
        borderRadius: "30px",
        paddingTop: "6.5px",
        paddingLeft: "6.5px",
        margin: "10px 0"
    },
    innerCircle: {
        height: "17px",
        width: "17px",
        background: "#F2F2F2",
        borderRadius: "17px"
    },
    verticalLine: {
        height: "80px",
        width: "3px",
        margin: "auto",
        background: "#F2F2F2",
        borderRadius: "10px"
    },
    applyHeader: {
        fontSize: "20px",
        marginBottom: "10px",
        paddingTop: "10px"
    },
    applyBody: {
        fontSize: "15px",
        maxWidth: "435px"

    }
};

class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {

    }

    render() {
        let { classes } = this.props;

        return (<div className={classes.container}>
            <div className={classes.section} style={{textAlign: "center", minHeight: "100vh", background: "black", color: "white"}}>
                <div style={{fontSize: "100px", letterSpacing: "-5.5px", paddingTop: "200px"}}>OSIRIS x Soho House</div>
                <div className={classes.body} style={{maxWidth: "750px", margin: "auto"}}>OSIRIS is partnering with Soho House to provide resources for BIPOC entrepreneurs to build transformative businesses</div>
                <Link to={"/apply"}>
                    <div className={classes.applyButton}>
                        Apply Now
                    </div>
                </Link>
            </div>
            <div className={classes.section} style={{paddingTop: "120px"}}>
                <div style={{display: "flex"}}>
                    <div style={{flex: 1}}>
                        <div className={classes.header} style={{marginBottom: "40px", marginTop: "150px"}}>BIPOC startups are disadvantaged</div>
                        <div className={classes.body} style={{maxWidth: "600px"}}>BIPOC entrepreneurs are 3x less likely to have adequate access to financing, talent, and mentors. ORSIRS and Soho House are teaming up to provide the infrastructure for BIPOC entrepreneurs to create transformative businesses.</div>
                    </div>
                    <div style={{flex: 1, textAlign: "right"}}>
                        <img width={"100%"} src={"/img/stats-img.png"} style={{maxWidth: "500px", display: "inline-block"}}/>
                    </div>
                </div>
            </div>
            <div className={classes.section} style={{paddingTop: "120px"}}>
                <div style={{display: "flex"}}>
                    <div style={{flex: 1, textAlign: "center"}}>
                        <div className={classes.divider} />
                    </div>
                    <div style={{flex: 1, fontSize: "200px"}}>
                        $2,000
                    </div>
                    <div style={{flex: 1, textAlign: "center"}}>
                        <div className={classes.divider} />
                    </div>
                </div>
                <div className={classes.body} style={{textAlign: "center", margin: "auto", maxWidth: "450px"}}>
                    Participants will receive a $2,000 grant to support their businesses
                </div>
            </div>
            <div className={classes.section} style={{paddingTop: "120px"}}>
                <div style={{display: "flex"}}>
                    <div style={{flex: 1, textAlign: "left", paddingRight: "60px"}}>
                        <img width={"100%"} src={"/img/soho-collab.png"} style={{display: "inline-block"}}/>
                    </div>
                    <div style={{flex: 1}}>
                        <div className={classes.header} style={{marginBottom: "40px", marginTop: "0"}}>Free Collaboration Spaces</div>
                        <div className={classes.body} style={{}}>
                            All participants will get access to Soho Works spaces to develop their companies, including:<br/>
                            <br/>
                            <ul>
                                <li>Private phone booths, photo studios, workshops, and 3D printing</li>
                                <li>Meeting rooms</li>
                                <li>Wireless connectivity and video conferencing</li>
                                <li>A curated calendar of events and workshops</li>
                                <li>Screening rooms</li>
                                <li>Lofts for private events</li>
                                <li>Kitchens with storage areas</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
            <div className={classes.section} style={{paddingTop: "120px"}}>
                <div style={{display: "flex"}}>

                    <div style={{flex: 1, paddingRight: "60px"}}>
                        <div className={classes.header} style={{marginBottom: "40px", marginTop: "75px"}}>A Nationwide Business Network</div>
                        <div className={classes.body} style={{maxWidth: "550px"}}>
                            Participants will also have the chance to network with peers and experts at various dinners hosted in Soho House locations across the country
                        </div>
                        <div style={{marginTop: "75px", paddingRight: "0"}}>
                            <img width={"100%"} src={"/img/soho-network-3.png"} style={{display: "inline-block"}}/>
                        </div>
                    </div>
                    <div style={{flex: 1, textAlign: "right", }}>
                        <div>
                            <img width={"100%"} src={"/img/soho-network-1.png"} style={{display: "inline-block", maxWidth: "480px"}}/>
                        </div>
                        <div style={{marginTop: "50px"}}>
                            <img width={"100%"} src={"/img/soho-network-2.png"} style={{display: "inline-block", maxWidth: "480px"}}/>
                        </div>
                    </div>

                </div>
            </div>
            <div className={classes.section} style={{paddingTop: "120px", paddingBottom: "100px", textAlign: "center"}}>
                <div className={classes.header}>
                    Everything You Need
                </div>
                <div className={classes.body} style={{margin: "auto", marginTop: "40px", maxWidth: "450px"}}>
                    Participants will also get discounted services and perks from our corporate sponsors
                </div>
                <div style={{maxWidth: "1024px", margin: "auto", marginTop: "100px",}}>
                    <img width={"100%"} src={"/img/soho-logos.png"} style={{display: "inline-block"}}/>
                </div>
            </div>
            <div className={classes.section} style={{ paddingBottom: "100px", background: "#2A251F", color: "#F5F4F4"}}>
                <div style={{display: "flex"}}>
                    <div style={{flex: 1, paddingTop: "60px",}}>
                        <div className={classes.header} style={{marginBottom: "40px",}}>Apply Today!</div>
                        <div className={classes.header} style={{marginBottom: "40px", fontSize: "20px", maxWidth: "450px", marginTop: "50px"}}>If you are a BIPOC entrepreneur with an idea for a startup, already have a startup, or want to join a startup, apply today!</div>
                        <Link to={"/apply"}>
                            <div className={classes.applyButton} style={{margin: "inherit", marginTop: "50px"}}>
                                Apply Now
                            </div>
                        </Link>
                    </div>
                    <div style={{flex: 1, textAlign: "left", paddingTop: "20px"}}>
                        <div style={{display:"flex"}}>
                            <div style={{flex: "0 0 30px"}}>
                                <div className={classes.verticalLine} style={{opacity: "50%"}}/>
                            </div>
                            <div style={{flex: 1, paddingTop: "0",}}>
                            </div>
                        </div>
                        <div style={{display:"flex"}}>
                            <div style={{flex: "0 0 30px", paddingRight: "10px",}}>
                                <div className={classes.outerCircle} style={{opacity: "50%"}}>
                                    <div className={classes.innerCircle}/>
                                </div>
                                <div className={classes.verticalLine} style={{opacity: "75%"}}/>
                            </div>
                            <div style={{flex: 1, paddingTop: "0",}}>
                                <div className={classes.applyHeader}>Apply to the Program</div>
                                <div className={classes.applyBody}>We will review applications on a rolling basis. The earlier you apply, the better!</div>
                            </div>

                        </div>
                        <div style={{display:"flex"}}>
                            <div style={{flex: "0 0 30px", paddingRight: "10px",}}>
                                <div className={classes.outerCircle} style={{opacity: "75%"}} >
                                    <div className={classes.innerCircle} />
                                </div>
                                <div className={classes.verticalLine}/>
                            </div>
                            <div style={{flex: 1, paddingTop: "0",}}>
                                <div className={classes.applyHeader}>Become a Finalist</div>
                                <div className={classes.applyBody}>Finalists will be announced in early April and will have a chance to pitch their ideas live to our judging panel.</div>
                            </div>
                        </div>
                        <div style={{display:"flex"}}>
                            <div style={{flex: "0 0 30px", paddingRight: "10px",}}>
                                <div className={classes.outerCircle} >
                                    <div className={classes.innerCircle}/>
                                </div>
                                <div className={classes.verticalLine}/>
                            </div>
                            <div style={{flex: 1, paddingTop: "0",}}>
                                <div className={classes.applyHeader}>Join the 2022 Cohort</div>
                                <div className={classes.applyBody}>In early May, we’ll announce the 5 - 10 teams that have been accepted to the 2022 Cohort. </div>
                            </div>
                        </div>
                        <div style={{display:"flex"}}>
                            <div style={{flex: "0 0 30px", paddingRight: "10px",}}>
                                <div className={classes.outerCircle} style={{background: "#7D6946"}}>
                                    <div className={classes.innerCircle} style={{background: "#D0AE6E"}}/>
                                </div>
                            </div>
                            <div style={{flex: 1, paddingTop: "0",}}>
                                <div className={classes.applyHeader}>Grow your business</div>
                                <div className={classes.applyBody}>Accepted participants will have a chance to meet each other over networking dinners at Soho house locations and will be connected with mentors, investors, and industry experts to take their business to the next level!</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={classes.section} style={{paddingTop: "120px",}}>
                <div className={classes.header} style={{marginBottom: "40px",}}>Frequently Asked Questions</div>

                <div style={{display: "flex",}}>
                    <div style={{flex: 1, paddingRight: "60px"}}>
                        {LEFT_QUESTIONS.map((q) => {
                            return (<FAQ key={q.prompt} prompt={q.prompt} answer={q.answer}/>);
                        })}
                    </div>
                    <div style={{flex: 1,}}>
                        {RIGHT_QUESTIONS.map((q) => {
                            return (<FAQ key={q.prompt} prompt={q.prompt} answer={q.answer}/>);
                        })}
                    </div>
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

export default withApollo(withRouter(injectSheet(Styles)(Home)));

