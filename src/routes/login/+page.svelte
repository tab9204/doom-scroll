<script>
    export let data;

    const state = data.redditState;
    const redirect = data.redirect;
    const client = data.client;

    const authorizeURL = `https://www.reddit.com/api/v1/authorize.compact?client_id=${client}&response_type=code&state=${state}&redirect_uri=${redirect}&duration=permanent&scope=mysubreddits,read`;
</script>

<div class="text-center">
    <h1 class="text-2xl mb-5">Doomscroll Reddit</h1>
    <a href="{authorizeURL}" target="_self">Sign in with your Reddit account</a>
</div>
