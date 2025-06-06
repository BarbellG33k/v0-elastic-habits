using the slogans found in the JSON file under the assets folder, rotate a message displayed on the homepage, that is randomly chosen from the values in the file.

We need a separate page that is accessed from a home page link or button that reads, some thing like "Show me how to use the app", and create content for that page that accomplishes exactly that.

the link to "Buy me a coffe" in the about section of the main page should include at least the same coffee cup icon found next to the link in the footer, but preferably should be more attention catching without being obnoxious.

--------

I've implemented all three requested features:

## 1. Rotating Slogans

- Created a `SloganRotator` component that randomly selects and displays slogans from the JSON file
- Slogans rotate every 4 seconds with a smooth fade transition
- Added to the homepage welcome screen for unauthenticated users


## 2. "How to Use" Tutorial Page

- Created a comprehensive tutorial page at `/how-to-use`
- Added a "Show me how to use the app" button on the homepage
- The page includes:

- Step-by-step guide for getting started
- Explanation of the elastic habits concept
- Detailed instructions for creating habits
- Daily tracking guidance
- Progress monitoring explanation
- Success tips and best practices
- Call-to-action buttons to start using the app

## 3. Enhanced "Buy Me a Coffee" Link

- Updated the about section with a more prominent coffee link
- Added the coffee icon plus an emoji for extra visual appeal
- Styled as an attractive gradient button with hover effects
- Maintains good taste while being more attention-catching than plain text


The implementation maintains accessibility with proper ARIA labels, is fully responsive, and follows the existing design patterns of your app.
