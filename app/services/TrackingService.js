import React from "react";

import { gql } from 'apollo-boost';

import axios from "axios";

let TrackingService = {};

TrackingService.trackEvent = trackEvent;
function trackEvent ({page, sub_page, action, value}) {
    // console.log("tracking event", page, sub_page, action, value);
    try {
        axios.post("/api/tracking/v1", {
            "user_id": localStorage.user_id,
            "type": 10,
            "custom_1": "mvp-beta",
            "custom_2": page,
            "custom_3": sub_page,
            "custom_4": action,
            "custom_5": value,
            "version": 10,
        }).then((data) => {

        });
    } catch (e) {

    }
}

TrackingService.trackClick = ({page, sub_page, value}) => {
    trackEvent({
        page,
        sub_page,
        action: "click",
        value
    })
}

TrackingService.trackSubmit = ({page, sub_page, value}) => {
    trackEvent({
        page,
        sub_page,
        action: "submit",
        value
    })
}

export default TrackingService
