<script>
    import Placeholder from "$lib/components/Placeholder.svelte";

    export let images = [];

    //selected image in gallery
    let selected = 0;

    let options = {root: null,rootMargin: "0px",threshold: 0};

    export const lazyLoadImage = (wrapper,src)=>{
        const image = wrapper.children[1].children[0];
        const placeholder = wrapper.children[0];
        const loaded = ()=>{
            image.style.opacity = "1";
            placeholder.style.opacity = "0";
            observer.unobserve(wrapper);
        }
        let observer = new IntersectionObserver((entries)=>{
            if (entries[0].isIntersecting) {
                image.src = src;
                if(image.complete){
                    loaded();
                }
                else{
                    image.addEventListener('load', loaded);  
                }
            }
        }, options);
        observer.observe(wrapper);
        return {
            destroy() {
                image.removeEventListener('load', loaded); 
            }
        }
    }

    const cycleImages = (node)=>{
        const back = node.children[0];
        const forward = node.children[2];

        back.addEventListener("click",()=>{
            selected = selected <= 0 ? images.length - 1 : selected -= 1;
        })

        forward.addEventListener("click",()=>{
            selected = selected >= images.length - 1 ? 0 : selected += 1;
        })
    }

</script>

{#if images.length > 1}
    <div class="relative max-w-full max-h-96 m-auto">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div id="imageGallery" class="w-full h-full" use:cycleImages>
            <svg class="absolute top-2/4 -translate-y-2/4 left-0 -translate-x-0 bg-tertiary-500/80 rounded-full z-[1]" xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40"><path d="M560.667-240 320-480.667l240.667-240.666L608-674 414.666-480.667 608-287.333 560.667-240Z"/></svg>
            <!-- svelte-ignore a11y-img-redundant-alt -->
            {#each images as image, i}
                {#if i == selected}
                    <div class="image-in-gallery left-2/4 -translate-x-2/4 relative max-w-full max-h-96" style="width:{images[0].width}px; height:{images[0].height}px;" use:lazyLoadImage={image.src}>
                        <Placeholder width={image.width} height={image.height}></Placeholder>
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <a class="outline-none" href={image.src} target="_blank">
                            <img class="relative left-2/4 -translate-x-2/4 max-w-full max-h-96 opacity-0 object-contain ease-linear duration-200" alt="The content of an image post" style="width:{image.width}px; height:{image.height}px;">
                        </a>
                    </div>
                {/if}
            {/each}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <svg class="absolute top-2/4 -translate-y-2/4 left-full -translate-x-full bg-tertiary-500/80 rounded-full z-[1]" xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40"><path d="M521.334-480.667 328-674l47.333-47.333L616-480.667 375.333-240 328-287.333l193.334-193.334Z"/></svg>
        </div>
        <div class="absolute bottom-0 right-0 bg-secondary-500/80 py-[1px] px-[4px]">{selected + 1}/{images.length}</div>
    </div>
{:else}
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <div class="relative max-w-full max-h-96" use:lazyLoadImage={images[0].src}>
        <Placeholder width={images[0].width} height={images[0].height}></Placeholder>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <a class="outline-none" href={images[0].src} target="_blank">
            <img class="relative left-2/4 -translate-x-2/4 max-w-full max-h-96 opacity-0 object-contain ease-linear duration-200" alt="The content of an image post" style="width:{images[0].width}px; height:{images[0].height}px;">
        </a>
    </div>
{/if}