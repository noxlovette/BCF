<script lang="ts">
    import { scale } from "svelte/transition";
    export let text: string;
</script>



    <div class="lg:px-8">
    <div class="flex flex-col items-center"> 
    <div class= "mx-auto max-w-[800px] xl:max-w-7xl">
    <div class= "max-w-md px-4 sm:max-w-2xl sm:px-6 md:max-w-3xl lg:max-w-4xl lg:px-0 xl:max-w-5xl 2xl:max-w-6xl">
    <div class="flex w-full flex-col items-center gap-4">
      <div class="flex flex-col items-start justify-between">
      <div id = "big text"class="">
        <h1
          class="text-center text-6xl xl:text-[6rem] xl:tracking-tight 2xl:text-[6.5rem] font-bold tracking-tight text-pretty"
          in:scale={{
            duration: 500,
            delay: 0,
            opacity: 0.5,
            start: 0.5,
          }}
        >
        {@html text}
        </h1>
      </div>
    </div>
    </div>
  </div>
</div>
    </div>
    </div>
