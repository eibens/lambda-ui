# Linking

Linking in Litdoc can be done by importing the module and passing it to the
template literal as a value.

## Example

Consider a simple homepage, with a contact page and sitemap. These pages are
interlinked in the following way:

- The homepage links to the contact page, so that a user can find the authors,
  and it links to the sitemap, so that a user can find pages.
- The contact page links to the homepage, so that a user can find information
  online.
- The sitemap links to all of the above, as well as itself, in order to provide
  the user with a complete overview of the website.

:file/homepage.ts:

:file/contact.ts^:

:file/sitemap.ts^:

This is the output:

It may surprise you, that this works. You might wonder if this is even valid use
of TypeScript. Or you might not see

> This is wrinkling my brain.
>
> --- Troy Barnes (Community, portrayed by Donald Glover)
