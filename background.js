import { sendNtfy } from "./ntfy.js";

const STATION_URL =
    "https://legacy-map.poweredbyvirta.com/api/core/v4/stations/20607";

let previousAvailable = 0;

async function checkStation() {
    try {
        const response = await fetch(STATION_URL);
        const data = await response.json();

        let available = 0;
        let availableList = [];

        for (const evse of data.evses) {

            if (!evse.available)
                continue;

            for (const connector of evse.connectors) {

                if (connector.type !== "Mennekes" &&
                    connector.type !== "CCS")
                    continue;

                available++;

                availableList.push({
                    type: connector.type === "Mennekes" ? "AC" : "CCS",
                    id: evse.id,
                    power: connector.maxKw
                });
            }
        }


        chrome.action.setBadgeText({
            text: available ? String(available) : ""
        });

        chrome.action.setBadgeBackgroundColor({
            color: available ? "#00AA00" : "#AA0000"
        });

        console.log(available + " prev:  " + previousAvailable);


        if (available > previousAvailable) {
            chrome.notifications.create({
                type: "basic",
                iconUrl: "icons/icon128.png",
                title: "Virta Monitor",
                message: `${available} connector(s) available`
            });

            const message =
                availableList
                    .map(c => `${c.type} ${c.id}`)
                    .join("\n");

            await sendNtfy(`${message}`);
        }

        previousAvailable = available;
        
    } catch (err) {
        console.error(err);
    }
}

chrome.runtime.onInstalled.addListener(() => {

    chrome.alarms.create("check", {
        periodInMinutes: 1/2 // 1 / 6 // 10 seconds
    });

    checkStation();
});

chrome.alarms.onAlarm.addListener(checkStation);