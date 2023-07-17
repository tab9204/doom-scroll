import {writable} from 'svelte/store';
export const after = writable(null);
export const count = writable(0);
export const limit = writable(20);
export const redditPosts = writable([]);
export const sortPostsBy = writable("hot");
export const frontPageScroll = writable(0);