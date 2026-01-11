// Habit Tracker for Burnout Brains
// Main Application JavaScript

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const currentDateEl = document.getElementById('currentDate');
const habitsContainer = document.getElementById('habitsContainer');
const addHabitForm = document.getElementById('addHabitForm');
const allHabitsList = document.getElementById('allHabitsList');
const currentStreakEl = document.getElementById('currentStreak');
const streakStatEl = document.getElementById('streakStat');
const completionRateEl = document.getElementById('completionRate');
const totalCompletedEl = document.getElementById('totalCompleted');
const burnoutScoreEl = document.getElementById('burnoutScore');
const weeklyChartEl = document.getElementById('weeklyChart');
const checkBurnoutBtn = document.getElementById('checkBurnoutBtn');
const burnoutResultEl = document.getElementById('burnoutResult');
const dailyQuoteEl = document.getElementById('dailyQuote');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');

// Navigation Elements
const navLinks = document.querySelectorAll('.nav-menu a');
const sections = document.querySelectorAll('.dashboard-section');

// State
let habits = [];
let selectedBurnoutAnswers = {};
let currentStreak = 0;

// Quotes for burnout recovery
const quotes = [
    {
        text: "Rest is not idleness, and to lie sometimes on the grass under trees on a summer's day, listening to the murmur of the water, or watching the clouds float across the sky, is by no means a waste of time.",
        author: "John Lubbock"
    },
    {
        text: "Almost everything will work again if you unplug it for a few minutes, including you.",
        author: "Anne Lamott"
    },
    {
        text: "The time to relax is when you don't have time for it.",
        author: "Sydney J. Harris"
    },
    {
        text: "Burnout is what happens when you try to avoid being human for too long.",
        author: "Michael Gungor"
    },
    {
        text: "Self-care is not selfish. You cannot serve from an empty vessel.",
        author: "Eleanor Brown"
    },
    {
        text: "It's okay to do nothing. It's okay to just be. Your worth is not measured by your productivity.",
        author: "Unknown"
    },
    {
        text: "Sometimes the most productive thing you can do is relax.",
        author: "Mark Black"
    }
];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateEl.textContent = now.toLocaleDateString('en-US', options);
    
    // Set random quote
    setRandomQuote();
    
    // Load habits from localStorage or initialize with sample data
    loadHabits();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize burnout check questions
    setupBurnoutQuestions();
    
    // Update stats
    updateStats();
    
    // Generate weekly chart
    generateWeeklyChart();
});

// Set random daily quote
function setRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    dailyQuoteEl.textContent = `"${quote.text}"`;
    document.querySelector('.quote-author').textContent = `- ${quote.author}`;
}

// Load habits from localStorage or initialize with sample data
function loadHabits() {
    const savedHabits = localStorage.getItem('serenityHabits');
    
    if (savedHabits) {
        habits = JSON.parse(savedHabits);
    } else {
        // Initialize with sample habits for burnout recovery
        habits = [
            {
                id: 1,
                name: "Drink 8 glasses of water",
                category: "nutrition",
                frequency: "daily",
                completedToday: false,
                streak: 3,
                createdDate: new Date().toISOString(),
                history: [true, true, true, false, false, false, false]
            },
            {
                id: 2,
                name: "10 minutes of mindfulness",
                category: "mindfulness",
                frequency: "daily",
                completedToday: true,
                streak: 7,
                createdDate: new Date().toISOString(),
                history: [true, true, true, true, true, true, true]
            },
            {
                id: 3,
                name: "Gentle walk outside",
                category: "movement",
                frequency: "daily",
                completedToday: false,
                streak: 5,
                createdDate: new Date().toISOString(),
                history: [true, true, true, true, true, false, false]
            },
            {
                id: 4,
                name: "Screen-free hour before bed",
                category: "rest",
                frequency: "daily",
                completedToday: false,
                streak: 2,
                createdDate: new Date().toISOString(),
                history: [true, true, false, false, false, false, false]
            },
            {
                id: 5,
                name: "Connect with a friend",
                category: "social",
                frequency: "weekly",
                completedToday: true,
                streak: 2,
                createdDate: new Date().toISOString(),
                history: [true, true, false, false, false, false, false]
            },
            {
                id: 6,
                name: "Write in gratitude journal",
                category: "self-care",
                frequency: "weekdays",
                completedToday: false,
                streak: 4,
                createdDate: new Date().toISOString(),
                history: [true, true, true, true, false, false, false]
            }
        ];
        saveHabits();
    }
    
    renderTodayHabits();
    renderAllHabitsList();
}

// Save habits to localStorage
function saveHabits() {
    localStorage.setItem('serenityHabits', JSON.stringify(habits));
}

// Render today's habits
function renderTodayHabits() {
    habitsContainer.innerHTML = '';
    
    // Filter habits based on frequency and day of week
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const todaysHabits = habits.filter(habit => {
        if (habit.frequency === "daily") return true;
        if (habit.frequency === "weekly") return true; // Weekly habits show every day
        if (habit.frequency === "weekdays" && today >= 1 && today <= 5) return true;
        return false;
    });
    
    if (todaysHabits.length === 0) {
        habitsContainer.innerHTML = `
            <div class="empty-state">
                <h3>No habits for today</h3>
                <p>Add some gentle habits to start your recovery journey</p>
            </div>
        `;
        return;
    }
    
    todaysHabits.forEach(habit => {
        const habitCard = document.createElement('div');
        habitCard.className = 'habit-card';
        
        // Get category display name and class
        const categoryInfo = getCategoryInfo(habit.category);
        
        habitCard.innerHTML = `
            <div class="habit-header">
                <div class="habit-title">
                    <h3>${habit.name}</h3>
                    <span class="habit-category category-${categoryInfo.class}">${categoryInfo.name}</span>
                </div>
                <div class="habit-frequency">${habit.frequency}</div>
            </div>
            <div class="habit-footer">
                <div class="habit-streak">
                    <span>${habit.streak} day${habit.streak !== 1 ? 's' : ''}</span>
                </div>
                <button class="btn-complete ${habit.completedToday ? 'completed' : ''}" data-id="${habit.id}">
                    <i class="fas fa-${habit.completedToday ? 'check' : 'plus'}"></i>
                    ${habit.completedToday ? 'Completed' : 'Mark Complete'}
                </button>
            </div>
        `;
        
        habitsContainer.appendChild(habitCard);
    });
    
    // Add event listeners to complete buttons
    document.querySelectorAll('.btn-complete').forEach(button => {
        button.addEventListener('click', function() {
            const habitId = parseInt(this.getAttribute('data-id'));
            toggleHabitCompletion(habitId);
        });
    });
}

// Render all habits list
function renderAllHabitsList() {
    allHabitsList.innerHTML = '';
    
    if (habits.length === 0) {
        allHabitsList.innerHTML = `
            <div class="empty-state">
                <h3>No habits yet</h3>
                <p>Add your first gentle habit to start tracking</p>
            </div>
        `;
        return;
    }
    
    habits.forEach(habit => {
        const categoryInfo = getCategoryInfo(habit.category);
        
        const habitItem = document.createElement('div');
        habitItem.className = 'habit-list-item';
        habitItem.innerHTML = `
            <div class="habit-list-info">
                <h4>${habit.name}</h4>
                <p>
                    <span class="habit-category category-${categoryInfo.class}">${categoryInfo.name}</span>
                    <span style="margin-left: 10px;">${habit.frequency} • ${habit.streak} day streak</span>
                </p>
            </div>
            <div class="habit-list-actions">
                <button class="btn-icon btn-edit" data-id="${habit.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" data-id="${habit.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        allHabitsList.appendChild(habitItem);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', function() {
            const habitId = parseInt(this.getAttribute('data-id'));
            editHabit(habitId);
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const habitId = parseInt(this.getAttribute('data-id'));
            deleteHabit(habitId);
        });
    });
}

// Toggle habit completion
function toggleHabitCompletion(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    habit.completedToday = !habit.completedToday;
    
    // Update streak
    if (habit.completedToday) {
        habit.streak++;
        // Show notification
        showNotification(`Great job! You completed "${habit.name}"`);
    } else {
        habit.streak = Math.max(0, habit.streak - 1);
    }
    
    // Update history (simplified - in a real app you'd track by date)
    habit.history.unshift(habit.completedToday);
    if (habit.history.length > 7) habit.history.pop();
    
    saveHabits();
    renderTodayHabits();
    updateStats();
    generateWeeklyChart();
}

// Add a new habit
addHabitForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('habitName');
    const categoryInput = document.getElementById('habitCategory');
    const frequencyInput = document.getElementById('habitFrequency');
    
    const newHabit = {
        id: habits.length > 0 ? Math.max(...habits.map(h => h.id)) + 1 : 1,
        name: nameInput.value.trim(),
        category: categoryInput.value,
        frequency: frequencyInput.value,
        completedToday: false,
        streak: 0,
        createdDate: new Date().toISOString(),
        history: [false, false, false, false, false, false, false]
    };
    
    habits.push(newHabit);
    saveHabits();
    
    // Reset form
    nameInput.value = '';
    categoryInput.value = 'self-care';
    frequencyInput.value = 'daily';
    
    // Update UI
    renderTodayHabits();
    renderAllHabitsList();
    updateStats();
    
    // Show notification
    showNotification(`Added new habit: "${newHabit.name}"`);
});

// Edit habit (simplified - would open a modal in a full app)
function editHabit(habitId) {
    showNotification("Edit feature would open in a full version of the app");
}

// Delete habit
function deleteHabit(habitId) {
    if (confirm("Are you sure you want to delete this habit?")) {
        habits = habits.filter(h => h.id !== habitId);
        saveHabits();
        renderTodayHabits();
        renderAllHabitsList();
        updateStats();
        showNotification("Habit deleted");
    }
}

// Update statistics
function updateStats() {
    // Calculate current streak (longest consecutive days with at least one completed habit)
    // Simplified calculation for demo
    let maxStreak = 0;
    let currentStreakCount = 0;
    
    // In a real app, you would calculate based on actual completion history
    // For demo, we'll use a simplified approach
    const completedHabits = habits.filter(h => h.completedToday);
    const totalHabits = habits.length;
    
    // Calculate completion rate
    const completionRate = totalHabits > 0 ? Math.round((completedHabits.length / totalHabits) * 100) : 0;
    
    // Calculate total completed habits (all time - simplified)
    let totalCompleted = 0;
    habits.forEach(habit => {
        totalCompleted += habit.streak;
    });
    
    // Update streak display
    if (completedHabits.length > 0) {
        currentStreakCount = Math.max(...habits.map(h => h.streak));
    }
    
    currentStreak = currentStreakCount;
    
    // Update DOM elements
    currentStreakEl.textContent = `${currentStreak} day streak`;
    streakStatEl.textContent = currentStreak;
    completionRateEl.textContent = `${completionRate}%`;
    totalCompletedEl.textContent = totalCompleted;
    
    // Calculate burnout score based on habits and completion rate
    let burnoutRisk = "Low";
    if (completionRate < 30) {
        burnoutRisk = "High";
    } else if (completionRate < 60) {
        burnoutRisk = "Medium";
    }
    burnoutScoreEl.textContent = burnoutRisk;
}

// Generate weekly chart
function generateWeeklyChart() {
    weeklyChartEl.innerHTML = '';
    
    // Days of week
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Calculate completion for each day (simplified - using habit history)
    // In a real app, you'd track completion by actual date
    const dayCompletions = [0, 0, 0, 0, 0, 0, 0];
    
    habits.forEach(habit => {
        habit.history.forEach((completed, index) => {
            if (completed && index < 7) {
                dayCompletions[index]++;
            }
        });
    });
    
    // Find max for scaling
    const maxCompletions = Math.max(...dayCompletions, 1);
    
    // Create bars
    days.forEach((day, index) => {
        const completionCount = dayCompletions[index];
        const barHeight = (completionCount / maxCompletions) * 100;
        
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.style.height = `${barHeight}%`;
        bar.style.backgroundColor = completionCount > 0 ? 'var(--primary)' : 'var(--gray-light)';
        bar.title = `${completionCount} habit${completionCount !== 1 ? 's' : ''} completed`;
        
        const label = document.createElement('div');
        label.className = 'chart-label';
        label.textContent = day;
        
        bar.appendChild(label);
        weeklyChartEl.appendChild(bar);
    });
}

// Setup burnout questions
function setupBurnoutQuestions() {
    const scaleOptions = document.querySelectorAll('.scale-option');
    
    scaleOptions.forEach(option => {
        option.addEventListener('click', function() {
            const question = this.parentElement.parentElement;
            const questionNumber = parseInt(question.querySelector('p').textContent.charAt(0));
            const value = parseInt(this.getAttribute('data-value'));
            
            // Remove selected class from all options in this question
            const allOptions = question.querySelectorAll('.scale-option');
            allOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Store answer
            selectedBurnoutAnswers[questionNumber] = value;
        });
    });
    
    // Setup burnout check button
    checkBurnoutBtn.addEventListener('click', checkBurnoutLevel);
}

// Check burnout level
function checkBurnoutLevel() {
    const questions = Object.keys(selectedBurnoutAnswers).length;
    
    if (questions < 3) {
        burnoutResultEl.innerHTML = `
            <h3>Please answer all questions</h3>
            <p>Select an option for each question to get your burnout risk assessment.</p>
        `;
        return;
    }
    
    // Calculate average score
    let totalScore = 0;
    for (let key in selectedBurnoutAnswers) {
        totalScore += selectedBurnoutAnswers[key];
    }
    const averageScore = totalScore / questions;
    
    // Determine burnout level
    let burnoutLevel, message, color;
    
    if (averageScore <= 2) {
        burnoutLevel = "Low";
        message = "You're doing well! Your burnout risk is low. Keep up your self-care practices.";
        color = "var(--success)";
    } else if (averageScore <= 3.5) {
        burnoutLevel = "Moderate";
        message = "You're showing some signs of burnout. Consider incorporating more rest and gentle habits into your routine.";
        color = "var(--warning)";
    } else {
        burnoutLevel = "High";
        message = "You're experiencing significant burnout symptoms. Please prioritize rest and consider speaking with a healthcare professional.";
        color = "var(--danger)";
    }
    
    // Update burnout result display
    burnoutResultEl.innerHTML = `
        <h3>Your Burnout Risk: <span style="color: ${color}">${burnoutLevel}</span></h3>
        <p>${message}</p>
        <p><strong>Self-care recommendation:</strong> ${getBurnoutRecommendation(burnoutLevel)}</p>
    `;
    
    // Update stats
    burnoutScoreEl.textContent = burnoutLevel;
}

// Get burnout recommendation based on level
function getBurnoutRecommendation(level) {
    switch(level) {
        case "Low":
            return "Maintain your current self-care practices. Consider adding one gentle habit to support ongoing wellbeing.";
        case "Moderate":
            return "Schedule regular breaks throughout your day. Try a 5-minute breathing exercise when feeling overwhelmed.";
        case "High":
            return "Prioritize rest above all else. Consider taking a mental health day and reducing non-essential commitments.";
        default:
            return "Listen to your body's signals and give yourself permission to rest.";
    }
}

// Get category info
function getCategoryInfo(category) {
    const categories = {
        "self-care": { name: "Self-Care", class: "self-care" },
        "mindfulness": { name: "Mindfulness", class: "mindfulness" },
        "movement": { name: "Gentle Movement", class: "movement" },
        "nutrition": { name: "Nutrition", class: "nutrition" },
        "rest": { name: "Rest & Sleep", class: "rest" },
        "social": { name: "Social Connection", class: "social" }
    };
    
    return categories[category] || { name: "Other", class: "self-care" };
}

// Show notification
function showNotification(message) {
    notificationText.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Setup event listeners
function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const icon = this.querySelector('i');
        if (document.body.classList.contains('dark-theme')) {
            icon.className = 'fas fa-sun';
            localStorage.setItem('serenityTheme', 'dark');
        } else {
            icon.className = 'fas fa-moon';
            localStorage.setItem('serenityTheme', 'light');
        }
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('serenityTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.querySelector('i').className = 'fas fa-sun';
    }
    
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get target section id
            const targetId = this.id.replace('Link', 'Section');
            
            // Update active nav link
            navLinks.forEach(navLink => {
                navLink.parentElement.classList.remove('active');
            });
            this.parentElement.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(targetId).classList.add('active');
        });
    });
}