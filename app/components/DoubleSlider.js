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
import {formatLargeNumber, mc} from "../common/helpers";

import Slider, {Range, Handle, SliderTooltip} from 'rc-slider';
import 'rc-slider/assets/index.css';
import './style.css';


const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
};

const handle = props => {
    const { value, dragging, index, ...restProps } = props;
    return (
        <SliderTooltip
            prefixCls="rc-slider-tooltip"
            // overlay={`${value} %`}
            overlay={`$${formatLargeNumber(value)}`}
            visible={dragging}
            // visible={true}
            placement="bottom"
            key={index}
        >
            <Handle value={value} {...restProps} />
        </SliderTooltip>
    );
};

class DoubleSlider extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            min: 12000,
            max: 250000
        };
    }

    componentDidMount() {

    }

    onSliderChange(e) {
        console.log(e)
    }

    render() {
        let { classes, client, match: { params } } = this.props;


        return (<div className={classes.container}>

            <div style={{height: "28px"}}>
                <Range
                    defaultValue={[60000, 105000]}
                    step={1000}
                    min={this.state.min}
                    max={this.state.max}
                    allowCross={false}
                    onChange={this.onSliderChange.bind(this)}
                    handle={handle}
                />
            </div>

        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(DoubleSlider)));

