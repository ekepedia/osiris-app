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
    OSIRIS_GREEN,
    N600, N300
} from "../colors";

const CompanyPageStyles = {
    pageTitle: {
        marginTop: "40px",
        marginBottom: "15px",
        ...FONT_TITLE_3_BOLD
    },
    mainContainer: {
        display: "flex",
        paddingTop: "35px",
        '@media (max-width: 1000px)': {
            paddingTop: "10px",
        },
    },
    LHSContainer: {
        flex: "0 0 315px",
        marginRight: "50px",
        height: "fit-content",
        maxHeight: "calc(100vh - 177px)",
        overflow: "scroll",
        borderRadius: "4px",
        border: `1px solid ${N400}`,
        '@media (max-width: 1000px)': {
            display: "none"
        },
    },
    RHSContainer: {
        flex: 1,
        maxHeight: "calc(100vh - 120px)",
        height: "fit-content",
        overflow: "hidden",
    },
    RHSScrollContainer: {
        maxHeight: "calc(100vh - 177px)",
        height: "fit-content",
        overflow: "scroll",
        borderRadius: "4px",
        border: `1px solid ${N400}`
    },
    companyFilterContainer: {
        ...FONT_FOOTNOTE_BOLD,
        // borderRadius: "6px",
        // border: `1px solid ${LIGHT_GREY}`,
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
        margin: "auto",
        '@media (max-width: 1000px)': {
            paddingTop: "10px",
            paddingBottom: "50px",
            overflow: "hidden",
        },
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
        color: B400,
        '& a': {
            color: B400,
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

const CompanyRowStyles = {
    companyLogo: {
        height: "40px",
        flex: "0 0 40px",
        marginRight: "10px",
        border: `1px solid ${N300}`,
        borderRadius: "6px",
        overflow: "hidden"
    },
    companyNameContainer: {
        flex: 2,
        '@media (max-width: 1050px)': {
            flex: 1.6,
            paddingRight: "5px"
        },
    },
    companyEmployeeContainer: {
        flex: 1,
        "& i": {
            color: N600,
            marginRight: "4px",
            fontSize: "12px"
        },
        '@media (max-width: 1150px)': {
            display: "none"
        },
    },
    companyGenderContainer: {
        flex: 1.5,
        '@media (max-width: 1050px)': {
            display: "none"
        },
    },
    companyRaceContainer: {
        flex: 1.5,
        '@media (max-width: 1050px)': {
            paddingRight: "5px"
        },
    },
    companyRankContainer: {
        flex: 1,
        display: "none",
        '@media (max-width: 500px)': {
            display: "none"
        },
    },
    companyOverallGlassdoorContainer: {
        flex: 1,
    },
    companyWorkGlassdoorContainer: {
        flex: 1,
        '@media (max-width: 1250px)': {
            display: "none"
        },
    },
    companyPayGlassdoorContainer: {
        flex: 1,
        '@media (max-width: 1350px)': {
            display: "none"
        },
    },
    companyExpandContainer: {
        flex: "0 0 30px",
        '@media (max-width: 1150px)': {
            display: "none"
        },
    },
}


export const COMPANY = {
    CompanyPageStyles,
    CompanyProfilePageStyles,
    CompanyHeaderStyles,
    CompanyRowStyles
}