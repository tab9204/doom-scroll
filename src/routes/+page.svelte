<script>
    import {error} from '@sveltejs/kit';
    import {Drawer, drawerStore} from '@skeletonlabs/skeleton';
    import {beforeNavigate, afterNavigate} from '$app/navigation';
    import {posts, limit, sort, pageScroll} from "$lib/stores.js";
    import Post from "$lib/components/Post.svelte";
    import Loading_Icon from "$lib/components/Loading_Icon.svelte";


    //save the scroll position so the page does not reset
    afterNavigate(()=>{
        document.getElementById("page").scroll(0,$pageScroll);
    })
    beforeNavigate(()=>{
        pageScroll.set(document.getElementById("page").scrollTop);
    });

    const getPosts = async ()=>{
        const resp = await fetch("/api/get_user_posts",{
            method: 'POST',
            body: JSON.stringify({after:$posts[$posts.length - 1]?.id,count:$posts.length,limit:$limit,sort:$sort}),
            headers: {'content-type': 'application/json'}
        });
		const data = await resp.json();
        console.log(data);
        const err = data.message;
        if(err){
            throw new error (400,'Could not get Posts');
        }
        else{
            //increment count
            //next time we get posts we want the next page of posts 
            posts.set($posts.concat(data.posts));
            post_list = $posts;
            console.log($posts.length);
            return $posts;
        }
    }

    const watchPostScroll = (node)=>{
        let options = {root: null,rootMargin: "0px",threshold: 0}
        let observer = new IntersectionObserver((entries)=>{
            if (entries[0].isIntersecting && !node.classList.contains("seen")) {
                node.classList.add("seen");
                getPosts();
            }
        }, options);
        observer.observe(node);
        return {
            destroy() {
                observer.unobserve(node);
            }
        };

    }

    const setSort = (filter)=>{
		sort.set(filter);
		posts.set([]);
        drawerStore.close();
	}

    $: post_list = $posts.length <= 0 ? getPosts() : $posts;

</script>


<Drawer position="top" width="w-full" height="h-fit" zIndex="z-[1]" class="top-14" bgDrawer="variant-filled-surface">
    <div class="flex justify-center gap-10 p-4">
        <button on:click={()=>{setSort("hot")}} type="button" class="btn variant-{$sort == "hot" ? 'filled' : 'ringed' }-secondary focus:outline-none">Hot</button>
        <button on:click={()=>{setSort("best")}}  type="button" class="btn variant-{$sort == "best" ? 'filled' : 'ringed' }-secondary focus:outline-none">Best</button>
        <button on:click={()=>{setSort("new")}} type="button" class="btn variant-{$sort == "new" ? 'filled' : 'ringed' }-secondary focus:outline-none">New</button>
    </div>
</Drawer>
{#await post_list}
    <Loading_Icon></Loading_Icon>
{:then $posts}
    {#each $posts as post, i}
        <Post {post}></Post>
        <!--Intersection observer to load more posts as the user scrolls-->
        {#if i == Math.floor(post_list.length * .75)}
            <span use:watchPostScroll></span>
        {/if}
    {/each}
    <!--<span use:watchPostScroll></span>-->
{:catch error}
    <p>Could not load posts</p>
{/await}
