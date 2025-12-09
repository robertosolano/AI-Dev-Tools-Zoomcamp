const { io } = require("socket.io-client");
const assert = require("assert");

const SOCKET_URL = "http://localhost:3000";
const ROOM_ID = "test-room-123";

console.log("Starting integration test...");

const client1 = io(SOCKET_URL);
const client2 = io(SOCKET_URL);

let client1Connected = false;
let client2Connected = false;

client1.on("connect", () => {
    console.log("Client 1 connected");
    client1Connected = true;
    client1.emit("join-room", ROOM_ID);
    checkAndTest();
});

client2.on("connect", () => {
    console.log("Client 2 connected");
    client2Connected = true;
    client2.emit("join-room", ROOM_ID);
    checkAndTest();
});

function checkAndTest() {
    if (client1Connected && client2Connected) {
        console.log("Both clients connected. Testing sync...");
        testSync();
    }
}

function testSync() {
    const testCode = "console.log('Hello World');";

    // Client 2 listens for updates
    client2.on("code-update", (code) => {
        console.log("Client 2 received code update:", code);
        try {
            assert.strictEqual(code, testCode);
            console.log("Integration Test Passed!");
            client1.disconnect();
            client2.disconnect();
            process.exit(0);
        } catch (e) {
            console.error("Test Failed:", e.message);
            process.exit(1);
        }
    });

    // Client 1 sends update
    console.log("Client 1 emitting code-change...");
    client1.emit("code-change", { roomId: ROOM_ID, code: testCode });

    // Timeout
    setTimeout(() => {
        console.error("Timeout: Client 2 did not receive update.");
        process.exit(1);
    }, 2000);
}
