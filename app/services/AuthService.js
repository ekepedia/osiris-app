import React from "react";

import { gql } from 'apollo-boost';

import axios from "axios";
import UserService from "./UserService";
import ApolloService from "./ApolloService";
import EventService from './EventService'

const { client } = ApolloService;

let AuthService = {};

let current_user = null;
let current_user_id = null;


EventService.on(EventService.events.LOGIN, (payload) => {
    return new Promise((resolve, reject) => {
       console.log(payload);
    })
})

init();

AuthService.getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        resolve(current_user);
    })
}

AuthService.getCurrentUserId = () => {
    return new Promise((resolve, reject) => {
        resolve(current_user_id);
    })
}

AuthService.getCurrentUserIdSync = () => {
    return current_user_id;
}

AuthService.setCurrentUser = ({user, user_id}) => {
    if (user) {
        current_user = user;

        if (!user_id) {
            current_user_id = user.user_id;
        }
    }

    if (user_id) {
        current_user_id = user_id;

        if (!user) {
            reloadCurrentUser().then((user) => {
                current_user = user;
                localStorage.current_user = JSON.stringify(current_user);
                EventService.emit(EventService.events.UPDATE_USER, user);
                updateIntercomObject();
            })
        }
    }

    localStorage.current_user = JSON.stringify(current_user);
    localStorage.current_user_id = JSON.stringify(current_user_id);
    EventService.emit(EventService.events.UPDATE_USER, user);
    updateIntercomObject();
}

AuthService.reloadCurrentUser = reloadCurrentUser;

function reloadCurrentUser() {
    return new Promise((resolve, reject) => {

        if (!current_user_id) {
            return resolve(null);
        }

        UserService.getUser({client, user_id: current_user_id + ""}).then((user) => {
            console.log("Reloaded Current User", user);
            AuthService.setCurrentUser({user});
            resolve(user);
        });

    })
}

AuthService.logoutUser = logoutUser;

function logoutUser() {
    current_user = null;
    current_user_id = null;
    localStorage.current_user = null;
    localStorage.current_user_id = null;
}

function updateIntercomObject() {
    if (window && current_user) {
        window.intercomSettings = window.intercomSettings || {};
        window.intercomSettings.name = `${current_user.first_name} ${current_user.last_name}`;
        window.intercomSettings.email = current_user.username;
        window.intercomSettings.created_at = current_user.created_at;

        (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/lcoc53ye';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();

    }
}

function init () {
    let current_user_string = localStorage.current_user;
    let current_user_id_string = localStorage.current_user_id;

    if (current_user_string && current_user_string !== "undefined") {
        current_user = JSON.parse(current_user_string)
    }

    if (current_user_id_string && current_user_id_string !== "undefined") {
        current_user_id = JSON.parse(current_user_id_string)
    }

    console.log("INIT Auth Service:", current_user_id, current_user);
    reloadCurrentUser().then();

    console.log("abote to meit!");

    console.log(window);

    updateIntercomObject();
}



export default AuthService
