<script>
    import Text_Content from "$lib/components/content_types/Text_Content.svelte";
    import Image_Content from "$lib/components/content_types/Image_Content.svelte";
    import Link_Content from "$lib/components/content_types/Link_Content.svelte";
    import Video_Content from "$lib/components/content_types/Video_Content.svelte";
    import Embedded_Content from "$lib/components/content_types/Embedded_Content.svelte";


    export let post;
    export let forceExpand = false;
</script>

<div id="{post.id}" class="variant-soft-surface mb-5 mt-5 rounded p-2">
    <div class="mb-4">
        <slot name="header"/>
    </div>
    <div class="variant-filled-surface rounded p-2 overflow-hidden relative empty:hidden">
        <!--can't currently display twitch embeds so skip for now-->
        {#if post.embed}
            <Embedded_Content content={post.embed}></Embedded_Content>
        {:else if post.video}
            <Video_Content video={post.video}></Video_Content>
        {:else if post.images.length > 0}
            <Image_Content images={post.images}></Image_Content>
        <!--only show the link if there is no text and the link is not to the post itself-->
        {:else if !post.text && (!post.link.includes("/"+post.id+"/") && !post.link.includes("/comments/"))}
            <Link_Content link={post.link}></Link_Content>
        {/if}
        {#if post.text}
            <Text_Content text={post.text} {forceExpand}></Text_Content>
        {/if}
    </div>
    <div class="mt-3">
        <slot name="footer" />
    </div>
</div>
