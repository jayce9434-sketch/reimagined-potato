# QA Report

Build: Swarm Symphony 1.0.0

Checks completed:
- 29 root-level project files; no directories inside the project package.
- Broad Unicode scan found zero emoji code points in text/source files.
- No external scripts, stylesheets, fonts, CDNs, or runtime asset hosts.
- `node --check` passed for every JavaScript source file.
- `manifest.webmanifest` parsed successfully and all referenced icons exist.
- Every local `src` and `href` in `index.html` resolves to an included file.
- Every service-worker cache entry resolves to an included file.
- Local HTTP server returned the entry point and stylesheet successfully.
- Core-logic simulation passed: save creation, six-island data, 36 species, 144 form entries, breeding, offline breeding-to-nursery advancement, and hatching.
- Capacity test passed: every island's final castle exceeds the bed total needed for every native species.
- Five desktop/mobile visual QA renders were generated from the actual project data, vector monster renderer, forms, island themes, and layout rules.

Environment limitation:
- The container's managed Chromium has an administrator URL block policy that blocks local files, localhost, data URLs, and even `about:blank`. Because bypassing platform browser policy would be inappropriate, a true Chromium runtime screenshot pass could not be completed in this environment. The five included images are build-data visual QA renders, not falsely labeled live-browser captures. A final live interaction pass should be done after the files are on GitHub Pages or opened on the target iPad/desktop browser.

Included QA renders:
- `test-01-moss.png`
- `test-02-rain.png`
- `test-03-ember.png`
- `test-04-tempest.png`
- `test-05-mobile.png`
