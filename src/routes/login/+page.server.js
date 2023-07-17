import {REDIRECT_URI} from '$env/static/private';

export const load = async({cookies})=>{
   //generate a random reddit state string
   const redditState = Date.now() + Math.floor(Math.random() * (100 - 1 + 1) + 1);
   //set a cookie as we will need to reference the state when the user is redirected back
   cookies.set('redditState', redditState, {secure:false, path: '/' });

   return { 
    redditState: redditState,
    redirect: REDIRECT_URI
   }
}