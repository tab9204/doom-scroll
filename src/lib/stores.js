import {writable} from 'svelte/store';
import {browser} from "$app/environment"

export const frontPage = writable([]);
export const limit = writable(20);
export const maxLength = writable(100);

export const seen = writable(browser && JSON.parse(sessionStorage.getItem("seen")) || []);
seen.subscribe((val) => {
  if (browser) return (sessionStorage.setItem("seen", JSON.stringify(val)))
})

export const sort = writable(browser && localStorage.getItem("sort") || "hot")
sort.subscribe((val) => {
  if (browser) return (localStorage.setItem("sort", val))
})

export const pageScroll = writable(null);