<script>
    import Image_Content from "$lib/components/Image_Content.svelte";
    import Video_Content from "$lib/components/Video_Content.svelte";
    import Embedded_Content from "$lib/components/Embedded_Content.svelte";

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