import React from "react";
import _ from "lodash";
import moment from "moment";

import { gql } from 'apollo-boost';
import { Query } from '@apollo/react-components';
import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../services/DataService';

import {COLOR_BORDER_GREY, COLOR_WHITE} from "../common/colors";
import {FONT_BODY_BOLD, FONT_SUBHEADER} from "../common/fonts";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
};

class ProductRow extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        };
    }

    componentDidMount() {

    }

    render() {
        let { classes, client, match: { params }, product, total_sales_raw, daily } = this.props;

        const convertSales = (sales) => {
            sales = Math.round(sales*100)/100;

            if (sales > 1000000) {
                sales = (Math.round((sales/1000000)*100)/100) + "M"
            } else if (sales > 1000) {
                sales = (Math.round((sales/1000)*10)/10) + "K"
            }
            return sales;
        }

        if (!product.name)
            return null;

        console.log("PRODUCT TEMPLATE ROW", product);

        let height = daily ? "20px" : "40px";
        let hasVariants = product && product.variants && Object.keys(product.variants).length > 1;

        return (<div style={{
            background: this.state.expanded ? "rgba(229, 229, 229, 0.25)" : null,
            padding: this.state.expanded ? "8px 6px" : null,
            borderRadius: this.state.expanded ? "6px" : null,
        }}>
            <div style={{display: "flex", marginBottom: "5px",  ...FONT_SUBHEADER, height: height, lineHeight: height,}}>
                <div style={{flex: 6, paddingRight: "30px",  overflow: "hidden"}}>
                    {!daily && <img style={{marginRight: "10px", width: "40px"}} src={product.image}/>}
                    {product.name}  <span style={{display: hasVariants ? null : "none", cursor: "pointer"}}><i onClick={() => {
                        this.setState({
                            expanded: !this.state.expanded
                        })
                }} className={`fa-solid fa-arrow-${this.state.expanded ? "up" : "down"}`}/></span>
                </div>
                <div style={{flex: 1, paddingRight: "10px", overflow: "hidden"}}>
                    {product.count}
                </div>
                <div style={{flex: 1, paddingRight: "10px", overflow: "hidden"}}>
                    ${convertSales(product.revenue)}
                </div>
                <div style={{flex: 1, overflow: "hidden"}}>
                    {Math.round(product.revenue/ total_sales_raw * 1000)/10}%
                </div>
            </div>
            {this.state.expanded && Object.keys(product.variants || {}).sort((a,b) => (product.variants[b].count -  product.variants[a].count)).map((variant) => {

                let sales_data = product.variants[variant];

                return (<div style={{display: "flex", marginBottom: "5px",  ...FONT_SUBHEADER, height: "20px", lineHeight: "20px",}}>
                    <div style={{flex: 6, paddingRight: "30px",  overflow: "hidden"}}>
                        <div style={{marginRight: "10px", width: "40px", display: "inline-block"}}/>
                        {variant}
                    </div>
                    <div style={{flex: 1, paddingRight: "10px", overflow: "hidden"}}>
                        {sales_data.count}
                    </div>
                    <div style={{flex: 1, paddingRight: "10px", overflow: "hidden"}}>
                        ${convertSales(sales_data.revenue)}
                    </div>
                    <div style={{flex: 1, overflow: "hidden"}}>
                        {Math.round(sales_data.revenue/ ( product.revenue) * 1000)/10}%
                    </div>
                </div>)
            })}
        </div>);
    }

}

export default withApollo(withRouter(injectSheet(Styles)(ProductRow)));

