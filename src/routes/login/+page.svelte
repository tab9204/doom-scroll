<script>
    export let data;

    const state = data.redditState;
    const redirect = data.redirect;

    const authorizeURL = `https://www.reddit.com/api/v1/authorize.compact?client_id=J35OkEqpyYR5KwrMP8kSFA&response_type=code&state=${state}&redirect_uri=${redirect}&duration=permanent&scope=mysubreddits,read`;
</script>

<div class="text-center">
    <h1 class="text-2xl mb-5">Welcome to RedditKit</h1>
    <a class="text-tertiary-500" href="{authorizeURL}" target="_top">Sign in with your Reddit account</a>
</div>
