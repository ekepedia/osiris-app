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
import { mc } from "../common/helpers";
import Select from "react-select";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
};

class StandardMultiSelect extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {

    }

    render() {
        let { classes, client, match: { params }, value, options, onChange, hideIndicator, placeholder } = this.props;

        const DropdownIndicator = () => {
            return (<div style={{width: "32px", display: hideIndicator ? "none" : null}}>
                <img src={"/img/custom-select-caret.png"} style={{height: "20px", width: "20px"}}/>
            </div>);
        };

        return (<div className={classes.container}>
            <Select
                isMulti={true}
                isClearable={false}
                placeholder={placeholder}
                value={value}
                onChange={(e) => {
                    console.log("the original e", e)
                    let ids = e.map((val) => (val.value));
                    onChange(ids);
                }}
                maxMenuHeight={140}
                styles={{
                    control: (provided, state) => ({
                        ...provided,
                        minHeight: '32px',
                        boxShadow: state.isFocused ? null : null,
                        borderColor: COMMON.COLORS.N400,
                        outline: "none"
                    }),
                    valueContainer: (provided, state) => ({
                        ...provided,
                        minHeight: '32px',
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
                        color: COMMON.COLORS.N800,
                        padding: "0 2px"
                    }),
                    indicatorSeparator: (provided, state) => ({
                        ...provided,
                        display: "none"
                    }),
                    indicatorsContainer: (provided, state) => ({
                        ...provided,
                        minHeight: '32px',
                    }),
                    multiValue: (provided, state) => ({
                        ...provided,
                        marginRight: '6px',
                        ...COMMON.FONTS.P100,
                        color: COMMON.COLORS.N800,
                        background: COMMON.COLORS.N200,
                    }),
                    multiValueLabel: (provided, state) => ({
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

                components={{DropdownIndicator}}

                options={options}
            />
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(StandardMultiSelect)));

