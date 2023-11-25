<script>
    import videojs from "video.js";
    import Placeholder from "$lib/components/Placeholder.svelte";

    export let video;

    const videoId = "vid" + Math.floor(Math.random() * Date.now()).toString();

    let options = {root: null,rootMargin: "0px",threshold: 0};

    let player = null;

    const lazyLoadVideo = (wrapper)=>{
        const loaded = (player)=>{
            player.style.opacity = "1";
            //observer.unobserve(wrapper);
        }
        let observer = new IntersectionObserver((entries)=>{
            if (entries[0].isIntersecting) {
                if(player == null){
                    player = videojs(videoId, {preload: "auto", controls:true, nativeControlsForTouch:true, width:video.width, height:video.height});
                    player.ready(()=> {
                        loaded(player.el_);
                    });
                }
            }
            else if (!entries[0].isIntersecting && player != null){
                player.pause();
            }
        }, options);
        observer.observe(wrapper);
        return {
            destroy() {
                //player.dispose();
                observer.unobserve(wrapper);
            }
        }
    }
</script>

<!-- svelte-ignore a11y-media-has-caption -->
  <div class="relative max-w-full max-h-96 left-2/4 -translate-x-2/4" style="width:{video.width}px; height:{video.height}px;" use:lazyLoadVideo>
    <Placeholder width={video.width} height={video.height}></Placeholder>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <video-js class="min-w-[235px] relative left-2/4 -translate-x-2/4 max-w-full max-h-96 opacity-0 object-contain ease-linear duration-200" id="{videoId}">
        <source src="{video.hls}">
    </video-js>
</div>  

