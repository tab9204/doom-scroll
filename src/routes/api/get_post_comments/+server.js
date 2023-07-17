import {error} from '@sveltejs/kit';
import {json} from '@sveltejs/kit';


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

    const data = await resp.json();
    const comments = data[1].data.children;

    let just_the_comments = [];
    comments.forEach((comment)=>{
        extract_comments(comment,just_the_comments);
    })
    return json(just_the_comments);
    }
    catch(err){
        console.log(err);
        throw new error (400,'Could not get comments');
    }

}

//builds a comment chain array to return to the client 
const extract_comments = (comment,array)=>{
    array.push([comment.data.author,comment.data.body_html,[]]);
    if(comment.data.replies != "" && comment.data?.replies?.data?.children.length >= 1){
        comment.data.replies.data.children.forEach((reply)=>{
            extract_comments(reply,array[array.length-1][2])
        });
    }
}