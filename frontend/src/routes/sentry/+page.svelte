<button
  type="button"
  on:mousedown={() => {
    console.log('Error thrown');
    throw new Error('Sentry Frontend Error');
    
  }}
>
  Throw error
</button>;
