// Load the dataset and initialize the visualization
d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv").then(data => {
    data.forEach(d => {
        d.date = new Date(d.date);
        d.total_cases = +d.total_cases;
        d.new_cases = +d.new_cases;
        d.total_deaths = +d.total_deaths;
        d.new_deaths = +d.new_deaths;
    });

    // Initial Scene
    renderTotalCases(data);

    // Event listeners for buttons
    d3.select("#scene1").on("click", () => renderTotalCases(data));
    d3.select("#scene2").on("click", () => renderNewCases(data));
    d3.select("#scene3").on("click", () => renderTotalDeaths(data));
    d3.select("#scene4").on("click", () => renderNewDeaths(data));
});

// Function to render total cases
function renderTotalCases(data) {
    d3.select("#visualization").html(""); // Clear previous visualization

    const svg = d3.select("#visualization")
                  .append("svg")
                  .attr("width", 960)
                  .attr("height", 500);

    const x = d3.scaleTime()
                .domain(d3.extent(data, d => d.date))
                .range([0, 960]);

    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.total_cases)])
                .range([500, 0]);

    const line = d3.line()
                   .x(d => x(d.date))
                   .y(d => y(d.total_cases));

    svg.append("path")
       .datum(data)
       .attr("fill", "none")
       .attr("stroke", "steelblue")
       .attr("stroke-width", 1.5)
       .attr("d", line);

    svg.append("g")
       .attr("transform", "translate(0,500)")
       .call(d3.axisBottom(x));

    svg.append("g")
       .call(d3.axisLeft(y));

    // Add annotations
    svg.append("text")
       .attr("x", 960 / 2)
       .attr("y", 30)
       .attr("text-anchor", "middle")
       .style("font-size", "24px")
       .text("Total Confirmed Cases Over Time");
}

// Function to render new cases
function renderNewCases(data) {
    d3.select("#visualization").html(""); // Clear previous visualization

    const svg = d3.select("#visualization")
                  .append("svg")
                  .attr("width", 960)
                  .attr("height", 500);

    const x = d3.scaleTime()
                .domain(d3.extent(data, d => d.date))
                .range([0, 960]);

    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.new_cases)])
                .range([500, 0]);

    const line = d3.line()
                   .x(d => x(d.date))
                   .y(d => y(d.new_cases));

    svg.append("path")
       .datum(data)
       .attr("fill", "none")
       .attr("stroke", "steelblue")
       .attr("stroke-width", 1.5)
       .attr("d", line);

    svg.append("g")
       .attr("transform", "translate(0,500)")
       .call(d3.axisBottom(x));

    svg.append("g")
       .call(d3.axisLeft(y));

    // Add annotations
    svg.append("text")
       .attr("x", 960 / 2)
       .attr("y", 30)
       .attr("text-anchor", "middle")
       .style("font-size", "24px")
       .text("New Confirmed Cases Over Time");
}

// Function to render total deaths
function renderTotalDeaths(data) {
    d3.select("#visualization").html(""); // Clear previous visualization

    const svg = d3.select("#visualization")
                  .append("svg")
                  .attr("width", 960)
                  .attr("height", 500);

    const x = d3.scaleTime()
                .domain(d3.extent(data, d => d.date))
                .range([0, 960]);

    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.total_deaths)])
                .range([500, 0]);

    const line = d3.line()
                   .x(d => x(d.date))
                   .y(d => y(d.total_deaths));

    svg.append("path")
       .datum(data)
       .attr("fill", "none")
       .attr("stroke", "steelblue")
       .attr("stroke-width", 1.5)
       .attr("d", line);

    svg.append("g")
       .attr("transform", "translate(0,500)")
       .call(d3.axisBottom(x));

    svg.append("g")
       .call(d3.axisLeft(y));

    // Add annotations
    svg.append("text")
       .attr("x", 960 / 2)
       .attr("y", 30)
       .attr("text-anchor", "middle")
       .style("font-size", "24px")
       .text("Total Deaths Over Time");
}

// Function to render new deaths
function renderNewDeaths(data) {
    d3.select("#visualization").html(""); // Clear previous visualization

    const svg = d3.select("#visualization")
                  .append("svg")
                  .attr("width", 960)
                  .attr("height", 500);

    const x = d3.scaleTime()
                .domain(d3.extent(data, d => d.date))
                .range([0, 960]);

    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.new_deaths)])
                .range([500, 0]);

    const line = d3.line()
                   .x(d => x(d.date))
                   .y(d => y(d.new_deaths));

    svg.append("path")
       .datum(data)
       .attr("fill", "none")
       .attr("stroke", "steelblue")
       .attr("stroke-width", 1.5)
       .attr("d", line);

    svg.append("g")
       .attr("transform", "translate(0,500)")
       .call(d3.axisBottom(x));

    svg.append("g")
       .call(d3.axisLeft(y));

    // Add annotations
    svg.append("text")
       .attr("x", 960 / 2)
       .attr("y", 30)
       .attr("text-anchor", "middle")
       .style("font-size", "24px")
       .text("New Deaths Over Time");
}
