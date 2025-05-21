import si from "systeminformation";

export const getSystemInfo = async (socket) => {
    const cpu = await si.currentLoad();
    const mem = await si.mem();
    const net = await si.networkStats();

    // Send initial stats
    socket.emit("server-stats", {
        cpu: cpu.currentLoad,
        memory: {
            total: mem.total,
            used: mem.used,
            percent: (mem.used / mem.total) * 100,
        },
        network: {
            rx: net[0].rx_sec,
            tx: net[0].tx_sec,
        },
    });

    // Set up interval for continuous updates
    const interval = setInterval(async () => {
        const cpu = await si.currentLoad();
        const mem = await si.mem();
        const net = await si.networkStats();

        socket.emit("server-stats", {
            cpu: cpu.currentLoad,
            memory: {
                total: mem.total,
                used: mem.used,
                percent: (mem.used / mem.total) * 100,
            },
            network: {
                rx: net[0].rx_sec,
                tx: net[0].tx_sec,
            },
        });
    }, 1000);

    // Clean up interval when socket disconnects
    socket.on('disconnect', () => {
        clearInterval(interval);
    });
}
