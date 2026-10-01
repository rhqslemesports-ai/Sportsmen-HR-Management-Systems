/* SPORTSMEN HR MANAGEMENT SYSTEM — Data Layer (localStorage)
   Swap these functions with API calls later to connect a real backend/database. */
"use strict";
const DB_KEY = "shms_records_v1";

const SPORTS = ["Athletics","Boxing","Swimming","Wrestling","Weightlifting","Judo","Karate","Taekwondo","Football","Volleyball","Basketball","Cricket","Rugby","Shooting","Archery","Other"];
const RANKS = ["Private","Lance Corporal","Corporal","Sergeant","Staff Sergeant","Warrant Officer II","Warrant Officer I","Second Lieutenant","Lieutenant","Captain","Major","Lt. Colonel","Colonel"];
const UNITS = ["HQ Battalion","1st Infantry Battalion","2nd Infantry Battalion","Signals Regiment","Engineer Regiment","Armoured Corps","Artillery Regiment","Air Defence Unit","Medical Corps","Logistics Brigade","Military Police","Training School"];
const WORKPLACES = ["Headquarters","Field Command","Training Wing","Sports Directorate","Administrative Office","Operations Cell"];
const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];
const MARITAL = ["Single","Married","Divorced","Widowed"];
const WEIGHT_CLASSES = {
  Boxing:["Flyweight","Bantamweight","Featherweight","Lightweight","Welterweight","Middleweight","Light Heavyweight","Heavyweight"],
  Wrestling:["Freestyle 57kg","Freestyle 65kg","Freestyle 74kg","Freestyle 86kg","Freestyle 97kg","Freestyle 125kg"],
  Judo:["-60kg","-66kg","-73kg","-81kg","-90kg","-100kg","+100kg"],
  Karate:["-55kg","-60kg","-67kg","-75kg","-84kg","+84kg"],
  Taekwondo:["-54kg","-58kg","-63kg","-68kg","-74kg","-80kg","-87kg"],
  Weightlifting:["55kg","61kg","67kg","73kg","81kg","89kg","96kg","102kg","+109kg"],
  Athletics:["Sprint","Middle Distance","Long Distance","Jump","Throw","Decathlon"],
  Swimming:["50m Freestyle","100m Freestyle","200m Freestyle","400m Freestyle","Backstroke","Breaststroke","Butterfly","Medley"],
  Football:["Forward","Midfielder","Defender","Goalkeeper"],
  Basketball:["Guard","Forward","Center"],
  Volleyball:["Setter","Outside Hitter","Middle Blocker","Libero","Opposite"],
  Cricket:["Batsman","Bowler","All-Rounder","Wicketkeeper"],
  Rugby:["Prop","Hooker","Lock","Flanker","Scrum-half","Fly-half","Centre","Wing","Fullback"],
  Shooting:["Pistol","Rifle","Skeet","Trap"],
  Archery:["Recurve","Compound","Longbow"],
  Other:["Open","General"]
};

const SAMPLE_RECORDS = [
 {id:1,serviceNumber:"SN-1001",rank:"Sergeant",name:"J. Perera",unit:"1st Infantry Battalion",workplace:"Sports Directorate",sportsEvent:"Boxing",weightClass:"Welterweight",weight:"67",height:"172",bloodGroup:"O+",nationalIdNumber:"NID-88XXXXXX1",armyIdNumber:"AID-45XXXX01",phoneNumber:"+94 77 XXX X001",address:"42nd Regiment Road, Colombo",email:"j.perera@example.mil",maritalStatus:"Married",profileImage:"",status:"Active",createdAt:"2026-08-12T09:24:00Z"},
 {id:2,serviceNumber:"SN-1002",rank:"Corporal",name:"K. Fernando",unit:"Signals Regiment",workplace:"Training Wing",sportsEvent:"Athletics",weightClass:"Sprint",weight:"74",height:"178",bloodGroup:"A+",nationalIdNumber:"NID-88XXXXXX2",armyIdNumber:"AID-45XXXX02",phoneNumber:"+94 77 XXX X002",address:"12 Hill Street, Kandy",email:"k.fernando@example.mil",maritalStatus:"Single",profileImage:"",status:"Active",createdAt:"2026-08-20T14:10:00Z"},
 {id:3,serviceNumber:"SN-1003",rank:"Warrant Officer II",name:"M. Silva",unit:"Engineer Regiment",workplace:"Field Command",sportsEvent:"Judo",weightClass:"-81kg",weight:"80",height:"175",bloodGroup:"B+",nationalIdNumber:"NID-88XXXXXX3",armyIdNumber:"AID-45XXXX03",phoneNumber:"+94 77 XXX X003",address:"7 Lake View, Kurunegala",email:"m.silva@example.mil",maritalStatus:"Married",profileImage:"",status:"Active",createdAt:"2026-08-29T08:45:00Z"},
 {id:4,serviceNumber:"SN-1004",rank:"Lance Corporal",name:"A. Gunawardena",unit:"2nd Infantry Battalion",workplace:"Headquarters",sportsEvent:"Swimming",weightClass:"100m Freestyle",weight:"70",height:"180",bloodGroup:"AB+",nationalIdNumber:"NID-88XXXXXX4",armyIdNumber:"AID-45XXXX04",phoneNumber:"+94 77 XXX X004",address:"31 River Avenue, Galle",email:"a.gunawardena@example.mil",maritalStatus:"Single",profileImage:"",status:"Active",createdAt:"2026-09-03T11:30:00Z"},
 {id:5,serviceNumber:"SN-1005",rank:"Staff Sergeant",name:"R. Jayasinghe",unit:"Artillery Regiment",workplace:"Sports Directorate",sportsEvent:"Weightlifting",weightClass:"81kg",weight:"80.5",height:"168",bloodGroup:"O-",nationalIdNumber:"NID-88XXXXXX5",armyIdNumber:"AID-45XXXX05",phoneNumber:"+94 77 XXX X005",address:"5 Fort Lane, Jaffna",email:"r.jayasinghe@example.mil",maritalStatus:"Married",profileImage:"",status:"Active",createdAt:"2026-09-10T10:05:00Z"},
 {id:6,serviceNumber:"SN-1006",rank:"Private",name:"S. Bandara",unit:"Medical Corps",workplace:"Administrative Office",sportsEvent:"Cricket",weightClass:"All-Rounder",weight:"72",height:"174",bloodGroup:"B-",nationalIdNumber:"NID-88XXXXXX6",armyIdNumber:"AID-45XXXX06",phoneNumber:"+94 77 XXX X006",address:"88 Garden Road, Anuradhapura",email:"s.bandara@example.mil",maritalStatus:"Single",profileImage:"",status:"Active",createdAt:"2026-09-14T16:40:00Z"},
 {id:7,serviceNumber:"SN-1007",rank:"Captain",name:"T. Ratnayake",unit:"HQ Battalion",workplace:"Operations Cell",sportsEvent:"Shooting",weightClass:"Rifle",weight:"76",height:"176",bloodGroup:"A-",nationalIdNumber:"NID-88XXXXXX7",armyIdNumber:"AID-45XXXX07",phoneNumber:"+94 77 XXX X007",address:"19 Camp Street, Trincomalee",email:"t.ratnayake@example.mil",maritalStatus:"Married",profileImage:"",status:"Active",createdAt:"2026-09-18T09:15:00Z"},
 {id:8,serviceNumber:"SN-1008",rank:"Corporal",name:"N. Wickramasinghe",unit:"Armoured Corps",workplace:"Training Wing",sportsEvent:"Rugby",weightClass:"Flanker",weight:"92",height:"183",bloodGroup:"O+",nationalIdNumber:"NID-88XXXXXX8",armyIdNumber:"AID-45XXXX08",phoneNumber:"+94 77 XXX X008",address:"26 Barracks Road, Matara",email:"n.wickramasinghe@example.mil",maritalStatus:"Divorced",profileImage:"",status:"Inactive",createdAt:"2026-09-22T13:55:00Z"}
];

function loadRecords(){
  try{
    const raw = localStorage.getItem(DB_KEY);
    if(raw === null){ saveRecords(SAMPLE_RECORDS); return JSON.parse(JSON.stringify(SAMPLE_RECORDS)); }
    return JSON.parse(raw);
  }catch(e){ console.error("Storage read failed", e); return []; }
}
function saveRecords(records){ localStorage.setItem(DB_KEY, JSON.stringify(records)); }
function getRecord(id){ return loadRecords().find(r => String(r.id) === String(id)) || null; }
function nextId(){ const recs = loadRecords(); return recs.length ? Math.max(...recs.map(r => r.id)) + 1 : 1; }
function addRecord(data){
  const recs = loadRecords();
  const rec = Object.assign({}, data, {id: nextId(), createdAt: new Date().toISOString()});
  recs.push(rec); saveRecords(recs); return rec;
}
function updateRecord(id, data){
  const recs = loadRecords();
  const i = recs.findIndex(r => String(r.id) === String(id));
  if(i === -1) return null;
  recs[i] = Object.assign({}, recs[i], data);
  saveRecords(recs); return recs[i];
}
function deleteRecord(id){
  const recs = loadRecords().filter(r => String(r.id) !== String(id));
  saveRecords(recs);
}
function resetSampleData(){ localStorage.removeItem(DB_KEY); return loadRecords(); }
function exportJSON(){ return JSON.stringify(loadRecords(), null, 2); }

/* Small helper used across pages */
function initials(name){
  if(!name) return "?";
  const parts = name.trim().replace(/^[A-Za-z]\.\s*/,"").split(/\s+/);
  return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
}
function avatarHTML(rec, cls){
  if(rec.profileImage) return '<img class="avatar '+(cls||'')+'" src="'+rec.profileImage+'" alt="">';
  return '<div class="avatar '+(cls||'')+'">'+initials(rec.name)+'</div>';
}
function escapeHtml(s){ return String(s==null?"":s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
