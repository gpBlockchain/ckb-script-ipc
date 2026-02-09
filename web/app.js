/* ----- App logic for the CKB Script IPC Playground ----- */

let wasmModule = null;
let binaryData = null;

// ---------------------------------------------------------------------------
// Initialize the WASM module
// ---------------------------------------------------------------------------

async function initWasm() {
    try {
        const wasm = await import("./pkg/ckb_script_ipc_web.js");
        await wasm.default(); // initialize the wasm module
        wasmModule = wasm;
        updateExecuteButton();
    } catch (e) {
        showStatus(`Failed to load WASM module: ${e}. Make sure you have run wasm-pack build.`, "error");
    }
}

// ---------------------------------------------------------------------------
// File handling
// ---------------------------------------------------------------------------

const binaryInput = document.getElementById("binary-input");
const dropZone = document.getElementById("drop-zone");
const fileInfo = document.getElementById("file-info");

function handleFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
        binaryData = new Uint8Array(reader.result);
        fileInfo.textContent = `${file.name} (${(binaryData.length / 1024).toFixed(1)} KB)`;
        fileInfo.classList.remove("hidden");
        updateExecuteButton();
    };
    reader.readAsArrayBuffer(file);
}

binaryInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) handleFile(e.target.files[0]);
});

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("drag-over");
});
dropZone.addEventListener("dragleave", () => dropZone.classList.remove("drag-over"));
dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("drag-over");
    if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
});

// ---------------------------------------------------------------------------
// Execute
// ---------------------------------------------------------------------------

const executeBtn = document.getElementById("execute-btn");
const clearBtn = document.getElementById("clear-btn");
const argsInput = document.getElementById("args-input");
const jsonInput = document.getElementById("json-input");
const jsonOutput = document.getElementById("json-output");
const cyclesOutput = document.getElementById("cycles-output");
const debugOutput = document.getElementById("debug-output");
const statusDiv = document.getElementById("status");

function updateExecuteButton() {
    executeBtn.disabled = !(wasmModule && binaryData);
}

executeBtn.addEventListener("click", () => {
    const json = jsonInput.value.trim();
    if (!json) {
        showStatus("Please enter a JSON request.", "error");
        return;
    }

    showStatus("Executing…", "info");
    jsonOutput.textContent = "—";
    cyclesOutput.textContent = "—";
    debugOutput.textContent = "—";

    // Use setTimeout so the UI updates before the synchronous WASM call
    setTimeout(() => {
        try {
            const result = wasmModule.execute_script(binaryData, argsInput.value, json);
            jsonOutput.textContent = formatJson(result.json_response);
            cyclesOutput.textContent = result.cycles.toString();
            const msgs = result.debug_messages;
            debugOutput.textContent = msgs.length > 0 ? msgs.join("\n") : "(none)";
            showStatus("Execution completed successfully.", "success");
        } catch (e) {
            showStatus(`Execution error: ${e}`, "error");
        }
    }, 50);
});

clearBtn.addEventListener("click", () => {
    jsonInput.value = "";
    jsonOutput.textContent = "—";
    cyclesOutput.textContent = "—";
    debugOutput.textContent = "—";
    statusDiv.classList.add("hidden");
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function showStatus(msg, level) {
    statusDiv.textContent = msg;
    statusDiv.className = `status ${level}`;
    statusDiv.classList.remove("hidden");
}

function formatJson(str) {
    try {
        return JSON.stringify(JSON.parse(str), null, 2);
    } catch {
        return str;
    }
}

// Boot
initWasm();
