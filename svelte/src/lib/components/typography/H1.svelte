<script lang="ts">
  let { children, styling = "" } = $props();
</script>

<h1
  class="{styling} font-manrope font-thinner text-center text-4xl tracking-tighter md:text-5xl lg:text-6xl xl:text-7xl"
>
  {@render children()}
</h1>
