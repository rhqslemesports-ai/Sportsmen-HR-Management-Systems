/* Sportsmen records page: search, filters, sort, pagination, delete */
"use strict";
(function(){
  wireApp("sportsmen");
  const PAGE_SIZE = 8;
  let state = { q:"", rank:"", unit:"", sport:"", workplace:"", status:"", sort:"name-asc", page:1, advanced:false };

  /* populate filter dropdowns */
  function fillSelect(id, items, allLabel){
    const el = document.getElementById(id);
    el.innerHTML = '<option value="">'+(allLabel||"All")+'</option>' + items.map(i => '<option value="'+escapeHtml(i)+'">'+escapeHtml(i)+'</option>').join("");
  }
  fillSelect("f-rank", RANKS, "All Ranks");
  fillSelect("f-unit", UNITS, "All Units");
  fillSelect("f-sport", SPORTS, "All Sports");
  fillSelect("f-workplace", WORKPLACES, "All Workplaces");

  function filtered(){
    let recs = loadRecords();
    const q = state.q.toLowerCase();
    if(q) recs = recs.filter(r => [r.name, r.serviceNumber, r.rank, r.unit, r.phoneNumber, r.armyIdNumber].join(" ").toLowerCase().includes(q));
    if(state.rank) recs = recs.filter(r => r.rank === state.rank);
    if(state.unit) recs = recs.filter(r => r.unit === state.unit);
    if(state.sport) recs = recs.filter(r => r.sportsEvent === state.sport);
    if(state.workplace) recs = recs.filter(r => r.workplace === state.workplace);
    if(state.status) recs = recs.filter(r => r.status === state.status);
    const [key, dir] = state.sort.split("-");
    const mult = dir === "desc" ? -1 : 1;
    recs.sort((a,b) => String(a[key]).localeCompare(String(b[key])) * mult);
    return recs;
  }

  function render(){
    const recs = filtered();
    const pages = Math.max(1, Math.ceil(recs.length / PAGE_SIZE));
    if(state.page > pages) state.page = pages;
    const slice = recs.slice((state.page-1)*PAGE_SIZE, state.page*PAGE_SIZE);
    const tbody = document.getElementById("records-body");
    document.getElementById("result-count").textContent = recs.length + " record" + (recs.length===1?"":"s") + " found";

    if(!slice.length){
      tbody.innerHTML = '<tr><td colspan="11"><div class="empty-state"><div class="big">🔍</div><h3>No records match your filters</h3><p>Try adjusting the search criteria or add a new sportsman.</p></div></td></tr>';
    } else {
      tbody.innerHTML = slice.map(r =>
        '<tr>' +
        '<td>'+avatarHTML(r)+'</td>' +
        '<td><b>'+escapeHtml(r.serviceNumber)+'</b></td>' +
        '<td>'+escapeHtml(r.rank)+'</td>' +
        '<td class="clickable" onclick="location.href=\'profile.html?id='+r.id+'\'"><b>'+escapeHtml(r.name)+'</b></td>' +
        '<td>'+escapeHtml(r.unit)+'</td>' +
        '<td>'+escapeHtml(r.workplace)+'</td>' +
        '<td>'+escapeHtml(r.sportsEvent)+'</td>' +
        '<td>'+escapeHtml(r.weightClass)+'</td>' +
        '<td>'+escapeHtml(r.phoneNumber)+'</td>' +
        '<td><span class="pill '+(r.status==="Active"?"active":"inactive")+'">'+escapeHtml(r.status)+'</span></td>' +
        '<td><div class="action-btns">' +
          '<a class="mini-btn view" title="View Profile" href="profile.html?id='+r.id+'">👁</a>' +
          '<a class="mini-btn edit" title="Edit" href="add-sportsman.html?edit='+r.id+'">✎</a>' +
          '<button class="mini-btn del" title="Delete" onclick="askDelete('+r.id+')">🗑</button>' +
        '</div></td></tr>'
      ).join("");
    }

    /* pagination */
    const pg = document.getElementById("pagination");
    let html = '<span class="info">Page '+state.page+' of '+pages+'</span>' +
      '<button class="pg-btn" '+(state.page===1?"disabled":"")+' onclick="gotoPage('+(state.page-1)+')">‹</button>';
    for(let p = 1; p <= pages; p++){
      if(pages > 7 && Math.abs(p - state.page) > 2 && p !== 1 && p !== pages){ if(!html.endsWith("…")) html += '<span style="color:var(--muted)">…</span>'; continue; }
      html += '<button class="pg-btn '+(p===state.page?"active":"")+'" onclick="gotoPage('+p+')">'+p+'</button>';
    }
    html += '<button class="pg-btn" '+(state.page===pages?"disabled":"")+' onclick="gotoPage('+(state.page+1)+')">›</button>';
    pg.innerHTML = html;
  }

  window.gotoPage = p => { state.page = p; render(); };
  window.askDelete = function(id){
    const rec = getRecord(id); if(!rec) return;
    confirmModal('Are you sure you want to delete the personnel record of "'+rec.name+'" ('+rec.serviceNumber+')? This action cannot be undone.', () => {
      withLoader(() => { deleteRecord(id); toast("Personnel record deleted successfully."); render(); });
    });
  };

  /* wire controls */
  const search = document.getElementById("table-search");
  let deb;
  search.addEventListener("input", () => { clearTimeout(deb); deb = setTimeout(() => { state.q = search.value.trim(); state.page = 1; render(); }, 200); });
  [["f-rank","rank"],["f-unit","unit"],["f-sport","sport"],["f-workplace","workplace"],["f-status","status"]].forEach(([id,key]) => {
    document.getElementById(id).addEventListener("change", e => { state[key] = e.target.value; state.page = 1; render(); });
  });
  document.getElementById("sort-by").addEventListener("change", e => { state.sort = e.target.value; render(); });
  document.getElementById("clear-filters").addEventListener("click", () => {
    Object.assign(state, { q:"", rank:"", unit:"", sport:"", workplace:"", status:"", page:1 });
    search.value = "";
    ["f-rank","f-unit","f-sport","f-workplace","f-status"].forEach(id => document.getElementById(id).value = "");
    render(); toast("Filters cleared.", "info");
  });
  document.getElementById("adv-toggle").addEventListener("click", () => {
    const p = document.getElementById("adv-panel");
    state.advanced = !state.advanced;
    p.style.display = state.advanced ? "block" : "none";
    document.getElementById("adv-toggle").textContent = state.advanced ? "▲ Hide Advanced Search" : "▼ Advanced Search";
  });

  render();
})();
