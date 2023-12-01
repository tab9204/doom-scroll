<script>
    import {onMount} from "svelte";
    import Placeholder from "$lib/components/Placeholder.svelte";
    

    export let images = [];

    //selected image in gallery
    let selected = 0;

    let options = {root: null,rootMargin: "0px",threshold: 0};

    let galleryWidth = 0;
    let galleryHeight = 0;

    onMount(()=>{
        //set the gallery height to the largest image in the gallery 
        //keeps the height consistent as the user scrolls the images
        if(images.length > 1){
            images.forEach((image)=>{
                if(image.height > galleryHeight){
                    galleryHeight = image.height;
                    galleryWidth = image.width;
                }
            })
        }
    })

    export const lazyLoadImage = (wrapper,src)=>{
        const image = wrapper.children[1];
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
                    //remove the transition animation if the image is already downloaded 
                    image.style.transitionDuration = "0s";
                    image.style.opacity = "1";
                    placeholder.style.opacity = "0";
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
                observer.unobserve(wrapper);
            }
        }
    }

    const addEvents = async (node)=>{
        //hammer.js import 
        //client only library must be imported in the client
        const module = await import('hammerjs');
        const Hammer = module.default;  

        const image = node.children[1];

        const manager = new Hammer.Manager(image,{
            recognizers: [
                [Hammer.Tap, {taps: 2}]
            ]  
        });

        const expand = ()=>{
            window.open(images[selected].big, "_blank");
        }

        manager.on("tap",expand);

        return {
            destroy() {
                Hammer(manager).off("tap");
            }
        };
    }

    const addGalleryEvents = async (node)=>{
        const back = node.children[0];
        const forward = node.children[2];
        //hammer.js import 
        //client only library must be imported in the client
        const module = await import('hammerjs');
		const Hammer = module.default;

        const manager = new Hammer.Manager(node,{
            recognizers: [
                [Hammer.Swipe, {direction: Hammer.DIRECTION_HORIZONTAL}],
                [Hammer.Tap, {taps: 2}]
            ]  
        });

        const next = ()=>{
            selected = selected >= images.length - 1 ? 0 : selected += 1;
        }
        
        const prev = ()=>{
            selected = selected <= 0 ? images.length - 1 : selected -= 1;
        }

        const expand = ()=>{
            window.open(images[selected].big, "_blank");
        }

        manager.on("swipeleft", next);

        manager.on("swiperight", prev);

        manager.on("tap",expand);

        back.addEventListener("click", prev);

        forward.addEventListener("click", next);

        return {
            destroy() {
                back.removeEventListener('click', prev);
                forward.removeEventListener('click', next);
                Hammer(manager).off("swipeleft");
                Hammer(manager).off("swiperight");
                Hammer(manager).off("tap");
            }
        };
    }

</script>

{#if images.length > 1}
<!--Image Gallery-->
    <div class="relative max-w-full max-h-96 m-auto">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="w-full h-full" use:addGalleryEvents>
            <!--Gallery Nav Arrow-->
            <svg class="hidden md:block absolute top-2/4 -translate-y-2/4 left-0 -translate-x-0 bg-tertiary-500/50 rounded ml-[-8px] z-[1]" xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40"><path d="M560.667-240 320-480.667l240.667-240.666L608-674 414.666-480.667 608-287.333 560.667-240Z"/></svg>
            <!-- svelte-ignore a11y-img-redundant-alt -->
            {#each images as image, i}
                {#if i == selected}
                    <div class="image-in-gallery left-2/4 -translate-x-2/4 relative max-w-full max-h-96" style="width:{galleryWidth}px; height:{galleryHeight}px;" use:lazyLoadImage={image.src}>
                        <Placeholder width={image.width} height={image.height}></Placeholder>
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <img class="relative left-2/4 -translate-x-2/4 max-w-full max-h-96 opacity-0 object-contain ease-linear duration-700" alt="The content of an image post" style="width:{image.width}px; height:{image.height}px;">
                    </div>
                {/if}
            {/each}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!--Gallery Nav Arrow-->
            <svg class="hidden md:block absolute top-2/4 -translate-y-2/4 left-full -translate-x-full bg-tertiary-500/50 ml-[8px] rounded z-[1]" xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40"><path d="M521.334-480.667 328-674l47.333-47.333L616-480.667 375.333-240 328-287.333l193.334-193.334Z"/></svg>
        </div>
        <div class="absolute bottom-0 right-0 bg-surface-500/80 py-[1px] px-[4px]">{selected + 1}/{images.length}</div>
    </div>
{:else}
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <div class="relative max-w-full max-h-96" use:lazyLoadImage={decodeURI(images[0].src)} use:addEvents>
        <Placeholder width={images[0].width} height={images[0].height}></Placeholder>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <img class="relative left-2/4 -translate-x-2/4 max-w-full max-h-96 opacity-0 object-contain ease-linear duration-500" alt="The content of an image post" style="width:{images[0].width}px; height:{images[0].height}px;">
    </div>
{/if}