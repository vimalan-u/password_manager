<script>
    export let src = null
    export let alt = null
    let className = ''
    export { className as class }

    let noimageSet = false

    function onError(event) {
        if (event.target.src !== 'img/noimage.svg' && !noimageSet) {
            noimageSet = true
            event.target.src = 'img/noimage.svg'
        }
    }
</script>

<img class={className} {src} {alt} on:error={onError} />

<style>
    img {
        pointer-events: none;
    }
</style>
