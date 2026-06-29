// Local Storage Keys
const STORAGE_KEYS = {
    USER_NAME: 'gambleFree_userName',
    DAILY_LOGS: 'gambleFree_dailyLogs',
    CURRENT_STREAK: 'gambleFree_currentStreak',
    LONGEST_STREAK: 'gambleFree_longestStreak'
};

// DOM Elements
const welcomeModal = document.getElementById('welcomeModal');
const nameInput = document.getElementById('nameInput');
const continueBtn = document.getElementById('continueBtn');
const userName = document.getElementById('userName');
const currentDate = document.getElementById('currentDate');
const currentStreak = document.getElementById('currentStreak');
const longestStreak = document.getElementById('longestStreak');
const streakCard = document.getElementById('streakCard');
const streakLocked = document.getElementById('streakLocked');
const cleanBtn = document.getElementById('cleanBtn');
const gambledBtn = document.getElementById('gambledBtn');
const successMessage = document.getElementById('successMessage');
const logsBtn = document.getElementById('logsBtn');
const logsModal = document.getElementById('logsModal');
const logsList = document.getElementById('logsList');
const closeLogsBtn = document.getElementById('closeLogsBtn');
const logDetailModal = document.getElementById('logDetailModal');
const logDetailDate = document.getElementById('logDetailDate');
const logDetailStatus = document.getElementById('logDetailStatus');
const closeDetailBtn = document.getElementById('closeDetailBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const resetBtn = document.getElementById('resetBtn');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const confirmModal = document.getElementById('confirmModal');
const confirmCancelBtn = document.getElementById('confirmCancelBtn');
const confirmResetBtn = document.getElementById('confirmResetBtn');

// Initialize App
function init() {
    loadUserName();
    displayCurrentDate();
    loadStreaks();
    checkTodayStatus();
    setupEventListeners();
    startRealTimeUpdates();
}

// Load User Name
function loadUserName() {
    const savedName = localStorage.getItem(STORAGE_KEYS.USER_NAME);
    if (savedName) {
        userName.textContent = savedName;
        welcomeModal.classList.add('hidden');
    } else {
        welcomeModal.classList.remove('hidden');
    }
}

// Display Current Date
function displayCurrentDate() {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    currentDate.textContent = today.toLocaleDateString('en-US', options);
}

// Update date every minute and check for day change
function startRealTimeUpdates() {
    setInterval(() => {
        displayCurrentDate();
        checkDayChange();
    }, 60000); // Check every minute
}

// Check if day has changed
function checkDayChange() {
    const logs = getDailyLogs();
    const today = getTodayString();
    const todayLog = logs.find(log => log.date === today);
    
    // If no log for today and buttons are disabled, re-enable them
    if (!todayLog && (cleanBtn.disabled || gambledBtn.disabled)) {
        cleanBtn.disabled = false;
        gambledBtn.disabled = false;
        successMessage.classList.add('hidden');
    }
}

// Get Today's Date String
function getTodayString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Load Streaks
function loadStreaks() {
    const current = parseInt(localStorage.getItem(STORAGE_KEYS.CURRENT_STREAK)) || 0;
    const longest = parseInt(localStorage.getItem(STORAGE_KEYS.LONGEST_STREAK)) || 0;
    currentStreak.textContent = current;
    longestStreak.textContent = longest;
    
    // Show/hide streak based on day 3 unlock
    if (current >= 3) {
        streakCard.classList.remove('hidden');
        streakLocked.classList.add('hidden');
    } else {
        streakCard.classList.add('hidden');
        streakLocked.classList.remove('hidden');
    }
}

// Save Streaks
function saveStreaks(current, longest) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_STREAK, current);
    localStorage.setItem(STORAGE_KEYS.LONGEST_STREAK, longest);
    currentStreak.textContent = current;
    longestStreak.textContent = longest;
}

// Get Daily Logs
function getDailyLogs() {
    const logs = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    return logs ? JSON.parse(logs) : [];
}

// Save Daily Logs
function saveDailyLogs(logs) {
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
}

// Check Today's Status
function checkTodayStatus() {
    const logs = getDailyLogs();
    const today = getTodayString();
    const todayLog = logs.find(log => log.date === today);
    
    if (todayLog) {
        // Today already recorded
        cleanBtn.disabled = true;
        gambledBtn.disabled = true;
        successMessage.classList.remove('hidden');
        
        if (todayLog.status === 'clean') {
            successMessage.innerHTML = `
                <p>You stayed gamble-free today!</p>
                <p class="see-you">See you tomorrow!</p>
            `;
        } else {
            successMessage.innerHTML = `
                <p>You gambled today.</p>
                <p class="see-you">Tomorrow is a new day!</p>
            `;
        }
    }
}

// Record Today's Status
function recordStatus(status) {
    const logs = getDailyLogs();
    const today = getTodayString();
    
    // Check if already recorded
    const existingLog = logs.find(log => log.date === today);
    if (existingLog) return;
    
    // Add new log
    logs.push({ date: today, status: status });
    saveDailyLogs(logs);
    
    // Update streaks
    let current = parseInt(localStorage.getItem(STORAGE_KEYS.CURRENT_STREAK)) || 0;
    let longest = parseInt(localStorage.getItem(STORAGE_KEYS.LONGEST_STREAK)) || 0;
    
    if (status === 'clean') {
        current++;
        if (current > longest) {
            longest = current;
        }
    } else {
        current = 0;
    }
    
    saveStreaks(current, longest);
    
    // Check if streak just unlocked (reached day 3)
    if (current === 3 && status === 'clean') {
        showStreakUnlockedAnimation();
    }
    
    // Update UI
    cleanBtn.disabled = true;
    gambledBtn.disabled = true;
    successMessage.classList.remove('hidden');
    
    if (status === 'clean') {
        successMessage.innerHTML = `
            <p>You stayed gamble-free today!</p>
            <p class="see-you">See you tomorrow!</p>
        `;
        animateButton(cleanBtn);
    } else {
        successMessage.innerHTML = `
            <p>You gambled today.</p>
            <p class="see-you">Tomorrow is a new day!</p>
        `;
        animateButton(gambledBtn);
    }
}

// Animate Button
function animateButton(button) {
    button.style.animation = 'glow 0.5s ease-out';
    setTimeout(() => {
        button.style.animation = '';
    }, 500);
}

// Show Streak Unlocked Animation
function showStreakUnlockedAnimation() {
    streakLocked.classList.add('hidden');
    streakCard.classList.remove('hidden');
    streakCard.style.animation = 'popIn 0.6s ease-out';
    
    setTimeout(() => {
        streakCard.style.animation = 'float 3s ease-in-out infinite';
        lucide.createIcons();
    }, 600);
}

// Setup Event Listeners
function setupEventListeners() {
    // Welcome Modal
    continueBtn.addEventListener('click', handleContinue);
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleContinue();
    });
    
    // Action Buttons
    cleanBtn.addEventListener('click', () => recordStatus('clean'));
    gambledBtn.addEventListener('click', () => recordStatus('gambled'));
    
    // Logs
    logsBtn.addEventListener('click', showLogs);
    closeLogsBtn.addEventListener('click', () => {
        logsModal.classList.add('hidden');
    });
    
    // Log Detail
    closeDetailBtn.addEventListener('click', () => {
        logDetailModal.classList.add('hidden');
    });
    
    // Settings
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
    });
    
    closeSettingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });
    
    resetBtn.addEventListener('click', showConfirmModal);
    
    // Confirmation Modal
    confirmCancelBtn.addEventListener('click', () => {
        confirmModal.classList.add('hidden');
    });
    
    confirmResetBtn.addEventListener('click', resetAllData);
}

// Handle Continue Button
function handleContinue() {
    const name = nameInput.value.trim();
    if (name) {
        localStorage.setItem(STORAGE_KEYS.USER_NAME, name);
        userName.textContent = name;
        welcomeModal.classList.add('hidden');
    } else {
        nameInput.style.borderColor = '#ff6b6b';
        setTimeout(() => {
            nameInput.style.borderColor = '#ddd';
        }, 1000);
    }
}

// Show Logs
function showLogs() {
    const logs = getDailyLogs();
    logsList.innerHTML = '';
    
    if (logs.length === 0) {
        logsList.innerHTML = '<p style="text-align: center; color: #999;">No logs yet</p>';
    } else {
        // Sort by date descending
        const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        sortedLogs.forEach((log, index) => {
            const logItem = document.createElement('div');
            logItem.className = 'log-item';
            
            const date = new Date(log.date);
            const formattedDate = date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            const statusText = log.status === 'clean' ? 'Stayed Gamble-Free' : 'I Gambled Today';
            const statusClass = log.status;
            
            logItem.innerHTML = `
                <div class="log-date">${formattedDate}</div>
                <div class="log-status ${statusClass}">${statusText}</div>
            `;
            
            logItem.addEventListener('click', () => showLogDetail(log));
            logsList.appendChild(logItem);
            
            // Add divider except for last item
            if (index < sortedLogs.length - 1) {
                const divider = document.createElement('div');
                divider.className = 'log-divider';
                divider.textContent = '—';
                logsList.appendChild(divider);
            }
        });
    }
    
    logsModal.classList.remove('hidden');
    lucide.createIcons();
}

// Show Log Detail
function showLogDetail(log) {
    const date = new Date(log.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    logDetailDate.textContent = formattedDate;
    logDetailStatus.textContent = log.status === 'clean' ? 'Stayed Gamble-Free' : 'I Gambled Today';
    logDetailStatus.className = 'log-detail-status ' + log.status;
    
    logsModal.classList.add('hidden');
    logDetailModal.classList.remove('hidden');
}

// Show Confirmation Modal
function showConfirmModal() {
    settingsModal.classList.add('hidden');
    confirmModal.classList.remove('hidden');
    lucide.createIcons();
}

// Reset All Data
function resetAllData() {
    // Clear all localStorage data
    localStorage.removeItem(STORAGE_KEYS.USER_NAME);
    localStorage.removeItem(STORAGE_KEYS.DAILY_LOGS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_STREAK);
    localStorage.removeItem(STORAGE_KEYS.LONGEST_STREAK);
    
    // Reset UI
    userName.textContent = 'Friend';
    currentStreak.textContent = '0';
    longestStreak.textContent = '0';
    
    // Hide confirmation modal
    confirmModal.classList.add('hidden');
    
    // Show welcome modal
    welcomeModal.classList.remove('hidden');
    nameInput.value = '';
    
    // Reset streak visibility
    streakCard.classList.add('hidden');
    streakLocked.classList.remove('hidden');
    
    // Reset buttons
    cleanBtn.disabled = false;
    gambledBtn.disabled = false;
    successMessage.classList.add('hidden');
    
    lucide.createIcons();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    init();
    lucide.createIcons();
});
