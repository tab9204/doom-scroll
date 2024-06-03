import { CLIENT_SECRET, CLIENT_ID} from '$env/static/private';
import {environment, cookieSecure} from "$lib/config.server.js";

export const handle = async ({event,resolve}) =>{
    //oauth token refresh 
    const refresh = event.cookies.get("refresh");

    //no refresh so user needs to log in
    if(!refresh){
        if(event.url.pathname !== "/login" && event.url.pathname !== "/authorize"){
            return new Response(null, { status: 303, headers: { location: '/login' } });
        }
    }
    else if(refresh){
        //if this is an api call make sure the oauth token is up to date
        if(event.url.pathname.includes("/api")){
            if(!event.cookies.get('token')){
                const token = await get_new_token(refresh,CLIENT_ID,CLIENT_SECRET);
                console.log("New token");
                //store the token as a cookie 
                event.cookies.set('token', token, {secure:cookieSecure[environment], path: '/', maxAge:  3600});
            }
        }
        //we dont want the user going back to the login or authorize pages if they are already logged in
        else if(event.url.pathname == "/login" && event.url.pathname == "/authorize"){
            return new Response(null, {status: 303, headers: { location: '/' } }); 
        }
    }
    
    const response = await resolve(event);
    return response;
}

//use refresh token to get new auth token 
const get_new_token = async(refresh,client,secret)=>{
    //data must be set as form data, idk reddit moment
    var form = new FormData();
    form.append('grant_type', "refresh_token");
    form.append('refresh_token', refresh);

    const resp = await fetch("https://www.reddit.com/api/v1/access_token",{
        method: 'POST',
        body: new URLSearchParams(form),
        headers: new Headers({
            "Authorization": "Basic " + btoa(client + ":" + secret),
            'User-Agent': "doomscroll-V1-tab",
            'Content-Type': "application/x-www-form-urlencoded"
            })
    });
    const data = await resp.json();
    return data.access_token;
}