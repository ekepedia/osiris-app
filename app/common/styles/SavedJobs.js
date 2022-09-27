import {
    FONT_BODY,
    FONT_BODY_BOLD,
    FONT_FOOTNOTE,
    FONT_FOOTNOTE_BOLD, FONT_H_300, FONT_P_100, FONT_SUBHEADER, FONT_SUBHEADER_BOLD,
    FONT_TITLE_2_BOLD,
    FONT_TITLE_3_BOLD, H100, H300, P100
} from "../fonts";
import {
    B400,
    COLOR_GOLD,
    COLOR_WHITE,
    DARK_GREY,
    LIGHT_GREY, N100,
    N700,
    N900,
    N_600,
    N_700,
    N_800,
    OSIRIS_BLACK
} from "../colors";

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
        padding: "0",
        ...P100,
        lineHeight: "48px",
        color: N700
    },
    jobTitle: {
        extend: 'rowContainer',
        ...H300,
        lineHeight: "48px",
        cursor: "pointer",
        color: N900,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden"
    },
    rowContainerHeader: {
        extend: 'rowContainer',
        textTransform: "uppercase",
        color: N700,
        ...H100,
        lineHeight: "48px",
    },
    rowHeaderSuperContainer: {
        padding: "0 15px",
        display: "flex",
        background: "#FAFBFF"
    },
    filterHolder: {
        ...H300,
        display: "inline-block",
        marginRight: "8px",
        padding: "0 8px",
        borderRadius: "4px",
        lineHeight: "32px",
        background: "#EBF0FF",
        color: B400,
        width: "fit-content",
    },
    savedJobRow: {
        borderTop: `1px solid ${LIGHT_GREY}`,
        display: "flex",
        padding: "0 15px"
    },
    companyLogoContainer: {
        position: "absolute",
        height: "16px",
        width: "16px",
        marginRight: "5px",
        top: "16px",
        left: 0,
        borderRadius: "4px",
        overflow: "hidden",
        border: "none"
    },
    statusSelectStyle: {
        ...H100,
        border: "none",
        height: "20px",
        padding: "2px 4px",
        marginTop: "14px",
        color: N700,
        textTransform: "uppercase",
        borderRadius: "4px",
        width: "91px"
    },
    roleTypeContainer: {
        background: N100,
        padding: "2px 3px",
        borderRadius: "4px",
        "& i": {
            fontSize: "10px",
            marginRight: "3px"
        }
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