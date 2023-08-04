import {error} from '@sveltejs/kit';
import {json} from '@sveltejs/kit';
import {environment, cookieSecure} from "$lib/config.server.js";



export const POST = async ({request,cookies})=>{
    const req = await request.json();
    try{
        //get the oauth token
        const token = cookies.get('token');
        //configure which page of posts should be shown 
        let after;
        if(cookies.get('saveListing')){
            after = !req.after ? cookies.get('after') : "t3_"+req.after;
        }
        else{
            //set the save listing cookie
            cookies.set('saveListing', true, {secure:cookieSecure[environment], path: '/', maxAge:  28800});
            //reset the after cookie to null 
            cookies.set('after', null, {secure:cookieSecure[environment], path: '/', maxAge:  86400});
            //for after to be null
            after = null;
        }
        //use the new token to get the user's frontpage 
        const posts = await get_front_page(token,after,req.count,req.limit,req.sort);
       // const posts = await get_test_data();
        if(req.count > 0){
            cookies.set('after', posts.after, {secure:cookieSecure[environment], path: '/', maxAge:  86400});
        }

        let data = {
            raw: posts.raw,//just for testing
            after: posts.after,
            posts: []
        }

        posts.all.forEach(post => {
            const duplicate = req.ids.indexOf(post.data.id) > 0 ? true : false;
            if(!duplicate){
                const post_data = {
                    id: post.data.id,
                    subreddit: post.data.subreddit,
                    title: post.data.title,
                    post_type: post.data?.post_hint ? post.data.post_hint : false,
                    images: post.data?.media_metadata || post.data?.preview ? extract_image_data(post) : [],
                    link: post.data.url,
                    text: post.data?.selftext_html ? post.data.selftext_html : false,
                    video: post.data?.secure_media?.reddit_video ? extract_video_data(post.data.secure_media.reddit_video) : false,
                    embed: post.data?.secure_media_embed?.media_domain_url ? extract_embed_data(post.data.secure_media_embed) : false,
                    nsfw: post.data.over_18,
                    num_comments: post?.data.num_comments ? post.data.num_comments : 0
                }
                data.posts.push(post_data);
            }
        });
        return json(data);
    }
    catch(err){
        console.log(err);
        throw new error (400,'Could not get posts');
    }

}


//uses an auth token to return posts on a users front page 
const get_front_page = async(token,after,count,limit,sort)=>{
    //`https://oauth.reddit.com/${sort}/.json?limit=${limit}&after=${after}&count=${count}`
    const resp = await fetch(`https://oauth.reddit.com/${sort}/.json?limit=${limit}&after=${after}`,{
        method: 'GET',
        headers: new Headers({
            "Authorization": `bearer ${token}`,
        })
    });

    const front_page = await resp.json();
    const posts = {
        after: front_page.data.after,
        before: front_page.data.before,
        all: front_page.data.children,
        raw: front_page//for testing
    }
    return posts;
}


//post => reddit post data
const extract_image_data = (post)=>{
    let images = [];
    //metadata means the post contains a gallery of images
    if(post.data?.media_metadata){
        const metadata = post.data.media_metadata;
        for (const media in metadata) {
            try{
                const media_id = metadata[media]["id"];
                const file_type = metadata[media]?.["m"].substring(metadata[media]["m"].indexOf("/") + 1);
                const media_url = `https://i.redd.it/${media_id}.${file_type}`;
                const x = metadata[media]["s"]["x"];
                const y = metadata[media]["s"]["y"];
                images.push({src:media_url,width:x,height:y});
            }
            catch(e){
                console.log(e)
                //just skip the image if we encountered an error 
                continue;
            }
        }
    }
    else if(post.data?.preview && post.data?.post_hint == "image" ){
        const media_url = post.data.url;
        const x = post.data?.preview?.images[0]?.source?.width;
        const y = post.data?.preview?.images[0]?.source?.height;
        images.push({src:media_url,width:x,height:y});
    }
    return images;
}

const extract_video_data = (video)=>{
    const url = video.fallback_url;
    const height = video.height;
    const width = video.width;
    const audio = video.fallback_url.match(new RegExp(/\/([^/]+)\/DASH_/));
    const hls = video.hls_url;
    const data = {
        url:url,
        audio: `https://v.redd.it/${audio[1]}/DASH_audio.mp4`,
        height:height,
        width:width,
        hls: hls
    }
    return data;
}

const extract_embed_data = (embed)=>{
    const url = embed.media_domain_url;
    const width = embed.width;
    const height = embed.height;
    const iframe = embed.content;
    const data = {
        url:url,
        height:height,
        width:width,
        iframe:iframe
    }
    return data;
}


//testing purposes only
const get_test_data = async()=>{
    //https://oauth.reddit.com/hot/.json? font page with sorting hot/new/best
    const resp = await fetch(`http://localhost:5173/dummy.json`,{
        method: 'GET'
    });

    const front_page = await resp.json();
    const posts = {
        after: front_page.data.after,
        all: front_page.data.children
    }
    return posts;
}