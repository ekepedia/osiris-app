import {FONT_FOOTNOTE} from "../fonts";
import {DARK_GREY} from "../colors";
import {NAV_HEIGHT} from "../consts";

const alignmentStyles = {
    centerAlignContainer: {
        position: "relative"
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
        flex: `0 0 ${NAV_HEIGHT}px`
    },
    masterBodyContainer: {
        flex: 1,
        overflow: "scroll"
    }
}

export const GENERAL = {
    alignmentStyles,
    AlignmentStyles: alignmentStyles,
    InputStyles,
    NavigationStyles
}