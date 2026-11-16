// ==========================================
// CARDIO PULSE - COMPLETE JAVASCRIPT
// ==========================================

const $ = (id) => document.getElementById(id);

// ==========================================
// PROFILE MANAGEMENT
// ==========================================

function getUserProfile() {
    try {
        return JSON.parse(localStorage.getItem("cardioPulseProfile")) || null;
    } catch {
        return null;
    }
}

function saveUserProfile(profile) {
    localStorage.setItem("cardioPulseProfile", JSON.stringify(profile));
}

// ==========================================
// LOGIN AND SIGNUP
// ==========================================

function showAuth(type) {
    const modal = $("authModal");

    if (modal) {
        modal.style.display = "flex";
        switchAuth(type);
    }
}

function closeAuth() {
    const modal = $("authModal");

    if (modal) modal.style.display = "none";
}

function switchAuth(type) {
    const loginForm = $("loginForm");
    const signupForm = $("signupForm");

    if (loginForm) {
        loginForm.style.display = type === "login" ? "block" : "none";
    }

    if (signupForm) {
        signupForm.style.display = type === "signup" ? "block" : "none";
    }
}

function getFormValue(form, possibleNames, inputType) {
    for (const name of possibleNames) {
        const element =
            form.querySelector(`[name="${name}"]`) || $(name);

        if (element && element.value) {
            return element.value.trim();
        }
    }

    if (inputType) {
        const element = form.querySelector(`input[type="${inputType}"]`);

        if (element) return element.value.trim();
    }

    return "";
}

// ==========================================
// REGISTER
// ==========================================

function registerUser(event) {
    event.preventDefault();

    const form = event.target;

    const name = getFormValue(
        form, ["signupName", "name", "fullName"], "text"
    );

    const email = getFormValue(
        form, ["signupEmail", "email"], "email"
    );

    const password = getFormValue(
        form, ["signupPassword", "password"], "password"
    );

    if (!name || !email || !password) {
        alert("Please fill in all required fields.");
        return;
    }

    if (password.length < 6) {
        alert("Password must contain at least 6 characters.");
        return;
    }

    const profile = {
        name: name,
        email: email,
        createdAt: new Date().toLocaleDateString()
    };

    saveUserProfile(profile);

    sessionStorage.setItem("cardioPulseEmail", email);
    sessionStorage.setItem("cardioPulsePassword", password);

    alert("Account created successfully! Please log in.");

    form.reset();
    switchAuth("login");
}

// ==========================================
// LOGIN
// ==========================================

function loginUser(event) {
    event.preventDefault();

    const form = event.target;

    const email = getFormValue(
        form, ["loginEmail", "email"], "email"
    );

    const password = getFormValue(
        form, ["loginPassword", "password"], "password"
    );

    const savedEmail = sessionStorage.getItem("cardioPulseEmail");
    const savedPassword = sessionStorage.getItem("cardioPulsePassword");
    const profile = getUserProfile();

    if (!profile) {
        alert("Please create an account first.");
        switchAuth("signup");
        return;
    }

    if (
        email === savedEmail &&
        password === savedPassword &&
        email === profile.email
    ) {
        sessionStorage.setItem("cardioPulseLoggedIn", "true");
        form.reset();
        window.location.href = "dashboard.html";
    } else {
        alert("Incorrect email or password. Please try again.");
    }
}

// ==========================================
// FORGOT PASSWORD
// ==========================================

function forgotPassword() {
    alert("Password recovery is not available in this demo.");
}

// ==========================================
// LOGOUT
// ==========================================

function logoutUser() {
    sessionStorage.removeItem("cardioPulseLoggedIn");
    window.location.href = "index.html";
}

// ==========================================
// DASHBOARD ACCESS
// ==========================================

function checkLogin() {
    const isLoggedIn =
        sessionStorage.getItem("cardioPulseLoggedIn");

    if (
        window.location.pathname.endsWith("dashboard.html") &&
        isLoggedIn !== "true"
    ) {
        window.location.href = "index.html";
    }
}

// ==========================================
// PROFILE DISPLAY
// ==========================================

function displayProfile() {
    const profile = getUserProfile();

    if (!profile) return;

    const nameElements = [
        $("userName"),
        $("profileName"),
        $("welcomeName")
    ];

    nameElements.forEach((element) => {
        if (element) {
            element.textContent = profile.name;
        }
    });

    if ($("profileEmail")) {
        $("profileEmail").textContent = profile.email;
    }
}

// ==========================================
// SMARTWATCH DEMO
// ==========================================

function connectWatch() {
    alert(
        "No smartwatch is connected. Real device integration " +
        "requires a compatible device and supported API."
    );
}

// ==========================================
// HEALTH READING STORAGE
// ==========================================

function getHealthReadings() {
    try {
        return JSON.parse(
            localStorage.getItem("cardioPulseReadings")
        ) || [];
    } catch {
        return [];
    }
}

function saveHealthReadings(readings) {
    localStorage.setItem(
        "cardioPulseReadings",
        JSON.stringify(readings)
    );
}

// ==========================================
// SAVE A NEW HEALTH READING
// ==========================================

function saveHealthReading(event) {
    event.preventDefault();

    const heartRate = $("heartRate").value;
    const systolic = $("systolic").value;
    const diastolic = $("diastolic").value;
    const oxygen = $("oxygen").value;
    const temperature = $("temperature").value;
    const respiratoryRate = $("respiratoryRate").value;
    const ecgNote = $("ecgNote").value.trim();

    if (
        !heartRate && !systolic && !diastolic &&
        !oxygen && !temperature &&
        !respiratoryRate && !ecgNote
    ) {
        alert("Please enter at least one health measurement.");
        return;
    }

    if (
        (systolic && !diastolic) ||
        (!systolic && diastolic)
    ) {
        alert("Please enter both blood pressure values.");
        return;
    }

    const reading = {
        heartRate: heartRate || null,
        systolic: systolic || null,
        diastolic: diastolic || null,
        oxygen: oxygen || null,
        temperature: temperature || null,
        respiratoryRate: respiratoryRate || null,
        ecgNote: ecgNote || null,
        date: new Date().toLocaleString("en-IN"),
        timestamp: Date.now()
    };

    const readings = getHealthReadings();

    readings.unshift(reading);

    saveHealthReadings(readings);

    displayLatestReading();
    displayReadingHistory();
    updateHealthCharts();
    checkHealthAlerts();

    $("readingMessage").textContent =
        "Your health reading has been saved successfully!";

    $("healthReadingForm").reset();
}

// ==========================================
// DISPLAY LATEST READING
// ==========================================

function displayLatestReading() {
    const readings = getHealthReadings();

    if (readings.length === 0) return;

    const latest = readings[0];

    if (latest.heartRate && $("heartRateValue")) {
        $("heartRateValue").textContent =
            latest.heartRate + " BPM";
    }

    if (latest.systolic && $("bloodPressureValue")) {
        $("bloodPressureValue").textContent =
            latest.systolic + " / " + latest.diastolic;
    }

    if (latest.oxygen && $("oxygenValue")) {
        $("oxygenValue").textContent =
            latest.oxygen + " %";
    }

    if (latest.temperature && $("temperatureValue")) {
        $("temperatureValue").textContent =
            latest.temperature + " °C";
    }

    if (latest.respiratoryRate && $("respiratoryValue")) {
        $("respiratoryValue").textContent =
            latest.respiratoryRate + " /min";
    }

    if (latest.ecgNote && $("ecgValue")) {
        $("ecgValue").textContent = latest.ecgNote;
    }
}

// ==========================================
// READING HISTORY
// ==========================================

function displayReadingHistory() {
    const container = $("readingHistory");

    if (!container) return;

    const readings = getHealthReadings();

    container.replaceChildren();

    if (readings.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No readings saved yet.";
        container.appendChild(message);
        return;
    }

    readings.forEach((reading) => {
        const card = document.createElement("div");
        card.className = "history-card";

        const date = document.createElement("p");
        date.textContent = reading.date;

        const details = document.createElement("p");
        const values = [];

        if (reading.heartRate) {
            values.push("Heart Rate: " + reading.heartRate + " BPM");
        }

        if (reading.systolic) {
            values.push(
                "Blood Pressure: " +
                reading.systolic + "/" + reading.diastolic
            );
        }

        if (reading.oxygen) {
            values.push("Oxygen: " + reading.oxygen + "%");
        }

        if (reading.temperature) {
            values.push("Temperature: " + reading.temperature + " °C");
        }

        if (reading.respiratoryRate) {
            values.push(
                "Respiratory Rate: " + reading.respiratoryRate + "/min"
            );
        }

        if (reading.ecgNote) {
            values.push("ECG Note: " + reading.ecgNote);
        }

        details.textContent = values.join(" | ");

        card.appendChild(date);
        card.appendChild(details);

        container.appendChild(card);
    });
}

// ==========================================
// CHART SETTINGS
// ==========================================

let heartRateChart = null;
let bloodPressureChart = null;
let oxygenChart = null;

// ==========================================
// UPDATE ALL THREE CHARTS
// ==========================================

function updateHealthCharts() {
    if (typeof Chart === "undefined") {
        console.warn("Chart.js could not be loaded.");
        return;
    }

    const readings = getHealthReadings()
        .slice()
        .reverse()
        .slice(-20);

    const labels = readings.map((reading) => {
        const date = new Date(reading.timestamp);
        return date.toLocaleDateString("en-IN");
    });

    const heartRates = readings.map((reading) =>
        reading.heartRate ? Number(reading.heartRate) : null
    );

    const systolicValues = readings.map((reading) =>
        reading.systolic ? Number(reading.systolic) : null
    );

    const diastolicValues = readings.map((reading) =>
        reading.diastolic ? Number(reading.diastolic) : null
    );

    const oxygenValues = readings.map((reading) =>
        reading.oxygen ? Number(reading.oxygen) : null
    );

    // HEART RATE CHART

    const heartCanvas = $("heartRateChart");

    if (heartCanvas) {
        if (heartRateChart) heartRateChart.destroy();

        heartRateChart = new Chart(heartCanvas, {
            type: "line",

            data: {
                labels: labels,

                datasets: [{
                    label: "Heart Rate (BPM)",
                    data: heartRates,
                    borderColor: "#16a36a",
                    backgroundColor: "rgba(22,163,106,0.12)",
                    fill: true,
                    tension: 0.35,
                    spanGaps: false
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }

    // BLOOD PRESSURE CHART

    const bpCanvas = $("bloodPressureChart");

    if (bpCanvas) {
        if (bloodPressureChart) bloodPressureChart.destroy();

        bloodPressureChart = new Chart(bpCanvas, {
            type: "line",

            data: {
                labels: labels,

                datasets: [
                    {
                        label: "Systolic",
                        data: systolicValues,
                        borderColor: "#e58a36",
                        tension: 0.35,
                        spanGaps: false
                    },
                    {
                        label: "Diastolic",
                        data: diastolicValues,
                        borderColor: "#3985d6",
                        tension: 0.35,
                        spanGaps: false
                    }
                ]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }

    // OXYGEN CHART

    const oxygenCanvas = $("oxygenChart");

    if (oxygenCanvas) {
        if (oxygenChart) oxygenChart.destroy();

        oxygenChart = new Chart(oxygenCanvas, {
            type: "line",

            data: {
                labels: labels,

                datasets: [{
                    label: "Oxygen Level (%)",
                    data: oxygenValues,
                    borderColor: "#4b91d1",
                    backgroundColor: "rgba(75,145,209,0.12)",
                    fill: true,
                    tension: 0.35,
                    spanGaps: false
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                scales: {
                    y: {
                        min: 70,
                        max: 100
                    }
                }
            }
        });
    }
}

// ==========================================
// ALERT SETTINGS STORAGE
// ==========================================

function getAlertSettings() {
    try {
        return JSON.parse(
            localStorage.getItem("cardioPulseAlertSettings")
        ) || {};
    } catch {
        return {};
    }
}

function saveAlertSettingsToStorage(settings) {
    localStorage.setItem(
        "cardioPulseAlertSettings",
        JSON.stringify(settings)
    );
}

// ==========================================
// SAVE ALERT SETTINGS
// ==========================================

function saveAlertSettings(event) {
    event.preventDefault();

    const minHeartRate = $("minHeartRate").value;
    const maxHeartRate = $("maxHeartRate").value;
    const minOxygen = $("minOxygen").value;

    if (
        minHeartRate &&
        maxHeartRate &&
        Number(minHeartRate) >= Number(maxHeartRate)
    ) {
        alert("Heart rate minimum must be lower than maximum.");
        return;
    }

    const settings = {
        minHeartRate: minHeartRate || null,
        maxHeartRate: maxHeartRate || null,
        minOxygen: minOxygen || null
    };

    saveAlertSettingsToStorage(settings);

    checkHealthAlerts();

    alert("Your alert settings have been saved.");
}

// ==========================================
// LOAD ALERT SETTINGS INTO FORM
// ==========================================

function loadAlertSettings() {
    const settings = getAlertSettings();

    if ($("minHeartRate")) {
        $("minHeartRate").value = settings.minHeartRate || "";
    }

    if ($("maxHeartRate")) {
        $("maxHeartRate").value = settings.maxHeartRate || "";
    }

    if ($("minOxygen")) {
        $("minOxygen").value = settings.minOxygen || "";
    }
}

// ==========================================
// CHECK RECORDED READINGS AGAINST LIMITS
// ==========================================

function checkHealthAlerts() {
    const container = $("healthAlerts");

    if (!container) return;

    const settings = getAlertSettings();
    const readings = getHealthReadings();

    container.replaceChildren();

    if (readings.length === 0) {
        container.textContent = "No readings available to check.";
        return;
    }

    const latest = readings[0];
    const alerts = [];

    if (latest.heartRate && settings.minHeartRate) {
        if (Number(latest.heartRate) < Number(settings.minHeartRate)) {
            alerts.push("Latest heart rate is below your configured minimum.");
        }
    }

    if (latest.heartRate && settings.maxHeartRate) {
        if (Number(latest.heartRate) > Number(settings.maxHeartRate)) {
            alerts.push("Latest heart rate is above your configured maximum.");
        }
    }

    if (latest.oxygen && settings.minOxygen) {
        if (Number(latest.oxygen) < Number(settings.minOxygen)) {
            alerts.push("Latest oxygen reading is below your configured minimum.");
        }
    }

    if (alerts.length === 0) {
        const message = document.createElement("p");
        message.textContent =
            "No configured limits were crossed by the latest saved reading.";
        container.appendChild(message);
        return;
    }

    alerts.forEach((alertText) => {
        const alertItem = document.createElement("p");
        alertItem.className = "alert-item";
        alertItem.textContent = "⚠ " + alertText;
        container.appendChild(alertItem);
    });

    const note = document.createElement("small");
    note.textContent =
        "This is an automated flag, not a diagnosis. Seek medical advice when concerned.";
    container.appendChild(note);
}

// ==========================================
// MEDICAL HISTORY - SAVE AND LOAD
// ==========================================

function saveMedicalHistory() {

    const medicalHistory = {
        previousProblems: $("previousProblems").value.trim(),
        allergies: $("allergies").value.trim(),
        ongoingConditions: $("ongoingConditions").value.trim(),
        medicalNotes: $("medicalNotes").value.trim()
    };

    localStorage.setItem(
        "cardioPulseMedicalHistory",
        JSON.stringify(medicalHistory)
    );

    $("medicalHistoryMessage").textContent =
        "Medical history saved successfully!";
}

function loadMedicalHistory() {

    const savedHistory = localStorage.getItem(
        "cardioPulseMedicalHistory"
    );

    if (!savedHistory) return;

    try {

        const medicalHistory = JSON.parse(savedHistory);

        $("previousProblems").value =
            medicalHistory.previousProblems || "";

        $("allergies").value =
            medicalHistory.allergies || "";

        $("ongoingConditions").value =
            medicalHistory.ongoingConditions || "";

        $("medicalNotes").value =
            medicalHistory.medicalNotes || "";

    } catch (error) {

        console.error("Unable to load medical history.");

    }
}

// ==========================================
// PAGE STARTUP
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    checkLogin();
    displayProfile();
    displayLatestReading();
    displayReadingHistory();
    updateHealthCharts();
    loadAlertSettings();
    checkHealthAlerts();
    loadMedicalHistory();
});