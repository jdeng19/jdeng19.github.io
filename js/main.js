d3.csv("data/owid-covid-data.csv").then(data => {
   data.forEach(d => {
       d.date = new Date(d.date);
       d.new_cases = +d.new_cases;
       d.new_deaths = +d.new_deaths;
       d.life_expectancy = +d.life_expectancy;
       d.human_development_index = +d.human_development_index;
   });

   // Initial Scene
   renderNewCases(data);

   // Event listeners for buttons
   d3.select("#scene1").on("click", () => renderNewCases(data));
   d3.select("#scene2").on("click", () => renderNewDeaths(data));
   d3.select("#scene3").on("click", () => renderLifeExpectancyVsHDI(data));
   d3.select("#scene4").on("click", () => renderHDIByContinent(data));
});

// Function to render new cases
function renderNewCases(data) {
   d3.select("#visualization").html(""); // Clear previous visualization

   const svg = d3.select("#visualization")
                 .append("svg")
                 .attr("width", 960)
                 .attr("height", 500);

   const tooltip = d3.select("#visualization")
                     .append("div")
                     .attr("class", "tooltip")
                     .style("opacity", 0);

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
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")));

   svg.append("g")
      .call(d3.axisLeft(y));

   svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".75em")
      .style("text-anchor", "end")
      .text("New Cases");

   svg.append("text")
      .attr("x", 960 / 2)
      .attr("y", 470)
      .attr("text-anchor", "middle")
      .text("Date");

   svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.date))
      .attr("cy", d => y(d.new_cases))
      .attr("r", 3)
      .attr("fill", "red")
      .on("mouseover", function(event, d) {
          tooltip.transition()
                 .duration(200)
                 .style("opacity", .9);
          tooltip.html(`Date: ${d3.timeFormat("%Y-%m-%d")(d.date)}<br>New Cases: ${d.new_cases}`)
                 .style("left", (event.pageX + 5) + "px")
                 .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
      });
}

// Function to render new deaths
function renderNewDeaths(data) {
   d3.select("#visualization").html(""); // Clear previous visualization

   const svg = d3.select("#visualization")
                 .append("svg")
                 .attr("width", 960)
                 .attr("height", 500);

   const tooltip = d3.select("#visualization")
                     .append("div")
                     .attr("class", "tooltip")
                     .style("opacity", 0);

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
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")));

   svg.append("g")
      .call(d3.axisLeft(y));

   svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".75em")
      .style("text-anchor", "end")
      .text("New Deaths");

   svg.append("text")
      .attr("x", 960 / 2)
      .attr("y", 470)
      .attr("text-anchor", "middle")
      .text("Date");

   svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.date))
      .attr("cy", d => y(d.new_deaths))
      .attr("r", 3)
      .attr("fill", "red")
      .on("mouseover", function(event, d) {
          tooltip.transition()
                 .duration(200)
                 .style("opacity", .9);
          tooltip.html(`Date: ${d3.timeFormat("%Y-%m-%d")(d.date)}<br>New Deaths: ${d.new_deaths}`)
                 .style("left", (event.pageX + 5) + "px")
                 .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
      });
}

// Function to render life expectancy vs. human development index
function renderLifeExpectancyVsHDI(data) {
   d3.select("#visualization").html(""); // Clear previous visualization

   const svg = d3.select("#visualization")
                 .append("svg")
                 .attr("width", 960)
                 .attr("height", 500);

   const tooltip = d3.select("#visualization")
                     .append("div")
                     .attr("class", "tooltip")
                     .style("opacity", 0);

   const x = d3.scaleLinear()
               .domain([0, d3.max(data, d => d.human_development_index)])
               .range([0, 960]);

   const y = d3.scaleLinear()
               .domain([0, d3.max(data, d => d.life_expectancy)])
               .range([500, 0]);

   svg.append("g")
      .attr("transform", "translate(0,500)")
      .call(d3.axisBottom(x));

   svg.append("g")
      .call(d3.axisLeft(y));

   svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".75em")
      .style("text-anchor", "end")
      .text("Life Expectancy");

   svg.append("text")
      .attr("x", 960 / 2)
      .attr("y", 470)
      .attr("text-anchor", "middle")
      .text("Human Development Index");

   svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.human_development_index))
      .attr("cy", d => y(d.life_expectancy))
      .attr("r", 3)
      .attr("fill", "red")
      .on("mouseover", function(event, d) {
          tooltip.transition()
                 .duration(200)
                 .style("opacity", .9);
          tooltip.html(`Life Expectancy: ${d.life_expectancy}<br>HDI: ${d.human_development_index}`)
                 .style("left", (event.pageX + 5) + "px")
                 .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
      });
}

// Function to render human development index by continent
function renderHDIByContinent(data) {
   d3.select("#visualization").html(""); // Clear previous visualization

   const svg = d3.select("#visualization")
                 .append("svg")
                 .attr("width", 960)
                 .attr("height", 500);

   const tooltip = d3.select("#visualization")
                     .append("div")
                     .attr("class", "tooltip")
                     .style("opacity", 0);

   const continents = d3.groups(data, d => d.continent).map(d => d[0]);

   const avgHDI = d3.groups(data, d => d.continent).map(d => {
       const continentData = d[1];
       const avgHDI = d3.mean(continentData, c => c.human_development_index);
       return { continent: d[0], avgHDI: avgHDI };
   });

   const x = d3.scaleBand()
               .domain(continents)
               .range([0, 960])
               .padding(0.1);

   const y = d3.scaleLinear()
               .domain([0, d3.max(avgHDI, d => d.avgHDI)])
               .range([500, 0]);

   svg.append("g")
      .attr("transform", "translate(0,500)")
      .call(d3.axisBottom(x));

   svg.append("g")
      .call(d3.axisLeft(y));

   svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".75em")
      .style("text-anchor", "end")
      .text("Average Human Development Index");

   svg.append("text")
      .attr("x", 960 / 2)
      .attr("y", 470)
      .attr("text-anchor", "middle")
      .text("Continent");

   svg.selectAll("rect")
      .data(avgHDI)
      .enter()
      .append("rect")
      .attr("x", d => x(d.continent))
      .attr("y", d => y(d.avgHDI))
      .attr("width", x.bandwidth())
      .attr("height", d => 500 - y(d.avgHDI))
      .attr("fill", "steelblue")
      .on("mouseover", function(event, d) {
          tooltip.transition()
                 .duration(200)
                 .style("opacity", .9);
          tooltip.html(`Continent: ${d.continent}<br>Avg HDI: ${d.avgHDI.toFixed(3)}`)
                 .style("left", (event.pageX + 5) + "px")
                 .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
      });
}
