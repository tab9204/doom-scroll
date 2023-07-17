<script>
    import {error} from '@sveltejs/kit';
    import { page } from '$app/stores'
    import Loading_Icon from "$lib/components/Loading_Icon.svelte";
    import Comment from "$lib/components/Comment.svelte";


    const post_id = $page.url.searchParams.get('id');


    const getComments = async(id)=>{
        const resp = await fetch("/api/get_post_comments",{
            method: 'POST',
            body: JSON.stringify({id}),
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
    let comments = getComments(post_id);

</script>

{#await comments}
	<Loading_Icon></Loading_Icon>
{:then comments}
	{#each comments as comment}
        <div class="variant-soft-surface m-2 p-1">
            <Comment user={comment[0]} text={comment[1]} replies={comment[2]}></Comment>
        </div>
    {/each}
{:catch error}
	<div class="variant-filled-error text-center">Could not get comments for this post</div>
{/await}