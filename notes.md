# Notes for CS260

## Git

This is the pattern that you want to make a reflexive part of your development process.
1. Pull the repository's latest changes from GitHub (git pull)
2. Make changes to the code
3. Commit the changes (git commit)
4. Push the changes to GitHub (git push)

## HTML

### structure elements
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

### Lease a domain name
1. Open the AWS browser console and log in.
2. Use Route 53 to purchase a domain name.
3. Set up your DNS records using Route 53. Make sure you have a record representing your root domain name, and a wild card subdomain.
4. Test that you can access your server using your domain name and any subdomain name.
