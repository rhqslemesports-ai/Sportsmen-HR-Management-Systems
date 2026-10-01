/* Personnel profile page */
"use strict";
(function(){
  wireApp("");
  const id = new URLSearchParams(location.search).get("id");
  const rec = id ? getRecord(id) : null;
  const root = document.getElementById("profile-root");
  if(!rec){
    root.innerHTML = '<div class="card"><div class="empty-state"><div class="big">⚠</div><h3>Record not found</h3><p>The requested personnel record does not exist.</p><p style="margin-top:14px"><a class="btn btn-primary" href="sportsmen.html">Back to Records</a></p></div></div>';
    return;
  }
  document.title = rec.name + " — SPORTSMEN HR";

  function dl(k, v, full){
    return '<div class="detail-item'+(full?" full-row":"")+'"><span class="k">'+k+'</span><span class="v">'+escapeHtml(v || "—")+'</span></div>';
  }
  const img = rec.profileImage
    ? '<img class="p-img" src="'+rec.profileImage+'" alt="">'
    : '<div class="p-img">'+initials(rec.name)+'</div>';

  root.innerHTML =
  '<a class="back-link" href="sportsmen.html">← Back to Records</a>' +
  '<div class="profile-hero">' +
    img +
    '<div><div class="p-name">'+escapeHtml(rec.name)+'</div>' +
    '<div class="p-meta"><span>Rank: <b>'+escapeHtml(rec.rank)+'</b></span><span>Service No: <b>'+escapeHtml(rec.serviceNumber)+'</b></span><span>Unit: <b>'+escapeHtml(rec.unit)+'</b></span><span>Status: <b>'+escapeHtml(rec.status)+'</b></span></div></div>' +
    '<div class="p-actions no-print">' +
      '<a class="btn btn-gold btn-sm" href="add-sportsman.html?edit='+rec.id+'">✎ Edit Profile</a>' +
      '<button class="btn btn-outline btn-sm" id="btn-print" style="color:#fff;border-color:rgba(255,255,255,.4)">🖨 Print Profile</button>' +
      '<button class="btn btn-outline btn-sm" id="btn-export" style="color:#fff;border-color:rgba(255,255,255,.4)">⬇ Download / Export</button>' +
    '</div>' +
  '</div>' +
  '<div class="profile-grid">' +
    '<div class="card"><h3 class="card-title"><span class="ico">🎖</span> Service Details <span class="line"></span></h3><div class="detail-list">' +
      dl("Service Number", rec.serviceNumber) + dl("Rank", rec.rank) + dl("Unit", rec.unit) + dl("Workplace", rec.workplace) +
    '</div></div>' +
    '<div class="card"><h3 class="card-title"><span class="ico">🏅</span> Sports Details <span class="line"></span></h3><div class="detail-list">' +
      dl("Sports Event", rec.sportsEvent) + dl("Weight Class", rec.weightClass) + dl("Weight", rec.weight ? rec.weight + " kg" : "") + dl("Height", rec.height ? rec.height + " cm" : "") +
    '</div></div>' +
    '<div class="card" style="grid-column:1/-1"><h3 class="card-title"><span class="ico">🪪</span> Personal Details <span class="line"></span></h3><div class="detail-list">' +
      dl("Blood Group", rec.bloodGroup) + dl("Marital Status", rec.maritalStatus) +
      dl("National ID Number", rec.nationalIdNumber) + dl("Army ID Number", rec.armyIdNumber) +
      dl("Phone Number", rec.phoneNumber) + dl("Email Address", rec.email) +
      dl("Address", rec.address, true) +
    '</div></div>' +
  '</div>';

  document.getElementById("btn-print").addEventListener("click", () => window.print());
  document.getElementById("btn-export").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(rec, null, 2)], { type:"application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "sportsman-" + rec.serviceNumber + ".json";
    a.click(); URL.revokeObjectURL(a.href);
    toast("Profile exported as JSON file.");
  });
})();
