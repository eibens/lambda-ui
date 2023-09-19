# :icons/file: Developer Notes

These are unsorted notes for the development of Litdoc.

#### `litdoc` import specifier

Litdoc internally uses the `litdoc/` import specifier to import its own modules.

- :^icons/thumbs-up?color=green: Utilities can use absolute internal imports.
- :^icons/thumbs-down?color=red: Users of the library have to add the `litdoc/`
  entry to their import map.

#### `slate` dependency

Litdoc relies on slate for document transformation. While this dependency can be
kept out of the parsing step, features on parsed documents, such as extraction
of metadata (title, icons, etc.) is much easier with slate.

#### Typed Linking

Litdoc should support linking to other pages in the documentation. Links can be
type checked by importing the linked module and passing it to the template
literal as a value.

Litdoc can then refer to the module manifest to match the value to a page.

#### Zero- and multi-manifest

Litdoc currently uses a generated manifest file that exports a set of file
names, as well as their exports, if the file is a TypeScript module.

- :^icons/square: Allow for a zero-manifest mode, where modules are discovered
  solely through module resolution.
  - File names or contents must be provided manually, if this mode is used and
    file system access is needed. File system is required for plain Markdown
    files and for literate TypeScript modules.
  - One could pass the import.meta.url value to litdoc, which would then be
    available to Litdoc via the module export. The drawback of this

#### Token implementations

Tokens are not implemented fully (see unit test output).

- :^icons/square: Tokens that stick to the node afterwards.
- :^icons/square: Trim whitespace surrounding sticky tokens.

#### File watcher for Markdown files

Currently using the out-of-the-box `--watch` flag of deno. This works for
changes in the dependency graph, but not for changes of other files, like
Markdown documents. This hinders the use of litdoc with plain Markdown instead
of the more powerful literate TypeScript.

#### Back button broken

The back button currently does not work when running litdoc in development mode
via `deno task start`. It works when running `deno task preview`.
