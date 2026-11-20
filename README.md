# Plugin: Retry ADP

This plugin allow to retry to dial out an ADP (Automatically Dialed Participant)
that failed. For example, this could happen if the user isn't available at the
beginning of the conference of if the user rejected the call.

## Run for development

- To be able to build the plugin, you need to comply with the following versions
  or higher:

  | NodeJS   | NPM     |
  | -------- | ------- |
  | v22.19.0 | v10.5.0 |

- Create a file `.env` in the root of the project with the following content:

```env
VITE_INFINITY_TARGET=<infinity_url>
VITE_DEV_SERVER_PORT=<dev_server_port>
```

The `VITE_INFINITY_TARGET` variable is **mandatory** and should contain the URL
of the Pexip Infinity system where you want to test the plugin.

The `VITE_DEV_SERVER_PORT` variable is an optional variable used to specify the
port on which the development server will run. If not provided, it defaults to
`5173`.

You can check an example in the provided `.env.example` file.

- Install all the dependencies:

```bash
$ npm i
```

- Run the dev environment:

```bash
$ npm start
```

The plugin will be served from https://localhost:5173 (visit that page and
accept the self-signed certificates), but you should access it thought the Web
App 3 URL. You have more information about how to configure your environment in
the
[Developer Portal: Setup guide for plugin developers](https://developer.pexip.com/docs/plugins/webapp-3/setup-guide-for-plugin-developers).

## Build for production

To create a package, you will need to first install all the dependencies:

```bash
$ npm i
```

And now to create the package itself:

```bash
$ npm run build
```

Congrats! Your package is ready and it will be available in the `dist` folder.
The next step is to create a Web App3 branding and copy `dist` into that
branding.

If you want to know more about how to deploy your plugin in Pexip Infinity,
check our [Developer Portal](https://developer.pexip.com).
