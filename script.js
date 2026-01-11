const fileSelector = document.getElementById('file-selector');

fileSelector.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    document.getElementById('boot-menu').style.display = 'none';
    const filename = file.name.toLowerCase();
    const ext = filename.split('.').pop();
    const blobUrl = URL.createObjectURL(file);

    // EmulatorJS Global Settings
    window.EJS_player = "#player";
    window.EJS_gameUrl = blobUrl;
    window.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    window.EJS_startOnLoaded = true;

    // --- CORE SELECTION ---
    const coreMap = {
        'nes': 'nes',
        'gba': 'gba',
        'gbc': 'gbc',
        'gb': 'gb',
        'sfc': 'snes',
        'snes': 'snes',
        'md': 'segaMD',
        'gen': 'segaMD',
        'iso': filename.includes('ps1') ? 'psx' : 'ppsspp',
        'cso': 'ppsspp',
        'exe': 'dos',
        'zip': 'dos',
        'rar': 'dos'
    };

    window.EJS_core = coreMap[ext] || 'gba';

    // PC/DOS Auto-Runner
    if (window.EJS_core === 'dos') {
        window.EJS_dosConfig = {
            executable: filename.endsWith('.exe') ? filename : ""
        };
    }

    // Load Engine Loader
    const script = document.createElement("script");
    script.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    document.head.appendChild(script);
});

// PS5 Input Mapping to Keyboard Keys
const KEYS = {
    'up': 'ArrowUp', 'down': 'ArrowDown', 'left': 'ArrowLeft', 'right': 'ArrowRight',
    'cross': 'Enter', 'cir': 'Escape', 'sq': ' ', 'tri': 'y',
    'L1': 'Control', 'R1': 'Alt', 'L2': 'q', 'R2': 'w',
    'start': 'Enter', 'select': 'Shift'
};

document.querySelectorAll('button').forEach(btn => {
    if(!KEYS[btn.id]) return;
    const target = KEYS[btn.id];

    const press = (type) => {
        const ev = new KeyboardEvent(type, { 
            key: target, 
            keyCode: getCode(target), 
            bubbles: true 
        });
        document.dispatchEvent(ev);
    };

    btn.addEventListener('touchstart', (e) => { e.preventDefault(); press('keydown'); });
    btn.addEventListener('touchend', (e) => { e.preventDefault(); press('keyup'); });
});

function getCode(k) {
    const m = { 'ArrowUp': 38, 'ArrowDown': 40, 'ArrowLeft': 37, 'ArrowRight': 39, 'Enter': 13, 'Escape': 27, ' ': 32 };
    return m[k] || k.toUpperCase().charCodeAt(0);
}
