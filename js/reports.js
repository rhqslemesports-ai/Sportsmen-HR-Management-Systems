/* Reports page */
"use strict";
(function(){
  wireApp("reports");
  const records = loadRecords();
  const byField = f => {
    const m = {};
    records.forEach(r => { const k = r[f] || "Not Specified"; m[k] = (m[k]||0)+1; });
    return Object.entries(m).sort((a,b) => b[1]-a[1]);
  };
  function statCardHTML(entries){
    const max = Math.max.apply(null, entries.map(e => e[1]).concat([1]));
    return '<table class="rep-table"><thead><tr><th>Category</th><th class="bar-cell">Distribution</th><th style="text-align:right">Count</th></tr></thead><tbody>' +
      (entries.length ? entries.map(([k,v]) =>
        '<tr><td>'+escapeHtml(k)+'</td>' +
        '<td><div class="bar-track"><div class="bar-fill" style="width:'+Math.round(v/max*100)+'%"></div></div></td>' +
        '<td style="text-align:right"><b>'+v+'</b></td></tr>'
      ).join("") : '<tr><td colspan="3" style="text-align:center;color:var(--muted)">No data available</td></tr>') +
      '</tbody></table>';
  }
  document.getElementById("rep-unit").innerHTML = statCardHTML(byField("unit"));
  document.getElementById("rep-rank").innerHTML = statCardHTML(byField("rank"));
  document.getElementById("rep-sport").innerHTML = statCardHTML(byField("sportsEvent"));
  document.getElementById("rep-weightclass").innerHTML = statCardHTML(byField("weightClass"));
  document.getElementById("rep-workplace").innerHTML = statCardHTML(byField("workplace"));
  document.getElementById("rep-marital").innerHTML = statCardHTML(byField("maritalStatus"));
  document.getElementById("rep-total").textContent = records.length;
  document.getElementById("rep-active").textContent = records.filter(r => r.status === "Active").length;

  /* chart */
  const sp = byField("sportsEvent");
  function renderChart(){
    const c = document.getElementById("rep-chart");
    if(c) drawBarChart(c, sp.map(e => e[0]), sp.map(e => e[1]), { height: 280 });
  }
  window.__redrawCharts = renderChart;
  renderChart();
  window.addEventListener("resize", renderChart);

  /* CSV export */
  document.getElementById("btn-csv").addEventListener("click", () => {
    const cols = ["serviceNumber","rank","name","unit","workplace","sportsEvent","weightClass","weight","height","bloodGroup","maritalStatus","status"];
    const csv = [cols.join(",")].concat(records.map(r => cols.map(c => '"' + String(r[c]==null?"":r[c]).replace(/"/g,'""') + '"').join(","))).join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type:"text/csv" }));
    a.download = "sportsmen-report-" + new Date().toISOString().slice(0,10) + ".csv";
    a.click(); URL.revokeObjectURL(a.href);
    toast("Report exported as CSV.");
  });
  document.getElementById("btn-pdf").addEventListener("click", () => { toast("Opening print dialog — choose 'Save as PDF'.", "info"); setTimeout(() => window.print(), 500); });
  document.getElementById("btn-print").addEventListener("click", () => window.print());
})();
