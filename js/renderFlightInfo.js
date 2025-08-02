document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("../api/flights/get_selection.php");
        const realData = await res.json();
        data = realData.data
        console.log(data)

        const { tripType, outbound, inbound } = data;

        // 去程資訊
        document.getElementById("outward_place_from").textContent = outbound.from_airport_name;
        document.getElementById("outward_place_to").textContent = outbound.to_airport_name;
        document.getElementById("outward_time_from").textContent = formatDateTime(outbound.departure_time);

        insertAfterText("outward_time_from", `艙等：${translateClass(outbound.class_type)}`);
        insertAfterText("outward_time_from", `票價：${outbound.price} 元`);

        // 回程資訊（若為 round trip）
        if (tripType === "round" && inbound) {
            document.getElementById("return_place_from").textContent = inbound.from_airport_name;
            document.getElementById("return_place_to").textContent = inbound.to_airport_name;
            document.getElementById("return_time_to").textContent = formatDateTime(inbound.departure_time);

            insertAfterText("return_time_to", `艙等：${translateClass(inbound.class_type)}`);
            insertAfterText("return_time_to", `票價：${inbound.price} 元`);
        }

    } catch (err) {
        console.error("無法載入航班資訊：", err);
    }
});

function formatDateTime(datetime) {
    return datetime?.slice(0, 16).replace("T", " ") || "--";
}

function translateClass(type) {
    switch (type) {
        case "economy": return "經濟艙";
        case "business": return "商務艙";
        default: return type;
    }
}

function insertAfterText(refId, text) {
    const ref = document.getElementById(refId);
    if (!ref) return;
    const div = document.createElement("div");
    div.textContent = text;
    ref.parentNode.insertBefore(div, ref.nextSibling);
}
