import {redirect} from '@sveltejs/kit';
import {CLIENT_SECRET, CLIENT_ID, REDIRECT_URI} from '$env/static/private';
import {environment, cookieSecure} from "$lib/config.server.js";

export const load = async({cookies,url})=>{
    const redditState = cookies.get('redditState');
    const error = url.searchParams.get("error") || false;
    //exchange for bearer token 
    const code = url.searchParams.get("code");
    const returnedState = url.searchParams.get("state");

    if(!error && returnedState == redditState){
        //reddit expects form data not json
        var form = new FormData();
        form.append('code', code)
        form.append('grant_type', "authorization_code");
        form.append('redirect_uri', REDIRECT_URI);

        //make a post request for the bearer and refresh token 
        const resp = await fetch("https://www.reddit.com/api/v1/access_token",{
            method: 'POST',
            body: new URLSearchParams(form),
            headers: new Headers({
                "Authorization": "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
                'User-Agent': "doomscroll-V1-tab",
                'Content-Type': "application/x-www-form-urlencoded"
              })
        });
        const respData = await resp.json();
        //save the refresh token in a cookie
        cookies.set('refresh', respData.refresh_token, {secure:cookieSecure[environment], path: '/', maxAge:  7776000});
        throw redirect(303,"/");

    }
    else{
        //if theres an error just send the user back to the login screen
        throw redirect(303,"/login")
    }
}