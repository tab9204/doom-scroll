<script>
    import {decodeHTML} from "$lib/utilities.js";
    import Text_Content from "$lib/components/content_types/Text_Content.svelte";
    import Image_Content from "$lib/components/content_types/Image_Content.svelte";
    import Link_Content from "$lib/components/content_types/Link_Content.svelte";
    import Video_Content from "$lib/components/content_types/Video_Content.svelte";
    import Embedded_Content from "$lib/components/content_types/Embedded_Content.svelte";
    import Generic_Content from  "$lib/components/content_types/Generic_Content.svelte";


    export let post;

    
</script>

<div id="{post.id}" class="variant-soft-surface mb-5 mt-5 rounded p-2">
    <div class="mb-4">
        <div class="text-sm">r/{post.subreddit}</div>
        <h3 class="text-lg">{@html decodeHTML(post.title)}</h3>
    </div>
    <div class="variant-filled-secondary rounded p-2 overflow-hidden relative empty:hidden">
        {#if post.post_type == "image"}
            <Image_Content images={post.images}></Image_Content>
        {:else if post.post_type == "link"}
            <Link_Content link={post.link}></Link_Content> 
        {:else if post.post_type == "hosted:video"}
            <Video_Content video={post.video}></Video_Content>
        {:else if post.post_type == "rich:video"}
            <Embedded_Content content={post.embed}></Embedded_Content>
        {:else if !post.post_type}
            <Generic_Content post={post}></Generic_Content>
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
