<script>
    import Placeholder from "$lib/components/Placeholder.svelte";
    export let images = [];

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

    const cycleImages = (direction)=>{
        const images = document.querySelector("#imageGallery").children;
        let currImage;
        for (var i = 0; i <= images.length - 1; i++) {
            if(!images[i].classList.contains("hidden")){
                currImage = i;
            }
        }
        const nextImage = currImage + direction < 0 ? images.length - 1 : currImage + direction > images.length - 1 ? 0 : currImage + direction;
        document.querySelector(".image-in-gallery:not(.hidden)").classList.add("hidden");
        document.querySelector("#imageGallery").children[nextImage].classList.remove("hidden");
    }

</script>

{#if images.length > 1}
    <div class="relative max-w-full max-h-96 m-auto" style="width:{images[0].width}px; height:{images[0].height}px;">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <svg class="absolute top-2/4 -translate-y-2/4 left-0 -translate-x-0 bg-tertiary-500/80 rounded-full z-[1]" on:click={(e)=>{cycleImages(-1)}} xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40"><path d="M560.667-240 320-480.667l240.667-240.666L608-674 414.666-480.667 608-287.333 560.667-240Z"/></svg>
        <div id="imageGallery" class="w-full h-full">
            {#each images as image, i}
                <!-- svelte-ignore a11y-img-redundant-alt -->
                <div class="image-in-gallery top-2/4 -translate-y-2/4 relative max-w-full max-h-96 {i > 0 ? 'hidden' : '' }" use:lazyLoadImage={image.src}>
                    <Placeholder width={image.width} height={image.height}></Placeholder>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <a class="outline-none" href={image.src} target="_blank">
                        <img class="relative left-2/4 -translate-x-2/4 max-w-full max-h-96 opacity-0 object-contain ease-linear duration-200" alt="The content of an image post" style="width:{image.width}px; height:{image.height}px;">
                    </a>
                </div>
            {/each}
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <svg class="absolute top-2/4 -translate-y-2/4 left-full -translate-x-full bg-tertiary-500/80 rounded-full z-[1]" on:click={(e)=>{cycleImages(1)}} xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40"><path d="M521.334-480.667 328-674l47.333-47.333L616-480.667 375.333-240 328-287.333l193.334-193.334Z"/></svg>
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