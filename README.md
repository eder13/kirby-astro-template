# Kirby Astro Template

## Installation

1. Create a .env file and specify the domain you want to publish like so:

```txt
DOMAIN="my-website.com"
```

2. Install the Dependencies for Astro:

    1. `cd frontend/`
    2. `(sudo) npm install`

3. (Optional): Give permission rights to your htdocs folder if using XAMPP or anything similiar:

`sudo chmod -R 777 /path/to/XAMPP/xamppfiles/htdocs`

## Architecture

![Architecture](./docs/architecture.png)

The cms is installed in the subpath `/cms`, which returns the data for the HomePage. use the `EnvironmentHelper` to get the base URL for fetch requests like so:

```ts
// Example: Retrieving the HomePage
const response = await fetch(
    `${EnvironmentHelper.getFetchBaseURL()}${Page.HOME}`
);
```

Inside `pages.ts` define your other routes (e.g. in Kirby if you create an /about site, add the /about in the pages file).
