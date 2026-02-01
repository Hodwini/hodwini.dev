<script lang="ts">
    import favicon from '$lib/assets/favicon.svg';
	import { AsciiGlobe } from '$lib';
    import '../lib/styles/index';
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <title>hodwini/dev</title>
</svelte:head>

<AsciiGlobe />

<slot />

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: #0d0d0d;
  }
</style>