<script lang="ts">
  import BigText from "$lib/components/BigText.svelte";
    import Section from "$lib/UI/Section.svelte";
  const bigText = `Want to create your own <span class="text-gold-400"> perfume? </span>We've got you covered<span class="text-gold-400">.</span>`;

</script>

  <div
    class="flex flex-col py-12"
  >
    <BigText text={bigText} />

    <div
      id="blabla"
      class="flex max-w-md flex-col sm:max-w-2xl md:max-w-3xl md:py-8 lg:max-w-4xl xl:max-w-5xl space-y-8 my-12 md:my-4"
    >

<Section href="browse" color="navy" heading="Browse over 3100 ingredients." body="Use the power of IFRA's FIG in an unprecedented way. Industry-level data, supported by the opinions of real perfumers. This is the place where the hidden becomes apparent, and your expertise grows. You contribute, and you benefit." />
<Section href="collect" color="grapefruit" heading="Collect hundreds of compounds." body="Keep track of your favourite ingredients and the ones you want to try. Note down ideas, associations, and inspirations. Everything from colour to availability in your lab. Your collection is your world only. Encrypted, it is only yours to enjoy." />
<Section href="formulate" color="aqua" heading="Formulate a revolution." body="Manage your formulas independent of where you are. At home, in the
            lab, or on holiday. Focus on how to make your ideas come true, and
            not on where to store them. Make a difference. Change the
            landscape of perfumery today." />
    </div>


    <div class="lg:px-8 lg:py-8">
      <div class="flex flex-col items-center">
        <div class="mx-auto max-w-[800px] xl:max-w-7xl">
          <div
            class="2xl:max-w-6x1 max-w-md px-4 sm:max-w-2xl sm:px-6 md:max-w-3xl lg:max-w-4xl lg:px-0 xl:max-w-5xl"
          >
            <div class="flex w-full flex-col items-center gap-4">
              <div class="flex flex-col items-start justify-between">
                <div
                  id="buttons"
                  class="flex flex-col text-pretty text-center text-6xl font-bold tracking-tight xl:text-[6rem] xl:tracking-tight 2xl:text-[6.5rem]"
                  style="width: 100%;"
                >
                  <div class="flex flex-col xl:flex-row">
                    <a
                      href="/browse"
                      class="button px-6 py-3 transition-all hover:text-navy-700"
                      >browse</a
                    >
                    <a
                      href="/collect"
                      class="button px-6 py-3 transition-all hover:text-grapefruit-700"
                      >collect</a
                    >
                    <a
                      href="/formulate"
                      class="button px-6 py-3 transition-all hover:text-aqua-700"
                      >formulate</a
                    >
                  </div>
                  <a
                    href="/auth/signup"
                    class="button px-6 py-3 text-gold-400 transition-all hover:text-gold-200"
                    >sign up</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
