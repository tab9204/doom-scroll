<script>
    import {decodeHTML} from "$lib/utilities.js";
    import {error} from '@sveltejs/kit';
    import {Drawer, drawerStore} from '@skeletonlabs/skeleton';
    import {afterNavigate, beforeNavigate} from '$app/navigation';
    import {frontPage, seen, maxLength, limit, sort, pageScroll, subPosts, subPageScroll} from "$lib/stores.js";
    import {onDestroy, onMount} from "svelte";
    import Post from "$lib/components/Post.svelte";
    import Loading_Icon from "$lib/components/Loading_Icon.svelte";


    beforeNavigate((nav)=>{
        if(nav.to?.route.id == "/comments" || nav.to?.route.id == "/r/[slug]"){
            //save the scroll position 
            pageScroll.set(nav.to.url.searchParams.get("id"));
        }
    })

    afterNavigate((nav)=>{
        //restore the users scroll position
        if($pageScroll){
            document.getElementById($pageScroll).scrollIntoView({block:"center"});
        }
    });

    onDestroy(()=>{
        //if the total # of posts gets too large it slows down page navigation
        if($frontPage.length > $maxLength){
            $frontPage.splice(0,$frontPage.length - $maxLength);
        }
    });

    onMount(()=>{
        //set the subreddit post array and scroll position to their default value 
        subPosts.set([]);
        subPageScroll.set(null);
    })

    //get_user_posts
    //get_test_posts
    const getPosts = async ()=>{
        const resp = await fetch("/api/get_user_posts",{
            method: 'POST',
            body: JSON.stringify({
                after:$frontPage[$frontPage.length - 1]?.id,
                ids: $seen,
                count:$frontPage.length,
                limit:$limit,
                sort:$sort,
                screen: {width: window.innerWidth, height: window.innerHeight > 384 ? 384 : window.innerHeight}
            }),
            headers: {'content-type': 'application/json'}
        });
		const data = await resp.json();
        const err = data.message;
        if(err){
            throw new error (400,'Could not get Posts');
        }
        else{
            console.log(data);
            frontPage.set($frontPage.concat(data.posts));
           // console.log([...$frontPage, ...data.posts]);
            return $frontPage;
        }
    }


    const watchScroll =  (node)=>{
        let options = {root: null,rootMargin: "0px",threshold: 0}
        let observer = new IntersectionObserver(async (entries)=>{
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
        <Post {post}>
            <div slot="header">
                <div class="text-sm"><a href="r/{post.subreddit}?id={post.id}">r/{post.subreddit}</a></div>
                <h3 class="text-lg">{@html decodeHTML(post.title)}</h3>
            </div>
            <div slot="footer">
                {#if post.num_comments > 0}
                    <a href="./comments?id={post.id}">{post.num_comments} Comments</a>
                {/if}
            </div>
        </Post>
        <!--Intersection observer to load more posts as the user scrolls-->
        {#if i == Math.floor(post_list.length * .75)}
           <span use:watchScroll></span>
        {/if}
    {/each}
{:catch error}
    <p>Could not load posts</p>
{/await}
