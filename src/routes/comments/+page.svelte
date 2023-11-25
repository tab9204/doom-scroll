<script>
    import {decodeHTML} from "$lib/utilities.js";
    import {error} from '@sveltejs/kit';
    import {page} from '$app/stores';
    import Loading_Icon from "$lib/components/Loading_Icon.svelte";
    import Comment from "$lib/components/Comment.svelte";
    import Post from "$lib/components/Post.svelte";


    const post_id = $page.url.searchParams.get('id');
    
    const getComments = async(id)=>{
        const resp = await fetch("/api/get_post_comments",{
            method: 'POST',
            body: JSON.stringify({
                id:id,
                screen: {width: window.innerWidth, height: window.innerHeight > 384 ? 384 : window.innerHeight}
            }),
            headers: {'content-type': 'application/json'}
        });
        const data = await resp.json();
        const err = data.message;
        if(err){
            throw new error (400,'Could not get comments');
        }
        else{
            return data;
        }

    }
    let post = getComments(post_id);

</script>

{#await post}
	<Loading_Icon></Loading_Icon>
{:then post}
    <Post post={post[0]} forceExpand={true}>
        <div slot="header">
            <h3 class="text-lg">{@html decodeHTML(post[0].title)}</h3>
        </div>
    </Post>
    {#each post[1] as comment}
        <div class="variant-soft-surface rounded p-1 my-2">
            <Comment user={comment[0]} text={comment[1]} replies={comment[2]}></Comment>
        </div>
    {/each}
{:catch error}
	<div class="variant-filled-error text-center">Could not get comments for this post</div>
{/await}