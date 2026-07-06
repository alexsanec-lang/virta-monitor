import {CONFIG, loadStation, parseStation} from "./api.js";

const list=document.getElementById("list");

const updated=document.getElementById("updated");

async function refresh(){

    const station=await loadStation(CONFIG.stations[0].url);

    const connectors=parseStation(station);

    list.innerHTML="";

    connectors.forEach(c=>{

        const div=document.createElement("div");

        div.className="card";

        div.innerHTML=`
            <span>${c.type}</span>
            <span class="${c.available?"green":"red"}">
            ${c.available?"AVAILABLE":c.status}
            </span>
        `;

        list.appendChild(div);

    });

    updated.textContent=
        "Updated "+
        new Date().toLocaleTimeString();

}

refresh();

setInterval(refresh,10000);
