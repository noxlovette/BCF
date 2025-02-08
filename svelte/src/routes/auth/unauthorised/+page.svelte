<script lang="ts">
</script>

<div
  class="max-w-lg rounded-b-xl bg-white p-8 text-center shadow-lg dark:bg-stone-900"
>
  <h1 class="text-3xl font-semibold">Access Restricted</h1>
  <p class="mt-4 text-balance">
    The page you’re trying to view requires an account. Please log in to access
    your collection of perfume ingredients, save impressions and ideas in
    Markdown, or create perfume formulas.
  </p>

  <div class="mt-6 flex flex-col items-center space-y-2 *:w-1/2">
    <a
      href="/auth/login"
      class="bg-saffron-400 hover:bg-saffron-600 text-saffron-950 rounded-xl px-3 py-1 font-medium shadow-md transition"
    >
      Sign In
    </a>
    <a
      href="/paperwork/about"
      class="bg-saffron-400 hover:bg-saffron-600 text-saffron-950 rounded-xl px-3 py-1 font-medium shadow-md transition"
    >
      About BCF
    </a>
    <a
      href="https://docs.bcfapp.app/"
      class="bg-saffron-400 hover:bg-saffron-600 text-saffron-950 rounded-xl px-3 py-1 font-medium shadow-md transition"
    >
      Learn BCF
    </a>
  </div>

  <p class="mt-4 text-sm text-gray-500">
    Don’t have an account? <a
      href="/auth/signup"
      class="text-saffron-500 hover:underline">Sign up here</a
    >.
  </p>
</div>
