<script>
	import 'video.js/dist/video-js.css';
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';
	import {AppShell, AppBar, drawerStore} from '@skeletonlabs/skeleton';
	import {page} from '$app/stores';

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<AppShell regionPage="relative hide-scrollbar" slotPageHeader="fixed w-full top-0 z-10" slotPageContent="mt-[56px]">
	<svelte:fragment slot="pageHeader">
		<AppBar background="bg-primary-500" shadow="drop-shadow-lg" padding="p-2" class="z-50 h-19">	
			{#if $page.url.pathname == "/"}
				<div on:click={()=>{
					if($drawerStore.open){
						drawerStore.close();	
					}
					else{
						drawerStore.open();
					}
				}}>
					<svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40"><path d="M120-240v-66.666h720V-240H120Zm0-206.667v-66.666h720v66.666H120Zm0-206.667V-720h720v66.666H120Z"/></svg>
				</div>
			{:else if $page.url.pathname.includes("/comments")}
				<a href="/">
					<svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40"><path d="M560.667-240 320-480.667l240.667-240.666L608-674 414.666-480.667 608-287.333 560.667-240Z"/></svg>
				</a>
			{/if}
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>

