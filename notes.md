# tasks
## table interactions
### click and drag
### copy and paste
## data structures
### set state of nested data more space-efficiently
either with less nesting
or maybe using map in a clever way
### ability to save patterns
## UI changes
### form sidepanel for dimensions of loom
## view changes
### continuity between cells
### drop shadow + z-index effect
## app interactions
### list of patterns by name
### 'genetic' pattern mutation
### markov pattern mutation

# roadmap
## settle on serializable data structure for patterns


# ideas for solutions
## serializable pattern data
should be easily written without notation

research order of number in weaving draft diagrams

{

threading: [1,2,3,4,1,2,3,4],

tieup: [[1,4],[1,2],[2,3],[3,4]],

treadling: [1,2,3,4,1,2,3,4]

}

alt

{
  
threading: "1-2-3-4-1-2-3-4",

tieup: [[1,4],[1,2],[2,3],[3,4]],

treadling: "1x4-2x4-3x4-4x4"

}