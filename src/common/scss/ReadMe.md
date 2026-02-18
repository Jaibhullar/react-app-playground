# Partial SCSS
Partial SCSS files can be placed in this folder for site wide import via a @scss/[partial name without underscore] statement.

e.g.
```scss
@use '@scss/importSample' as sample;
...
.myClass{
    @include sample.shade-area;
}
```
When used with modular CSS, ensure that only mixins or functions are in the partial file, as any classes etc will be duplicated into any imported file.