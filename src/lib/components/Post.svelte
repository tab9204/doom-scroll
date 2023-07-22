<script>
    import {decodeHTML} from "$lib/utilities.js";
    import Text_Content from "$lib/components/Text_Content.svelte";
    import Image_Content from "$lib/components/Image_Content.svelte";
    import Link_Content from "$lib/components/Link_Content.svelte";
    import Video_Content from "$lib/components/Video_Content.svelte";
    import Embedded_Content from "$lib/components/Embedded_Content.svelte";
    import Generic_content from  "$lib/components/Generic_content.svelte";


    export let post;

    
</script>

<div id="{post.id}" class="variant-soft-surface mb-5 mt-5 rounded p-2">
    <div class="mb-4">
        <div class="text-sm">r/{post.subreddit}</div>
        <h3 class="text-lg">{@html decodeHTML(post.title)}</h3>
    </div>
    <div class="variant-filled-secondary rounded p-2 overflow-hidden relative empty:p-0">
        {#if post.post_type == "image"}
            <Image_Content images={post.images}></Image_Content>
        {:else if post.post_type == "link"}
            <Link_Content link={post.link}></Link_Content> 
        {:else if post.post_type == "hosted:video"}
            <Video_Content video={post.video}></Video_Content>
        {:else if post.post_type == "rich:video"}
            <Embedded_Content content={post.embed}></Embedded_Content>
        {:else if !post.post_type}
            <Generic_content post={post}></Generic_content>
        {/if}
        {#if post.text}
            <Text_Content text={post.text}></Text_Content>
        {/if}
    </div>
    <div class="mt-3">
        {#if post.num_comments > 0}
            <a href="./comments?id={post.id}">{post.num_comments} Comments</a>
        {/if}
    </div>
</div>
