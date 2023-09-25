# Litdoc Assets Folder

This folder contains source code copied from external repositories, ideally with
their respective licenses. Ideally, this folder would be empty, meaning all
these dependencies are loaded from a CDN. The reason for the local copies is
that some of these dependencies might not be difficult to use with Deno or

- `monaco`: Typings needed for monaco editor. Not sure if we could not just
  import it from CDN. Maybe there were some incompatibilities when using the
  original source?
- `swc`: WASM file and TypeScript bindings for the SWC parser. This was included
  mainly to easily load the WASM file locally, back when I thought it needed to
  be loaded each time a file needed to be parsed (instead of just instantiating
  the WASM code multiple times). Might still be useful to have it locally, as it
  is not automatically cached and each build therefore requires network
  connection.
- `urlpattern` (currently unused): Copied this over from Flowery Web App. Seems
  to be some Deno port of a Polyfill by Intel. URLPattern is still not supported
  by all major browsers (Firefox, Safari), but it is really useful for more
  complex routing.
