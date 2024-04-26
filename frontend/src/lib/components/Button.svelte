<script>
  export let textContent = "";
  export let className = "";
  export let onClick = () => {};
  export let id = "";
</script>

<button class="btn btn-primary {className}" on:click={onClick} data-id={id}>
  {textContent}
</button>
