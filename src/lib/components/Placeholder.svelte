<script>
    export let width;
    export let height;

</script>

<svg class="absolute max-h-96 max-w-full left-2/4 -translate-x-2/4 top-2/4 -translate-y-2/4 ease-linear duration-200" style="width:{width}px; height:{height}px;" viewBox="0 0 {width} {height}">
    <rect class="animate-pulse" width="{width - 2}" height="{height - 2}" style="fill:rgb(128, 140, 177);"/>
</svg>