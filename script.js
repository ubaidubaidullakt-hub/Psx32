/**
 * PS5 ULTIMATE EMULATOR LOGIC
 * Supports: .exe, .dos, .zip, .nes, .gba, .gbc, .iso, .cso
 */

const fileSelector = document.getElementById('file-selector');

fileSelector.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Hide the boot menu
    const bootScreen = document.getElementById('boot-screen');
    if (bootScreen) bootScreen.style.display = 'none';

    const filename = file.name.toLowerCase();
    const ext = filename.split('.').pop();
    const blobUrl = URL.createObjectURL(file);

    // Initial configuration for EmulatorJS
    window.EJS_player = "#player";
    window.EJS_gameUrl = blobUrl;
    window.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    window.EJS_startOnLoaded = true;

    // --- CORE DETECTION LOGIC ---
    if (ext === 'exe' || ext === 'dos' || ext === 'zip' || ext === 'rar') {
        // PC / DOS Games
        window.EJS_core = "dos";
        window.EJS_dosConfig = {
            executable: filename.endsWith('.exe') ? filename : ""
        };
    } 
    else if (ext === 'nes') {
        window.EJS_core = "nes";
    } 
    else if (ext === 'gba') {
        window.EJS_core = "gba";
    } 
    else if (ext === 'gbc' || ext === 'gb') {
        window.EJS_core = "gbc";
    } 
    else if (ext === 'iso' || ext === 'cso') {
        // High-end Mobile Core (PSP)
        window.EJS_core = "ppsspp";
    } 
    else {
        // Default to GBA if unknown
        window.EJS_core = "gba";
    }

    // Load the Emulator engine
    const loader = document.createElement("script");
    loader.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    document.head.appendChild(loader);
});

/**
 * PS5 CONTROLLER MAPPING (Keyboard Injection)
 * Maps PS5 virtual buttons to the keys PC and Consoles expect.
 */
const CONTROLLER_MAP = {
    'cross': 'Enter',   // Confirm / Start
    'cir': 'Escape',    // Back / Menu
    'sq': ' ',          // Space (Jump/Action)
    'tri': 'y',         // Yes / Change View
    'L1': 'Control',    // Fire / Special
    'R1': 'Alt',        // Strafe / Alt Fire
    'up': 'ArrowUp',
    'down': 'ArrowDown',
    'left': 'ArrowLeft',
    'right': 'ArrowRight',
    'start': 'Enter',
    'select': 'Shift'
};

// Event Listeners for Touch & Click
document.querySelectorAll('button[data-k]').forEach(btn => {
    // We use either the ID or the data-k attribute to find the mapping
    const id = btn.id || btn.getAttribute('data-k');
    const targetKey = CONTROLLER_MAP[id] || btn.getAttribute('data-k');

    const handleInput = (type) => {
        const keyEvent = new KeyboardEvent(type, {
            key: targetKey,
            keyCode: getKeyCode(targetKey),
            code: targetKey,
            which: getKeyCode(targetKey),
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(keyEvent);
    };

    // Mobile Touch Support
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleInput('keydown');
    });
    btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        handleInput('keyup');
    });

    // PC Mouse Support
    btn.addEventListener('mousedown', () => handleInput('keydown'));
    btn.addEventListener('mouseup', () => handleInput('keyup'));
});

/**
 * Helper to convert Key names to ASCII codes
 */
function getKeyCode(key) {
    const codes = {
        'ArrowUp': 38, 'ArrowDown': 40, 'ArrowLeft': 37, 'ArrowRight': 39,
        'Enter': 13, 'Escape': 27, ' ': 32, 'Control': 17, 'Alt': 18, 'Shift': 16
    };
    return codes[key] || (key ? key.toUpperCase().charCodeAt(0) : 0);
}
