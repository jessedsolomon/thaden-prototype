# Usage
## Background Color Blending
```html
<section fx-background="<color>">...</section>
```
### Notes:
The rendered element is placed as the first child of the section, so beware using CSS any(`*`) selectors

## Parallax
```html
<your-element fx-parallax="[ <number> | near | medium | far ] [, <number> | near | medium | far ]?">...</your-element>
```

### Notes:
`near`, `medium` & `far` are just substitues for the values `3`, `2` & `1` respectively

The parallax amount (in pixels) is saved into the local CSS variable `--parallax-[x,y]` and the transformation is applied by default, though it can be overwriten.
```css
/* parallax transform overwrite example */
.example {
	transform: translate(calc(-50% + var(--parallax-x), calc(-50% + var(--parallax-y)))
}
```