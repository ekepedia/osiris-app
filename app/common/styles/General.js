import {FONT_FOOTNOTE} from "../fonts";
import {DARK_GREY, N400} from "../colors";
import {NAV_HEIGHT} from "../consts";

const alignmentStyles = {
    centerAlignContainer: {
        position: "relative"
    },
    centerAlignContainerFill: {
        extend: "centerAlignContainer",
        height: "100%",
        width: "100%"
    },
    centerAlignObject: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
    },
    verticalAlignObject: {
        position: "absolute",
        top: "50%",
        transform: "translate(0%,-50%)",
    },
    verticalAlignObjectFill: {
        extend: "verticalAlignObject",
        width: "100%"
    },
}

const InputStyles =  {
    inputLabel: {
        color: DARK_GREY,
        marginTop: "10px",
        marginBottom: "6px",
        ...FONT_FOOTNOTE
    }
}

const NavigationStyles = {
    masterContainer: {
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
    },
    masterNavContainer: {
        flex: `0 0 ${NAV_HEIGHT}px`,
        borderBottom: `1px solid ${N400}`
    },
    masterBodyContainer: {
        flex: 1,
        overflow: "scroll"
    }
}

const MobileScalingStyles = {
    hide600: {
        '@media (max-width: 600px)': {
            display: "none"
        },
    },
    hide500: {
        '@media (max-width: 500px)': {
            display: "none"
        },
    },
    hide450: {
        '@media (max-width: 450px)': {
            display: "none"
        },
    },
}

export const GENERAL = {
    alignmentStyles,
    AlignmentStyles: alignmentStyles,
    InputStyles,
    NavigationStyles,
    MobileScalingStyles
}