<button
  type="button"
  on:click={() => {
    console.log('Error thrown');
    throw new Error('Sentry Frontend Error');
    
  }}
>
  Throw error
</button>;
