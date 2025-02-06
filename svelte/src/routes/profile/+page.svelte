<script lang="ts">
  import { enhance } from "$app/forms";
  import { SubmitButton } from "$lib/components";
  import { clearUser, notification } from "$lib/stores";

  let isSubmitting = $state(false);
</script>

<div
  id="controls"
  class="flex flex-row justify-end space-x-4 self-start xl:text-2xl"
>
  <form
    method="POST"
    use:enhance={() => {
      isSubmitting = true;

      return async ({ result, update }) => {
        isSubmitting = false;
        if (result.type === "redirect") {
          clearUser();
          localStorage.removeItem("user");
          localStorage.removeItem("profile");
          notification.set({ message: "Bye!", type: "success" });
          update();
        } else if (result.type === "failure") {
          notification.set({
            message: String(result.data?.message) || "Something's off",
            type: "error",
          });
        }
      };
    }}
  >
    <SubmitButton bind:isSubmitting>Log Out</SubmitButton>
  </form>
</div>
