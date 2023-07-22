import {writable} from 'svelte/store';
import {browser} from "$app/environment"

export const posts = writable([]);
export const limit = writable(20);

export const sort = writable(browser && localStorage.getItem("sort") || "hot")
sort.subscribe((val) => {
  if (browser) return (localStorage.setItem("sort", val))
})

export const pageScroll = writable(0);