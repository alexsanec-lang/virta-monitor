export const CONFIG = {
    stations: [
        {
            id: 20607,
            name: "Kotikeskus Jyväskylä",
            url: "https://legacy-map.poweredbyvirta.com/api/core/v4/stations/20607"
        }
    ]
};

export async function loadStation(url) {
    const r = await fetch(url);
    if (!r.ok)
        throw new Error(`HTTP ${r.status}`);

    return await r.json();
}

export function parseStation(data) {
    const connectors = [];
    for (const evse of data.evses) {
        for (const connector of evse.connectors) {
            if (
                connector.type !== "Mennekes" &&
                connector.type !== "CCS"
            )
                continue;

            connectors.push({
                evseId: evse.id,
                type: connector.type,
                available: evse.available,
                status: connector.operativeStatus,
                online: evse.connectivityStatus === "Online"
            });
        }
    }
    return connectors;
}