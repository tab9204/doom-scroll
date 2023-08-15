import {writable} from 'svelte/store';
import {browser} from "$app/environment"

export const frontPage = writable([]);
export const limit = writable(20);
export const maxLength = writable(100);

export const seen = writable(browser && JSON.parse(localStorage.getItem("seen")) || []);
seen.subscribe((val) => {
  try{
    if (browser) return (localStorage.setItem("seen", JSON.stringify(val)))
  }
  catch(e){
    if(e == "QuotaExceededError"){
      if(browser){
        localStorage.removeItem("seen");
        return [];
      }
    }
  }
})

export const sort = writable(browser && localStorage.getItem("sort") || "hot")
sort.subscribe((val) => {
  if (browser) return (localStorage.setItem("sort", val))
})

export const pageScroll = writable(null);