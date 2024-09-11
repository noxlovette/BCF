<script lang="ts">
    import { enhance } from "$app/forms";
  import AppWrap from "$lib/components/AppWrap.svelte";
import type { PageServerData } from "./$types";

  export let data: PageServerData;

  const formula = data.formula;
</script>

<AppWrap>
  <h1>
    {formula.name}
  </h1>
  <ul class="space-y-2">
  <p>
    {formula.description}
  </p>
  <p>
    {formula.notes}
  </p>
</ul>
  
  <input type="text" name="name" value={formula.notes} />
  <form method="post" action="?/update" use:enhance>
    <input type="hidden" name="id" value={formula.id} />
    <button type="submit">
      update
    </button>
  </form>

  <form method="post" action="?/delete" use:enhance>
    <input type="hidden" name="id" value={formula.id} />
    <button type="submit">
      delete
    </button>
  </form>
</AppWrap>