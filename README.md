E-FarmConnect Zambia: Smart Farming Solutions
E-FarmConnect Zambia is a web application designed to empower farmers in Zambia and Southern Africa with smart farming solutions, providing valuable information and tools even when offline.

Table of Contents
Features

Technologies Used

Setup and Running Locally

Deployment with GitHub Pages

Usage

Future Enhancements

Credits

License

Features
This application includes the following core functionalities:

Live Weather:

Fetches and displays current weather conditions (temperature, humidity, wind speed, description) for a specified city using the OpenWeatherMap API.

Provides weather-based alerts for farming activities.

Crop Advisor:

Offers AI-powered (rule-based) recommendations for optimal planting times, precise fertilizer application, and efficient harvesting strategies.

Recommendations are based on user-inputted crop type, soil conditions, and integrated real-time weather data.

Livestock Guide:

Provides guidance on health monitoring, feeding schedules, breeding management, and housing tips for various livestock types (e.g., Cattle, Goats, Poultry, Sheep).

Recommendations consider user-inputted animal type, specific concerns, and current weather conditions.

Farm Logbook:

Allows farmers to track expenses, yields, and daily farm activities through easy data entry.

Entries are saved locally in the browser's localStorage for persistence across sessions.

Supports adding new entries, viewing a list of recent entries, deleting individual entries, and clearing all entries.

Offline Mode:

Designed to provide full functionality even without an internet connection (though Live Weather will require internet to fetch new data).

Responsive Design:

Ensures a user-friendly experience across various devices (mobile, tablet, desktop).

Technologies Used
HTML5: Structure of the web pages.

CSS3: Styling and layout, including responsive design.

JavaScript (ES6+): Core logic for interactivity, data handling, and API integration.

OpenWeatherMap API: For fetching live weather data.

localStorage: Client-side data persistence for the Farm Logbook.

Font Awesome: For various icons used throughout the application.

Setup and Running Locally
To get a copy of this project up and running on your local machine, follow these simple steps:

Clone or Download:

If you have Git, clone the repository:

git clone <repository-url>

Alternatively, download the ZIP file of the repository and extract it to your desired folder.

Navigate to Project Directory:

cd E-FarmConnect-Zambia

(Replace E-FarmConnect-Zambia with your actual project folder name if different)

Open index.html:

Simply open the index.html file in your web browser (e.g., by double-clicking it).

Important Note for Live Weather:
The Live Weather feature requires an OpenWeatherMap API key. Ensure that the API_KEY variable in script.js is set to your valid key. If you encounter a 401 Unauthorized error, your API key might be incorrect or not yet active.

Deployment with GitHub Pages
You can easily host this static website using GitHub Pages, making it accessible online.

Create a GitHub Repository:

Go to GitHub and create a new public repository (e.g., e-farmconnect-zambia).

Important: If you want your site to be yourusername.github.io, name the repository exactly that. Otherwise, a regular repository name will result in a URL like yourusername.github.io/repository-name/.

Push Your Code to GitHub:

Initialize a Git repository in your project folder (if you haven't already):

git init

Add your files:

git add .

Commit your changes:

git commit -m "Initial commit of E-FarmConnect Zambia app"

Link to your GitHub repository:

git remote add origin https://github.com/your-username/your-repository-name.git

(Replace your-username and your-repository-name)

Push your code:

git push -u origin master

(Or main if that's your default branch name)

Enable GitHub Pages:

On GitHub, navigate to your repository.

Click on "Settings" (usually near the top right).

In the left sidebar, click on "Pages".

Under "Build and deployment", for "Source", select "Deploy from a branch".

Under "Branch", select your primary branch (e.g., main or master) and choose the / (root) folder.

Click "Save".

Access Your Live Site:

GitHub Pages will now build and deploy your site. This process usually takes a few minutes.

Once deployed, the URL for your live site will be displayed on the "Pages" settings page (e.g., https://your-username.github.io/your-repository-name/).

Usage
Navigation: Use the navigation bar at the top to jump between sections (Home, Features, Benefits, Timeline, Future, Contact).

Live Weather: Enter a city name in the input field within the "Live Weather" card and click "Get Weather" to fetch local weather data.

Crop Advisor: Input your desired crop type (e.g., "Maize", "Soybeans", "Groundnuts", "Wheat") and soil type (e.g., "Loam", "Sandy", "Clay") into the "Crop Advisor" card and click "Get Advice" for recommendations.

Livestock Guide: Enter an animal type (e.g., "Cattle", "Goats", "Poultry", "Sheep") and a specific concern (e.g., "Health", "Feeding", "Breeding", "Housing") into the "Livestock Guide" card and click "Get Guide" for tailored advice.

Farm Logbook: Use the input fields in the "Farm Logbook" card to record activities, expenses, and yields. Click "Save Entry" to save your data. Entries persist locally. You can also delete individual entries or clear all.

Future Enhancements
Potential future developments for E-FarmConnect Zambia could include:

Full Backend & Database: Migrating localStorage data to a cloud database (like Firebase Firestore) for multi-device synchronization and collaborative features.

Advanced AI/ML: Implementing more sophisticated machine learning models for predictions and recommendations based on broader datasets.

IoT Sensor Integration: Connecting with real-time farm sensors (soil moisture, temperature) for more precise recommendations.

Farmer Marketplace: A platform for farmers to buy and sell produce directly.

Multi-language Support: Adding support for local African languages.

User Authentication: Implementing secure login and user profiles.

Credits
Developed by Albert Mulenga for E-FarmConnect Zambia.

License
© 2025 Albert Mulenga for E-FarmConnect Zambia. All rights reserved.
