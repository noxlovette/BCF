<script lang="ts">
  import BigText from "$lib/components/typography/BigText.svelte";
  import Section from "$lib/components/typography/Section.svelte";
  const bigText = `We make perfume here<span class="text-saffron-400">.</span>`;
</script>

<BigText text={bigText} />

<div class="grid grid-cols-1 gap-4 text-balance lg:grid-cols-3">
  <Section
    href="browse"
    heading="Browse over 3100 ingredients."
    body="Use the power of IFRA's FIG in an unprecedented way. Industry-level data, supported by the opinions of real perfumers. This is the place where the hidden becomes apparent, and your expertise grows. You contribute, and you benefit."
  />
  <Section
    href="collect"
    heading="Collect hundreds of compounds."
    body="Keep track of your favourite ingredients and the ones you want to try. Note down ideas, associations, and inspirations. Everything from colour to availability in your lab. Your collection is your world only. Encrypted, it is only yours to enjoy."
  />
  <Section
    href="formulate"
    heading="Formulate a revolution."
    body="Manage your formulas independent of where you are. At home, in the
            lab, or on holiday. Focus on how to make your ideas come true, and
            not on where to store them. Make a difference. Change the
            landscape of perfumery today."
  />
</div>

<div class="my-4 text-6xl font-bold xl:text-[6rem]">
  <a
    href="/auth/signup"
    class="button hover:text-saffron-700 text-saffron-400 font-manrope tracking-tighter transition-all"
    >Sign up</a
  >
</div>
