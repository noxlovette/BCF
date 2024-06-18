<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  const SITE_KEY = "YOUR_SITE_KEY";
  const dispatch = createEventDispatcher();

  let recaptchaInstance;

  onMount(() => {
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        recaptchaInstance = window.grecaptcha.render("recaptcha", {
          sitekey: SITE_KEY,
          callback: onVerify,
        });
      });
    } else {
      console.error("reCAPTCHA API script not loaded.");
    }
  });

  function onVerify(token) {
    dispatch("verify", token);
  }

  function reset() {
    if (recaptchaInstance) {
      window.grecaptcha.reset(recaptchaInstance);
    }
  }

  export { reset };
</script>

<div id="recaptcha"></div>
