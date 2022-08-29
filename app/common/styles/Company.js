import {
    FONT_BODY,
    FONT_BODY_BOLD,
    FONT_FOOTNOTE,
    FONT_FOOTNOTE_BOLD, FONT_H_200, FONT_H_300, FONT_SUBHEADER, FONT_SUBHEADER_BOLD,
    FONT_TITLE_2_BOLD,
    FONT_TITLE_3_BOLD
} from "../fonts";
import {COLOR_GOLD, COLOR_WHITE, DARK_GREY, LIGHT_GREY, OSIRIS_BLACK, OSIRIS_GREEN} from "../colors";

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
        ...FONT_FOOTNOTE_BOLD,
        marginBottom: "10px"
    },
    companySubFilterLabel: {
        ...FONT_FOOTNOTE,
        color: DARK_GREY,
        marginBottom: "5px"
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
        padding: "25px 50px",
        background: COLOR_WHITE,
        borderRadius: "6px",
        border: `1px solid ${LIGHT_GREY}`,
        color: OSIRIS_BLACK,
        marginTop: "20px"
    },
    sectionTitle: {
        ...FONT_TITLE_2_BOLD,
        lineHeight: "26px"
    },
    sectionSubHeader:{
        color: DARK_GREY,
        marginTop: "2px",
        ...FONT_SUBHEADER
    },
    sectionSubtitle: {
        ...FONT_BODY_BOLD,
        marginTop: "25px",
        lineHeight: "21px",
        marginBottom: "2px"
    },
    aboutBody: {
        ...FONT_BODY,
        marginTop: "25px"
    },
    overviewSection: {
        ...FONT_BODY,
    },
    companyWebsite: {
        ...FONT_BODY_BOLD,
        color: COLOR_GOLD
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
}

const CompanyHeaderStyles  = {
    companyMenuContainer: {
        width: "fit-content",
        display: "inline-block",
        marginRight: "35px",
        ...FONT_SUBHEADER_BOLD,
        position: "relative",
        cursor: "pointer"
    },
    companyMenuSelectBar: {
        position: "absolute",
        width: "100%",
        bottom: 0,
        height: "4px",
        background: OSIRIS_GREEN,
        borderRadius: "2px 2px 0 0"
    }

}



export const COMPANY = {
    CompanyPageStyles,
    CompanyProfilePageStyles,
    CompanyHeaderStyles
}