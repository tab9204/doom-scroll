<script>
    import {decodeHTML} from "$lib/utilities.js";
    export let user;
    export let text;
    export let replies;
    
</script>

<!--Todo: The final comment in a chain is showing as undefined-->
<div class="m-2 border-l border-tertiary-500">
    <div class="ml-1">
        <div class="font-semibold text-xs">u/{user}</div>
        <div>{@html decodeHTML(text)}</div>
    </div>
    {#if replies.length > 0}
        {#each replies as reply}
            {#if reply[0] !== null}
                <svelte:self user={reply[0]} text={reply[1]} replies={reply[2]}/>
            {/if}
        {/each}
    {/if}
</div>