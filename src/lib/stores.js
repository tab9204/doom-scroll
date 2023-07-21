import {writable} from 'svelte/store';
import {browser} from "$app/environment"

export const redditPosts = writable([]);
export const after = writable(null);
export const limit = writable(20);

export const sortPostsBy = writable(browser && localStorage.getItem("sort") || "hot")
sortPostsBy.subscribe((val) => {
  if (browser) return (localStorage.setItem("sort", val))
})

export const frontPageScroll = writable(0);

export const postsScrolledPast = writable(0);