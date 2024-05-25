<script>
  export let textContent = "";
  export let className = "";
  export let onClick = () => {};
  export let id = "";
</script>

<button class="btn btn-primary {className}" on:mousedown={onClick} data-id={id}>
  {textContent}
</button>
