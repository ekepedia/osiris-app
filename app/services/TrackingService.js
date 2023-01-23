import React from "react";

import { gql } from 'apollo-boost';

import axios from "axios";
import AuthService from "./AuthService";

let TrackingService = {};

TrackingService.trackEvent = trackEvent;
function trackEvent ({type, page, sub_page, action, value, user_id, custom}) {
    // console.log("tracking event", page, sub_page, action, value);
    try {
        AuthService.getCurrentUserId().then((in_user_id) => {
            axios.post("/api/tracking/v1", {
                "user_id": in_user_id || user_id,
                "type": type,
                "custom_1": "mvp-beta-v3",
                "custom_2": page,
                "custom_3": sub_page,
                "custom_4": action,
                "custom_5": value,
                "custom_6": custom,
                "version": 100,
            }).then((data) => {

            });
        })

    } catch (e) {

    }
}

TrackingService.trackClick = ({type, page, sub_page, value, user_id, custom}) => {
    trackEvent({
        page,
        sub_page,
        action: "click",
        value,
        custom,
        type: type || 2
    })
}

TrackingService.trackSubmit = ({type, page, sub_page, value, user_id, custom}) => {
    trackEvent({
        page,
        sub_page,
        action: "submit",
        value,
        user_id,
        custom,
        type: type || 1
    })
}

export default TrackingService
