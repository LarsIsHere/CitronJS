## CitronJS
CitronJS is a js library to use alongside HTML. What it offers is an easy way to paste a lot of big repetetive code.
The way it works is that you make "samples" that you can then use in your code as much as you need. 

### Making a Sample
Make a new .citron file and include it in your main html file. 
```html
<sample name="Sample 1">
  <h1>Hello, { foo }!</h1>
</sample>
```
This is a sample with the content "Hello, " . { foo } represents a variable that you can then fill with whatever you need to dynamically change the content.

To finish we need to export the sample and the variable:
```html
<citron>
  <export sample="Sample 1">
    <var var="foo" default="World">
  </export>
</citron>

<sample name="Sample 1">
  <h1>Hello, { foo }!</h1>
</sample>
```

now that we have done that we can use this sample in our html file as we wish by writing
```html
<sample name="Sample 1">
```
result: "Hello, World!"

to change the var value, use: 
```html
<sample name="Sample 1" foo="you">
```
result: "Hello, you!"



#### Other features
| tag | Description |
| ------------ | ------------ |
|  bind | Binds a variable to an element. If you put the id of an input element the var will automatically adopt the inputs value. |

