// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAEzNVVk26Gm5izWVfRaX1gbrbPzvjK8-g",
    authDomain: "iot-project-sliit.firebaseapp.com",
    databaseURL: "https://iot-project-sliit-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "iot-project-sliit",
    storageBucket: "iot-project-sliit.appspot.com",
    messagingSenderId: "639036929970",
    appId: "1:639036929970:web:d55b3a6e56e64fa64ed6ab"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// References for step count, goal, and weight
const stepCountRef = database.ref('stepCount');
const goalRef = database.ref('goal');
const weightRef = database.ref('weight');  // Reference to store user's weight

// Loader Handling
window.onload = () => {
    const loader = document.getElementById('loader');
    const content = document.getElementById('content');
    content.style.display = 'none';

    setTimeout(() => {
        content.style.display = 'block';
        loader.style.display = 'none';
    }, 2000);  // Simulate 2-second load time
};

// Fetch and display step count
stepCountRef.on('value', (snapshot) => {
    const stepCount = snapshot.val();
    document.getElementById('stepCount').innerText = stepCount;
    updateCalories(stepCount);
    updateProgress(stepCount);
});

// Fetch weight from database
weightRef.on('value', (snapshot) => {
    const userWeight = snapshot.val() || 70;  // Default weight: 70kg if not set
    document.getElementById('weightDisplay').innerText = userWeight + ' kg';
    updateCalories(stepCount);
});

// Function to calculate calories burned based on MET, weight, and duration
function updateCalories(steps) {
    const userWeight = parseFloat(document.getElementById('weightDisplay').innerText) || 70;
    const MET = 3.5;  // MET value for moderate walking
    const stepsPerMinute = 100;
    const duration = steps / stepsPerMinute / 60;
    const caloriesBurned = (MET * userWeight * duration).toFixed(2);
    const distance = (steps * 0.00078).toFixed(2);  // Average step length = 0.78m (in km)

    document.getElementById('calories').innerText = caloriesBurned;
    document.getElementById('distance').innerText = distance;
}

// Save user name to localStorage
document.getElementById('saveNameButton').addEventListener('click', () => {
    const name = document.getElementById('nameInput').value;
    if (name.trim()) {
        localStorage.setItem('userName', name);
        document.getElementById('userNameDisplay').innerText = name;
        document.getElementById('namePopup').style.display = 'none';
    }
});

// Check if user name is set
window.addEventListener('load', () => {
    const userName = localStorage.getItem('userName');
    if (!userName) {
        document.getElementById('namePopup').style.display = 'block';
    } else {
        document.getElementById('userNameDisplay').innerText = userName;
    }
});

// Set goal
document.getElementById('setGoalBtn').addEventListener('click', () => {
    const goal = document.getElementById('goalInput').value;
    goalRef.set(goal);
});

// Set weight
document.getElementById('setWeightBtn').addEventListener('click', () => {
    const weight = document.getElementById('weightInput').value;
    weightRef.set(weight);
});

// Update progress bar
goalRef.on('value', (snapshot) => {
    const goal = snapshot.val();
    document.getElementById('goalDisplay').innerText = goal;
    updateProgress(stepCount, goal);
});

// Update progress bar width based on step count and goal
function updateProgress(steps, goal = 10000) {
    const progress = Math.min((steps / goal) * 100, 100).toFixed(2);
    document.getElementById('progress').style.width = progress + '%';
    document.getElementById('progress').innerText = progress + '%';
}
