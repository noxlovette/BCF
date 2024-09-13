<script lang="ts">
    import AppWrap from "$lib/components/AppWrap.svelte";
    import Button from "$lib/components/UI/Button.svelte";
  </script>
  
  <AppWrap>
    <h1 class="my-8 text-2xl">
      Hello. Nice that you're here. However, you are not supposed to. Perhaps you
      forgot to log in?
    </h1>
    <Button href="/auth/login">Let's fix that</Button>
  </AppWrap>
  