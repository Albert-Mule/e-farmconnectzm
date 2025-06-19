document.addEventListener('DOMContentLoaded', function() { // Removed async here as Firebase init is gone

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });

    // Form Submission
    const signupForm = document.getElementById('signup-form');

    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const farmType = document.getElementById('farm-type').value;
            const message = document.getElementById('message').value;

            // Here you would typically send this data to a server
            // For now, we'll just show a custom message box
            displayMessageBox(`Thank you, ${name}! Your information has been submitted. We'll contact you soon.`);

            // Reset the form
            signupForm.reset();
        });
    }

    // Custom Message Box (instead of alert/confirm)
    function displayMessageBox(message, isConfirm = false, onConfirm = null) {
        const messageBox = document.createElement('div');
        messageBox.className = 'message-box';
        let buttonsHtml = `<button class="message-box-ok-btn btn-primary">OK</button>`;

        if (isConfirm) {
            buttonsHtml = `
                <button class="message-box-cancel-btn btn-secondary">Cancel</button>
                <button class="message-box-confirm-btn btn-primary">Confirm</button>
            `;
        }

        messageBox.innerHTML = `
            <div class="message-box-content">
                <p>${message}</p>
                <div class="message-box-buttons">${buttonsHtml}</div>
            </div>
        `;
        document.body.appendChild(messageBox);

        if (isConfirm) {
            messageBox.querySelector('.message-box-confirm-btn').addEventListener('click', () => {
                document.body.removeChild(messageBox);
                if (onConfirm) onConfirm();
            });
            messageBox.querySelector('.message-box-cancel-btn').addEventListener('click', () => {
                document.body.removeChild(messageBox);
            });
        } else {
            messageBox.querySelector('.message-box-ok-btn').addEventListener('click', () => {
                document.body.removeChild(messageBox);
            });
        }
    }


    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Adjust for fixed header
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Add active class to nav items on scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;

        // Add/remove sticky class to navbar
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (scrollPosition > 50) {
                navbar.classList.add('sticky');
            } else {
                navbar.classList.remove('sticky');
            }
        }

        // Highlight active nav item
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelector('.nav-menu a[href*=' + sectionId + ']')?.classList.add('active');
            } else {
                document.querySelector('.nav-menu a[href*=' + sectionId + ']')?.classList.remove('active');
            }
        });
    });

    // ----------------------------------------------------
    // LIVE WEATHER API INTEGRATION LOGIC
    // ----------------------------------------------------
    const weatherDataContainer = document.getElementById('current-weather-data');
    const cityInput = document.getElementById('city-input');
    const getWeatherBtn = document.getElementById('get-weather-btn');

    // !!! IMPORTANT: Your actual OpenWeatherMap API Key !!!
    const API_KEY = '35d0ebb422b85a8660279312b1b5b5c0';
    // Corrected BASE_URL: should not include query parameters directly
    const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather?q=Lusaka&appid=35d0ebb422b85a8660279312b1b5b5c0&units=metric';


    // Default city (e.g., Lusaka, Zambia)
    const defaultCity = 'Lusaka,ZM';

    let currentFetchedWeather = null; // Store the last fetched weather for Crop Advisor and Livestock Guide

    async function fetchWeatherData(city) {
        if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
            weatherDataContainer.innerHTML = '<p style="color: red;">Error: Please replace "YOUR_API_KEY_HERE" with your actual OpenWeatherMap API key in script.js.</p>';
            return;
        }

        weatherDataContainer.innerHTML = '<p>Fetching weather data...</p>';
        try {
            const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('API key invalid or not activated. Please check your OpenWeatherMap API key.');
                }
                if (response.status === 404) {
                    throw new Error('City not found. Please check the spelling.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            currentFetchedWeather = { // Store relevant weather data
                temp: data.main.temp,
                humidity: data.main.humidity,
                wind_speed: data.wind.speed,
                weather_main: data.weather[0].main, // e.g., 'Clouds', 'Rain'
                weather_description: data.weather[0].description,
            };
            displayWeatherData(data);
        } catch (error) {
            console.error('Could not fetch weather data:', error);
            weatherDataContainer.innerHTML = `<p style="color: red;">Failed to load weather: ${error.message}.</p>`;
            currentFetchedWeather = null; // Clear if fetch fails
        }
    }

    function displayWeatherData(data) {
        if (!data || !data.main || !data.weather || data.weather.length === 0) {
            weatherDataContainer.innerHTML = '<p>No weather data available.</p>';
            return;
        }

        const cityName = data.name;
        const temperature = data.main.temp;
        const feelsLike = data.main.feels_like;
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;

        const weatherHtml = `
            <h4>${cityName}</h4>
            <img src="http://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${description}" class="weather-icon">
            <p><strong>Temperature:</strong> ${temperature}°C (Feels like: ${feelsLike}°C)</p>
            <p><strong>Conditions:</strong> ${description.charAt(0).toUpperCase() + description.slice(1)}</p>
            <p><strong>Humidity:</strong> ${humidity}%</p>
            <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
        `;
        weatherDataContainer.innerHTML = weatherHtml;
    }

    // Event listener for the "Get Weather" button
    if (getWeatherBtn) {
        getWeatherBtn.addEventListener('click', () => {
            const city = cityInput.value.trim();
            if (city) {
                fetchWeatherData(city);
            } else {
                displayMessageBox('Please enter a city name.');
            }
        });
    }

    // Fetch weather for the default city when the page loads
    if (weatherDataContainer) {
         fetchWeatherData(defaultCity);
    }

    // ----------------------------------------------------
    // CROP ADVISOR CLIENT-SIDE LOGIC
    // ----------------------------------------------------
    const cropTypeInput = document.getElementById('crop-type-input');
    const soilTypeInput = document.getElementById('soil-type-input');
    const getCropAdviceBtn = document.getElementById('get-crop-advice-btn');
    const cropAdvisorOutput = document.getElementById('crop-advisor-output');

    // Hardcoded crop data and rules (simulating an AI knowledge base)
    const CROP_DATA = {
        "maize": {
            "planting_window": "October - November (after first significant rains)",
            "fertilizer_timing": "Basal application at planting, top-dressing at V6 (6 leaf stage) and tasseling",
            "harvesting_period": "March - April (when moisture content is optimal)",
            "soil_types_preferred": ["loam", "clay-loam", "sandy-loam"],
            "min_rainfall_mm_month": 80, // Conceptual, for rule-based comparison
            "temp_range_celsius": [20, 32] // Optimal temperature range
        },
        "soybeans": {
            "planting_window": "November - December",
            "fertilizer_timing": "Starter fertilizer, nitrogen-fixing bacteria inoculant at planting",
            "harvesting_period": "April - May",
            "soil_types_preferred": ["sandy-loam", "loam"],
            "min_rainfall_mm_month": 60,
            "temp_range_celsius": [25, 30]
        },
        "groundnuts": {
            "planting_window": "November - December",
            "fertilizer_timing": "Minimal nitrogen, focus on phosphorus, potassium, calcium",
            "harvesting_period": "April - May (when leaves yellow and pods mature)",
            "soil_types_preferred": ["sandy", "sandy-loam"],
            "min_rainfall_mm_month": 50,
            "temp_range_celsius": [25, 30]
        },
        "wheat": {
            "planting_window": "May - June (winter wheat) or Oct - Nov (spring wheat in some regions)",
            "fertilizer_timing": "Pre-plant, tillering, and jointing stages",
            "harvesting_period": "August - September (winter wheat), April - May (spring wheat)",
            "soil_types_preferred": ["loam", "clay-loam"],
            "min_rainfall_mm_month": 60,
            "temp_range_celsius": [10, 25]
        }
    };

    // Mapping common soil type inputs to a standardized form for rules
    const SOIL_TYPE_MAPPING = {
        "loam": ["loam", "loamy"],
        "sandy": ["sandy", "sand"],
        "clay": ["clay", "clayey"],
        "sandy-loam": ["sandy loam", "sandy-loam"],
        "clay-loam": ["clay loam", "clay-loam"],
    };

    function normalizeSoilType(soilInput) {
        const lowerInput = soilInput.toLowerCase();
        for (const key in SOIL_TYPE_MAPPING) {
            if (SOIL_TYPE_MAPPING[key].includes(lowerInput)) {
                return key;
            }
        }
        return lowerInput; // Return as is if not found
    }

    function getCropRecommendations(cropType, soilTypeRaw, weatherData) {
        const soilType = normalizeSoilType(soilTypeRaw);
        const recommendations = {
            "planting_advice": "General planting advice based on region.",
            "fertilizer_advice": "General fertilizer advice.",
            "harvesting_advice": "General harvesting advice.",
            "alerts": []
        };

        const cropInfo = CROP_DATA[cropType];

        if (!cropInfo) {
            recommendations.alerts.push(`Crop type '${cropType.capitalize()}' is not currently in our advisor's database. Please check spelling or contact support.`);
            return recommendations;
        }

        // --- Planting Advice ---
        recommendations.planting_advice = `Optimal planting window for ${cropType.capitalize()}: ${cropInfo.planting_window}.`;
        if (!cropInfo.soil_types_preferred.includes(soilType)) {
            recommendations.alerts.push(`Warning: Your soil type '${soilTypeRaw.capitalize()}' (${soilType}) may not be ideal for ${cropType.capitalize()}. This crop prefers ${cropInfo.soil_types_preferred.map(s => s.capitalize()).join(', ')} soil types.`);
        }

        // Weather considerations for planting
        if (weatherData && typeof weatherData.temp === 'number') {
            const temp = weatherData.temp;
            const [minTemp, maxTemp] = cropInfo.temp_range_celsius;
            if (temp < minTemp || temp > maxTemp) {
                recommendations.alerts.push(`Current temperature (${temp}°C) is outside optimal range (${minTemp}-${maxTemp}°C) for ${cropType.capitalize()} planting.`);
            }
        }
        if (weatherData && weatherData.weather_main && weatherData.weather_main.toLowerCase().includes('rain')) {
             // This is very simplistic: assume if it's raining now, it's good for planting if crop needs it
        } else {
             // If not raining and crop needs high rainfall
        }

        // --- Fertilizer Advice ---
        recommendations.fertilizer_advice = `Fertilizer strategy for ${cropType.capitalize()}: ${cropInfo.fertilizer_timing}. Always perform a soil test for precise nutrient needs.`;

        // --- Harvesting Advice ---
        recommendations.harvesting_advice = `Harvesting period for ${cropType.capitalize()}: ${cropInfo.harvesting_period}. Monitor crop-specific indicators like maturity and moisture content.`;

        // Add weather-based alerts for other stages (conceptual)
        if (weatherData && weatherData.weather_main) {
            if (weatherData.weather_main.toLowerCase().includes('rain') && (cropType === 'maize' || cropType === 'wheat')) {
                recommendations.alerts.push("Rain during critical growth or harvest stages can impact yield. Monitor conditions.");
            }
            if (weatherData.temp > 35) {
                recommendations.alerts.push("High temperatures detected. Ensure crops are well-hydrated to mitigate heat stress.");
            }
        }

        return recommendations;
    }

    // Event listener for the "Get Advice" button
    if (getCropAdviceBtn) {
        getCropAdviceBtn.addEventListener('click', () => {
            const cropType = cropTypeInput.value.trim().toLowerCase();
            const soilType = soilTypeInput.value.trim().toLowerCase();

            if (!cropType || !soilType) {
                displayMessageBox('Please enter both Crop Type and Soil Type.');
                return;
            }

            cropAdvisorOutput.innerHTML = '<p>Getting AI-powered recommendations...</p>';

            const recommendations = getCropRecommendations(cropType, soilType, currentFetchedWeather);

            displayCropRecommendations(recommendations, cropTypeInput.value.trim());
        });
    }

    function displayCropRecommendations(recs, originalCropType) {
        if (cropAdvisorOutput) {
            let alertsHtml = '';
            if (recs.alerts && recs.alerts.length > 0) {
                alertsHtml = '<div class="alert-messages">';
                recs.alerts.forEach(alert => {
                    alertsHtml += `<p class="alert-item"><i class="fas fa-exclamation-triangle"></i> ${alert}</p>`;
                });
                alertsHtml += '</div>';
            }

            cropAdvisorOutput.innerHTML = `
                <h4>Recommendations for ${originalCropType.capitalize()}:</h4>
                <p><strong>Planting:</strong> ${recs.planting_advice}</p>
                <p><strong>Fertilizing:</strong> ${recs.fertilizer_advice}</p>
                <p><strong>Harvesting:</strong> ${recs.harvesting_advice}</p>
                ${alertsHtml}
            `;
        }
    }


    // ----------------------------------------------------
    // LIVESTOCK GUIDE CLIENT-SIDE LOGIC
    // ----------------------------------------------------
    const animalTypeInput = document.getElementById('animal-type-input');
    const concernInput = document.getElementById('concern-input');
    const getLivestockAdviceBtn = document.getElementById('get-livestock-advice-btn');
    const livestockGuideOutput = document.getElementById('livestock-guide-output');

    // Hardcoded livestock data and rules
    const LIVESTOCK_DATA = {
        "cattle": {
            "health": "Monitor for ticks and internal parasites. Vaccinate regularly for common diseases like FMD and Anthrax. Provide clean water and mineral supplements.",
            "feeding": "Pasture grazing supplemented with hay or silage during dry season. Provide protein concentrates for growing animals. Ensure access to salt licks.",
            "breeding": "Select healthy breeding stock. Monitor heat cycles and breeding records. Implement rotational breeding to prevent inbreeding. Calving season management is crucial.",
            "housing": "Provide shelter from extreme sun and rain. Ensure good ventilation and clean bedding. Separate sick animals."
        },
        "goats": {
            "health": "Deworm regularly. Watch for signs of pneumonia, foot rot. Provide balanced diet to prevent mineral deficiencies. Hoof trimming is important.",
            "feeding": "Browsers by nature, enjoy diverse forage. Supplement with grain for milk production or fast growth. Access to clean water is vital.",
            "breeding": "Manage breeding seasons to avoid kidding during harsh weather. Monitor does for signs of heat. Proper buck management.",
            "housing": "Dry, draft-free shelter. Enough space per animal. Elevated sleeping areas are preferred."
        },
        "poultry": { // E.g., Chickens
            "health": "Vaccinate chicks for common poultry diseases. Maintain strict biosecurity. Watch for respiratory issues or diarrhea. Provide clean feed and water.",
            "feeding": "Age-appropriate feed (starter, grower, layer/finisher). Ensure consistent access to fresh, clean water. Grit might be needed for digestion.",
            "breeding": "For egg production, ensure proper lighting schedules. For meat, focus on growth rates. Separate breeding stock if specific genetics are desired.",
            "housing": "Well-ventilated coops, protection from predators. Adequate roosting space and nesting boxes for layers. Good litter management is key."
        },
        "sheep": {
            "health": "Regular deworming. Monitor for foot rot, external parasites (lice, mites). Vaccinate against common diseases. Shearing as needed for wool breeds.",
            "feeding": "Primarily grazers. Supplement with hay or concentrates if pasture is insufficient. Mineral supplementation, especially selenium.",
            "breeding": "Ram selection is crucial. Monitor ewes for heat. Manage lambing season to minimize losses. Proper nutrition for ewes pre- and post-lambing.",
            "housing": "Shelter from extreme weather. Good drainage and dry bedding to prevent foot problems."
        }
    };

    const CONCERN_MAPPING = {
        "health": ["health", "sick", "disease", "illness", "sickness"],
        "feeding": ["feeding", "feed", "nutrition", "diet"],
        "breeding": ["breeding", "reproduction", "pregnant", "birth"],
        "housing": ["housing", "shelter", "pen", "coop"]
        // Add more common concerns/keywords
    };

    function normalizeConcern(concernInput) {
        const lowerInput = concernInput.toLowerCase();
        for (const key in CONCERN_MAPPING) {
            if (CONCERN_MAPPING[key].includes(lowerInput)) {
                return key;
            }
        }
        return lowerInput; // Return as is if not found
    }


    function getLivestockRecommendations(animalTypeRaw, concernRaw, weatherData) {
        const animalType = animalTypeRaw.toLowerCase().trim();
        const concern = normalizeConcern(concernRaw);

        const recommendations = {
            "guidance": "No specific guidance found for this query.",
            "alerts": []
        };

        const livestockInfo = LIVESTOCK_DATA[animalType];

        if (!livestockInfo) {
            recommendations.alerts.push(`Animal type '${animalTypeRaw.capitalize()}' is not currently in our guide. Please check spelling or contact support.`);
            return recommendations;
        }

        let specificGuidance = livestockInfo[concern];
        if (specificGuidance) {
            recommendations.guidance = specificGuidance;
        } else {
            recommendations.alerts.push(`No specific guidance found for '${concernRaw.capitalize()}' for ${animalTypeRaw.capitalize()}. Showing general advice.`);
            recommendations.guidance = `General advice for ${animalTypeRaw.capitalize()}: Monitor health, provide balanced feed, and manage breeding carefully.`;
            // Fallback to a general health/feeding/breeding message if concern not found
            if (livestockInfo.health) recommendations.guidance += ` Health: ${livestockInfo.health.split('.')[0]}.`;
            if (livestockInfo.feeding) recommendations.guidance += ` Feeding: ${livestockInfo.feeding.split('.')[0]}.`;
        }

        // Add weather-based alerts for livestock (simplified)
        if (weatherData && typeof weatherData.temp === 'number') {
            const temp = weatherData.temp;
            if (temp > 35 && (animalType === 'cattle' || animalType === 'sheep')) {
                recommendations.alerts.push("Extreme heat detected. Ensure livestock have access to shade and ample clean drinking water to prevent heat stress.");
            }
            if (temp < 10 && (animalType === 'goats' || animalType === 'poultry')) {
                recommendations.alerts.push("Low temperatures detected. Ensure adequate shelter and dry bedding, especially for young or vulnerable animals.");
            }
            if (weatherData.weather_main && weatherData.weather_main.toLowerCase().includes('rain')) {
                recommendations.alerts.push("Rainy conditions. Ensure livestock housing remains dry to prevent respiratory issues and foot problems.");
            }
        }
        if (weatherData && typeof weatherData.wind_speed === 'number' && weatherData.wind_speed > 10) { // Example wind speed threshold
            recommendations.alerts.push("High winds. Secure shelters and ensure animals are protected from drafts.");
        }


        return recommendations;
    }

    // Event listener for the "Get Guide" button
    if (getLivestockAdviceBtn) {
        getLivestockAdviceBtn.addEventListener('click', () => {
            const animalType = animalTypeInput.value.trim().toLowerCase();
            const concern = concernInput.value.trim().toLowerCase();

            if (!animalType || !concern) {
                displayMessageBox('Please enter both Animal Type and a specific Concern.');
                return;
            }

            livestockGuideOutput.innerHTML = '<p>Getting livestock guidance...</p>';

            const recommendations = getLivestockRecommendations(animalType, concern, currentFetchedWeather);

            displayLivestockRecommendations(recommendations, animalTypeInput.value.trim(), concernInput.value.trim());
        });
    }

    function displayLivestockRecommendations(recs, originalAnimalType, originalConcern) {
        if (livestockGuideOutput) {
            let alertsHtml = '';
            if (recs.alerts && recs.alerts.length > 0) {
                alertsHtml = '<div class="alert-messages">';
                recs.alerts.forEach(alert => {
                    alertsHtml += `<p class="alert-item"><i class="fas fa-exclamation-triangle"></i> ${alert}</p>`;
                });
                alertsHtml += '</div>';
            }

            livestockGuideOutput.innerHTML = `
                <h4>Guidance for ${originalAnimalType.capitalize()} (Concern: ${originalConcern.capitalize()}):</h4>
                <p>${recs.guidance}</p>
                ${alertsHtml}
            `;
        }
    }

    // ----------------------------------------------------
    // FARM LOGBOOK CLIENT-SIDE LOGIC (USING LOCALSTORAGE)
    // ----------------------------------------------------
    const logDateInput = document.getElementById('log-date-input');
    const logActivityInput = document.getElementById('log-activity-input');
    const logDescriptionInput = document.getElementById('log-description-input');
    const logExpensesInput = document.getElementById('log-expenses-input');
    const logYieldInput = document.getElementById('log-yield-input');
    const saveLogEntryBtn = document.getElementById('save-log-entry-btn');
    const logbookEntriesList = document.getElementById('logbook-entries-list');
    const clearLogbookBtn = document.getElementById('clear-logbook-btn');

    const LOCAL_STORAGE_KEY = 'eFarmConnectLogbookEntries';
    let farmLogEntries = []; // Define farmLogEntries here for broader scope

    // Function to load entries from localStorage
    function loadLogEntries() {
        const storedEntries = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedEntries) {
            farmLogEntries = JSON.parse(storedEntries);
        }
        displayLogEntries(); // Display loaded entries
    }

    // Function to save entries to localStorage
    function saveLogEntriesToLocalStorage() {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(farmLogEntries));
    }

    // Function to display log entries in the HTML
    function displayLogEntries() {
        if (logbookEntriesList) {
            logbookEntriesList.innerHTML = ''; // Clear existing entries

            if (farmLogEntries.length === 0) {
                logbookEntriesList.innerHTML = '<p>No entries yet. Add one above!</p>';
                return;
            }

            // Sort entries by date, newest first. If dates are the same, sort by timestamp.
            farmLogEntries.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                if (dateA.getTime() === dateB.getTime()) {
                    // If dates are identical, use timestamp for stable sort (newest first)
                    // Ensure timestamp exists and is comparable
                    const timestampA = new Date(a.timestamp || 0); // Use 0 if timestamp is missing
                    const timestampB = new Date(b.timestamp || 0);
                    return timestampB.getTime() - timestampA.getTime();
                }
                return dateB.getTime() - dateA.getTime(); // Sort by date (newest first)
            });

            farmLogEntries.forEach((entry) => {
                const entryDiv = document.createElement('div');
                entryDiv.className = 'logbook-entry';
                entryDiv.setAttribute('data-id', entry.id); // Use a unique ID for deletion

                const dateStr = new Date(entry.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });

                entryDiv.innerHTML = `
                    <button class="delete-btn" data-id="${entry.id}"><i class="fas fa-times-circle"></i></button>
                    <p><strong>Date:</strong> ${dateStr}</p>
                    <p><strong>Activity:</strong> ${entry.activity.capitalize()}</p>
                    <p><strong>Description:</strong> ${entry.description || 'N/A'}</p>
                    <p><strong>Expenses:</strong> ZMW ${entry.expenses ? entry.expenses.toFixed(2) : '0.00'}</p>
                    <p><strong>Yield:</strong> ${entry.yield ? entry.yield.toFixed(2) : '0.00'} Kg/Units</p>
                `;
                logbookEntriesList.appendChild(entryDiv);
            });

            // Add event listeners for delete buttons (re-added on each display)
            logbookEntriesList.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const entryIdToDelete = event.currentTarget.getAttribute('data-id');
                    deleteLogEntry(entryIdToDelete);
                });
            });
        }
    }

    // Function to add a new log entry
    if (saveLogEntryBtn) {
        saveLogEntryBtn.addEventListener('click', () => {
            const date = logDateInput.value;
            const activity = logActivityInput.value.trim();
            const description = logDescriptionInput.value.trim();
            const expenses = parseFloat(logExpensesInput.value) || 0;
            const yieldVal = parseFloat(logYieldInput.value) || 0;

            if (!date || !activity) {
                displayMessageBox('Please enter both Date and Activity for the log entry.');
                return;
            }

            const newEntry = {
                id: Date.now().toString(), // Simple unique ID
                date: date,
                activity: activity,
                description: description,
                expenses: expenses,
                yield: yieldVal,
                timestamp: new Date().toISOString() // Store ISO string for consistency
            };

            farmLogEntries.push(newEntry);
            saveLogEntriesToLocalStorage();
            displayLogEntries();
            displayMessageBox('Log entry saved successfully!');
            
            // Clear form fields after saving
            logDateInput.value = '';
            logActivityInput.value = '';
            logDescriptionInput.value = '';
            logExpensesInput.value = '';
            logYieldInput.value = '';
        });
    }

    // Function to delete a log entry
    function deleteLogEntry(idToDelete) {
        displayMessageBox("Are you sure you want to delete this log entry?", true, () => {
            farmLogEntries = farmLogEntries.filter(entry => entry.id !== idToDelete);
            saveLogEntriesToLocalStorage();
            displayLogEntries();
            displayMessageBox('Log entry deleted.');
        });
    }

    // Event listener for clearing all entries
    if (clearLogbookBtn) {
        clearLogbookBtn.addEventListener('click', () => {
            displayMessageBox("Are you sure you want to clear ALL log entries? This cannot be undone.", true, () => {
                farmLogEntries = [];
                saveLogEntriesToLocalStorage();
                displayLogEntries();
                displayMessageBox('All log entries cleared.');
            });
        });
    }

    // Load log entries when the page first loads
    loadLogEntries();


    // Helper for capitalizing first letter of a string
    String.prototype.capitalize = function() {
        if (typeof this !== 'string' || this.length === 0) {
            return '';
        }
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
});
