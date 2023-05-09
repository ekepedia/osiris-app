import React from "react";

import ReactTooltip from 'react-tooltip';

import injectSheet from 'react-jss';

import COMMON from "../common/index";
import { mc } from "../common/helpers";

const Styles = {
    badgeStyle: (props) => {
        return ({
            marginRight: "5px",
            // marginTop: "5.5px",
            ...COMMON.FONTS.H100,
            padding: "2px 4px",
            background: props.background || COMMON.COLORS.N100,
            color: props.color || COMMON.COLORS.N700,
            display: "inline-block",
            borderRadius: "4px",
            whiteSpace: "nowrap",
            textTransform: "uppercase"
        })
    },
    defaultIcon: {
        fontSize: "10px"
    }
};

class GlassdoorBadge extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {};
    }

    getIcon() {
        let { type} = this.props;
        if (type === "overall") return "fa-solid fa-star";
        if (type === "work_life") return "fa-solid fa-scale-balanced";
        if (type === "culture") return "fa-sharp fa-solid fa-basketball";
        if (type === "compensation") return "fa-solid fa-dollar-sign";
    }

    getIconStyle() {
        let { type } = this.props;
        if (type === "overall") return {color: COMMON.COLORS.Y400};
        if (type === "work_life") return {color: COMMON.COLORS.R400};
        if (type === "culture") return {color: COMMON.COLORS.P400};
        if (type === "compensation") return {color: COMMON.COLORS.G600};
    }

    getToolTip() {
        let { type, value, company_name} = this.props;
        let base = `Employees rate ${company_name} ${value}/5 on<br/>Glassdoor`;
        if (type === "overall") return `${base} overall`;
        if (type === "work_life") return `${base} for work-life balance`;
        if (type === "culture") return `${base} for culture`;
        if (type === "compensation") return `${base} for compensation`;
    }

    getStyle() {
        let {type} = this.props;
        if (type === "overall") return {background: COMMON.COLORS.N100, color: COMMON.COLORS.N900}
        if (type === "work_life") return {background: COMMON.COLORS.N100, color: COMMON.COLORS.N900}
        if (type === "culture") return {background: COMMON.COLORS.N100, color: COMMON.COLORS.N900}
        if (type === "compensation") return {background: COMMON.COLORS.N100, color: COMMON.COLORS.N900}
    }


    getLabel() {
        let { type} = this.props;
        if (type === "overall") return "overall"
        if (type === "work_life") return "work-life"
        if (type === "culture") return "culture"
        if (type === "compensation") return "compensation"
    }

    render() {
        let { classes, type, value, small} = this.props;

        let icon = this.getIcon(type);
        let iconStyle = this.getIconStyle();
        let tooltip = this.getToolTip();
        let style = this.getStyle();
        let label = this.getLabel();

        let id = Math.random() + "";

        return (<div style={style} className={classes.badgeStyle} data-tip data-for={id}>

            {small ? <div>
                <span>{value}</span><span style={{marginLeft: "4.25px"}}><i style={iconStyle} className={mc(icon,classes.defaultIcon)}/></span>
            </div> : <div>
                <span>{value}</span><span style={{margin: "0 4.25px"}}><i style={iconStyle} className={mc(icon,classes.defaultIcon)}/></span><span>{label}</span>
            </div>
            }


            {tooltip ? <ReactTooltip multiline={true} className={"tool-tip-styles"} id={id} place={"bottom"} padding={"0px"} backgroundColor={COMMON.COLORS.N800}>
                <div dangerouslySetInnerHTML={(() => ({__html: tooltip}))()}/>
            </ReactTooltip> : null}
        </div>)
    }

}

export default injectSheet(Styles)(GlassdoorBadge);

