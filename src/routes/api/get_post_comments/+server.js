import {error} from '@sveltejs/kit';
import {json} from '@sveltejs/kit';
import {extract_image_data, extract_video_data, extract_embed_data} from "$lib/utilities.server.js";


export const POST = async ({request,cookies})=>{
    const req = await request.json();
    const token = cookies.get('token');
    try{
        const resp = await fetch(`https://oauth.reddit.com/comments/${req.id}?sort=best`,{
        method: 'GET',
        headers: new Headers({
            "Authorization": `bearer ${token}`,
        })
    });

    const post = await resp.json();
    
    const comments = post[1].data.children;
    const content = post[0].data.children[0];
    //return both the content and comments of the post
    let data = [
        //post content data object
        {
            title: content.data.title,
            post_type: content.data?.post_hint ? content.data.post_hint : false,
            link: content.data.url,
            text: content.data?.selftext_html ? content.data.selftext_html : false,
            images: extract_image_data(content,req.screen.width,req.screen.height),
            video: extract_video_data(content),
            embed: extract_embed_data(content)
        },
        //post comment array
        []
    ]

    comments.forEach((comment)=>{
        extract_comments(comment,data[1]);
    })
    return json(data);
    }
    catch(err){
        console.log(err);
        throw new error (400,'Could not get comments');
    }

}

//builds a comment chain array to return to the client 
const extract_comments = (comment,array)=>{
    //comment.data.is_submitter => OP
    array.push([comment.data.author,comment.data.body_html, [], comment.data?.is_submitter ? comment.data.is_submitter : false]);
    if(comment.data.replies != "" && comment.data?.replies?.data?.children.length >= 1){
        comment.data.replies.data.children.forEach((reply)=>{
            extract_comments(reply,array[array.length-1][2])
        });
    }
}