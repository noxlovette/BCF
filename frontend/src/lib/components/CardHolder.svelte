<script>
      import { slide } from "svelte/transition";
      import { quintOut } from "svelte/easing";
</script>
<div
        id="card-holder"
        class="grid w-full grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      >
<slot></slot>
      </div>
