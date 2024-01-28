## CitronJS
![Group 3](https://github.com/LarsIsHere/CitronJS/assets/118752107/ff1411ab-fdb4-4f6f-ad40-718a3836734e)<svg width="50" height="50" viewBox="0 0 237 239" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="118.5" cy="118.5" r="118.5" fill="white"/>
<circle cx="118" cy="118" r="105" fill="#F7B81A"/>
<circle cx="118" cy="118" r="105" fill="#F7B81A"/>
<circle cx="118" cy="118" r="105" fill="#F7B81A"/>
<circle cx="118" cy="118" r="105" fill="#F7B81A"/>
<circle cx="118" cy="118" r="95" fill="#F7B81A"/>
<circle cx="118" cy="118" r="95" fill="#F7B81A"/>
<circle cx="118" cy="118" r="95" fill="#F7B81A"/>
<circle cx="118" cy="118" r="95" fill="#F2E2B8"/>
<path d="M127.242 93.5C123.008 100.833 112.423 100.833 108.189 93.5L85.2394 53.75C81.0055 46.4167 86.2979 37.25 94.7657 37.25L140.665 37.25C149.133 37.25 154.425 46.4167 150.191 53.75L127.242 93.5Z" fill="#D7B150"/>
<path d="M124.562 86.5C121.868 91.1667 115.132 91.1667 112.438 86.5L93.8183 54.25C91.124 49.5833 94.4919 43.75 99.8805 43.75L137.12 43.75C142.508 43.75 145.876 49.5833 143.182 54.25L124.562 86.5Z" fill="#E2C26F"/>
<path d="M143.614 114.263C135.146 114.263 129.854 105.096 134.087 97.7629L157.19 57.7477C161.424 50.4144 172.009 50.4144 176.243 57.7477L199.346 97.7628C203.579 105.096 198.287 114.263 189.819 114.263L143.614 114.263Z" fill="#D7B150"/>
<path d="M45.391 114.263C36.9232 114.263 31.6308 105.096 35.8647 97.7629L58.9674 57.7477C63.2013 50.4144 73.7861 50.4144 78.02 57.7477L101.123 97.7628C105.357 105.096 100.064 114.263 91.5965 114.263L45.391 114.263Z" fill="#D7B150"/>
<path d="M94.937 196.84C86.4692 196.84 81.1768 187.673 85.4107 180.34L108.513 140.324C112.747 132.991 123.332 132.991 127.566 140.324L150.669 180.339C154.903 187.673 149.61 196.84 141.143 196.84L94.937 196.84Z" fill="#D7B150"/>
<path d="M134.087 139.455C129.854 132.122 135.146 122.955 143.614 122.955L189.819 122.955C198.287 122.955 203.579 132.122 199.346 139.455L176.243 179.47C172.009 186.804 161.424 186.804 157.19 179.47L134.087 139.455Z" fill="#D7B150"/>
<path d="M35.8647 139.455C31.6308 132.122 36.9231 122.955 45.3909 122.955L91.5965 122.955C100.064 122.955 105.357 132.122 101.123 139.455L78.02 179.47C73.7861 186.804 63.2013 186.804 58.9674 179.47L35.8647 139.455Z" fill="#D7B150"/>
<path d="M147.874 108.244C142.486 108.244 139.118 102.411 141.812 97.7439L160.432 65.4939C163.126 60.8272 169.862 60.8272 172.556 65.4939L191.176 97.7439C193.87 102.411 190.502 108.244 185.113 108.244L147.874 108.244Z" fill="#E2C26F"/>
<path d="M141.812 140.244C139.118 135.577 142.486 129.744 147.874 129.744L185.113 129.744C190.502 129.744 193.87 135.577 191.176 140.244L172.556 172.494C169.862 177.161 163.126 177.161 160.432 172.494L141.812 140.244Z" fill="#E2C26F"/>
<path d="M112.438 147.5C115.132 142.833 121.868 142.833 124.562 147.5L143.182 179.75C145.876 184.417 142.508 190.25 137.12 190.25H99.8805C94.4919 190.25 91.124 184.417 93.8183 179.75L112.438 147.5Z" fill="#E2C26F"/>
<path d="M87.1134 129.744C92.502 129.744 95.8699 135.577 93.1756 140.244L74.5561 172.494C71.8618 177.161 65.126 177.161 62.4317 172.494L43.8122 140.244C41.1179 135.577 44.4857 129.744 49.8743 129.744L87.1134 129.744Z" fill="#E2C26F"/>
<path d="M93.1756 97.7439C95.8699 102.411 92.502 108.244 87.1134 108.244L49.8743 108.244C44.4857 108.244 41.1179 102.411 43.8122 97.7439L62.4317 65.4939C65.126 60.8272 71.8618 60.8272 74.5561 65.4939L93.1756 97.7439Z" fill="#E2C26F"/>
</svg>



CitronJS is a js library to use alongside HTML. What it offers is an easy way to paste a lot of big repetetive code.
The way it works is that you make "samples" that you can then use in your code as much as you need. 

### Installation
Currently the only way to include CitronJS is through script:src github. 

```
https://raw.githubusercontent.com/LarsIsHere/CitronJS/main/src/v1-0-0/index.min.js
```

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

