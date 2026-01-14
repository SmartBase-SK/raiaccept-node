# Building TypeScript Code

## Quick Build

To build the TypeScript code, run these commands from the `raiaccept_api_client` directory:

```bash
cd raiaccept_api_client
npm install
npm run build
```

This will:
1. Install TypeScript and other dependencies
2. Compile all TypeScript files from `src/` to `dist/`
3. Generate type definition files (`.d.ts`) in `dist/`

## Build Output

After building, you'll find:
- Compiled JavaScript files in `dist/`
- Type definition files (`.d.ts`) in `dist/`
- Source maps (`.map`) in `dist/`

## Watch Mode

For development, you can use watch mode:

```bash
npm run build:watch
```

This will automatically recompile when files change.

## Verification

After building, verify the output:

```bash
# Check if dist directory was created
ls dist/

# Should see files like:
# - dist/index.js
# - dist/index.d.ts
# - dist/RaiAcceptService.js
# - dist/RaiAcceptService.d.ts
# etc.
```

## Using the Built Code

Once built, you can update imports in your main app to use the compiled version:

```typescript
// Instead of:
import { RaiAcceptService } from "../raiaccept_api_client/src/index.js";

// Use:
import { RaiAcceptService } from "../raiaccept_api_client/dist/index.js";
```

Or keep using `src/` if your build system (like Vite) handles TypeScript directly.

## Troubleshooting

If you encounter build errors:

1. **Check TypeScript version**: Ensure TypeScript 5.2+ is installed
2. **Check node_modules**: Run `npm install` to ensure all dependencies are installed
3. **Check tsconfig.json**: Verify the configuration is correct
4. **Check imports**: Ensure all `.js` extensions are present in import statements (required for ES modules)

## Next Steps After Building

1. ✅ Build completes successfully
2. ✅ Verify `dist/` directory contains compiled files
3. ✅ Run tests: `npm run unit-tests` and `npm run integration-tests`
4. ✅ Update main app imports if needed
5. ✅ Remove old `.js` files from `src/` (after verification)
