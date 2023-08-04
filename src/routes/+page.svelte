<script>
    import {error} from '@sveltejs/kit';
    import {Drawer, drawerStore} from '@skeletonlabs/skeleton';
    import {afterNavigate} from '$app/navigation';
    import {frontPage, seen, maxLength, limit, sort, pageScroll} from "$lib/stores.js";
    import {onDestroy} from "svelte";
    import Post from "$lib/components/Post.svelte";
    import Loading_Icon from "$lib/components/Loading_Icon.svelte";


    afterNavigate(()=>{
        //restore the users scroll position
        if($pageScroll){
            document.getElementById($pageScroll).scrollIntoView();
        }
    });

    onDestroy(()=>{
        //if the total # of posts gets too large it slows down page navigation
        if($frontPage.length > $maxLength){
            $frontPage.splice(0,$frontPage.length - $maxLength);
        }
    });

    const getPosts = async ()=>{
        const resp = await fetch("/api/get_user_posts",{
            method: 'POST',
            body: JSON.stringify({
                after:$frontPage[$frontPage.length - 1]?.id,
                ids: $seen,
                count:$frontPage.length,
                limit:$limit,
                sort:$sort
            }),
            headers: {'content-type': 'application/json'}
        });
		const data = await resp.json();
        const err = data.message;
        if(err){
            throw new error (400,'Could not get Posts');
        }
        else{
            frontPage.set($frontPage.concat(data.posts))
            return $frontPage;
        }
    }


    const watchScroll = (node)=>{
        let options = {root: null,rootMargin: "0px",threshold: 0}
        let observer = new IntersectionObserver((entries)=>{
            if (entries[0].isIntersecting && !node.classList.contains("seen")) {
                node.classList.add("seen"); 
                //add the last batch of post ids to seen array
                //ids in the array won't be shown again
                let viewed = [];
                $frontPage.slice(-$limit).forEach((post)=>{viewed.push(post.id);})
                seen.set($seen.concat(viewed));
                //load more posts
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
		frontPage.set([]);
        drawerStore.close();
	}

    $: post_list = $frontPage.length <= 0 ? getPosts() : $frontPage;

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
{:then posts}
    {#each posts as post, i}
        <Post {post}></Post>
        <!--Intersection observer to load more posts as the user scrolls-->
        {#if i == Math.floor(post_list.length * .75)}
            <span use:watchScroll></span>
        {/if}
    {/each}
    <!--<span use:watchScroll></span>-->
{:catch error}
    <p>Could not load posts</p>
{/await}
