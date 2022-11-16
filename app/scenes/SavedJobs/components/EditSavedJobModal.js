import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


import injectSheet from 'react-jss';

import Modal from 'react-modal';

import DataService from '../../../services/DataService';

import COMMON from "../../../common/index";
import {convertDateObjectToMonthYear, converMonthYearToDateObject, mc, companyCustomSearch} from "../../../common/helpers";
import StandardButton from "../../../components/StandardButton";
import StandardInput from "../../../components/StandardInput";
import {
    EDIT_PORTFOLIO_MODAL,
    EDIT_PORTFOLIO_MODALS,
    STYLE_MODAL_SUPER_CONTAINER,
    STYLE_MODAL_SUPER_SUPER_CONTAINER
} from "../../../common/styles";
import EditPortfolioModalHeader from "../../UserPortfolio/components/EditPortfolioModalHeader";

import StandardSelect from "../../../components/StandardSelect";
import axios from "axios";
import CoverImageHolder from "../../../components/CoverImageHolder";
import ThumbnailUpload from "../../../components/ThumbnailUpload";
import Select from "react-select/creatable";
import EditSavedJobModalHeader from "./EditSavedJobModalHeader";
import SavedJobService from "../../../services/SavedJobService";
import {PieChart} from "react-minimal-pie-chart";
import SavedJobNoteService from "../../../services/SavedJobNoteService";
import SavedJobReminderService from "../../../services/SavedJobReminderService";
import {FONT_H_400} from "../../../common/fonts";
import GenderPieChart from "../../../components/charts/GenderPieChart";
import RacePieChart from "../../../components/charts/RacePieChart";
import CompanySelect from "../../../components/CompanySelect";

const SECTION_BUFFER = "32px";


const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    sectionLabel: {
        color: COMMON.COLORS.DARK_GREY,
        marginBottom: "5px",
        ...COMMON.FONTS.FONT_HEADLINE_BOLD
    },
    inputLabel: {
        color: COMMON.COLORS.DARK_GREY,
        marginTop: "10px",
        marginBottom: "6px",
        ...COMMON.FONTS.FONT_FOOTNOTE
    },
    sectionHeader: {
        ...COMMON.FONTS.H600,
        color: COMMON.COLORS.N900
    },
    sectionSubHeader: {
        ...COMMON.FONTS.H100,
        color: COMMON.COLORS.N800,
        textTransform: "uppercase",
        marginBottom: "15px"
    },
    bodyText: {
        ...COMMON.FONTS.P200,
        color: COMMON.COLORS.N800
    },
    ...COMMON.STYLES.PORTFOLIO.PortfolioPageStyles,
    ...COMMON.STYLES.COMPANY.CompanyHeaderStyles,
    ...COMMON.STYLES.COMPANY.CompanyPageStyles,
    ...COMMON.STYLES.COMPANY.CompanyProfilePageStyles,
    ...COMMON.STYLES.SAVED_JOBS.SavedJobModalStyles,
    pieChartLabelHolderTwo: {
        marginTop: "5px"
    }
};

class EditSavedJobModal extends React.Component {

    constructor(props) {
        super(props);

        let { saved_job } = this.props;
        saved_job = saved_job || {};

        this.state = {
            selectedState: 1,
            saved_job_id: saved_job.saved_job_id,
            new_reminder_date: new Date().getTime().toString()
        }
    }

    componentDidMount() {
        this.loadSavedJobNotes();
        this.loadSavedJobReminders();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let { saved_job } = this.props;

        if (!saved_job)
            return;

        if (saved_job.saved_job_id !== this.state.saved_job_id) {
            this.setState({
                saved_job_id: saved_job.saved_job_id
            })
            this.loadSavedJobNotes();
            this.loadSavedJobReminders();
        }

    }

    loadSavedJobNotes() {
        let { client, saved_job } = this.props;
        saved_job = saved_job || {};

        SavedJobNoteService.getSavedJobNotes({client, saved_job_id: saved_job.saved_job_id}).then((saved_job_notes) => {
            console.log(saved_job.saved_job_id, "LOADED SAVED NOTES IN MODAL", saved_job_notes);

            saved_job_notes = saved_job_notes ? saved_job_notes.sort((a, b) => {

                let nameA = a.date_created || "";
                let nameB = b.date_created || "";

                return nameA.localeCompare(nameB);
            }) : saved_job_notes;

            this.setState({
                saved_job_notes
            })
        })
    }

    loadSavedJobReminders() {
        let { client, saved_job } = this.props;
        saved_job = saved_job || {};

        SavedJobReminderService.getSavedJobReminders({client, saved_job_id: saved_job.saved_job_id}).then((saved_job_reminders) => {
            console.log(saved_job.saved_job_id, "LOADED SAVED REMINDERS IN MODAL", saved_job_reminders);

            saved_job_reminders = saved_job_reminders ? saved_job_reminders.sort((a, b) => {

                let nameA = a.reminder_date || "";
                let nameB = b.reminder_date || "";

                return nameA.localeCompare(nameB);
            }) : saved_job_reminders;

            this.setState({
                saved_job_reminders
            })
        })
    }

    render() {
        let { classes, client, open, onClose, refetch, onSubmit, updateField, updateJobField, saved_job, job, options, option_map, company_map, company_demographics } = this.props;

        const { selectedState, saved_job_notes, saved_job_reminders } = this.state;

        saved_job = saved_job || {};
        job = job || {};
        option_map = option_map || {};
        company_map = company_map || {};
        company_demographics = company_demographics || {};
        const has_demographics = company_demographics && company_demographics.employees_male;

        let company = company_map[job.company_id] || {};


        const setSelectedState = (selectedState) => {
            this.setState({
                selectedState,
                creatingNewReminder: false,
                editingNewReminder: false,
                editingNewNote: false,
                creatingNewNote: false,
            })
        }

        return (<div className={classes.container}>
            <Modal
                isOpen={open}
                closeTimeoutMS={COMMON.STYLES.MODAL_TIMING}
                style={{
                    overlay: {
                        ...COMMON.STYLES.STYLE_MODAL_OVERLAY
                    },
                    content: {
                        ...COMMON.STYLES.EDIT_PORTFOLIO_MODAL.MODAL_CONTAINER,
                        maxHeight: COMMON.STYLES.EDIT_PORTFOLIO_MODAL.DEFAULT_MODAL_MAX_HEIGHT,
                        height: "600px"
                    }
                }}
            >
                <div style={{...STYLE_MODAL_SUPER_SUPER_CONTAINER, height: "100%"}}>
                    <div style={{...COMMON.STYLES.STYLE_MODAL_SUPER_CONTAINER,  maxHeight: COMMON.STYLES.EDIT_PORTFOLIO_MODAL.DEFAULT_MODAL_MAX_HEIGHT,}}>
                        <div style={{flex: "0 0 51px", padding: "25px 35px", borderBottom: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`}}>
                            <EditSavedJobModalHeader title={"Edit Link"} onClose={onClose} job={job} company_map={company_map} has_demographics={has_demographics}/>
                        </div>
                        <div style={{...COMMON.STYLES.STYLE_MODAL_CONTAINER, paddingLeft: "35px", paddingRight: "35px", paddingTop: "0px", overflow: "scroll"}}>
                            <div style={{
                                height: "45px",
                                lineHeight: "45px",
                                marginTop: "0",
                                borderTop: "none",
                                width: "calc(100% + 70px)",
                                marginLeft: "-35px",
                                paddingLeft: "35px",
                                borderBottom: `1px solid ${COMMON.COLORS.N400}`
                            }}>
                                <div className={mc(classes.companyMenuContainer)} onClick={() => {setSelectedState ? setSelectedState(1) : null}}>
                                    Info
                                    {selectedState === 1 ? <div className={classes.companyMenuSelectBar}/> : null}
                                </div>
                                <div className={mc(classes.companyMenuContainer)} onClick={() => {setSelectedState ? setSelectedState(2) : null}}>
                                    Company
                                    {selectedState === 2 ? <div className={classes.companyMenuSelectBar}/> : null}
                                </div>
                                <div className={mc(classes.companyMenuContainer)} onClick={() => {setSelectedState ? setSelectedState(3) : null}}>
                                    Reminders
                                    {selectedState === 3 ? <div className={classes.companyMenuSelectBar}/> : null}
                                </div>
                                <div className={mc(classes.companyMenuContainer)} onClick={() => {setSelectedState ? setSelectedState(4) : null}}>
                                    Notes
                                    {selectedState === 4 ? <div className={classes.companyMenuSelectBar}/> : null}
                                </div>
                            </div>
                            <div style={{display: selectedState === 1 ? null : "none"}}>
                                <div style={{display: "flex"}}>
                                    <div style={{flex: 1, marginRight: "50px"}}>

                                        {job.is_user_submitted ? <div>
                                            <div style={{display: "flex"}}>
                                                <div style={{flex: 1, paddingRight: "25px"}}>
                                                    <div className={classes.inputLabel}>Company</div>
                                                    <CompanySelect value={option_map[job.company_id]} options={options} onChange={(company_id) => {
                                                        updateJobField("company_id", company_id)
                                                    }}/>
                                                </div>
                                                <div style={{flex: 1}}>
                                                    <div className={classes.inputLabel}>Job title</div>
                                                    <StandardInput placeholder={"Ex: Engineer"} value={job.job_title} update={(v) => (updateJobField("job_title", v))}/>
                                                </div>
                                            </div>

                                            <div className={classes.inputLabel}>Post URL</div>
                                            <StandardInput placeholder={"+ add URL"} value={job.apply_link} update={(v) => (updateJobField("apply_link", v))}/>

                                            <div className={classes.inputLabel}>Description</div>
                                            <StandardInput style={{height: "184px"}} type={"textarea"} placeholder={""} value={job.job_overview} update={(v) => (updateJobField("job_overview", v))}/>

                                        </div> : <div>
                                            <div style={{marginTop: "25px"}}>
                                                <div className={mc(classes.sectionHeader)}>Role Overview</div>
                                                <div className={mc(classes.sectionSubHeader)} style={{marginBottom: "15px"}}>Identified by OSIRIS from the original job post</div>
                                                <div className={mc(classes.bodyText)} style={{marginBottom: SECTION_BUFFER}}>{job.job_overview}</div>
                                            </div>

                                        </div>}



                                    </div>
                                    <div style={{flex: "0 0 185px"}}>
                                        <div className={classes.inputLabel}>Salary</div>
                                        <StandardInput placeholder={"Add Salary"} value={saved_job.job_salary} update={(v) => (updateField("job_salary", v))}/>

                                        <div className={classes.inputLabel}>Application Deadline</div>
                                        <DatePicker selected={saved_job.job_deadline && parseFloat(saved_job.job_deadline)? new Date(parseFloat(saved_job.job_deadline)) : null} onChange={(date) => {
                                            updateField("job_deadline", date.getTime().toString())
                                        }}/>

                                        <div className={classes.inputLabel}>Status</div>
                                        <StandardSelect disableCustom={true} value={saved_job.status_id} options={COMMON.CONSTS.STATUSES} update={(v) => (updateField("status_id", v))}/>

                                    </div>
                                </div>
                            </div>
                            <div style={{display: selectedState === 2 ? null : "none", paddingTop: "25px"}}>


                                <div>
                                    <div style={{marginBottom: "25px"}}>
                                        <div className={mc(classes.sectionMainTitle)}>About Company</div>
                                        <div className={mc(classes.sectionSubHeader)}>Identified by OSIRIS from {company.company_name}</div>
                                        <div style={{...COMMON.FONTS.P200, color: COMMON.COLORS.N800}}>{company.company_about}</div>
                                    </div>
                                    <div style={{display: has_demographics ? null : "none"}}>
                                        <div className={mc(classes.sectionMainTitle)}>Representation at Company</div>
                                        <div className={mc(classes.sectionSubHeader)}>Identified by OSIRIS from Company EEO-1 Form</div>

                                        <div className={mc(classes.sectionTitle)} style={{margin: "15px 0"}}>By race / ethnicity</div>
                                        <RacePieChart company_demographics={company_demographics}/>

                                        <div className={mc(classes.sectionTitle)} style={{margin: "15px 0"}}>By gender</div>
                                        <GenderPieChart company_demographics={company_demographics}/>

                                    </div>
                                </div>
                            </div>
                            <div style={{display: selectedState === 3 ? null : "none"}}>
                                {this.state.creatingNewReminder ? <div>

                                    <div className={mc(classes.backArrow)} onClick={() => {this.setState({
                                        creatingNewReminder: false,
                                        new_reminder_name: "",
                                        new_reminder_date: new Date().getTime().toString()
                                    })}}>
                                        <i className="fa-solid fa-arrow-left"/>
                                    </div>

                                    <div style={{display: "flex"}}>
                                        <div style={{flex: 1}}>
                                            <StandardInput style={{marginBottom: "10px"}} placeholder={"Reminder"} value={this.state.new_reminder_name} update={(v) => (this.setState({new_reminder_name: v}))}/>
                                        </div>
                                        <div style={{flex: "0 0 100px", marginLeft: "10px"}}>
                                            <DatePicker selected={this.state.new_reminder_date && parseFloat(this.state.new_reminder_date) ? new Date(parseFloat(this.state.new_reminder_date)) : new Date()} onChange={(date) => {
                                                this.setState({
                                                    new_reminder_date: date.getTime().toString()
                                                })
                                            }}/>
                                        </div>
                                    </div>

                                    <StandardButton label="Save Reminder" onClick={() => {

                                        SavedJobReminderService.addSavedJobReminder({
                                            client,
                                            reminder_name: this.state.new_reminder_name,
                                            reminder_date: this.state.new_reminder_date,
                                            saved_job_id: saved_job.saved_job_id,
                                            job_id: saved_job.job_id,
                                            user_id: saved_job.user_id,
                                            date_modified: new Date().getTime().toString(),
                                            date_created: new Date().getTime().toString()
                                        }).then(() => {
                                            this.setState({
                                                creatingNewReminder: false,
                                                new_reminder_name: "",
                                                new_reminder_date: new Date().getTime().toString()
                                            });
                                            this.loadSavedJobReminders();
                                        })
                                    }}/>

                                </div> : (this.state.editingNewReminder ? <div>
                                    <div>
                                        <div className={mc(classes.backArrow)} onClick={() => {
                                            SavedJobReminderService.editSavedJobReminder({
                                                client,
                                                reminder_name: this.state.edited_reminder_name,
                                                reminder_date: this.state.edited_reminder_date,
                                                saved_job_reminder_id: this.state.edited_saved_job_reminder_id,
                                                date_modified: new Date().getTime().toString()
                                            }).then(() => {
                                                this.setState({
                                                    editingNewReminder: false,
                                                    edited_reminder_name: "",
                                                    edited_reminder_date: "",
                                                    edited_saved_job_reminder_id: null
                                                });
                                                this.loadSavedJobReminders();
                                            })
                                        }}>
                                            <i className="fa-solid fa-arrow-left"/>
                                        </div>


                                        <div style={{display: "flex"}}>
                                            <div style={{flex: 1}}>
                                                <StandardInput style={{marginBottom: "10px"}}  placeholder={"Reminder"} value={this.state.edited_reminder_name} update={(v) => (this.setState({edited_reminder_name: v}))}/>

                                            </div>
                                            <div style={{flex: "0 0 100px", marginLeft: "10px"}}>
                                                <DatePicker selected={new Date(parseFloat(this.state.edited_reminder_date))} onChange={(date) => {
                                                    this.setState({
                                                        edited_reminder_date: date.getTime().toString()
                                                    })
                                                }}/>
                                            </div>
                                        </div>
                                    </div>
                                </div> : <div>


                                    <div style={{display: "flex"}} className={mc(classes.notesReminderHeader)}>
                                        <div style={{flex: 1, ...COMMON.FONTS.FONT_H_600}}>Reminders</div>
                                        <div style={{flex: 1, textAlign: "right"}}>
                                            <StandardButton label={"Add Reminder"} onClick={() => {this.setState({creatingNewReminder: true})}}/>
                                        </div>
                                    </div>
                                    <div>{saved_job_reminders && saved_job_reminders.length ? <div>

                                        {saved_job_reminders.map((saved_job_reminder) => {

                                            const {saved_job_reminder_id, reminder_name, reminder_date, is_completed } = saved_job_reminder;

                                            return (<div className={mc(classes.reminderHolder)} style={{display: "flex", margin: "5px 0", textDecoration: is_completed ? "line-through" : null}}>
                                                <div onClick={() => {
                                                   SavedJobReminderService.editSavedJobReminder({
                                                       client,
                                                       saved_job_reminder_id,
                                                       is_completed: !is_completed
                                                   }).then(() => {
                                                       this.loadSavedJobReminders();
                                                   });
                                                }} style={{flex: "0 0 14px", marginRight: "10px", paddingLeft: "15px"}}>
                                                    <div style={{height: "14px", cursor: "pointer", marginTop: "1.5px", width: "14px", background: is_completed ? "" : "", borderRadius: "100%", border: "1px solid #696F8C"}}>
                                                        <i className="fa-solid fa-check" style={{display: is_completed ? null : "none", fontSize: "9px", marginTop: "2px", marginLeft: "2px"}}/>
                                                    </div>
                                                </div>
                                                <div onClick={() => {
                                                    this.setState({
                                                        edited_saved_job_reminder_id: saved_job_reminder_id,
                                                        edited_reminder_name: reminder_name,
                                                        edited_reminder_date: reminder_date,
                                                        editingNewReminder: true
                                                    })
                                                }} style={{flex: 1}}>{reminder_name}</div>
                                                <div style={{flex: "0 0 120px"}}>{moment(parseFloat(reminder_date)).format("MMM DD YYYY")}</div>
                                                <div style={{flex: "0 0 25px", textAlign: "right"}} onClick={() => {

                                                    const yes = confirm("Are you sure you'd like to delete this reminder?");
                                                    if (yes) {
                                                        SavedJobReminderService.deleteSavedJobReminder({client, saved_job_reminder_id}).then(() =>{
                                                            this.loadSavedJobReminders();
                                                        })
                                                    }


                                                }}><i style={{textDecoration: "none", fontSize: "14px", marginTop:"3px"}} className="fa-solid fa-xmark"/></div>
                                            </div>)
                                        })}

                                    </div> : <div>
                                        <div>No Reminders</div>
                                    </div>}</div>
                                </div>)}


                            </div>
                            <div style={{display: selectedState === 4 ? null : "none"}}>
                                {this.state.creatingNewNote ? <div>

                                    <div className={mc(classes.backArrow)}  onClick={() => {this.setState({
                                        creatingNewNote: false,
                                        new_note_title: "",
                                        new_note_body: ""})}}>
                                        <i className="fa-solid fa-arrow-left"/>
                                    </div>

                                    <StandardInput placeholder={"Title"}  value={this.state.new_note_title} update={(v) => (this.setState({new_note_title: v}))}/>
                                    <StandardInput placeholder={"Note"} style={COMMON.STYLES.SAVED_JOBS.SavedJobModalStyles.notesTextArea} type="textarea" value={this.state.new_note_body} update={(v) => (this.setState({new_note_body: v}))}/>

                                    <StandardButton label="Save Note" onClick={() => {

                                        SavedJobNoteService.addSavedJobNote({
                                            client,
                                            note_title: this.state.new_note_title,
                                            note_body: this.state.new_note_body,
                                            saved_job_id: saved_job.saved_job_id,
                                            job_id: saved_job.job_id,
                                            user_id: saved_job.user_id,
                                            date_modified: new Date().getTime().toString(),
                                            date_created: new Date().getTime().toString()
                                        }).then(() => {
                                            this.setState({
                                                creatingNewNote: false,
                                                new_note_title: "",
                                                new_note_body: ""
                                            });
                                            this.loadSavedJobNotes();
                                        })
                                    }}/>

                                </div> : (this.state.editingNewNote ? <div>
                                    <div>
                                        <div className={mc(classes.backArrow)} onClick={() => {
                                            SavedJobNoteService.editSavedJobNote({
                                                client,
                                                note_title: this.state.edited_note_title,
                                                note_body: this.state.edited_note_body,
                                                saved_job_note_id: this.state.edited_saved_job_note_id,
                                                date_modified: new Date().getTime().toString()
                                            }).then(() => {
                                                this.setState({
                                                    editingNewNote: false,
                                                    edited_note_title: "",
                                                    edited_note_body: "",
                                                    edited_saved_job_note_id: null
                                                });
                                                this.loadSavedJobNotes();
                                            })
                                        }}>
                                            <i className="fa-solid fa-arrow-left"/>
                                        </div>
                                        <StandardInput placeholder={"Title"} value={this.state.edited_note_title} update={(v) => (this.setState({edited_note_title: v}))}/>
                                        <StandardInput placeholder={"Note"} style={COMMON.STYLES.SAVED_JOBS.SavedJobModalStyles.notesTextArea} type="textarea" value={this.state.edited_note_body} update={(v) => (this.setState({edited_note_body: v}))}/>
                                    </div>
                                </div> : <div>


                                    <div style={{display: "flex"}} className={mc(classes.notesReminderHeader)}>
                                        <div style={{flex: 1, ...COMMON.FONTS.FONT_H_600}}>Notes</div>
                                        <div style={{flex: 1, textAlign: "right"}}>
                                            <StandardButton label={"Add Note"} onClick={() => {this.setState({creatingNewNote: true})}}/>
                                        </div>
                                    </div>
                                    <div>{saved_job_notes && saved_job_notes.length ? <div>

                                        {saved_job_notes.map((saved_job_note) => {

                                            const {saved_job_note_id, note_title, note_body, date_modified } = saved_job_note;
                                            return (<div className={mc(classes.noteHolder)}>
                                                <div style={{display: "flex"}}>
                                                    <div style={{flex: 1}}>
                                                        <div style={{...COMMON.FONTS.FONT_H_400}} onClick={() => {
                                                            this.setState({
                                                                edited_saved_job_note_id: saved_job_note_id,
                                                                edited_note_title: note_title,
                                                                edited_note_body: note_body,
                                                                editingNewNote: true
                                                            })
                                                        }}>{note_title}</div>
                                                    </div>
                                                    <div style={{flex: "0 0 20px"}}>
                                                        <div style={{flex: 1, textAlign: "right"}} onClick={() => {
                                                            const yes = confirm("Are you sure you'd like to delete this note?");
                                                            if (yes) {
                                                                SavedJobNoteService.deleteSavedJobNote({client, saved_job_note_id}).then(() =>{
                                                                    this.loadSavedJobNotes();
                                                                })
                                                            }

                                                        }}><i style={{textDecoration: "none", fontSize: "14px", marginTop:"5px" }} className="fa-solid fa-xmark"/></div>
                                                    </div>
                                                </div>



                                                <div style={{display: "flex"}}>
                                                    <div style={{flex: "0 0 70px", marginRight: "20px", ...COMMON.FONTS.FONT_H_200}}><div>{moment(parseFloat(date_modified)).format(("MM/DD/YYYY"))}</div></div>
                                                    <div style={{flex: 1, overflow: "hidden", paddingRight: "20px"}}><div
                                                        style={{
                                                            overflow: "hidden",
                                                            whiteSpace: "nowrap",
                                                            textOverflow: "ellipsis",
                                                            ...COMMON.FONTS.FONT_P_100
                                                        }}
                                                    >{note_body}</div></div>
                                                </div>


                                            </div>)
                                        })}

                                    </div> : <div>
                                        <div style={{
                                            textAlign: "center",
                                            margin: "50px 0",
                                            color: COMMON.COLORS.DARK_GREY,
                                            textTransform: "uppercase",
                                            ...COMMON.FONTS.FONT_H_200
                                        }}>You have not created any Notes yet</div>
                                    </div>}</div>
                                </div>)}
                            </div>
                        </div>
                        <div style={{flex: "0 0 54px", textAlign: "right", padding: "13px 35px",  borderTop: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`}}>

                            <div style={{display: "inline-block", marginRight: "10px"}}>
                                <StandardButton outline={true} label={"Delete Saved Job"} size={"S"} onClick={() => {
                                    const yes = confirm("Are you sure you'd like to delete this job?");
                                    if (yes) {
                                        SavedJobService.deleteSavedJob({client, saved_job_id: saved_job.saved_job_id}).then(() =>{
                                            onClose ? onClose() : null;
                                            refetch ? refetch() : null;
                                        });
                                    }
                                }}/>
                            </div>
                            <div style={{display: "inline-block", marginRight: "10px"}}>
                                <StandardButton outline={true} label={"View Job"} size={"S"} onClick={() => {
                                    window.open(job.apply_link, "_blank");
                                }}/>
                            </div>
                            <div style={{display: "inline-block"}}>
                                <StandardButton label={"Save"} size={"S"} onClick={() => {
                                    onSubmit ? onSubmit() : null;
                                    onClose ? onClose() : null;
                                }}/>
                            </div>
                        </div>
                    </div>

                </div>
            </Modal>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(EditSavedJobModal)));

