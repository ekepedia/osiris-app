import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import COMMON from "../../../common/index";
import { mc } from "../../../common/helpers";
import CoverImageHolder from "../../../components/CoverImageHolder";
import Slider from "react-slick";

const Styles = {
    container: {
        padding: "15px",
        borderRadius: "6px",
        border: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`,
        '@media (max-width: 768px)': {
            // padding: "0",
        },
    },
    imageHolder: {
        borderRadius: "6px",
        overflow: "hidden"
    }
};

class PortfolioCarousel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            slideIndex: 0
        };
    }

    componentDidMount() {

    }

    render() {
        let { classes, user_galleries, height, portfolioLinkRef} = this.props;

        user_galleries = user_galleries || [];

        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            beforeChange: (current, next) => this.setState({ slideIndex: next })
        };

        return (
            <div className={classes.container}>
                <div style={{height: height ? (height + 0) : "339px"}}>
                    <div className={classes.imageHolder}>
                        <Slider {...settings} ref={slider => (this.slider = slider)}>
                            {user_galleries && user_galleries.length ? user_galleries.map((user_gallery) => {
                                return (<div ref={portfolioLinkRef}>
                                    <CoverImageHolder url={user_gallery.gallery_photo_url} />
                                </div>);
                            }) : null }
                        </Slider>
                    </div>
                </div>

                <div style={{marginTop: "10px", textAlign: "center"}}>
                    {user_galleries && user_galleries.length ? user_galleries.map((user_gallery, i) => {
                        const { slideIndex } = this.state;

                        return (<div onClick={() => {


                            if (this.slider) {
                                this.slider.slickGoTo(i)
                            }
                        }
                        } style={{display: "inline-block", height: "5px", width: "5px", marginLeft: i === 0 ? 0 : "5px", borderRadius: "100%", background: slideIndex === i ? COMMON.COLORS.OSIRIS_GREEN : "#D9D9D9"}}/>);
                    }) : null }
                </div>
            </div>

        );
    }

}

export default withApollo(withRouter(injectSheet(Styles)(PortfolioCarousel)));

