<script>
    import Image_Content from "$lib/components/content_types/Image_Content.svelte";
    import Video_Content from "$lib/components/content_types/Video_Content.svelte";
    import Embedded_Content from "$lib/components/content_types/Embedded_Content.svelte";

    export let post;
</script>

<!--Video and embedded content is mutually exclusive-->
{#if post.embed}
    <Embedded_Content content={post.embed}></Embedded_Content>
{:else if post.video}
    <Video_Content video={post.video}></Video_Content>
{/if}

{#if post.images.length > 0}
    <Image_Content images={post.images}></Image_Content>
{/if}