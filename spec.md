## openfreebooks

this project is free internet textbooks for elementary schools to university students. completely free, static and open source. 

this project is build using zola. interactivity by solid js. deployed to cloudflare. 

canvas feature use [jsoncanvas](https://jsoncanvas.org/spec/1.0/) standard by Obsidian. Viewer is [JSON canvas viewer](https://github.com/Hesprs/JSON-Canvas-Viewer).

not markdown, html based. but in every page, we should have a copy as md button using [defuddle](https://github.com/kepano/defuddle).

we don't i18n. i18n will be solved in future by big companies.

search is supported by pagefind.

we have a catalog of subjects. Each subject will have chapters. Each chapters can be labelled (multiple) cirriculum. E.g. DSE, IB, A level. so that user knows if a chapter is needed in a cirriculum. Each subject should show all chapters by default (all cirriculum). chapters should be sequential in a tree structure. users can filter by themselves. 