//渲染飛機座位圖
document.addEventListener('DOMContentLoaded', () => {
    const seatSize = 30;
    const seatGap = 10;
    const seatYOffset = 60;
    const economySeatSize = 25;
    const economyRowGap = 20;

    const flightData = {
        outbound: {
            canvasId: 'outboundCanvas',
            selectedSeat: null,
            classType: 'economy',
            seats: [],
            bgImage: new Image(),
        },
        return: {
            canvasId: 'returnCanvas',
            selectedSeat: null,
            classType: 'business',
            seats: [],
            bgImage: new Image(),
        },
    };

    for (const tripType of ['outbound', 'return']) {
        const config = flightData[tripType];
        const canvas = document.getElementById(config.canvasId);
        if (!canvas) continue;

        const ctx = canvas.getContext('2d');
        config.bgImage.src = '../assets/images/flight_seat.svg';

        // 只載入背景，不在這裡畫座位，避免 classType 還沒設定完成
        config.bgImage.onload = () => {
            ctx.drawImage(config.bgImage, 0, 0, canvas.width, canvas.height);
        };

        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const mx = (e.clientX - rect.left) * scaleX;
            const my = (e.clientY - rect.top) * scaleY;


            const seats = config.seats;
            let clicked = false;

            for (const seat of seats) {
                const size = seat.size;
                if (
                    mx >= seat.x &&
                    mx <= seat.x + size &&
                    my >= seat.y &&
                    my <= seat.y + size
                ) {
                    config.selectedSeat = seat.label;
                    clicked = true;
                    break;
                }
            }

            if (clicked) drawSeats(ctx, canvas.width, canvas.height, config);
        });
    }

    // 每次都根據最新 classType 動態建立座位
    function createSeats(classType, canvasWidth, canvasHeight) {
        const seats = [];

        if (classType === 'business') {
            const startY = 110 + seatYOffset;
            const rowCount = 3;
            const perRow = 4;
            const startX = (canvasWidth - (perRow * seatSize + (perRow - 1) * seatGap)) / 2;
            let number = 1;

            for (let row = 0; row < rowCount; row++) {
                for (let col = 0; col < perRow; col++) {
                    const x = startX + col * (seatSize + seatGap);
                    const y = startY + row * (seatSize + seatGap);
                    seats.push({
                        x, y, size: seatSize,
                        label: `J${number++}`,
                        type: 'business',
                    });
                }
            }
        }

        if (classType === 'economy') {
            const startY = 250 + seatYOffset;
            const rowCount = 10;
            const perRow = 6;
            const aisleGap = 20;

            for (let row = 0; row < rowCount; row++) {
                for (let col = 0; col < perRow; col++) {
                    let x = (canvasWidth - (perRow * economySeatSize + (perRow - 1) * seatGap + aisleGap)) / 2
                        + col * (economySeatSize + seatGap);
                    const y = startY + row * (economySeatSize + economyRowGap);
                    if (col >= 3) x += aisleGap;

                    seats.push({
                        x, y, size: economySeatSize,
                        label: `${String.fromCharCode(65 + col)}${row + 1}`,
                        type: 'economy',
                    });
                }
            }
        }

        return seats;
    }

    function drawSeats(ctx, width, height, config, passengerIndex = 1) {
        const { bgImage, seats, selectedSeat, classType } = config;

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(bgImage, 0, 0, width, height);

        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fillRect(100, 20, width - 140, 70);
        ctx.fillStyle = '#000';
        ctx.font = '22px sans-serif';
        ctx.fillText(`第 ${passengerIndex} 位乘客選擇中`, 115, 45);
        ctx.font = '20px sans-serif';
        ctx.fillText(`艙等：${classType === 'business' ? '商務艙' : '經濟艙'}｜座位：${selectedSeat || '尚未選擇'}`, 115, 75);

        for (const seat of seats) {
            const isSelected = seat.label === selectedSeat;
            ctx.fillStyle = isSelected ? '#4CAF50' : (seat.type === 'business' ? '#999' : '#ccc');
            ctx.strokeStyle = isSelected ? '#222' : '#333';
            ctx.lineWidth = isSelected ? 3 : 1;

            ctx.fillRect(seat.x, seat.y, seat.size, seat.size);
            ctx.strokeRect(seat.x, seat.y, seat.size, seat.size);

            ctx.fillStyle = '#000';
            ctx.font = '13px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(seat.label, seat.x + seat.size / 2, seat.y + seat.size / 2);
        }
    }

    window.getSelectedSeat = function (tripType) {
        return flightData[tripType]?.selectedSeat || null;
    };

    window.resetSeatSelection = function (tripType) {
        if (flightData[tripType]) {
            flightData[tripType].selectedSeat = null;
        }
    };

    window.drawCanvasWithOverlay = function (tripType, ctx, width, height, passengerIndex) {
        const config = flightData[tripType];
        config.seats = createSeats(config.classType, width, height); // ✅ 動態建立對應艙等座位
        drawSeats(ctx, width, height, config, passengerIndex);
    };

    window.flightData = flightData;
});
