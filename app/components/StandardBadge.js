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

class StandardBadge extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        let { classes, style, label, icon, iconStyle, iconLeft, tooltip } = this.props;

        let id = Math.random() + "";

        let incom = `Employees rate Morgan Stanley 3.6/5 <br/>on Glassdoor for work/life`;

        return (<div style={style} className={classes.badgeStyle} data-tip data-for={id}>
            {icon && iconLeft ? <span style={{marginRight: "4.25px"}}><i style={iconStyle} className={mc(icon,classes.defaultIcon)}/></span> : null}{label}{icon && !iconLeft ? <span style={{marginLeft: "4.25px"}}><i style={iconStyle} className={mc(icon,classes.defaultIcon)}/></span> : null}
            {tooltip ? <ReactTooltip multiline={true} className={"tool-tip-styles"} id={id} place={"bottom"} padding={"0px"} backgroundColor={COMMON.COLORS.N800}>
                <div dangerouslySetInnerHTML={(() => ({__html: tooltip}))()}/>
            </ReactTooltip> : null}
        </div>)
    }

}

export default injectSheet(Styles)(StandardBadge);

