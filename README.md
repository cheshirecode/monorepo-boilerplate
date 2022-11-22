# rushmonorepo-boilerplate

## add package
`rush add -p <Package>` in current project

## Publish
1. ensure `common/config/rush/.npmrc-publish` has relevant auth like

```
//registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}
```

2. generate changelog `rush change`
3. publish `rush publish -a -p --add-commit-details -c HEAD -b main`
