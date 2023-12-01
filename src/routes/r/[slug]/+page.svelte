<script>
    import {page} from '$app/stores';
    import {decodeHTML} from "$lib/utilities.js";
    import {error} from '@sveltejs/kit';
    import {afterNavigate, beforeNavigate} from '$app/navigation';
    import {subPosts, subAfter, subPageScroll, maxLength} from "$lib/stores.js";
    import {onDestroy, onMount} from "svelte";
    import Post from "$lib/components/Post.svelte";
    import Loading_Icon from "$lib/components/Loading_Icon.svelte";

    const subreddit = $page.params.slug;

    beforeNavigate((nav)=>{
        if(nav.to?.route.id == "/comments"){
            //save the scroll position 
            subPageScroll.set(nav.to.url.searchParams.get("id"));
        }
    })

    afterNavigate((nav)=>{
        //restore the users scroll position
        if($subPageScroll){
            document.getElementById($subPageScroll).scrollIntoView({block:"end"});
        }
    });

    onDestroy(()=>{
        //if the total # of posts gets too large it slows down page navigation
        if($subPosts.length > $maxLength){
            $subPosts.splice(0,$subPosts.length - $maxLength);
        }
    });

    const getSubredditPosts = async ()=>{
        const resp = await fetch("/api/get_subreddit_posts",{
            method: 'POST',
            body: JSON.stringify({
                subreddit: subreddit,
                after: $subAfter,
                screen: {width: window.innerWidth, height: window.innerHeight > 384 ? 384 : window.innerHeight}
            }),
            headers: {'content-type': 'application/json'}
        });
        const data = await resp.json();
        const err = data.message;
        if(err){
            throw new error (400,'Could not get subreddit posts');
        }
        else{
            subPosts.set($subPosts.concat(data.posts))
            subAfter.set(data.after);
            console.log($subPosts);
            return $subPosts;
        }
    }

    const watchScroll = (node)=>{
        let options = {root: null,rootMargin: "0px",threshold: 0}
        let observer = new IntersectionObserver((entries)=>{
            if (entries[0].isIntersecting && !node.classList.contains("seen")) {
                node.classList.add("seen"); 
                //load more posts
                getSubredditPosts();
            }
        }, options);
        observer.observe(node);
        return {
            destroy() {
                observer.unobserve(node);
            }
        };
    }

   $: post_list = $subPosts.length <= 0 ? getSubredditPosts() : $subPosts;

</script>

{#await post_list}
    <Loading_Icon></Loading_Icon>
{:then posts}
    {#each posts as post, i}
        <Post {post}>
            <div slot="header">
                <div class="text-sm">r/{subreddit}</div>
                <h3 class="text-lg">{@html decodeHTML(post.title)}</h3>
            </div>
            <div slot="footer">
                {#if post.num_comments > 0}
                    <a href="../comments?id={post.id}">{post.num_comments} Comments</a>
                {/if}
            </div>
        </Post>
        <!--Intersection observer to load more posts as the user scrolls-->
        {#if i == Math.floor(post_list.length * .75)}
            <span use:watchScroll></span>
        {/if}
    {/each}
    <!--<span use:watchScroll></span>-->
{:catch error}
    <p>Could not load r/{subreddit} posts</p>
{/await}