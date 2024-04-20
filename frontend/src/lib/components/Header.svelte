<script>
    import { onMount } from 'svelte';

    let is_authenticated = false;
    let username = '';

    onMount(() => {
        // Get the user's login status and nickname from session storage
        is_authenticated = sessionStorage.getItem('is_authenticated') === 'true';
        username = sessionStorage.getItem('username') || '';
    });
</script>

<header>
    <nav class="navbar navbar-expand-md bg-body py-3" id="navbar">
        <div class="container">
            <a href = "/">
                <img src="/assets/img/bcf_logo_dark.png" style="width: 64px;padding: 0;margin-right: 24px;" alt="Go to home page">
            </a>
            <a class="navbar-brand d-flex align-items-center" href="/"><span>BCF</span></a><button data-bs-toggle="collapse" class="navbar-toggler" data-bs-target="#navcol-1"><span class="visually-hidden">Toggle navigation</span><span class="navbar-toggler-icon"></span></button>
            <div class="collapse navbar-collapse" id="navcol-1">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item"><a class="nav-link active" href="/browse">Browse</a></li>
                    <li class="nav-item"><a class="nav-link" href="/collection">Collect</a></li>
                    <li class="nav-item"><a class="nav-link" href="/formulae">Formulate</a></li>
                </ul>
                <div class="navbar-nav login">
                    <button class="btn btn-primary" id = 'signup-button' type="button" style="margin-right: 8px;background: var(--bs-body-bg);border-color: var(--bs-btn-hover-border-color);color: var(--bs-btn-hover-border-color);">Sign Up</button>
                    <a href="/login" class="btn btn-primary" id = 'login-button' role="button">Log In</a>
                </div>
            </div>
        </div>
    </nav>
</header>

<style>

</style>