# 🦐 xChat

An UI to run seamlessly LLM services (OpenAI, Claude, Gemini, Mistral,...)

## Getting Started

To get started, install [nvm](https://github.com/nvm-sh/nvm) and use it to install the desired version of Node.js and [Yarn](https://yarnpkg.com/).

```bash
nvm install 20 # node v20
# then install yarn
npm i --global yarn
yarn --version
```

> [!WARNING]  
> `--turbo` [doesn't work](https://github.com/vercel/next.js/issues/42651) with [`yarn` PnP](https://yarnpkg.com/features/pnp), try `npm` or force yarn to use `node-modules` instead!
> (`yarn config set nodeLinker node-modules`, revert to use pnp by `yarn config set nodeLinker pnp`)

```bash
# install
yarn

# run dev server
yarn dev
yarn dev --turbo

# build
yarn build
yarn buuld --turbo

# run production server
yarn start

# lint
yarn lint

# prettier
yarn prettier

# clean
yarn clean

# reinstall
yarn reinstall

# run test in watch mode
yarn test
```

## Notes

- To change the print width rules: change in 3 places:
  - `.vscode/settings.json/prettier.printWidth`
  - `.vscode/settings.json/editor.rulers`
  - `.prettierrc.printWidth`