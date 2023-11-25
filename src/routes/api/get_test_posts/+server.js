import {error} from '@sveltejs/kit';
import {json} from '@sveltejs/kit';
import {extract_image_data, extract_video_data, extract_embed_data} from "$lib/utilities.server.js";

export const POST = async ({request,cookies})=>{
    const req = await request.json();
    try{
        const posts = await get_test_data();

        let data = {
            raw: posts.raw,//just for testing
            after: posts.after,
            posts: []
        }

        posts.all.forEach(post => {
            const post_data = {
                id: post.data.id,
                subreddit: post.data.subreddit,
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
            
        });
        return json(data);
    }
    catch(err){
        console.log(err);
        throw new error (400,'Could not get posts');
    }

}


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
