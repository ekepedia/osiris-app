import {LIGHT_GREY, OSIRIS_BLACK, COLOR_WHITE, OSIRIS_GREEN, DARK_GREY} from "../colors";
import {
    FONT_FOOTNOTE_BOLD,
    FONT_SUBHEADER,
    FONT_CAPTION_2,
    FONT_CAPTION_3,
    FONT_FOOTNOTE,
    FONT_TITLE_2_BOLD,
    FONT_CAPTION_1,
    FONT_HEADLINE_BOLD,
    FONT_SUBHEADER_BOLD,
    FONT_CAPTION_1_BOLD,
    FONT_CAPTION_2_BOLD,
    FONT_TITLE_1_BOLD,
    FONT_TITLE_3,
    FONT_TITLE_3_BOLD,
    FONT_HEADLINE
} from "../fonts";

const StandardCardStyles = {
    cardContainer: {
        padding: "15px",
        marginTop: "10px",
        overflow: "hidden",
        border: `1px solid ${LIGHT_GREY}`,
        borderRadius: "6px",
        '@media (max-width: 768px)': {
            marginTop: "10px",
            padding: "10px 12px",
        },
    },
    cardImageContainer: {
        flex: "0 0 51px",
        height: "51px",
        marginRight: "15px",
        overflow: "hidden",
        border: `1px solid ${LIGHT_GREY}`,
        borderRadius: "6px",
        '@media (max-width: 768px)': {
            flex: "0 0 45px",
            height: "45px",
            marginRight: "11px",
        },
    },
    cardTitle: {
        ...FONT_SUBHEADER_BOLD,
        marginTop: "0px",
        lineHeight: "19px",
        '@media (max-width: 768px)': {
            ...FONT_FOOTNOTE_BOLD,
            marginTop: "0px",
            lineHeight: "inherit"
        },
    },
    cardSmallLinkTitle: {
        extend: 'cardTitle',
        color: OSIRIS_BLACK,
        marginTop: "8px",
        '@media (max-width: 768px)': {
            marginTop: "8px",
            ...FONT_FOOTNOTE_BOLD,
        },
    },
    cardEducationTitle: {
        extend: 'cardTitle',
        marginTop: "9.5px",
        '@media (max-width: 768px)': {
            marginTop: "6.5px",
            ...FONT_FOOTNOTE_BOLD,
        },
    },
    cardSubTitle: {
        ...FONT_FOOTNOTE,
        lineHeight: "16px",
        marginTop: "0px",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        '@media (max-width: 768px)': {
            ...FONT_CAPTION_2,
            marginTop: "0px",
            lineHeight: "inherit"
        },
    },
    cardBody: {
        ...FONT_FOOTNOTE,
        color: DARK_GREY,
        lineHeight: "16px",
        marginTop: "0px",
        '@media (max-width: 768px)': {
            ...FONT_CAPTION_2,
            marginTop: "0px",
            lineHeight: "inherit"
        },
    },
}

const PortfolioHeaderStyles = {
    superContainer: {
        border: `1px solid ${LIGHT_GREY}`, borderRadius: "6px", overflow: "hidden"
    },
    profileHeaderContainer: {
        padding: "75px 35px",
        position:"relative",
        paddingBottom: "25px",
        background: COLOR_WHITE,
        '@media (max-width: 768px)': {
            padding: "75px 15px",
            paddingBottom: "15px"
        },
    },
    profileCover: {
        height: "150px",
        width: "100%",
        overflow: "hidden",
        position: "relative",
        '@media (max-width: 768px)': {
            height: "75px",
        },
    },
    profileImageContainer: {
        position: "absolute",
        top: "-50px",
        '@media (max-width: 768px)': {
            top: "-50px",
        },
    },
    profileImage:{
        height: "100px",
        width: "100px",
        border: `1px solid ${LIGHT_GREY}`,
        borderRadius: "4px",
        overflow: "hidden",
        backgroundSize: "cover",
        position: "relative",
        '@media (max-width: 768px)': {
            height: "100px",
            width: "100px",
        },
    },
    editHeaderButtonContainer: {
        position: "absolute",
        top: "19px",
        right: "35px",
        '@media (max-width: 768px)': {
            top: "19px",
            right: "15px",
        },
    },
    editHeaderButton:{
        display: "inline-block",
        marginLeft: "5px"
    },
    profileHeaderName:{
        ...FONT_TITLE_2_BOLD,
        '@media (max-width: 768px)': {
            ...FONT_HEADLINE_BOLD,
        },
    },
    profileHeaderBio:{
        ...FONT_SUBHEADER,
        '@media (max-width: 768px)': {
            ...FONT_CAPTION_1,
        },
    },
    socialLink: {
        background: OSIRIS_GREEN,
        color: COLOR_WHITE,
        height: "22px",
        width: "22px",
        textAlign: "center",
        fontSize: "10.5px",
        borderRadius: "6px",
        paddingTop: "5.75px",
        marginRight: "5px",
        cursor: "pointer",
        display: "inline-block"
    },
};

const PortfolioPageStyles = {
    pageContainer: {
        padding: "0 50px",
        '@media (max-width: 768px)': {
            padding: "0 19px",
        },
    },
    pageSection: {
        paddingTop: "35px",
        '@media (max-width: 768px)': {
            paddingTop: "20px",
        },
    },
    sectionContainer: {
        border: `1px solid ${LIGHT_GREY}`,
        borderRadius: "6px",
        overflow: "hidden",
        padding: "25px 35px",
        background: COLOR_WHITE,
        marginTop: "10px",
        '@media (max-width: 768px)': {
            padding: "11px 11px",
        },
    },
    sectionPortfolio: {
        extend: 'sectionContainer',
        paddingBottom: "25px",
        '@media (max-width: 768px)': {
            // paddingBottom: "1px",
        },
    },
    sectionExperienceContainer: {
        border: `1px solid ${LIGHT_GREY}`,
        borderRadius: "6px",
        overflow: "hidden",
        padding: "0",
        background: COLOR_WHITE,
        marginTop: "10px"
    },
    sectionExperiencePadding: {
        padding: "25px 35px",
        '@media (max-width: 768px)': {
            padding: "11px 11px",
        },
    },
    sectionExperienceShowMore: {
        padding: "10px",
        textAlign: "center",
        cursor: "pointer",
        borderTop: `1px solid ${LIGHT_GREY}`,
        ...FONT_SUBHEADER_BOLD,
        color: DARK_GREY,
        '@media (max-width: 768px)': {
            padding: "11px 11px",
            ...FONT_CAPTION_1_BOLD,
        },
    },
    sectionTitle: {
        ...FONT_HEADLINE_BOLD,
        '@media (max-width: 768px)': {
            ...FONT_CAPTION_2_BOLD,
        },
    },
    sectionSubTitle: {
        ...FONT_CAPTION_2,
        color: DARK_GREY,
        '@media (max-width: 768px)': {
            ...FONT_CAPTION_3,
        },
    },
    linkText: {
        position: "absolute",
        width: "100%",
        bottom: "25px",
        color: COLOR_WHITE,
        padding: "0 25px",
        ...FONT_SUBHEADER_BOLD,
        '@media (max-width: 768px)': {
            ...FONT_CAPTION_2_BOLD,
            padding: "0 12px",
            bottom: "11px",
        },
    },
    linkContainer: {
        height: "384px",
        width: "100%",
        borderRadius: "6px",
        overflow: "hidden",
        position: "relative",
        '@media (max-width: 768px)': {
            // height: "191px",
        },
    },
    plusIcon: {
        fontSize: "12.5px",
        marginTop: "3.5px",
        cursor: "pointer"
    },
    smallThumbnailContainer: {
        flex: "0 0 113px",
        overflow: "hidden"
    },
    smallThumbnailHolder: {
        height: "95px",
        width: "95px",
        borderRadius: "6px",
        border: `1px solid ${LIGHT_GREY}`,
        overflow: "hidden"
    }
}

const ClaimPortfolioStyles = {
    subContainer: {
        width: "65vw",
        maxWidth: "875px",
        margin: "auto",
        height: "100%",
        marginTop: "5vh"
    },
    headerTitle: {
        ...FONT_TITLE_2_BOLD,
        marginBottom: "15px"
    },
    bodyText: {
        ...FONT_HEADLINE,
        '& span': {
            ...FONT_HEADLINE_BOLD
        }
    },
    imageSignature: {
        height: "24px",
        marginTop: "5px"
    },
    buttonContainer: {
        marginTop: "30px"
    },
    iframeSuperContainer: {
        maxHeight: "669px",
        maxWidth: "326px",
        height: "80vh",
        width: "39vh",
        marginLeft: "auto",
        borderRadius: "6px",
        padding: "17px",
        paddingTop: "42px",
        background: `url(/img/iphone-background.png)`,
        backgroundSize: "auto 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center"
    },
    iframeContainer: {
        height: "94%",
        width: "100%",
        borderRadius: "28px"
    },
    iframe: {
        height: "100%",
        width: "100%",
        border: "none",
        "zoom": "0.75",
        "msZoom": "0.75",
        "mozTransform": "scale(0.75)",
        "mozTransformOrigin": "0 0",
        "oTransform": "scale(0.75)",
        "oTransformOrigin": "0 0",
        "webkitTransform": "scale(0.75)",
        "webkitTransformOrigin": "0 0"
    }
}

const EditToggleDeleteStyles = {
    editToggleDeleteSuperContainer: {
        flex: "0 0 65px",
    },
    editToggleDeleteFloatingContainer: {
        position: "absolute",
        top: "20px",
        right: "20px",
        background: "white",
        borderRadius: "4px",
        padding: "5px"
    },
    editToggleDeleteContainer: {
        display: "flex",
        color: OSIRIS_GREEN,
        fontSize: "13px"
    },
    editToggleDeleteEdit: {
        flex: 1,
        fontSize: "12px",
        marginRight: "10px",
        paddingTop: "3.5px",
        cursor: "pointer"
    },
    editToggleDeleteToggle: {
        flex: 1,
        fontSize: "20px",
        cursor: "pointer"
    },
    editToggleDeleteDelete: {
        flex: 1,
        fontSize: "16px",
        marginLeft: "10px",
        paddingTop: "1.5px",
        cursor: "pointer"
    },
}

export const PORTFOLIO = {
    StandardCardStyles,
    PortfolioHeaderStyles,
    PortfolioPageStyles,
    ClaimPortfolioStyles,
    EditToggleDeleteStyles
};