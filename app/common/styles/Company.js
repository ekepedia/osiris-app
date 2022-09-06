import {
    FONT_BODY,
    FONT_BODY_BOLD,
    FONT_FOOTNOTE,
    FONT_FOOTNOTE_BOLD, FONT_H_200, FONT_H_300, FONT_SUBHEADER, FONT_SUBHEADER_BOLD,
    FONT_TITLE_2_BOLD,
    FONT_TITLE_3_BOLD, H100, H300, H400, H500, H600, P100, P200
} from "../fonts";
import {
    B400,
    COLOR_GOLD,
    COLOR_WHITE,
    DARK_GREY,
    LIGHT_GREY, N400,
    N700,
    N75,
    N800,
    N900,
    OSIRIS_BLACK,
    OSIRIS_GREEN
} from "../colors";

const CompanyPageStyles = {
    pageTitle: {
        marginTop: "40px",
        marginBottom: "15px",
        ...FONT_TITLE_3_BOLD
    },
    mainContainer: {
        display: "flex"
    },
    LHSContainer: {
        flex: "0 0 315px",
        paddingRight: "50px",
    },
    RHSContainer: {
        flex: 1,
    },
    companyFilterContainer: {
        ...FONT_FOOTNOTE_BOLD,
        borderRadius: "6px",
        border: `1px solid ${LIGHT_GREY}`,
        padding: "20px",
        background: COLOR_WHITE
    },
    companyFilterLabel: {
        ...H400,
        color: N900,
        marginBottom: "10px",
        "& i": {
            marginRight: "5px"
        }
    },
    companySubFilterLabel: {
        ...P100,
        color: N700,
        marginBottom: "8px"
    }
}

const CompanyProfilePageStyles = {
    mainContainer: {
        padding: "40px 0px",
        paddingBottom: "100px",
        maxWidth: "680px",
        margin: "auto"
    },
    headerContainer: {
        // marginBottom: "20px"
    },
    sectionContainer: {
        padding: "25px 35px",
        background: COLOR_WHITE,
        borderRadius: "6px",
        border: `1px solid ${LIGHT_GREY}`,
        color: OSIRIS_BLACK,
        marginTop: "15px"
    },
    sectionMainTitle: {
        ...H600,
        color: N900,
    },
    sectionTitle: {
        ...H500,
        color: N900,
    },
    sectionSubHeader:{
        color: N700,
        textTransform: "uppercase",
        marginTop: "2px",
        ...H100
    },
    sectionSubtitle: {
        ...H500,
        color: N900,
        marginTop: "25px",
        marginBottom: 0
    },
    aboutBody: {
        ...P200,
        color: N800,
        marginTop: "15px"
    },
    overviewSection: {
        ...P200,
        color: N800
    },
    companyWebsite: {
        color: COLOR_GOLD,
        '& a': {
            color: COLOR_GOLD,
        }
    },
    diversityStatsContainer: {
        marginTop: "20px",
        display: "flex"
    },
    pieChartHolder: {
        flex: "0 0 125px",
        marginRight: "20px"
    },
    pieChartLabelHolder: {
        display: "flex",
        lineHeight: "20px",
        // maxWidth: "150px",
        marginTop: "12px"
    },
    pieChartLabelColor: {
        height: "14px",
        width: "14px",
        flex: "0 0 14px",
        background: COLOR_GOLD,
        borderRadius: "4px",
        marginTop: "1px"
    },
    pieChartLabelName: {
        flex: 1,
        paddingLeft: "10px",
        ...FONT_H_300
    },
    pieChartLabelPercentage: {
        ...FONT_H_200,
        flex: "0 0 35px"
    },
    seeMoreDetails: {
        ...H400,
        cursor: "pointer",
        marginTop: "25px",
        textAlign: "center",
        paddingTop: "12px",
        borderTop: `1px solid ${N400}`,
        color: N700,
        width: "calc(100% + 100px)",
        marginLeft: "-50px",
        paddingLeft: "0"
    }
}

const CompanyHeaderStyles  = {
    companyMenuContainer: {
        width: "fit-content",
        display: "inline-block",
        marginRight: "35px",
        position: "relative",
        cursor: "pointer",
        color: N700
    },
    companyMenuSelectBar: {
        position: "absolute",
        width: "100%",
        bottom: 0,
        height: "2px",
        background: B400,
        borderRadius: "2px 2px 0 0"
    },
    companyTabs: {
        ...H300,
        height: "48px",
        lineHeight: "48px",
        marginTop: "25px",
        borderTop: `1px solid ${N400}`,
        width: "calc(100% + 70px)",
        marginLeft: "-35px",
        paddingLeft: "35px"
    }
}



export const COMPANY = {
    CompanyPageStyles,
    CompanyProfilePageStyles,
    CompanyHeaderStyles
}