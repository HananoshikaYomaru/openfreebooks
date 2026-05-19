## openfreebooks

this project is free internet textbooks for elementary schools to university students. completely free, static and open source. 

this project is build using zola. interactivity by solid js. deployed to cloudflare. 

catalog map feature uses Mermaid with pan and zoom interactions.

not markdown, html based. but in every page, we should have a copy as md button using [defuddle](https://github.com/kepano/defuddle).

we don't i18n. i18n will be solved in future by big companies.

search is supported by pagefind.

we have a catalog of subjects. Each subject will have chapters. Each chapters can be labelled (multiple) cirriculum. E.g. DSE, IB, A level. so that user knows if a chapter is needed in a cirriculum. Each subject should show all chapters by default (all cirriculum). chapters should be sequential in a tree structure. users can filter by themselves. in the chapter we don't specify or mention the cirriculum anymore.

we need to have a question bank feature. since this is purely static sites, question answer needs to be determined and able to grade in advanced. 

1. multiple-choice
2. short-answer
3. fill-in-the-blank
4. choice
5. ranking

question bank not only show answer but also steps and calcultion

## Chapters requirements 

### Maths 

each chapter needs to have the following other than the core content: 

1. history - when did people first study this? why? how? 
2. derivation / calculation
3. check point / thought provoking questions
4. real life applications
5. questions bank - some exams questions from easy, intermediate, difficult, hardcore
6. reference (if any)

the order is that core content (with some interactive demos) -> history -> derivation -> check point -> applications -> question bank 