<script>
    import Placeholder from "$lib/components/Placeholder.svelte";
    export let content;

    let options = {root: null,rootMargin: "0px",threshold: 0};

    const lazyLoadEmbed = (wrapper,url)=>{
        const placeholder = wrapper.children[0];
        const embed = wrapper.children[1];
        const loaded = ()=>{
            embed.style.opacity = "1";
            placeholder.style.opacity = "0";
           // observer.unobserve(wrapper);
        }
        let observer = new IntersectionObserver((entries)=>{
            if (entries[0].isIntersecting && embed.src == "") {
                embed.src = url;
                embed.addEventListener('load', loaded); 
            }
            else if (!entries[0].isIntersecting && embed.src != ""){
                try{
                    embed.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo' }), '*');
                }
                catch(e){
                    console.log(e)
                }
            }
        }, options);
        observer.observe(wrapper);
        return {
            destroy() {
                embed.removeEventListener('load', loaded);
                observer.unobserve(wrapper);
                
            }
        }


    }
</script>


<!-- svelte-ignore a11y-img-redundant-alt -->
<div class="relative max-w-full max-h-96" use:lazyLoadEmbed={content.url}>
    <Placeholder width={content.width} height={content.height}></Placeholder>
    <iframe class="relative left-2/4 -translate-x-2/4 max-w-full max-h-96 opacity-0 object-contain ease-linear duration-200" title="Embedded Content" scrolling="no" width="{content.width}" height="{content.height}" allowfullscreen></iframe>
</div>
