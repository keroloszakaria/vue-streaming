## Publishing to npm

Before publishing to npm, make sure to:

1. Update the version in `package.json`
2. Build the package:
   ```bash
   npm run build
   ```
3. Test the build:
   ```bash
   npm pack
   ```
4. Review the contents of the generated `.tgz` file
5. Publish to npm:
   ```bash
   npm publish
   ```

Note: Make sure you're logged in to npm (`npm login`) and have the necessary permissions to publish.
