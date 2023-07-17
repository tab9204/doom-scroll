<script>
    import {decodeHTML} from "$lib/utilities.js";
    export let text;

    let overflowing = false;
    let fullHeight = 0;
    let collapsed = true;

    const checkOverflow = (node)=>{
        const container = node.offsetHeight;
        const overflow =  node.children[0].offsetHeight;
        if(overflow > container){
            overflowing = true;
            fullHeight = 'max-h-['+overflow+'px]';
        }
    }

    const expandCollapse = ()=>{
        collapsed = !collapsed;
    }
</script>

<div class="transition-all duration-500 ease-linear delay-0 {collapsed ? 'max-h-80' : fullHeight }" use:checkOverflow>
    <div class={overflowing ? "mb-10" : "mb-0"}>
        {@html decodeHTML(text)}
    </div>
    {#if overflowing}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div on:click={expandCollapse} class="absolute bottom-0 left-2/4 -translate-x-2/4 rounded w-full bg-tertiary-500/80 flex justify-center">
            <svg class="transition-all ease-linear delay-0 {!collapsed ? "rotate-180" : "rotate-0"}" xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40"><path d="M480-345 240-585l47.333-47.333L480-438.999l192.667-192.667L720-584.333 480-345Z"/></svg>
        </div>
    {/if}
</div>