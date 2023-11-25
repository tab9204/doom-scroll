import {error} from '@sveltejs/kit';
import {json} from '@sveltejs/kit';
import {extract_image_data, extract_video_data, extract_embed_data} from "$lib/utilities.server.js";

export const POST = async ({request})=>{
    const req = await request.json();
    try{
        const resp = await fetch(`https://www.reddit.com/r/${req.subreddit}/hot.json?limit=5&after=${req.after}`,{method: 'GET'});

        const posts = await resp.json();

        let data = {
            after: posts.data.after,
            posts: []
        }
        posts.data.children.forEach((post)=>{
            const post_data = {
                subreddit: post.data.subreddit,
                id: post.data.id,
                title: post.data.title,
                post_type: post.data?.post_hint ? post.data.post_hint : false,
                images: post.data?.media_metadata || post.data?.preview ? extract_image_data(post,req.screen.width,req.screen.height) : [],
                link: post.data.url,
                text: post.data?.selftext_html ? post.data.selftext_html : false,
                video: post.data?.secure_media?.reddit_video ? extract_video_data(post.data.secure_media.reddit_video) : false,
                embed: post.data?.secure_media_embed?.media_domain_url ? extract_embed_data(post.data.secure_media_embed) : false,
                nsfw: post.data.over_18,
                num_comments: post?.data.num_comments ? post.data.num_comments : 0
            }
            data.posts.push(post_data);
        })
        return json(data);
    }
    catch(e){
        console.log(e);
        throw new error (400,'Could not get subreddit posts');
    }
}