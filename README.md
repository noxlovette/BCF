# README.md
# BCF

This is a web app for perfumers. Users can browse IFRA’s FIG of 3100 perfume compounds, manage their collection of ingredients (what they have in the lab, for example), store, and create perfume formulas. Everything happens in a safe environment, the collection and formula data are encrypted.

## Features
- Browse through IFRA’s database of perfume compounds and contribute to BCF's knowledge base.
- Manage a personal collection of ingredients and enrich it with subjective data.
- Create and store perfume formulas that will change the industry.
- Secure data storage with encryption.

## Installation
1. **Clone the repo:**
```bash
git clone https://github.com/noxlovette/BCF.git
cd BCF
```

2. Define the .env file in the *backend* folder. Ensure it’s not in your version control. Below is an example.
```env
PGNAME=name
PGUSER=user
PGPASSWORD=pass
PGHOST=host
PGPORT=5432

PRIVATE_KEY_PASSWORD=pass
PRIVATE_KEY=key
PUBLIC_KEY=key

CORS_ALLOW_ALL_ORIGINS=True
CSRF_COOKIE_SECURE=False
SESSION_COOKIE_SECURE=False

DJANGO_SETTINGS_MODULE=main_project.settings
DJANGO_SECRET_KEY=key
DJANGO_DEBUG=True
```

You may not have to create a key pair, but not doing so will prevent 2/3 of the app from working. I suggest using [Python cryptography](https://pypi.org/project/cryptography/) for this. 

3. .env for the *frontend*. Docker is configured in such a way as to work with this setup.
```env
VITE_API_URL=http://localhost:8000
```


4. **Build and Start the Docker Containers from the root folder:**
```bash
docker compose up --build
```

That is pretty much it. Open localhost:5173 and have fun.

## Usage
The docker setup lets you hot-swap your frontend src and static folder, and it enables full sync with django. You can just launch your VSCode (with an official svelte plugin) and start work like you always would. Just make sure you have configured the environment.

*The reason why a fuller sync with a local frontend is not possible is the fact that rollup, which vite uses, does not install additional dependencies on darwin.*

When it comes to the database, you could run migrations in backend and then fill it out with Django ORM or DataGrip.

## Built With

* [Django](https://www.djangoproject.com/) - Backend
* [Svelte](https://svelte.dev/) - Frontend
* [PostgreSQL](https://www.postgresql.org/) - Database

## Contributing

This is a very new project so feel free to bombard me with how bad this code is.

## Versioning

I use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/yourusername/yourprojectname/tags).

## Authors

* **Danila Volkov** - *Initial work* - [noxlovette](https://github.com/noxlovette)

## License

This project is licensed under the GNL License - see the [LICENSE.md](LICENSE.md) file for details
## Stack
* Styling – [Tailwind CSS](https://tailwindcss.com/)
* JS & HTML – [Svelte](https://svelte.dev/) on SvelteKit
* Container – [Docker](https://www.docker.com/)
* Cloud/CI/CD – [Railway](https://railway.app/)
* Tracking - [Sentry](https://sentry.io/)
* Server – [Django](https://github.com/django/django)
* API – [Django REST framework](https://www.django-rest-framework.org/)
* Created with a lot of support from ChatGPT by [OpenAI](https://openai.com/) and [GitHub Copilot by GitHub](https://github.com/features/copilot)

## Acknowledgments
* Absolutely everyone behind my Stack. You do a terrific job. Especially Svelte – Hallo aus Braunschweig! 
* Pavel Durov. [Your interview](https://www.youtube.com/watch?v=1Ut6RouSs0w) inspired me to continue my full-stack app, embrace open-source, and believe in myself.
* [Theo t3.gg.](https://www.youtube.com/@t3dotgg)You showed me what Svelte and TailwindCSS are, explained the core concepts of FrontEnd, and, most importantly, indirectly supported me during the long hours of coding. 
* [Fireship](https://www.youtube.com/@Fireship) – more concepts of programming.
