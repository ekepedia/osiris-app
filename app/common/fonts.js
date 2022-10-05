// BASE STYLES
const BASE = {fontWeight: 400, fontSize: "11px", letterSpacing: "-0px"};
const BOLD_BASE = {fontWeight: 600};

const REGULAR_BASE = {fontWeight: 400};
const MEDIUM_BASE = {fontWeight: 500};
const SEMI_BOLD_BASE = {fontWeight: 600};

// CAPTION 1
export const FONT_CAPTION_1 = { ...BASE, fontSize: "12px",}
export const FONT_CAPTION_1_BOLD = { ...FONT_CAPTION_1,  ...BOLD_BASE}

// CAPTION 2
export const FONT_CAPTION_2 = { ...BASE, fontSize: "11px",}
export const FONT_CAPTION_2_BOLD = { ...FONT_CAPTION_2,  ...BOLD_BASE}

// CAPTION 3
export const FONT_CAPTION_3 = { ...BASE, fontSize: "9px",}
export const FONT_CAPTION_3_BOLD = { ...FONT_CAPTION_3,  ...BOLD_BASE}

// FOOTNOTE
export const FONT_FOOTNOTE = { ...BASE, fontSize: "12px",}
export const FONT_FOOTNOTE_BOLD = { ...FONT_FOOTNOTE, ...BOLD_BASE}

// SUBHEADER
export const FONT_SUBHEADER = { ...BASE, fontSize: "14px",}
export const FONT_SUBHEADER_BOLD = { ...FONT_SUBHEADER,  ...BOLD_BASE}

// HEADLINE
export const FONT_HEADLINE = { ...BASE, fontSize: "16px",}
export const FONT_HEADLINE_BOLD = { ...FONT_HEADLINE, ...BOLD_BASE}

// BODY
export const FONT_BODY = { ...BASE, fontSize: "16px",}
export const FONT_BODY_BOLD = { ...FONT_BODY, ...BOLD_BASE}

// LARGE TITLE
export const FONT_LARGE_TITLE = { ...BASE, fontSize: "27px",}
export const FONT_LARGE_TITLE_BOLD = { ...FONT_LARGE_TITLE,  ...BOLD_BASE}

// TITLE
export const FONT_TITLE = { ...BASE, fontSize: "27px",}
export const FONT_TITLE_BOLD = { ...FONT_TITLE,  ...BOLD_BASE}

// TITLE 1
export const FONT_TITLE_1 = { ...BASE, fontSize: "27px",}
export const FONT_TITLE_1_BOLD = { ...FONT_TITLE_1,  ...BOLD_BASE}

// TITLE 2
export const FONT_TITLE_2 = { ...BASE, fontSize: "21px",}
export const FONT_TITLE_2_BOLD = { ...FONT_TITLE_2,  ...BOLD_BASE}

// TITLE 3
export const FONT_TITLE_3 = { ...BASE, fontSize: "19px",}
export const FONT_TITLE_3_BOLD = { ...FONT_TITLE_3,  ...BOLD_BASE}


export const FONT_P_100 = { ...BASE, fontSize: "12px", lineHeight: "16px", fontWeight: 400}
export const FONT_H_100 = { ...BASE, fontSize: "10px", lineHeight: "16px", fontWeight: 400}
export const FONT_H_200 = { ...BASE, fontSize: "12px", lineHeight: "16px", fontWeight: 600}
export const FONT_H_300 = { ...BASE, fontSize: "12px", lineHeight: "16px", fontWeight: 600}
export const FONT_H_400 = { ...BASE, fontSize: "14px", lineHeight: "24px", fontWeight: 600}
export const FONT_H_600 = { ...BASE, fontSize: "18px", lineHeight: "24px", fontWeight: 600}

export const FONTS = {
    FONT_CAPTION_1,
    FONT_CAPTION_1_BOLD,
    FONT_CAPTION_2,
    FONT_CAPTION_2_BOLD,
    FONT_CAPTION_3,
    FONT_CAPTION_3_BOLD,
    FONT_FOOTNOTE,
    FONT_FOOTNOTE_BOLD,
    FONT_SUBHEADER,
    FONT_SUBHEADER_BOLD,
    FONT_HEADLINE,
    FONT_HEADLINE_BOLD,
    FONT_BODY,
    FONT_BODY_BOLD,
    FONT_TITLE,
    FONT_TITLE_BOLD,
    FONT_LARGE_TITLE,
    FONT_LARGE_TITLE_BOLD,
    FONT_TITLE_1,
    FONT_TITLE_1_BOLD,
    FONT_TITLE_2,
    FONT_TITLE_2_BOLD,
    FONT_TITLE_3,
    FONT_TITLE_3_BOLD,
    FONT_P_100,
    FONT_H_100,
    FONT_H_200,
    FONT_H_300,
    FONT_H_400,
    FONT_H_600,
}

export const H900 = { ...SEMI_BOLD_BASE, fontSize: "32px", lineHeight: "40px",}
FONTS.H900 = H900;

export const H800 = { ...SEMI_BOLD_BASE, fontSize: "24px", lineHeight: "32px",}
FONTS.H800 = H800;

export const H700 = { ...SEMI_BOLD_BASE, fontSize: "20px", lineHeight: "24px",}
FONTS.H700 = H700;

export const H600 = { ...SEMI_BOLD_BASE, fontSize: "18px", lineHeight: "24px",}
FONTS.H600 = H600;

export const H500 = { ...SEMI_BOLD_BASE, fontSize: "16px", lineHeight: "24px",}
FONTS.H500 = H500;

export const H400 = { ...MEDIUM_BASE, fontSize: "14px", lineHeight: "24px",}
FONTS.H400 = H400;

export const H300 = { ...MEDIUM_BASE, fontSize: "12px", lineHeight: "16px",}
FONTS.H300 = H300;

export const H200 = { ...SEMI_BOLD_BASE, fontSize: "12px", lineHeight: "16px",}
FONTS.H200 = H200;

export const H100 = { ...MEDIUM_BASE, fontSize: "10px", lineHeight: "16px",}
FONTS.H100 = H100;

export const P300 = { ...REGULAR_BASE, fontSize: "16px", lineHeight: "24px",}
FONTS.P300 = P300;

export const P200 = { ...REGULAR_BASE, fontSize: "14px", lineHeight: "20px",}
FONTS.P200 = P200;

export const P100 = { ...REGULAR_BASE, fontSize: "12px", lineHeight: "16px",}
FONTS.P100 = P100;