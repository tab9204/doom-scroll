import {error} from '@sveltejs/kit';
import {json} from '@sveltejs/kit';
import {extract_image_data, extract_video_data, extract_embed_data} from "$lib/utilities.server.js";

export const POST = async ({request,cookies})=>{
    const req = await request.json();
    const token = cookies.get('token');
    try{
        const resp = await fetch(`https://oauth.reddit.com/r/${req.subreddit}/hot?limit=5&after=${req.after}`,{
            method: 'GET',
            headers: new Headers({
                "Authorization": `bearer ${token}`,
            })
        });

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
                link: post.data.url,
                text: post.data?.selftext_html ? post.data.selftext_html : false,
                images: extract_image_data(post,req.screen.width,req.screen.height),
                video: extract_video_data(post),
                embed: extract_embed_data(post),
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