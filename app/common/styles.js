import {COLOR_BORDER_GREY, COLOR_GREEN, COLOR_TEXT_GREY, COLOR_WHITE} from "./colors";
import {FONT_FOOTNOTE, FONT_FOOTNOTE_BOLD, FONT_HEADLINE_BOLD, FONT_SUBHEADER, FONT_SUBHEADER_BOLD} from "./fonts";

export const MODAL_TIMING = 250;

// BUTTON STYLES
export const STYLE_BUTTON_HEADLINE = {
    ...FONT_HEADLINE_BOLD,
    background: COLOR_GREEN,
    color: COLOR_WHITE,
    padding: "6px 8px",
    width: "fit-content",
    borderRadius: "6px",
    cursor: "pointer",
}

export const STYLE_BUTTON_HEADLINE_OUTLINE = {
    ...FONT_HEADLINE_BOLD,
    background: "none",
    color: COLOR_GREEN,
    border: `1px solid ${COLOR_GREEN}`,
    padding: "6px 8px",
    width: "fit-content",
    borderRadius: "6px",
    cursor: "pointer",
}

export const STYLE_BUTTON_SUBHEADER = {
    ...FONT_SUBHEADER_BOLD,
    background: COLOR_GREEN,
    color: COLOR_WHITE,
    padding: "6px 8px",
    width: "fit-content",
    borderRadius: "6px",
    cursor: "pointer",
}

export const STYLE_BUTTON_FOOTNOTE = {
    ...FONT_FOOTNOTE_BOLD,
    background: COLOR_GREEN,
    color: COLOR_WHITE,
    padding: "6px 8px",
    width: "fit-content",
    borderRadius: "6px",
}

export const STYLE_BUTTON_FOOTNOTE_OUTLINE = {
    ...FONT_FOOTNOTE_BOLD,
    background: "none",
    color: COLOR_GREEN,
    padding: "6px 8px",
    width: "fit-content",
    borderRadius: "6px",
    border: `1px solid ${COLOR_GREEN}`
}
// MODAL STYLES
export const STYLE_MODAL_OVERLAY = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    transition: `opacity ${MODAL_TIMING}ms ease-in-out`
}

export const STYLE_MODAL_CONTENT = {
    position: 'absolute',
    top: '0',
    left: 0,
    right: 0,
    margin: "auto",
    maxWidth: "350px",
    width: "calc(100% - 20px)",
    bottom: '100px',
    border: '1px solid #ccc',
    background: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '6px',
    outline: 'none',
    padding: '0'
}



// BORDER
export const STYLE_BORDER_LINE = {
    background: COLOR_BORDER_GREY,
    width: "100%",
    height: "1px"
}

export const STYLE_INPUT = {
    ...FONT_FOOTNOTE,
    background: COLOR_WHITE,
    height: "25px",
    lineHeight: "25px",
    border: `1px solid ${COLOR_TEXT_GREY}`,
    borderRadius: "6px",
    padding: "0 8px",
    width: "100%",
    outline: "none",
}

export const GREY_BORDER_6 = {
    border: `1px solid ${COLOR_BORDER_GREY}`,
    borderRadius: "6px",
}

export const MOBILE_STYLES = {
    hideOnMobile: {
        '@media (max-width: 768px)': {
            display: "none"
        },
    },
    showOnMobile: {
        display: "none",
        '@media (max-width: 768px)': {
            display: "block"
        },
    }
}

export const EDIT_PORTFOLIO_MODAL = {
    MODAL_CONTAINER: {
        position: 'absolute',
        top: '0',
        left: 0,
        right: 0,
        margin: "auto",
        maxWidth: "794px",
        width: "calc(100% - 20px)",
        bottom: '100px',
        border: '1px solid #ccc',
        background: '#fff',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '6px',
        outline: 'none',
        padding: '0',
        inset: "0"
    },
    DEFAULT_MODAL_HEIGHT: "90vh",
    MODAL_HEADER: {
        ...FONT_HEADLINE_BOLD
    }
}

export const STYLES = {
    STYLE_INPUT,
    STYLE_BORDER_LINE,
    GREY_BORDER_6,
    STYLE_MODAL_CONTENT,
    STYLE_MODAL_OVERLAY,
    STYLE_BUTTON_FOOTNOTE_OUTLINE,
    STYLE_BUTTON_FOOTNOTE,
    STYLE_BUTTON_SUBHEADER,
    STYLE_BUTTON_HEADLINE_OUTLINE,
    STYLE_BUTTON_HEADLINE,
    MODAL_TIMING,
    MOBILE_STYLES,
    EDIT_PORTFOLIO_MODAL
}

console.log("SD", STYLES)