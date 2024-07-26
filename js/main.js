d3.csv("data/Student_performance_data.csv", d => {
   return {
      StudyTimeWeekly: +d.StudyTimeWeekly,
      GPA: +d.GPA,
      ParentalEducation: +d.ParentalEducation,
      Absences: +d.Absences,
      Extracurricular: +d.Extracurricular,
      Sports: +d.Sports,
      Music: +d.Music,
      Volunteering: +d.Volunteering
   };
}).then(data => {
   let currentScene = 0;
   const scenes = [renderOverviewWithAnnotations, renderHighlightExtremesWithAnnotations, renderExtracurricularByStudyTimeWithAnnotations, renderGPAByStudyTimeWithAnnotations];   
   // Initial Scene
   updateButtons();
   scenes[currentScene](data);
   
   // Event listeners for buttons
   d3.select("#start-over").on("click", () => {
      currentScene = 0;
      updateButtons();
      scenes[currentScene](data);
   });
   d3.select("#back").on("click", () => {
      if (currentScene > 0) {
         currentScene--;
         updateButtons();
         scenes[currentScene](data);
      }
   });
   d3.select("#forward").on("click", () => {
      if (currentScene < scenes.length - 1) {
         currentScene++;
         updateButtons();
         scenes[currentScene](data);
      }
   });
   
   function updateButtons() {
      d3.select("#start-over")
      .attr("class", currentScene === 0 ? "button disabled" : "button enabled")
      .attr("disabled", currentScene === 0 ? true : null);
      d3.select("#back")
      .attr("class", currentScene === 0 ? "button disabled" : "button enabled")
      .attr("disabled", currentScene === 0 ? true : null);
      d3.select("#forward")
      .attr("class", currentScene === scenes.length - 1 ? "button disabled" : "button enabled")
      .attr("disabled", currentScene === scenes.length - 1 ? true : null);
   }
});

function setupSvgAndScales() {
   const margin = { top: 100, right: 50, bottom: 80, left: 80 };
   const width = 960 - margin.left - margin.right;
   const height = 500 - margin.top - margin.bottom;
   
   const svg = d3.select("#visualization")
   .append("svg")
   .attr("width", width + margin.left + margin.right)
   .attr("height", height + margin.top + margin.bottom)
   .append("g")
   .attr("transform", `translate(${margin.left},${margin.top})`);
   
   const tooltip = d3.select("#visualization")
   .append("div")
   .attr("class", "tooltip")
   .style("opacity", 0)
   .style("position", "absolute")
   .style("pointer-events", "none");
   
   return { width, height, margin, svg, tooltip };
}

function setupAxes(svg, x, y, width, height, margin, title) {
   svg.append("g")
   .attr("transform", `translate(0,${height})`)
   .call(d3.axisBottom(x).tickFormat(d3.format(".0f")));
   
   svg.append("g")
   .call(d3.axisLeft(y).ticks(10));
   
   svg.append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", -margin.left + 10)
   .attr("x", -height / 2)
   .attr("dy", "1em")
   .style("text-anchor", "middle")
   .text("Count of Students");
   
   svg.append("text")
   .attr("x", width / 2)
   .attr("y", height + margin.bottom - 10)
   .attr("text-anchor", "middle")
   .text("Study Time (hours)");
   
   svg.append("text")
   .attr("x", width / 2)
   .attr("y", -margin.top / 2 + 10)
   .attr("text-anchor", "middle")
   .style("font-size", "16px")
   .style("font-weight", "bold")
   .text(title);
}


function prepareDataForStudyTime(data, current = "") {
   let minStudyTime = d3.min(data, d => d.StudyTimeWeekly);
   let maxStudyTime = d3.max(data, d => d.StudyTimeWeekly);
   let studyTimeGroups = d3.range(minStudyTime, maxStudyTime, (maxStudyTime - minStudyTime) / 20);
   
   let calculatedData = {};
   
   for (const record of data) {
      let studyTime = record.StudyTimeWeekly;
      if (!calculatedData[studyTime]) {
         calculatedData[studyTime] = {
            StudyTimeWeekly: studyTime,
            total: 0,
            Extracurricular: 0,
            Sports: 0,
            Music: 0,
            Volunteering: 0,
            Grade_F: 0,
            Grade_C_D: 0,
            Grade_A_B: 0
         };
      }
      calculatedData[studyTime].total += 1;
      if (current === "ExtracurricularByStudyTime") {
         calculatedData[studyTime].Extracurricular += record.Extracurricular;
         calculatedData[studyTime].Sports += record.Sports;
         calculatedData[studyTime].Music += record.Music;
         calculatedData[studyTime].Volunteering += record.Volunteering;
      }
      if (current === "GPAByStudyTime") {
         if (record.GPA < 2) calculatedData[studyTime].Grade_F += 1;
         if (record.GPA >= 2 && record.GPA < 3) calculatedData[studyTime].Grade_C_D += 1;
         if (record.GPA >= 3) calculatedData[studyTime].Grade_A_B += 1;
      }
   }
   
   let finalData = Object.values(calculatedData).sort((a, b) => a.StudyTimeWeekly - b.StudyTimeWeekly);
   
   let groupedData = [];
   for (let i = 0; i < studyTimeGroups.length - 1; i++) {
      let groupStart = studyTimeGroups[i];
      let groupEnd = studyTimeGroups[i + 1];
      let group = finalData.filter(d => d.StudyTimeWeekly >= groupStart && d.StudyTimeWeekly < groupEnd);
      
      if (current === "highlightExtremes" || current === "") {
         groupedData.push({
            StudyTimeWeekly: groupStart,
            count: d3.sum(group, d => d.total)
         });
      } else if (current === "ExtracurricularByStudyTime") {
         groupedData.push({
            StudyTimeWeekly: groupStart,
            total: d3.sum(group, d => d.total),
            Extracurricular: d3.sum(group, d => d.Extracurricular),
            Sports: d3.sum(group, d => d.Sports),
            Music: d3.sum(group, d => d.Music),
            Volunteering: d3.sum(group, d => d.Volunteering)
         });
      } else { // current === "GPAByStudyTime"
         groupedData.push({
            StudyTimeWeekly: groupStart,
            total: d3.sum(group, d => d.total),
            Grade_F: d3.sum(group, d => d.Grade_F),
            Grade_C_D: d3.sum(group, d => d.Grade_C_D),
            Grade_A_B: d3.sum(group, d => d.Grade_A_B)
         });
      }
   }
   
   return groupedData;
}



function highlightExtremesAnnotations(x, y, finalData) {
   const maxCount = d3.max(finalData, d => d.count);
   const minCount = d3.min(finalData, d => d.count);
   const maxData = finalData.find(d => d.count === maxCount);
   const minData = finalData.find(d => d.count === minCount);
   
   const annotations = [
      {
         note: {
            label: `Study Time: ${d3.format(".0f")(maxData.StudyTimeWeekly)} hours`,
            title: `Max Count: ${maxCount}`,
            wrap: 200,
         },
         x: x(maxData.StudyTimeWeekly) + x.bandwidth() / 2,
         y: y(maxCount),
         dy: -10,
         dx: 0,
         subject: { radius: 15, radiusPadding: 5 },
         color: ["darkred"]
      },
      {
         note: {
            label: `Study Time: ${d3.format(".0f")(minData.StudyTimeWeekly)} hours`,
            title: `Min Count: ${minCount}`,
            wrap: 200,
         },
         x: x(minData.StudyTimeWeekly) + x.bandwidth() / 2,
         y: y(minCount),
         dy: -10,
         dx: 0,
         subject: { radius: 15, radiusPadding: 5 },
         color: ["darkred"]
      }
   ];
   return annotations;
}


function gpaAnnotations(x, y, finalData) {
   const firstGroupData = finalData[0];
   const firstGroupUnder2 = firstGroupData.Grade_F;
   const firstGroupUnder2YPosition = y(firstGroupUnder2);
   
   const annotations = [
      {
         note: {
            label: `0 Hour Study Time Per Week has the most students with Grade F`,
            title: `Student Count: ${firstGroupUnder2}`,
            wrap: 200,
         },
         x: x(firstGroupData.StudyTimeWeekly) + x.bandwidth() / 2,
         y: firstGroupUnder2YPosition,
         dy: -10,
         dx: 0,
         subject: { radius: 15, radiusPadding: 5 },
         color: ["darkred"]
      }
   ];
   return annotations;
}


function renderSceneAnnotations(sceneTitle) {
   const annotationContainer = d3.select("#scene-annotations");
   annotationContainer.html(""); 

   annotationContainer.append("div")
       .attr("class", "scene-annotation")
       .style("margin", "50px")
       .style("width", "90%")
       .style("position", "relative")
       .style("font-size", "16px")
       .text(sceneTitle);
}


function renderOverviewWithAnnotations(data) {
   renderCountByStudyTime(data, "Overview");
   const annotations = "The distribution of students' study time is relatively uniform, with no extreme peaks or troughs. Most study time intervals have a consistent number of students, indicating that students tend to distribute their study hours evenly across different weekly intervals.";
   renderSceneAnnotations(annotations);
}

function renderHighlightExtremesWithAnnotations(data) {
   renderCountByStudyTime(data, "", "highlightExtremes");
   const annotations = "The chart highlights that 10 hours of study time per week is the most common among students, with a maximum count of 144 students. Conversely, 15 hours of study time per week has the least number of students, with a count of 90. This indicates that a moderate study time (around 10 hours per week) is more popular among students, whereas longer study durations (like 15 hours) are less common. This could suggest that students find a balance at around 10 hours that optimally fits their schedules and study needs.";
   renderSceneAnnotations(annotations);
}


function renderExtracurricularByStudyTimeWithAnnotations(data) {
   renderExtracurricularByStudyTime(data, "ExtracurricularByStudyTime");
   const annotations = "This suggests that students who study a moderate amount of time are also able to balance their academics with various extracurricular activities. According to the chart, there are relatively more students who participate in extracurricular activities than who participate in volunteering. ";
   renderSceneAnnotations(annotations);
}

function renderGPAByStudyTimeWithAnnotations(data) {
   renderGPAByStudyTime(data, "GPAByStudyTime");
   const annotations = "The GPA distribution shows a clear trend where students with zero study hours per week have the highest count of students with a Grade F. As study hours increase, the number of students with higher GPAs (Grades A and B) also increases. This indicates a strong correlation between study time and academic performance, where more study time generally leads to better grades.";
   renderSceneAnnotations(annotations);
}


function renderCountByStudyTime(data, title, current = "") {
   d3.select("#visualization").html(""); // Clear previous visualization
   
   const { width, height, margin, svg, tooltip } = setupSvgAndScales();
   
   const finalData = prepareDataForStudyTime(data, current);
   
   const x = d3.scaleBand()
   .domain(finalData.map(d => d.StudyTimeWeekly))
   .range([0, width])
   .padding(0.1);
   
   const y = d3.scaleLinear()
   .domain([0, d3.max(finalData, d => d.count)])
   .range([height, 0]);
   
   setupAxes(svg, x, y, width, height, margin, title);
   
   const maxCount = d3.max(finalData, d => d.count);
   const minCount = d3.min(finalData, d => d.count);
   
   svg.selectAll("rect")
   .data(finalData)
   .enter()
   .append("rect")
   .attr("x", d => x(d.StudyTimeWeekly))
   .attr("y", d => y(d.count))
   .attr("width", x.bandwidth())
   .attr("height", d => height - y(d.count))
   .attr("fill", d => {
      if (current !== "highlightExtremes") return "steelblue";
      if (current === "highlightExtremes" && (d.count === maxCount || d.count === minCount)) return "steelblue";
      return "lightgray";
   })
   .on("mouseover", function (event, d) {
      tooltip.transition()
      .duration(200)
      .style("opacity", .9);
      tooltip.html(`Study Time: ${d3.format(".0f")(d.StudyTimeWeekly)}<br>Count: ${d.count}`);
   })
   .on("mousemove", function (event) {
      const [mouseX, mouseY] = d3.pointer(event);
      tooltip.style("left", `${mouseX + 15}px`)
      .style("top", `${mouseY - 15}px`);
   })
   .on("mouseout", function (d) {
      tooltip.transition()
      .duration(500)
      .style("opacity", 0);
   });
   
   if (current === "highlightExtremes") {
      const annotations = highlightExtremesAnnotations(x, y, finalData);
      const makeAnnotations = d3.annotation().annotations(annotations);
      
      svg.append("g")
      .attr("class", "annotation-group")
      .call(makeAnnotations);
   }
}

function renderExtracurricularByStudyTime(data, current = "ExtracurricularByStudyTime") {
   d3.select("#visualization").html(""); // Clear previous visualization
   
   const { width, height, margin, svg, tooltip } = setupSvgAndScales();
   
   const finalData = prepareDataForStudyTime(data, current);
   
   const x = d3.scaleBand()
   .domain(finalData.map(d => d.StudyTimeWeekly))
   .range([0, width])
   .padding(0.1);
   
   const y = d3.scaleLinear()
   .domain([0, d3.max(finalData, d => d.total)])
   .range([height, 0]);
   
   const color = d3.scaleOrdinal()
   .domain(["Extracurricular", "Sports", "Music", "Volunteering"])
   .range(["#375da1", "#37a1a1", "#7db36d", "#e8c974"]);
   
   setupAxes(svg, x, y, width, height, margin, "Extracurricular Distribution");
   
   const stack = d3.stack()
   .keys(["Extracurricular", "Sports", "Music", "Volunteering"])
   .order(d3.stackOrderNone)
   .offset(d3.stackOffsetNone);
   
   const series = stack(finalData);
   
   svg.selectAll(".serie")
   .data(series)
   .enter().append("g")
   .attr("class", "serie")
   .attr("fill", d => color(d.key))
   .selectAll("rect")
   .data(d => d)
   .enter().append("rect")
   .attr("x", d => x(d.data.StudyTimeWeekly))
   .attr("y", d => y(d[1]))
   .attr("height", d => y(d[0]) - y(d[1]))
   .attr("width", x.bandwidth())
   .on("mouseover", function (event, d) {
      const key = d3.select(this.parentNode).datum().key;
      tooltip.transition()
      .duration(200)
      .style("opacity", .9);
      tooltip.html(`Study Time: ${d3.format(".0f")(d.data.StudyTimeWeekly)}<br>${key}: ${d.data[key]}`);
   })
   .on("mousemove", function (event) {
      const [mouseX, mouseY] = d3.pointer(event);
      tooltip.style("left", `${mouseX + 15}px`)
      .style("top", `${mouseY - 15}px`);
   })
   .on("mouseout", function (d) {
      tooltip.transition()
      .duration(500)
      .style("opacity", 0);
   });

}

function renderGPAByStudyTime(data, current = "GPAByStudyTime") {
   d3.select("#visualization").html(""); // Clear previous visualization
   
   const { width, height, margin, svg, tooltip } = setupSvgAndScales();
   const finalData = prepareDataForStudyTime(data, current);
   
   const x = d3.scaleBand()
   .domain(finalData.map(d => d.StudyTimeWeekly))
   .range([0, width])
   .padding(0.1);
   
   const y = d3.scaleLinear()
   .domain([0, d3.max(finalData, d => d.total)])
   .range([height, 0]);
   
   const color = d3.scaleOrdinal()
   .domain(["Grade_F", "Grade_C_D", "Grade_A_B"])
   .range(["#375da1", "#37a1a1", "#7db36d"]);
   
   setupAxes(svg, x, y, width, height, margin, "GPA Distribution by Study Time");
   
   const stack = d3.stack()
   .keys(["Grade_F", "Grade_C_D", "Grade_A_B"])
   .order(d3.stackOrderNone)
   .offset(d3.stackOffsetNone);
   
   const series = stack(finalData);
   
   svg.selectAll(".serie")
   .data(series)
   .enter().append("g")
   .attr("class", "serie")
   .attr("fill", d => color(d.key))
   .selectAll("rect")
   .data(d => d)
   .enter().append("rect")
   .attr("x", d => x(d.data.StudyTimeWeekly))
   .attr("y", d => y(d[1]))
   .attr("height", d => y(d[0]) - y(d[1]))
   .attr("width", x.bandwidth())
   .on("mouseover", function (event, d) {
      const key = d3.select(this.parentNode).datum().key;
      tooltip.transition()
      .duration(200)
      .style("opacity", .9);
      tooltip.html(`Study Time: ${d3.format(".0f")(d.data.StudyTimeWeekly)}<br>${key}: ${d.data[key]}`);
   })
   .on("mousemove", function (event) {
      const [mouseX, mouseY] = d3.pointer(event);
      tooltip.style("left", `${mouseX + 15}px`)
      .style("top", `${mouseY - 15}px`);
   })
   .on("mouseout", function (d) {
      tooltip.transition()
      .duration(500)
      .style("opacity", 0);
   });
   
   const annotations = gpaAnnotations(x, y, finalData);
   const makeAnnotations = d3.annotation().annotations(annotations);
   svg.append("g")
   .attr("class", "annotation-group")
   .call(makeAnnotations);
   
}
