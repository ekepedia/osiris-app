import {FONT_FOOTNOTE} from "../fonts";
import {DARK_GREY} from "../colors";

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

export const GENERAL = {
    alignmentStyles,
    AlignmentStyles: alignmentStyles,
    InputStyles
}