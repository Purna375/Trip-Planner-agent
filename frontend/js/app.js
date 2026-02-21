/**
 * Main Application Logic
 * Handles UI interactions and trip planning flow
 */

// State Management
const appState = {
    currentTrip: null,
    isLoading: false,
};

// DOM Elements
const elements = {
    tripForm: document.getElementById('tripForm'),
    planButton: document.getElementById('planButton'),
    inputSection: document.getElementById('inputSection'),
    loadingSection: document.getElementById('loadingSection'),
    resultsSection: document.getElementById('resultsSection'),
    errorSection: document.getElementById('errorSection'),
    tripOverview: document.getElementById('tripOverview'),
    itineraryContainer: document.getElementById('itineraryContainer'),
    recommendationsGrid: document.getElementById('recommendationsGrid'),
    destinationTitle: document.getElementById('destinationTitle'),
    tripMeta: document.getElementById('tripMeta'),
    errorMessage: document.getElementById('errorMessage'),
    planAnotherButton: document.getElementById('planAnotherButton'),
    downloadButton: document.getElementById('downloadButton'),
    retryButton: document.getElementById('retryButton'),
    progressBar: document.getElementById('progressBar'),
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').setAttribute('min', today);
    document.getElementById('endDate').setAttribute('min', today);

    // Event Listeners
    elements.tripForm.addEventListener('submit', handleFormSubmit);
    elements.planAnotherButton.addEventListener('click', resetApp);
    elements.downloadButton.addEventListener('click', downloadItinerary);
    elements.retryButton.addEventListener('click', resetApp);

    // Validate end date is after start date
    document.getElementById('startDate').addEventListener('change', (e) => {
        document.getElementById('endDate').setAttribute('min', e.target.value);
    });

    console.log('🚀 AI Trip Planner initialized');
}

/**
 * Handle form submission
 */
async function handleFormSubmit(e) {
    e.preventDefault();

    if (appState.isLoading) return;

    const formData = getFormData();
    
    if (!validateFormData(formData)) {
        return;
    }

    try {
        appState.isLoading = true;
        elements.progressBar.style.width = '0%';
        showSection('loading');
        animateLoadingSteps();

        const response = await apiClient.planTrip(formData);
        
        appState.currentTrip = response;
        appState.isLoading = false;
        
        // Complete progress bar
        elements.progressBar.style.width = '100%';
        
        // Small delay to show completion
        await new Promise(resolve => setTimeout(resolve, 300));

        displayResults(response);
        showSection('results');
    } catch (error) {
        appState.isLoading = false;
        showError(error.message);
    }
}

/**
 * Get form data
 */
function getFormData() {
    const interests = Array.from(
        document.querySelectorAll('input[name="interests"]:checked')
    ).map(cb => cb.value);

    return {
        destination: document.getElementById('destination').value.trim(),
        start_date: document.getElementById('startDate').value,
        end_date: document.getElementById('endDate').value,
        budget: parseFloat(document.getElementById('budget').value),
        travelers: parseInt(document.getElementById('travelers').value),
        interests: interests.length > 0 ? interests : ['culture', 'local_life'],
        pace: document.getElementById('pace').value,
    };
}

/**
 * Validate form data
 */
function validateFormData(data) {
    if (!data.destination) {
        alert('Please enter a destination');
        return false;
    }

    if (!data.start_date || !data.end_date) {
        alert('Please select travel dates');
        return false;
    }

    const start = new Date(data.start_date);
    const end = new Date(data.end_date);

    if (end < start) {
        alert('End date must be after start date');
        return false;
    }

    if (!data.budget || data.budget < 100) {
        alert('Please enter a valid budget (minimum $100)');
        return false;
    }

    return true;
}

/**
 * Show specific section
 */
function showSection(section) {
    elements.inputSection.classList.remove('section-visible');
    elements.inputSection.classList.add('section-hidden');
    elements.loadingSection.classList.remove('section-visible');
    elements.loadingSection.classList.add('section-hidden');
    elements.resultsSection.classList.remove('section-visible');
    elements.resultsSection.classList.add('section-hidden');
    elements.errorSection.classList.remove('section-visible');
    elements.errorSection.classList.add('section-hidden');

    switch (section) {
        case 'input':
            elements.inputSection.classList.remove('section-hidden');
            elements.inputSection.classList.add('section-visible');
            break;
        case 'loading':
            elements.loadingSection.classList.remove('section-hidden');
            elements.loadingSection.classList.add('section-visible');
            break;
        case 'results':
            elements.resultsSection.classList.remove('section-hidden');
            elements.resultsSection.classList.add('section-visible');
            break;
        case 'error':
            elements.errorSection.classList.remove('section-hidden');
            elements.errorSection.classList.add('section-visible');
            break;
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Animate loading progress bar
 */
function animateLoadingSteps() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 90) {
            progress = 90;
            clearInterval(interval);
        }
        elements.progressBar.style.width = `${progress}%`;
    }, 500);
}

/**
 * Display trip results
 */
function displayResults(response) {
    // Update title and meta
    elements.destinationTitle.textContent = response.overview.destination;
    elements.tripMeta.textContent = `${response.overview.duration} days • ${response.overview.travelers} travelers • $${response.overview.total_budget.toFixed(2)} budget`;
    
    displayOverview(response.overview);
    displayItinerary(response.itinerary);
    displaySmartAdditions(response.smart_additions);
}

/**
 * Display trip overview
 */
function displayOverview(overview) {
    const html = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
            <div>
                <h4 style="font-size: 0.75rem; font-weight: 600; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Destination</h4>
                <p style="font-size: 1.125rem; font-weight: 600; color: var(--gray-900);">${overview.destination}</p>
            </div>
            <div>
                <h4 style="font-size: 0.75rem; font-weight: 600; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Duration</h4>
                <p style="font-size: 1.125rem; font-weight: 600; color: var(--gray-900);">${overview.duration} days</p>
            </div>
            <div>
                <h4 style="font-size: 0.75rem; font-weight: 600; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Travelers</h4>
                <p style="font-size: 1.125rem; font-weight: 600; color: var(--gray-900);">${overview.travelers} people</p>
            </div>
            <div>
                <h4 style="font-size: 0.75rem; font-weight: 600; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Total Budget</h4>
                <p style="font-size: 1.125rem; font-weight: 600; color: var(--gray-900);">$${overview.total_budget.toFixed(2)}</p>
            </div>
            <div>
                <h4 style="font-size: 0.75rem; font-weight: 600; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Daily Budget</h4>
                <p style="font-size: 1.125rem; font-weight: 600; color: var(--gray-900);">$${overview.daily_budget.toFixed(2)}/day</p>
            </div>
            <div>
                <h4 style="font-size: 0.75rem; font-weight: 600; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Weather</h4>
                <p style="font-size: 1.125rem; font-weight: 600; color: var(--gray-900);">${overview.weather_summary}</p>
            </div>
        </div>
    `;
    elements.tripOverview.innerHTML = html;
}

/**
 * Display daily itinerary
 */
function displayItinerary(itinerary) {
    const html = itinerary.map(day => `
        <div class="day-card">
            <div class="day-header">
                <div>
                    <span class="day-number">Day ${day.day}</span>
                    <span class="day-date">${formatDate(day.date)}</span>
                </div>
                ${day.weather ? `<div style="color: var(--gray-600); font-size: 0.875rem;">${day.weather}</div>` : ''}
            </div>

            <div class="activities-list">
                ${renderActivity(day.morning, 'morning')}
                ${renderActivity(day.afternoon, 'afternoon')}
                ${renderActivity(day.evening, 'evening')}
            </div>

            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--gray-200); display: flex; justify-content: space-between; font-size: 0.875rem; color: var(--gray-600);">
                <span>Travel time: ${day.travel_time}</span>
                <span style="font-weight: 600; color: var(--primary-color);">Daily cost: $${day.total_cost.toFixed(2)}</span>
            </div>

            ${day.notes ? `<p style="margin-top: 1rem; font-size: 0.875rem; color: var(--gray-600); font-style: italic;">${day.notes}</p>` : ''}
        </div>
    `).join('');

    elements.itineraryContainer.innerHTML = html;
}

/**
 * Render single activity
 */
function renderActivity(activity, timeOfDay) {
    const timeLabels = {
        morning: 'Morning',
        afternoon: 'Afternoon',
        evening: 'Evening'
    };

    return `
        <div class="activity-item">
            <div class="activity-time">
                <span class="time-badge">${timeLabels[timeOfDay]}</span>
            </div>
            <div class="activity-content">
                <h4 class="activity-name">${activity.name}</h4>
                <p class="activity-description">${activity.description}</p>
                <div class="activity-meta">
                    <span>Duration: ${activity.duration}</span>
                    <span>Cost: $${activity.estimated_cost.toFixed(2)}</span>
                    ${activity.location ? `<span>Location: ${activity.location}</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

/**
 * Display smart additions
 */
function displaySmartAdditions(additions) {
    const html = `
        <div class="recommendation-card">
            <h3 class="recommendation-title">Packing List</h3>
            <ul class="recommendation-list">
                ${additions.packing_list.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>

        <div class="recommendation-card">
            <h3 class="recommendation-title">Weather Tips</h3>
            <ul class="recommendation-list">
                ${additions.weather_tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        </div>

        <div class="recommendation-card">
            <h3 class="recommendation-title">Alternate Activities</h3>
            <ul class="recommendation-list">
                ${additions.alternate_activities.map(activity => `<li>${activity}</li>`).join('')}
            </ul>
        </div>

        <div class="recommendation-card">
            <h3 class="recommendation-title">Local Tips</h3>
            <ul class="recommendation-list">
                ${additions.local_tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        </div>
    `;
    elements.recommendationsGrid.innerHTML = html;
}

/**
 * Format date to readable format
 */
function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', options);
}

/**
 * Show error message
 */
function showError(message) {
    elements.errorMessage.textContent = message;
    showSection('error');
}

/**
 * Reset app to initial state
 */
function resetApp() {
    appState.currentTrip = null;
    appState.isLoading = false;
    elements.tripForm.reset();
    showSection('input');
}

/**
 * Download itinerary as PDF
 */
function downloadItinerary() {
    if (!appState.currentTrip) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const trip = appState.currentTrip;
    
    let yPos = 20;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 7;
    
    // Helper to add new page if needed
    const checkPageBreak = (neededSpace = 10) => {
        if (yPos + neededSpace > pageHeight - margin) {
            doc.addPage();
            yPos = 20;
        }
    };
    
    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text(`Trip to ${trip.overview.destination}`, margin, yPos);
    yPos += 12;
    
    // Trip Details
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Duration: ${trip.overview.duration} days`, margin, yPos);
    yPos += 6;
    doc.text(`Dates: ${trip.overview.start_date} to ${trip.overview.end_date}`, margin, yPos);
    yPos += 6;
    doc.text(`Travelers: ${trip.overview.travelers} people`, margin, yPos);
    yPos += 6;
    doc.text(`Budget: $${trip.overview.total_budget.toFixed(2)} ($${trip.overview.daily_budget.toFixed(2)}/day)`, margin, yPos);
    yPos += 6;
    doc.text(`Weather: ${trip.overview.weather_summary}`, margin, yPos);
    yPos += 12;
    
    // Itinerary
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Daily Itinerary', margin, yPos);
    yPos += 10;
    
    trip.itinerary.forEach(day => {
        checkPageBreak(30);
        
        // Day header
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`Day ${day.day} - ${day.date}`, margin, yPos);
        yPos += 8;
        
        if (day.weather) {
            doc.setFontSize(9);
            doc.setFont(undefined, 'italic');
            doc.text(`Weather: ${day.weather}`, margin, yPos);
            yPos += 6;
        }
        
        // Morning
        if (day.morning) {
            checkPageBreak(20);
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.text('Morning:', margin + 5, yPos);
            yPos += 6;
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(day.morning.name, margin + 10, yPos);
            yPos += 5;
            const morningDesc = doc.splitTextToSize(day.morning.description, 170);
            doc.setFontSize(9);
            doc.text(morningDesc, margin + 10, yPos);
            yPos += morningDesc.length * 4;
            doc.text(`Duration: ${day.morning.duration} | Cost: $${day.morning.estimated_cost.toFixed(2)}`, margin + 10, yPos);
            yPos += 7;
        }
        
        // Afternoon
        if (day.afternoon) {
            checkPageBreak(20);
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.text('Afternoon:', margin + 5, yPos);
            yPos += 6;
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(day.afternoon.name, margin + 10, yPos);
            yPos += 5;
            const afternoonDesc = doc.splitTextToSize(day.afternoon.description, 170);
            doc.setFontSize(9);
            doc.text(afternoonDesc, margin + 10, yPos);
            yPos += afternoonDesc.length * 4;
            doc.text(`Duration: ${day.afternoon.duration} | Cost: $${day.afternoon.estimated_cost.toFixed(2)}`, margin + 10, yPos);
            yPos += 7;
        }
        
        // Evening
        if (day.evening) {
            checkPageBreak(20);
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.text('Evening:', margin + 5, yPos);
            yPos += 6;
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(day.evening.name, margin + 10, yPos);
            yPos += 5;
            const eveningDesc = doc.splitTextToSize(day.evening.description, 170);
            doc.setFontSize(9);
            doc.text(eveningDesc, margin + 10, yPos);
            yPos += eveningDesc.length * 4;
            doc.text(`Duration: ${day.evening.duration} | Cost: $${day.evening.estimated_cost.toFixed(2)}`, margin + 10, yPos);
            yPos += 7;
        }
        
        // Day summary
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text(`Daily Cost: $${day.total_cost.toFixed(2)} | Travel Time: ${day.travel_time}`, margin + 5, yPos);
        yPos += 10;
        
        if (day.notes) {
            checkPageBreak(10);
            doc.setFontSize(9);
            doc.setFont(undefined, 'italic');
            const notes = doc.splitTextToSize(day.notes, 170);
            doc.text(notes, margin + 5, yPos);
            yPos += notes.length * 4 + 5;
        }
        
        yPos += 5;
    });
    
    // Recommendations
    if (trip.smart_additions) {
        checkPageBreak(30);
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('Recommendations', margin, yPos);
        yPos += 10;
        
        if (trip.smart_additions.packing_list && trip.smart_additions.packing_list.length > 0) {
            checkPageBreak(20);
            doc.setFontSize(12);
            doc.text('Packing List:', margin, yPos);
            yPos += 7;
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            trip.smart_additions.packing_list.forEach(item => {
                checkPageBreak(5);
                doc.text(`• ${item}`, margin + 5, yPos);
                yPos += 5;
            });
            yPos += 5;
        }
        
        if (trip.smart_additions.weather_tips && trip.smart_additions.weather_tips.length > 0) {
            checkPageBreak(20);
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text('Weather Tips:', margin, yPos);
            yPos += 7;
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            trip.smart_additions.weather_tips.forEach(tip => {
                checkPageBreak(5);
                doc.text(`• ${tip}`, margin + 5, yPos);
                yPos += 5;
            });
            yPos += 5;
        }
        
        if (trip.smart_additions.local_tips && trip.smart_additions.local_tips.length > 0) {
            checkPageBreak(20);
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text('Local Tips:', margin, yPos);
            yPos += 7;
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            trip.smart_additions.local_tips.forEach(tip => {
                checkPageBreak(5);
                doc.text(`• ${tip}`, margin + 5, yPos);
                yPos += 5;
            });
        }
    }
    
    // Save PDF
    const filename = `trip-${trip.overview.destination.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
    doc.save(filename);
}

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getFormData,
        validateFormData,
        formatDate,
    };
}
