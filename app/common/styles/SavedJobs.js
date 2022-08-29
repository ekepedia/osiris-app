import {
    FONT_BODY,
    FONT_BODY_BOLD,
    FONT_FOOTNOTE,
    FONT_FOOTNOTE_BOLD, FONT_H_300, FONT_P_100, FONT_SUBHEADER, FONT_SUBHEADER_BOLD,
    FONT_TITLE_2_BOLD,
    FONT_TITLE_3_BOLD
} from "../fonts";
import {COLOR_GOLD, COLOR_WHITE, DARK_GREY, LIGHT_GREY, N_600, N_700, N_800, OSIRIS_BLACK} from "../colors";

const SavedJobPageStyles = {
    pageTitle: {
        marginTop: "40px",
        marginBottom: "15px",
        ...FONT_TITLE_3_BOLD
    },
    mainContainer: {
        border: `1px solid ${LIGHT_GREY}`,
        overflow: "hidden",
        borderRadius: "6px",
        background: COLOR_WHITE,
    },
    filterBarContainer: {
        height: "48px",
        lineHeight: "48px",
        padding: "0px",
        margin: "25px 0",
        marginBottom: "5px",
    },
    rowContainer: {
        padding: "10px",
        ...FONT_SUBHEADER,
        // borderBottom: `1px solid ${LIGHT_GREY}`,
        minHeight: "53px",
        lineHeight: "calc(53px - 20px)"
    },
    filterHolder: {
        ...FONT_H_300,
        display: "inline-block",
        marginRight: "8px",
        padding: "0 8px",
        borderRadius: "4px",
        lineHeight: "32px",
        background: "#EBF0FF",
        color:"#3366FF",
        width: "fit-content",
    },
    savedJobRow: {
        borderTop: `1px solid ${LIGHT_GREY}`
    }
}


const SavedJobModalStyles = {
    notesReminderHeader: {
        padding: "25px 0px",
        paddingBottom: "15px",
        marginBottom: "5px",
        borderBottom: "1px solid #D8DAE5"
    },
    backArrow: {
        fontSize: "20px",
        marginTop: "25px",
        marginBottom: "15px",
        color: N_600,
        cursor: "pointer"
    },
    notesTextArea: {
        margin: "10px 0px",
        height: "250px",
    },
    noteHolder: {
        borderBottom: "1px solid #D8DAE5",
        paddingBottom: "10px",
    },
    reminderHolder: {
        color: N_800,
        ...FONT_P_100,
        padding: "10px 0",
        borderBottom: "1px solid #D8DAE5",

    }
}


export const SAVED_JOBS = {
    SavedJobPageStyles,
    SavedJobModalStyles,
}