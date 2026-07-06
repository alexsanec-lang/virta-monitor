export async function sendNtfy(title, message) {
    try {
        const response = await fetch(
            "https://ntfy.sh/virta-alexsanec-987654321",
            {
                method: "POST",
                headers: {
                    "Title": title,
                    "Priority": "5",
                    "Tags": "electric_plug,car"
                },
                body: message
            }
        );

        console.log("ntfy status:", response.status);
        
        if (!response.ok) {
            console.error("ntfy failed:", response.status);
        }
    } catch (err) {
        console.error(err);
    }
}