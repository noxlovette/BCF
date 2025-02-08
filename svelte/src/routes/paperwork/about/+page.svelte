<script>
  import BigText from "$lib/components/typography/BigText.svelte";
  import Section from "../Section.svelte";
  const bigText = `About<span class="text-saffron-400">.</span>`;
  const sectionBigTextWhat = `What is this?`;
  const sectionSmallTextWhat = `This app is your gateway to the world of perfume ingredients. It empowers you to explore, gather, classify, and create perfume formulas. The database draws from IFRA's FIG and contributions from passionate users like you.`;
  const sectionBigTextWhy = `Why?`;
  const sectionSmallTextWhy = `Reliable and regularly updated sources of perfume ingredient information are scarce online. Industry experts often hoard their knowledge, leaving enthusiasts in the dark. While similar applications exist, they often operate in isolation. This app aims to invigorate the industry by fostering collaboration and knowledge sharing.`;

  const sectionBigTextFor = `Who's this for?`;
  const sectionSmallTextFor = `It's a vital tool for perfumers who seek to expand and contribute their knowledge and elevate their craft. We are a community that grows stronger every day.`;
  const sectionBigTextNext = `What's next?`;
  const sectionSmallTextNext = `It's a question that concerns both you and me. As you continue to create amazing perfumes and contribute to our platform, I'm dedicated to listening to your feedback and implementing the features you want.`;
</script>

<div class="lowercase">
  <BigText text={bigText} />
</div>

<div
  class="grid max-w-5xl grid-cols-1 items-start gap-8 text-balance xl:grid-cols-2"
>
  <Section
    sectionBigText={sectionBigTextWhat}
    sectionSmallText={sectionSmallTextWhat}
  />
  <Section
    sectionBigText={sectionBigTextWhy}
    sectionSmallText={sectionSmallTextWhy}
  />

  <Section
    sectionBigText={sectionBigTextFor}
    sectionSmallText={sectionSmallTextFor}
  />
  <Section
    sectionBigText={sectionBigTextNext}
    sectionSmallText={sectionSmallTextNext}
  />
</div>
