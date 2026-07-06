const url =
    "https://legacy-map.poweredbyvirta.com/api/core/v4/stations/20607";

async function load() {

    const r = await fetch(url);
    const data = await r.json();

    let text = "";

    for(const evse of data.evses){

        const type =
            evse.connectors.some(c=>c.type==="CCS")
                ? "CCS"
                : "AC";

        text +=
`${type}
Status: ${evse.operativeStatus}
Available: ${evse.available}

`;

    }

    document.getElementById("status").innerText=text;

}

load();