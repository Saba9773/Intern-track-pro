// Global Endpoint Configuration 
// Get your free API keys instantly from https://developer.adzuna.com/
const ADZUNA_APP_ID = 'YOUR_FREE_APP_ID'; 
const ADZUNA_APP_KEY = 'YOUR_FREE_APP_KEY';
const COUNTRY_CODE = 'in'; // 'in' for India, 'us' for USA, 'gb' for UK, etc.

document.getElementById('search-btn').addEventListener('click', fetchLiveInternships);

async function fetchLiveInternships() {
    const cityInput = document.getElementById('city-input').value.trim();
    const selectedKeywords = document.getElementById('stack-select').value;
    const grid = document.getElementById('jobs-grid');
    const countText = document.getElementById('results-count');
    const loadingIndicator = document.getElementById('loading');

    // Reset layout state
    grid.innerHTML = '';
    
    if (!cityInput) {
        countText.textContent = "Error: Please specify a valid global target city or 'remote'.";
        return;
    }

    loadingIndicator.style.display = 'block';
    countText.textContent = "Negotiating handshake with live global data relays...";

    // Constructing specific semantic query structure searching for internships
    const targetQuery = encodeURIComponent(`${selectedKeywords} intern`);
    const locationQuery = encodeURIComponent(cityInput);
    
    // Call the live API routing
    const apiURL = `https://api.adzuna.com/v1/api/jobs/${COUNTRY_CODE}/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=15&what=${targetQuery}&where=${locationQuery}`;

    try {
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error('API Rate limits or Network Fault triggered');
        
        const data = await response.json();
        const results = data.results || [];

        loadingIndicator.style.display = 'none';
        countText.textContent = `Found ${results.length} active live matches verified for ${selectedKeywords} in ${cityInput}`;

        if (results.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">
                    No live open pipeline listings found right now for "${selectedKeywords}" in this geographical coordinate. Try modifying the region code filter!
                </div>`;
            return;
        }

        // Render dynamic cards seamlessly onto your page
        results.forEach(job => {
            const card = document.createElement('div');
            card.className = 'job-card';
            
            // Format standard values gracefully if data properties are empty
            const companyName = job.company ? job.company.display_name : 'Verified Enterprise';
            const cleanLocation = job.location ? job.location.display_name : cityInput;
            
            card.innerHTML = `
                <div>
                    <h3>${job.title}</h3>
                    <div class="company-name">${companyName}</div>
                    <div class="tags-div">
                        <span class="tag location">${cleanLocation}</span>
                        <span class="tag tech">${selectedKeywords.split(' ')[0]}</span>
                    </div>
                </div>
                <a href="${job.redirect_url}" class="apply-link" target="_blank">View Listing</a>
            `;
            grid.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        loadingIndicator.style.display = 'none';
        countText.textContent = "Fallback active: Remote API endpoint rejected packet or token missing.";
        
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">
                <strong>Configuration Needed:</strong> Please open <code>app.js</code> and verify you inserted your free Adzuna App ID and Key at the top of the script!
            </div>`;
    }
}