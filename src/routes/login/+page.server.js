import {CLIENT_ID, REDIRECT_URI} from '$env/static/private';
import {environment, cookieSecure} from "$lib/config.server.js";

export const load = async({cookies})=>{
   //generate a random reddit state string
   const redditState = Date.now() + Math.floor(Math.random() * (100 - 1 + 1) + 1);
   //set a cookie as we will need to reference the state when the user is redirected back
   cookies.set('redditState', redditState, {secure:cookieSecure[environment], path: '/' });

   return { 
    redditState: redditState,
    client: CLIENT_ID,
    redirect: REDIRECT_URI
   }
}