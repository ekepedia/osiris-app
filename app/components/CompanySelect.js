import React from "react";
import _ from "lodash";
import moment from "moment";

import { gql } from 'apollo-boost';
import { Query } from '@apollo/react-components';
import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../services/DataService';

import COMMON from "../common/index";
import {companyCustomSearch, mc} from "../common/helpers";
import Select from "react-select/creatable";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
};

class CompanySelect extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {

    }

    render() {
        let { classes, onChange, options, value, hideIndicator } = this.props;

        const DropdownIndicator = () => {
            return (<div style={{width: "32px", display: hideIndicator ? "none" : null}}>
                <img src={"/img/custom-select-caret.png"} style={{height: "20px", width: "20px"}}/>
            </div>);
        };

        return (<div className={classes.container}>
            <Select
                height="31px"
                isClearable={true}
                placeholder="Choose a company ..."
                options={options}
                maxMenuHeight={200}
                value={value}
                components={{DropdownIndicator}}

                filterOption={companyCustomSearch}
                styles={{
                    control: (provided, state) => ({
                        ...provided,
                        minHeight: '30px',
                        boxShadow: state.isFocused ? null : null,
                        borderColor: COMMON.COLORS.N400,
                        outline: "none",
                        "&:hover": {
                            borderColor: COMMON.COLORS.N600,
                        }
                    }),
                    valueContainer: (provided, state) => ({
                        ...provided,
                        height: '30px',
                        padding: '2px 2px'
                    }),
                    input: (provided, state) => ({
                        ...provided,
                        margin: '0 2px',
                        ...COMMON.FONTS.P100,
                        color: COMMON.COLORS.N800
                    }),
                    placeholder: (provided, state) => ({
                        ...provided,
                        ...COMMON.FONTS.P100,
                        color: COMMON.COLORS.N600,
                        padding: "0 2px"
                    }),
                    indicatorSeparator: (provided, state) => ({
                        ...provided,
                        display: "none"
                    }),
                    indicatorsContainer: (provided, state) => ({
                        ...provided,
                        minHeight: '30px',
                    }),
                    clearIndicator: (provided, state) => ({
                        ...provided,
                        display: "none"
                    }),
                    singleValue: (provided, state) => ({
                        ...provided,
                        marginRight: '6px',
                        ...COMMON.FONTS.P100,
                        color: COMMON.COLORS.N800,
                    }),
                    singleValueLabel: (provided, state) => ({
                        ...provided,
                        marginRight: '6px',
                        ...COMMON.FONTS.P100,
                        color: COMMON.COLORS.N800
                    }),
                    option:  (provided, state) => ({
                        ...provided,
                        ...COMMON.FONTS.P100,
                        color: COMMON.COLORS.N800
                    }),
                }}
                onChange={(e) => {
                    if (e && e.value) {
                        if(onChange) onChange(e.value)
                    }
                }}
            />
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(CompanySelect)));
