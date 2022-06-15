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
        let { classes, client, match: { params }, customer, total_sales_raw, daily } = this.props;

        const convertSales = (sales) => {
            sales = Math.round(sales*100)/100;

            if (sales > 1000000) {
                sales = (Math.round((sales/1000000)*100)/100) + "M"
            } else if (sales > 1000) {
                sales = (Math.round((sales/1000)*10)/10) + "K"
            }
            return sales;
        }

        console.log("CUSTOMER TEMPLATE ROW", customer);

        let height = daily ? "20px" : "20px";
        let hasVariants = true; //customer && customer.products && Object.keys(customer.products).length > 1;

        return (<div style={{
            background: this.state.expanded ? "rgba(229, 229, 229, 0.25)" : null,
            padding: this.state.expanded ? "8px 6px" : null,
            borderRadius: this.state.expanded ? "6px" : null,
        }}>

            <div style={{display: "flex", marginBottom: this.state.expanded ? "10px" : "5px",  ...FONT_SUBHEADER, height: height, lineHeight: height,}}>
                <div style={{flex: 3, paddingRight: "10px", overflow: "hidden"}}>
                    {customer.name}  <span style={{display: hasVariants ? null : "none", cursor: "pointer"}}><i onClick={() => {
                    this.setState({
                        expanded: !this.state.expanded
                    })
                }} className={`fa-solid fa-arrow-${this.state.expanded ? "up" : "down"}`}/></span>
                </div>
                <div style={{flex: 3, paddingRight: "20px", overflow: "hidden"}}>
                    {customer.email}
                </div>
                <div style={{flex: 1, paddingRight: "10px", overflow: "hidden"}}>
                    {customer.count}
                </div>
                <div style={{flex: 1, paddingRight: "10px", overflow: "hidden"}}>
                    ${convertSales(customer.revenue)}
                </div>
                <div style={{flex: 1, overflow: "hidden"}}>
                    {Math.round(customer.revenue/ total_sales_raw * 1000)/10}%
                </div>
            </div>


            {this.state.expanded && Object.keys(customer.products || {}).sort((a,b) => (customer.products[b].revenue -  customer.products[a].revenue)).map((product) => {

                let sales_data = customer.products[product];

                return (<div style={{display: "flex", marginBottom: "5px",  ...FONT_SUBHEADER, height: "20px", lineHeight: "20px",}}>
                    <div style={{flex: 6, paddingRight: "30px",  overflow: "hidden"}}>
                        <div style={{marginRight: "10px", width: "40px", display: "inline-block"}}/>
                        {product}
                    </div>
                    <div style={{flex: 1, paddingRight: "10px", overflow: "hidden"}}>
                        {sales_data.count}
                    </div>
                    <div style={{flex: 1, paddingRight: "10px", overflow: "hidden"}}>
                        ${convertSales(sales_data.revenue)}
                    </div>
                    <div style={{flex: 1, overflow: "hidden"}}>
                        {Math.round(sales_data.revenue/ ( customer.revenue) * 1000)/10}%
                    </div>
                </div>)
            })}
        </div>);
    }

}

export default withApollo(withRouter(injectSheet(Styles)(ProductRow)));

