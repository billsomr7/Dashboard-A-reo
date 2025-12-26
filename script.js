const toggleBtn = document.getElementById("themeToggle");
const periodSelect = document.getElementById("period");
const loading = document.getElementById("loading");
const kpis = document.getElementById("kpis");
const chartsSection = document.getElementById("charts");

let flightsChart, routesChart;

// THEME
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
    toggleBtn.textContent = "☀️";
}

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const light = document.body.classList.contains("light");
    toggleBtn.textContent = light ? "☀️" : "🌙";
    localStorage.setItem("theme", light ? "light" : "dark");
});

// FAKE API
function fetchDashboardData(period) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                months: period == 6
                    ? ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"]
                    : ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],
                flights: period == 6
                    ? [120,150,180,220,200,260]
                    : [120,150,180,220,200,260,240,210,230,250,270,300],
                routes: ["SP-RJ","SP-BH","SP-SAL","RJ-REC"],
                routeUsage: [320,280,210,170],
                totalFlights: period == 6 ? 1130 : 2450,
                totalPassengers: period == 6 ? 98240 : 187300,
                totalRoutes: 18
            });
        }, 1200);
    });
}

// LOAD DASHBOARD
async function loadDashboard() {
    loading.classList.remove("hidden");
    kpis.classList.add("hidden");
    chartsSection.classList.add("hidden");

    const data = await fetchDashboardData(periodSelect.value);

    document.getElementById("totalFlights").textContent = data.totalFlights;
    document.getElementById("totalPassengers").textContent = data.totalPassengers;
    document.getElementById("totalRoutes").textContent = data.totalRoutes;

    if (flightsChart) flightsChart.destroy();
    if (routesChart) routesChart.destroy();

    flightsChart = new Chart(document.getElementById("flightsChart"), {
        type: "line",
        data: {
            labels: data.months,
            datasets: [{
                label: "Voos",
                data: data.flights,
                borderColor: "#38bdf8",
                backgroundColor: "rgba(56,189,248,0.3)",
                fill: true,
                tension: 0.4
            }]
        }
    });

    routesChart = new Chart(document.getElementById("routesChart"), {
        type: "bar",
        data: {
            labels: data.routes,
            datasets: [{
                label: "Rotas",
                data: data.routeUsage,
                backgroundColor: "#2c5364"
            }]
        }
    });

    loading.classList.add("hidden");
    kpis.classList.remove("hidden");
    chartsSection.classList.remove("hidden");
}

periodSelect.addEventListener("change", loadDashboard);
loadDashboard();