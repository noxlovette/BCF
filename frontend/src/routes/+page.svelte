<script lang="ts">
  import BigText from "$lib/components/BigText.svelte";
  import Section from "$lib/components/UI/Section.svelte";
  const bigText = `Want to create your own <span class="text-gold-400"> perfume? </span>We've got you covered<span class="text-gold-400">.</span>`;
</script>

<div class="my-12 flex flex-col">
  <BigText text={bigText} />

  <div
    id="blabla"
    class="my-12 flex max-w-md flex-col space-y-8 sm:max-w-2xl md:my-4 md:max-w-3xl md:py-8 lg:max-w-4xl xl:max-w-5xl"
  >
    <Section
      href="browse"
      color="navy"
      heading="Browse over 3100 ingredients."
      body="Use the power of IFRA's FIG in an unprecedented way. Industry-level data, supported by the opinions of real perfumers. This is the place where the hidden becomes apparent, and your expertise grows. You contribute, and you benefit."
    />
    <Section
      href="collect"
      color="grapefruit"
      heading="Collect hundreds of compounds."
      body="Keep track of your favourite ingredients and the ones you want to try. Note down ideas, associations, and inspirations. Everything from colour to availability in your lab. Your collection is your world only. Encrypted, it is only yours to enjoy."
    />
    <Section
      href="formulate"
      color="aqua"
      heading="Formulate a revolution."
      body="Manage your formulas independent of where you are. At home, in the
            lab, or on holiday. Focus on how to make your ideas come true, and
            not on where to store them. Make a difference. Change the
            landscape of perfumery today."
    />
  </div>

  <div class="text-6xl font-bold xl:text-[6rem]">
    <a
      href="/auth/signup"
      class="button px-6 py-3 transition-all hover:text-gold-400">sign up</a
    >
  </div>
</div>
