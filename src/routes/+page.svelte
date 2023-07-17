<script>
    import {error} from '@sveltejs/kit';
    import {Drawer, drawerStore} from '@skeletonlabs/skeleton';
    import {beforeNavigate, afterNavigate} from '$app/navigation';
    import {retry} from "$lib/utilities.js";
    import {redditPosts, frontPageScroll, after, count, limit, sortPostsBy} from "$lib/stores.js";
    import Post from "$lib/components/Post.svelte";
    import Loading_Icon from "$lib/components/Loading_Icon.svelte";

    //save the scroll position so the page does not reset
    afterNavigate(()=>{
        document.getElementById("page").scroll(0,$frontPageScroll);
    })
    beforeNavigate(()=>{
        frontPageScroll.set(document.getElementById("page").scrollTop);
    });

    const getPosts = async ()=>{
        const resp = await fetch("/api/get_user_posts",{
            method: 'POST',
            body: JSON.stringify({after:$after,count:$count,limit:$limit,sort:$sortPostsBy}),
            headers: {'content-type': 'application/json'}
        });
		const data = await resp.json();
        console.log(data);
        const err = data.message;
        if(err){
            throw new error (400,'Could not get Posts');
        }
        else{
            //increment count and update after 
            //next time we get posts we want the next page of posts 
            after.set(data.after);
            count.update(n => n + $limit);
            redditPosts.set($redditPosts.concat(data.posts));
            post_list = $redditPosts;
            return $redditPosts;
        }
    }

    const watchPostScroll = (node)=>{
        let options = {root: null,rootMargin: "0px",threshold: 0}
        let observer = new IntersectionObserver((entries)=>{
            if (entries[0].isIntersecting && !node.classList.contains("seen")) {
                node.classList.add("seen");
                retry(getPosts);
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
		sortPostsBy.set(filter);
		redditPosts.set([]);
        drawerStore.close();
	}

    $: post_list = $redditPosts.length <= 0 ? getPosts() : $redditPosts;

</script>


<Drawer position="top" width="w-full" height="h-fit" zIndex="z-[1]" class="top-14" bgDrawer="variant-filled-surface">
    <div class="flex justify-center gap-10 p-4">
        <button on:click={()=>{setSort("hot")}} type="button" class="btn variant-{$sortPostsBy == "hot" ? 'filled' : 'ringed' }-secondary">Hot</button>
        <button on:click={()=>{setSort("best")}}  type="button" class="btn variant-{$sortPostsBy == "best" ? 'filled' : 'ringed' }-secondary">Best</button>
        <button on:click={()=>{setSort("new")}} type="button" class="btn variant-{$sortPostsBy == "new" ? 'filled' : 'ringed' }-secondary">New</button>
    </div>
</Drawer>
{#await post_list}
    <Loading_Icon></Loading_Icon>
{:then $posts}
    {#each $posts as post, i}
        {#if post.post_type != false}
            <Post {post}></Post>
        {/if}
        <!--Intersection observer to load more posts as the user scrolls-->
        {#if i == post_list.length / 2}
            <span use:watchPostScroll></span>
        {/if}
    {/each}
    <span use:watchPostScroll></span>
{:catch error}
    <p>Could not load posts</p>
{/await}
