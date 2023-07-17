<script>
    import {decodeHTML} from "$lib/utilities.js";
    import Text_Post from "$lib/components/Text_Post.svelte";
    import Image_Post from "$lib/components/Image_Post.svelte";
    import Link_Post from "$lib/components/Link_Post.svelte";
    import Reddit_Video_Post from "$lib/components/Reddit_Video_Post.svelte";
    import Embedded_Post from "$lib/components/Embedded_Post.svelte";


    export let post;

    
</script>

<div id="{post.id}" class="variant-soft-surface mb-5 mt-5 rounded p-2">
    <div class="mb-4">
        <div class="text-sm">r/{post.subreddit}</div>
        <h3 class="text-lg">{@html decodeHTML(post.title)}</h3>
    </div>
    <div class="mb-3 variant-filled-secondary rounded p-2 overflow-hidden relative">
        {#if post.post_type == "image"}
            <Image_Post images={post.images}></Image_Post>
        {:else if post.post_type == "link"}
            <Link_Post link={post.link}></Link_Post> 
        {:else if post.post_type == "hosted:video"}
            <Reddit_Video_Post video={post.video}></Reddit_Video_Post>
        {:else if post.post_type == "rich:video"}
            <Embedded_Post content={post.embed}></Embedded_Post>
        {/if}
        {#if post.text}
            <Text_Post text={post.text}></Text_Post>
        {/if}
    </div>
    <div>
        {#if post.num_comments > 0}
            <a href="./comments?id={post.id}">{post.num_comments} Comments</a>
        {/if}
    </div>
</div>
