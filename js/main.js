d3.csv("data/Student_performance_data.csv").then(data => {
   data.forEach(d => {
       d.StudyTimeWeekly = +d.StudyTimeWeekly;
       d.GPA = +d.GPA;
       d.ParentalEducation = +d.ParentalEducation;
       d.Absences = +d.Absences;
       d.Extracurricular = +d.Extracurricular;
   });

   // Initial Scene
   renderStudyTimeVsGPA(data);

   // Event listeners for buttons
   d3.select("#scene1").on("click", () => renderStudyTimeVsGPA(data));
   d3.select("#scene2").on("click", () => renderGPAByParentalEducation(data));
   d3.select("#scene3").on("click", () => renderGPAByExtracurricular(data));
   d3.select("#scene4").on("click", () => renderAbsencesVsGPA(data));
});

// Function to render Study Time vs GPA
function renderStudyTimeVsGPA(data) {
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
               .domain([0, d3.max(data, d => d.StudyTimeWeekly)])
               .range([0, 960]);

   const y = d3.scaleLinear()
               .domain([0, d3.max(data, d => d.GPA)])
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
      .text("GPA");

   svg.append("text")
      .attr("x", 960 / 2)
      .attr("y", 470)
      .attr("text-anchor", "middle")
      .text("Study Time (hours)");

   svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.StudyTimeWeekly))
      .attr("cy", d => y(d.GPA))
      .attr("r", 3)
      .attr("fill", "red")
      .on("mouseover", function(event, d) {
          tooltip.transition()
                 .duration(200)
                 .style("opacity", .9);
          tooltip.html(`Study Time: ${d.StudyTimeWeekly}<br>GPA: ${d.GPA}`)
                 .style("left", (event.pageX + 5) + "px")
                 .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
      });
}

// Function to render GPA by Parental Education
function renderGPAByParentalEducation(data) {
   d3.select("#visualization").html(""); // Clear previous visualization

   const svg = d3.select("#visualization")
                 .append("svg")
                 .attr("width", 960)
                 .attr("height", 500);

   const tooltip = d3.select("#visualization")
                     .append("div")
                     .attr("class", "tooltip")
                     .style("opacity", 0);

   const x = d3.scaleBand()
               .domain(data.map(d => d.ParentalEducation))
               .range([0, 960])
               .padding(0.1);

   const y = d3.scaleLinear()
               .domain([0, d3.max(data, d => d.GPA)])
               .range([500, 0]);

   svg.append("g")
      .attr("transform", "translate(0,500)")
      .call(d3.axisBottom(x).tickFormat(d => `Level ${d}`));

   svg.append("g")
      .call(d3.axisLeft(y));

   svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".75em")
      .style("text-anchor", "end")
      .text("GPA");

   svg.append("text")
      .attr("x", 960 / 2)
      .attr("y", 470)
      .attr("text-anchor", "middle")
      .text("Parental Education Level");

   svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.ParentalEducation))
      .attr("y", d => y(d.GPA))
      .attr("width", x.bandwidth())
      .attr("height", d => 500 - y(d.GPA))
      .attr("fill", "steelblue")
      .on("mouseover", function(event, d) {
         tooltip.transition()
                .duration(200)
                .style("opacity", .9);
         tooltip.html(`Parental Education: Level ${d.ParentalEducation}<br>GPA: ${d.GPA}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
     })
     .on("mouseout", function(d) {
         tooltip.transition()
                .duration(500)
                .style("opacity", 0);
     });
}

// Function to render GPA by Extracurricular Activities
function renderGPAByExtracurricular(data) {
  d3.select("#visualization").html(""); // Clear previous visualization

  const svg = d3.select("#visualization")
                .append("svg")
                .attr("width", 960)
                .attr("height", 500);

  const tooltip = d3.select("#visualization")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

  const extracurriculars = ["Extracurricular", "Sports", "Music", "Volunteering"];
  const avgGPA = extracurriculars.map(activity => {
      const filteredData = data.filter(d => d[activity] === 1);
      const avgGPA = d3.mean(filteredData, d => d.GPA);
      return { activity, avgGPA };
  });

  const x = d3.scaleBand()
              .domain(extracurriculars)
              .range([0, 960])
              .padding(0.1);

  const y = d3.scaleLinear()
              .domain([0, d3.max(avgGPA, d => d.avgGPA)])
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
     .text("Average GPA");

  svg.append("text")
     .attr("x", 960 / 2)
     .attr("y", 470)
     .attr("text-anchor", "middle")
     .text("Extracurricular Activities");

  svg.selectAll("rect")
     .data(avgGPA)
     .enter()
     .append("rect")
     .attr("x", d => x(d.activity))
     .attr("y", d => y(d.avgGPA))
     .attr("width", x.bandwidth())
     .attr("height", d => 500 - y(d.avgGPA))
     .attr("fill", "steelblue")
     .on("mouseover", function(event, d) {
         tooltip.transition()
                .duration(200)
                .style("opacity", .9);
         tooltip.html(`Activity: ${d.activity}<br>Avg GPA: ${d.avgGPA.toFixed(2)}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
     })
     .on("mouseout", function(d) {
         tooltip.transition()
                .duration(500)
                .style("opacity", 0);
     });
}

// Function to render Absences vs GPA
function renderAbsencesVsGPA(data) {
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
              .domain([0, d3.max(data, d => d.Absences)])
              .range([0, 960]);

  const y = d3.scaleLinear()
              .domain([0, d3.max(data, d => d.GPA)])
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
     .text("GPA");

  svg.append("text")
     .attr("x", 960 / 2)
     .attr("y", 470)
     .attr("text-anchor", "middle")
     .text("Absences");

  svg.selectAll("circle")
     .data(data)
     .enter()
     .append("circle")
     .attr("cx", d => x(d.Absences))
     .attr("cy", d => y(d.GPA))
     .attr("r", 3)
     .attr("fill", "red")
     .on("mouseover", function(event, d) {
         tooltip.transition()
                .duration(200)
                .style("opacity", .9);
         tooltip.html(`Absences: ${d.Absences}<br>GPA: ${d.GPA}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
     })
     .on("mouseout", function(d) {
         tooltip.transition()
                .duration(500)
                .style("opacity", 0);
     });
}
