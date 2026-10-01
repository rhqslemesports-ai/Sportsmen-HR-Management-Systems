/* Dashboard page logic */
"use strict";
(function(){
  wireApp("dashboard");
  const records = loadRecords();

  /* ---- Stat cards ---- */
  const active = records.filter(r => r.status === "Active").length;
  const sports = new Set(records.map(r => r.sportsEvent)).size;
  const units = new Set(records.map(r => r.unit)).size;
  const recentCount = records.filter(r => (Date.now() - new Date(r.createdAt)) < 30*24*3600*1000).length;
  document.getElementById("stat-total").textContent = records.length;
  document.getElementById("stat-active").textContent = active;
  document.getElementById("stat-sports").textContent = sports;
  document.getElementById("stat-units").textContent = units;
  document.getElementById("stat-recent").textContent = recentCount;

  /* ---- Chart: distribution by sport ---- */
  function sportData(){
    const map = {};
    records.forEach(r => { map[r.sportsEvent] = (map[r.sportsEvent]||0) + 1; });
    const entries = Object.entries(map).sort((a,b) => b[1]-a[1]);
    return { labels: entries.map(e => e[0]), values: entries.map(e => e[1]) };
  }
  function renderChart(){
    const c = document.getElementById("sport-chart");
    if(!c) return;
    const d = sportData();
    drawBarChart(c, d.labels, d.values, { height: 265 });
  }
  window.__redrawCharts = renderChart;
  renderChart();
  window.addEventListener("resize", renderChart);

  /* ---- Recently added table ---- */
  const recent = records.slice().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
  const tbody = document.getElementById("recent-body");
  if(!recent.length){
    tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state"><div class="big">📋</div><h3>No records yet</h3><p>Use "Add Sportsman" to register the first record.</p></div></td></tr>';
  } else {
    tbody.innerHTML = recent.map(r =>
      '<tr>' +
      '<td><div class="row-avatar">'+avatarHTML(r)+'</div></td>' +
      '<td><b>'+escapeHtml(r.serviceNumber)+'</b></td>' +
      '<td>'+escapeHtml(r.rank)+'</td>' +
      '<td>'+escapeHtml(r.name)+'</td>' +
      '<td>'+escapeHtml(r.unit)+'</td>' +
      '<td>'+escapeHtml(r.sportsEvent)+'</td>' +
      '<td><span class="pill '+(r.status==="Active"?"active":"inactive")+'">'+escapeHtml(r.status)+'</span></td>' +
      '<td><div class="action-btns">' +
        '<a class="mini-btn view" title="View" href="profile.html?id='+r.id+'">👁</a>' +
        '<a class="mini-btn edit" title="Edit" href="add-sportsman.html?edit='+r.id+'">✎</a>' +
      '</div></td></tr>'
    ).join("");
  }

  /* ---- Quick search ---- */
  const qs = document.getElementById("quick-search");
  if(qs) qs.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && qs.value.trim()){
      window.location.href = "search.html?q=" + encodeURIComponent(qs.value.trim());
    }
  });
})();
