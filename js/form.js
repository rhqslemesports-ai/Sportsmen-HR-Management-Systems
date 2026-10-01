/* Add / Edit Sportsman form */
"use strict";
(function(){
  const params = new URLSearchParams(location.search);
  const editId = params.get("edit");
  wireApp(editId ? "" : "add");

  /* populate selects */
  document.getElementById("f-rank").innerHTML = RANKS.map(r => '<option>'+r+'</option>').join("");
  document.getElementById("f-unit").innerHTML = UNITS.map(r => '<option>'+r+'</option>').join("");
  document.getElementById("f-workplace").innerHTML = WORKPLACES.map(r => '<option>'+r+'</option>').join("");
  document.getElementById("f-sport").innerHTML = SPORTS.map(r => '<option>'+r+'</option>').join("");
  document.getElementById("f-blood").innerHTML = BLOOD_GROUPS.map(r => '<option>'+r+'</option>').join("");
  document.getElementById("f-marital").innerHTML = MARITAL.map(r => '<option>'+r+'</option>').join("");

  function fillWeightClasses(sport, selected){
    const sel = document.getElementById("f-weightclass");
    const classes = WEIGHT_CLASSES[sport] || ["Open"];
    sel.innerHTML = classes.map(c => '<option '+(c===selected?"selected":"")+'>'+c+'</option>').join("");
  }
  fillWeightClasses("Athletics");
  document.getElementById("f-sport").addEventListener("change", e => fillWeightClasses(e.target.value));

  /* ---- Profile image ---- */
  let currentImage = "";
  const fileInput = document.getElementById("f-image"), preview = document.getElementById("img-preview");
  function setPreview(src){
    currentImage = src || "";
    preview.innerHTML = src ? '<img src="'+src+'" alt="">' : '📷';
    document.getElementById("btn-remove-img").style.display = src ? "inline-flex" : "none";
    document.getElementById("btn-change-img").style.display = src ? "inline-flex" : "none";
    document.getElementById("btn-upload-img").style.display = src ? "none" : "inline-flex";
  }
  fileInput.addEventListener("change", () => {
    const f = fileInput.files[0]; if(!f) return;
    if(!f.type.startsWith("image/")){ toast("Please select an image file.", "err"); return; }
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(f);
  });
  document.getElementById("btn-upload-img").addEventListener("click", () => fileInput.click());
  document.getElementById("btn-change-img").addEventListener("click", () => fileInput.click());
  document.getElementById("btn-remove-img").addEventListener("click", () => { fileInput.value = ""; setPreview(""); toast("Profile image removed.", "info"); });

  /* ---- Edit mode: prefill ---- */
  if(editId){
    const rec = getRecord(editId);
    if(!rec){ toast("Record not found.", "err"); setTimeout(() => location.href = "sportsmen.html", 800); return; }
    document.getElementById("page-title").textContent = "Edit Personnel Details";
    document.getElementById("page-sub").textContent = "Update service, sports and personal information for " + rec.name;
    document.getElementById("btn-save").textContent = "🔄 Update Record";
    const set = (id, v) => { const el = document.getElementById(id); if(el != null && v != null) el.value = v; };
    set("f-serviceno", rec.serviceNumber); set("f-rank", rec.rank); set("f-name", rec.name);
    set("f-unit", rec.unit); set("f-workplace", rec.workplace); set("f-sport", rec.sportsEvent);
    fillWeightClasses(rec.sportsEvent, rec.weightClass);
    set("f-weightclass", rec.weightClass); set("f-weight", rec.weight); set("f-height", rec.height);
    set("f-blood", rec.bloodGroup); set("f-nid", rec.nationalIdNumber); set("f-aid", rec.armyIdNumber);
    set("f-phone", rec.phoneNumber); set("f-address", rec.address); set("f-email", rec.email);
    set("f-marital", rec.maritalStatus); set("f-status", rec.status);
    if(rec.profileImage) setPreview(rec.profileImage);
  }

  /* ---- Validation ---- */
  const REQUIRED = [["f-serviceno","Service Number"],["f-rank","Rank"],["f-name","Name"],["f-unit","Unit"],["f-workplace","Workplace"],["f-sport","Sports Event"],["f-blood","Blood Group"],["f-phone","Phone Number"],["f-marital","Marital Status"]];
  function validate(){
    let ok = true, firstBad = null;
    REQUIRED.forEach(([id]) => {
      const el = document.getElementById(id);
      const wrap = el.closest(".field");
      if(!el.value.trim()){ wrap.classList.add("has-error"); el.classList.add("err"); ok = false; if(!firstBad) firstBad = el; }
      else { wrap.classList.remove("has-error"); el.classList.remove("err"); }
    });
    const email = document.getElementById("f-email");
    if(email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())){
      email.closest(".field").classList.add("has-error"); email.classList.add("err"); ok = false; if(!firstBad) firstBad = email;
    }
    if(firstBad) firstBad.scrollIntoView({ behavior:"smooth", block:"center" });
    return ok;
  }
  document.querySelectorAll("#personnel-form .input").forEach(el => el.addEventListener("input", () => { el.classList.remove("err"); el.closest(".field").classList.remove("has-error"); }));

  function collect(){
    const v = id => document.getElementById(id).value.trim();
    return {
      serviceNumber:v("f-serviceno"), rank:v("f-rank"), name:v("f-name"), unit:v("f-unit"),
      workplace:v("f-workplace"), sportsEvent:v("f-sport"), weightClass:v("f-weightclass"),
      weight:v("f-weight"), height:v("f-height"), bloodGroup:v("f-blood"),
      nationalIdNumber:v("f-nid"), armyIdNumber:v("f-aid"), phoneNumber:v("f-phone"),
      address:v("f-address"), email:v("f-email"), maritalStatus:v("f-marital"),
      status:v("f-status"), profileImage:currentImage
    };
  }

  document.getElementById("btn-save").addEventListener("click", () => {
    if(!validate()){ toast("Please fill in all required fields correctly.", "err"); return; }
    withLoader(() => {
      if(editId){
        updateRecord(editId, collect());
        toast("Personnel record updated successfully.");
        setTimeout(() => location.href = "profile.html?id=" + editId, 700);
      } else {
        addRecord(collect());
        toast("Personnel record saved successfully.");
        setTimeout(() => location.href = "sportsmen.html", 700);
      }
    });
  });
  document.getElementById("btn-save-new").addEventListener("click", () => {
    if(!validate()){ toast("Please fill in all required fields correctly.", "err"); return; }
    withLoader(() => { addRecord(collect()); toast("Record saved. Ready for a new entry."); document.getElementById("personnel-form").reset(); setPreview(""); fillWeightClasses("Athletics"); document.getElementById("f-rank").selectedIndex = 0; });
  });
  document.getElementById("btn-reset").addEventListener("click", () => confirmModal("Reset the form? All unsaved changes will be lost.", () => { document.getElementById("personnel-form").reset(); document.querySelectorAll(".has-error").forEach(x => x.classList.remove("has-error")); document.querySelectorAll(".err").forEach(x => x.classList.remove("err")); setPreview(""); fillWeightClasses("Athletics"); toast("Form reset.", "info"); }));
  document.getElementById("btn-cancel").addEventListener("click", () => location.href = editId ? "profile.html?id=" + editId : "sportsmen.html");
})();
