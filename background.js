const STATION_URL =
    "https://legacy-map.poweredbyvirta.com/api/core/v4/stations/20607";

let previousAvailable = 0;

async function checkStation() {
    try {
        const response = await fetch(STATION_URL);
        const data = await response.json();

        let available = 0;

        for (const evse of data.evses) {

            // Only AC (Mennekes) and CCS
            const usable = evse.connectors.some(c =>
                c.type === "Mennekes" || c.type === "CCS"
            );

            if (!usable)
                continue;

            if (evse.available)
                available++;
        }

        chrome.action.setBadgeText({
            text: available ? String(available) : ""
        });

        chrome.action.setBadgeBackgroundColor({
            color: available ? "#00AA00" : "#AA0000"
        });

        if (available > previousAvailable) {

            chrome.notifications.create({
                type: "basic",
                iconUrl: "icons/icon128.png",
                title: "Virta Monitor",
                message:
                    `${available} usable connector(s) available`
            });

        }

        previousAvailable = available;

    } catch (err) {
        console.error(err);
    }
}

chrome.runtime.onInstalled.addListener(() => {

    chrome.alarms.create("check", {
        periodInMinutes: 1 / 6 // 10 seconds
    });

    checkStation();
});

chrome.alarms.onAlarm.addListener(checkStation);