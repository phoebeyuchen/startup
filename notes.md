# Notes for CS260

## Git

This is the pattern that you want to make a reflexive part of your development process.
1. Pull the repository's latest changes from GitHub (git pull)
2. Make changes to the code
3. Commit the changes (git commit)
4. Push the changes to GitHub (git push)

## Lease a domain name

1. Open the AWS browser console and log in.
2. Use Route 53 to purchase a domain name.
3. Set up your DNS records using Route 53. Make sure you have a record representing your root domain name, and a wild card subdomain.
4. Test that you can access your server using your domain name and any subdomain name.

## HTML

### Structure elements
The two major purposes of HTML is to provide structure and content to your web application. 
Some of the common HTML structural elements include `body`, `header`, `footer`, `main`, `section`, `aside`, `p`, `table`, `ol/ul`, `div`, and `span`. 
We demonstrate the use of each element with the following HTML document. 
It starts with the top level content `body`. 
The body has three children, a `header`, `main`, and `footer`. 
Each of the body children then contains other structural content.

### Input Element
- form: Input container and submission
- fieldset: Labeled input grouping
- input: Multiple types of user input
- select: Selection dropdown
- optgroup: Grouped selection dropdown
- option: Selection option
- textarea: Multiline text input
- label: Individual input label
- output: Output of input
- meter: Display value with a known range

### Attribute for input
- name: The name of the input. This is submitted as the name of the input if used in a form
- disabled: Disables the ability for the user to interact with the input
- value: The initial value of the input
- required: Signifies that a value is required in order to be valid

## CSS

### Flexbox
- justify-content: Aligns flex items along the main axis.
- align-items: Aligns flex items along the cross-axis.

### Common Units
- px: Pixels
- %: Percentage
- em: Relative to the parent element
- rem: Relative to the root element
- vh / vw: Relative to the viewport height/width

## JavaScript 

### Object Function	
- pop: Remove an item from the end of the array	
- slice: Return a sub-array	
- sort: Run a function to sort an array in place	
- values: Creates an iterator for use with a for of loop	
- find: Find the first item satisfied by a test function	
- forEach: Run a function on each array item	
- reduce: Run a function to reduce each array item to a single item	
- map: Run a function to map an array to a new array	
- filter: Run a function to remove items	
- every: Run a function to test if all items match 
- some: Run a function to test if any items match	

## React

### Core Concepts
- Components: Reusable UI pieces (like functions that return HTML)
- Props: Data passed to components (read-only)
- State: Data managed within components (changeable)
- JSX: JavaScript XML syntax for writing HTML-like code
- Virtual DOM: Lightweight copy of the DOM for performance

### Common Hooks
- useState: For component state
```jsx
const [count, setCount] = useState(0);
```
- useEffect: For side effects (like API calls)
```jsx
useEffect(() => {
  // runs after render
}, [dependencies]);
```
- useRef: For DOM references
```jsx
const inputRef = useRef(null);
```

### Router Components
- BrowserRouter: Wrapper for routing
- Routes: Container for routes
- Route: Individual route
- Link: Navigation without refresh
- NavLink: Link with active state
```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
</BrowserRouter>
```

### Setup Commands
1. Create project: `npm create vite@latest app-name -- --template react`
2. Install dependencies: `npm install`
3. Run development: `npm run dev`
4. Build: `npm run build`

### File Structure
```plaintext
src/
  components/   # React components
  assets/       # Images, fonts
  App.jsx      # Main component
  main.jsx     # Entry point
```