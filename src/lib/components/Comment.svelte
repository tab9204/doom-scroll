<script>
    import {decodeHTML} from "$lib/utilities.js";
    import {onMount} from 'svelte';
    export let user;
    export let text;
    export let replies;
    export let is_op;
    export let profiles;

    let profilePicture;

    //array => profile image urls
    const selectProfilePicture = ()=>{
        const selected = Math.floor(Math.random() * profiles.length );

        profilePicture = profiles[selected];
    }

    onMount(async () => {
		selectProfilePicture();
	});

    
</script>


<div class="font-semibold text-xs flex leading-[26px]">
    {#if is_op == true}
        <img class="mr-1 ml-1 w-[32px] h-[32px]" src="/profiles/jake-profile.png" alt="User icon">
    {:else}
        <img class="mr-1 ml-1 w-[32px] h-[32px]" src={profilePicture} alt="User icon">
    {/if}
    u/{user}
</div>
<div class="m-2 border-l border-tertiary-500">
    <div class="ml-2">
        <div>{@html decodeHTML(text)}</div>
    </div>
    {#if replies.length > 0}
        {#each replies as reply}
            {#if reply[0] !== null}
                <svelte:self user={reply[0]} text={reply[1]} replies={reply[2]} is_op={reply[3]} profiles={profiles}/>
            {/if}
        {/each}
    {/if}
</div>