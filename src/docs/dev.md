# :^icons/file: Developer Notes

These are unsorted notes for the development of Litdoc.

---

#### `litdoc` import specifier

> **outdated**

Litdoc internally uses the `litdoc/` import specifier to import its own modules.

- :^icons/thumbs-up?color=green: Utilities can use absolute internal imports.
- :^icons/thumbs-down?color=red: Users of the library have to add the `litdoc/`
  entry to their import map.

#### `slate` dependency

> **outdated**

Litdoc relies on slate for document transformation. While this dependency can be
kept out of the parsing step, features on parsed documents, such as extraction
of metadata (title, icons, etc.) is much easier with slate.

#### Typed Linking

Litdoc should support linking to other pages in the documentation. Links can be
type checked by importing the linked module and passing it to the template
literal as a value.

Litdoc can then refer to the manifest to match the value to a page.

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

#### Link improvements

- Preview popover
- List of link on page
- Check links at runtime and on build

#### Lit override

Allow users to override litdoc configuration by passing an argument to the `lit`
function. This would allow users to define routing and file manifests within the
document.

This feature would also provide a general way of providing the import.meta.url
of the current module as a manifest entry to litdoc. This would solve zero- or
multi-manifest projects.

#### Investigate interactive islands

Does a litdoc document need client-side JavaScript? Right now, the whole
document is embedded as a Fresh island. This defeats the purpose of islands,
where interactivity should be limited to the interactive parts of the document.

For non-island JSX, it might be possible to allow the user to provide a generic
island component, imported from their Fresh project. Litdoc would pass the value
token as a string to the island and then retrieve the associated value from the
client-side module. This would embed all interactive parts of the document as
instances of this generic island, without the user having to create new islands
for every piece of JSX in their documents.

- :^icons/question: Can islands be embedded in the document?
- :^icons/question: Is it possible to automatically wrap values in islands?

#### Litdoc CLI

Allow users to start any project as a litdoc website.

- Litdoc config file in project folders. Configure manifest and route
  generation.
- Dev server that does not require any additional frontend dependencies.
- Build command that generates static and interactive sites.

#### Function calling in templates

Functions that evaluate with a litdoc context as an argument could be allowed
inside template literal tags. It might be necessary to have some kind of
'status' field that indicates the progression in the pipeline. Otherwise, using
the litdoc context could easily lead to circular dependencies at runtime.

#### Custom module resolution

Currently, litdoc document are expected to export a `doc` function that produces
an array of template calls. In the future, the user should be able to supply
custom module resolution functions that allow for more complex document
structures.

For example, an interactive document may export a set of actions. An action is a
function associated with a template call that documents it. We may either pass
the actions to an `action` tag that collects it, or structure the module in a
certain way, for example by exporting an `actions` object.

#### Custom token resolution

The user provides a custom token resolution function that takes a token and
renders it as a preact node.

> - :^icons/thumbs-down: Rendering as preact node seems very specific. This
  > might be something to revisit when function calling in templates is
  > implemented, where there might be multiple pipeline steps that allow token
  > resolution.

Applications for custom token resolution:

- Custom color themes.
- Custom icons sets and mixing of icon sets.
- Tags: `:tag/nature?icon=flower`

#### Tags

Tags are small visual indicators. They can contain an icon, a text, or other
primitive content.

> Can be implemented with custom token resolution.

#### Manifests becomes Litdoc

Manifests could be generated as a litdoc module:

```ts
import * as $0 from "./index.ts";
import * as $1 from "./sitemap.ts";

export const doc = lit({
  url: import.meta.url,
  routes: {
    "/": $0,
    "/sitemap": $1,
    "/contact": 2,
  },
  files: {
    "./index.ts": $0,
    "./sitemap.ts": $1,
    "./contact.md": 2,
  },
});
```

#### Config shortcut for module url

Common use case when config should be generated implicitly:

```ts
// This config entry...
{
  url: import.meta.url,
  route: "/",
}

// ... should be a shorthand for this,
// where `module` is the current module.
{
  routes: {
    "/": module,
  },
  manifest: {
    [import.meta.url]: module
  }
}
```

#### Create litdoc from doc

Right now, the manifest is provided by the user rather inconveniently. Deno
makes it possible to import modules cyclically. This means that a whole
collection of documents could be created from a single module.

- With custom config via lit function, the user can define their routes and
  manifest entries locally. Litdoc can then generate the manifest from the
  individual configs. Override rules must be clear in case of route / manifest
  collisions.
- Discovery could be enhanced further by looking for `doc` exports inside
  template values. A user would only need to import the module and pass it into
  a template literal to have it included in the discovery.

#### Config discovery

Discovery is an abstraction of methods for finding documents and linking them
together via routes and file URLs.

- File system based by iterating over all files and folders.
- Import based by parsing import statements and following them.
- Manual by providing a config.
- Runtime based by following docs inside template values.
- Hybrid by combining the above.
