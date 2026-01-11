const fileSelector = document.getElementById('file-selector');

fileSelector.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    document.getElementById('boot-screen').style.display = 'none';
    const ext = file.name.split('.').pop().toLowerCase();
    const blobUrl = URL.createObjectURL(file);

    if (ext === 'exe' || ext === 'iso' && !['gba', 'nes', 'psp'].includes(ext)) {
        start64BitEngine(blobUrl);
    } else {
        startConsoleEngine(blobUrl, ext);
    }
});

function startConsoleEngine(url, ext) {
    window.EJS_player = "#player";
    window.EJS_gameUrl = url;
    
    const coreMap = {
        'nes': 'nes',
        'gba': 'gba',
        'gbc': 'gbc',
        'psp': 'ppsspp',
        'iso': 'ppsspp'
    };

    window.EJS_core = coreMap[ext] || 'gba';
    window.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";

    const script = document.createElement("script");
    script.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    document.head.appendChild(script);
}

function start64BitEngine(url) {
    // v86 x86/x64 Emulation
    const emulator = new V86Starter({
        wasm_path: "https://copy.sh/v86/build/v86.wasm",
        memory_size: 512 * 1024 * 1024,
        vga_memory_size: 32 * 1024 * 1024,
        screen_container: document.getElementById("v86-screen"),
        bios: { url: "https://copy.sh/v86/bios/seabios.bin" },
        vga_bios: { url: "https://copy.sh/v86/bios/vgabios.bin" },
        cdrom: { url: url },
        autostart: true,
    });
}

// Map Buttons to Keyboard
document.querySelectorAll('button[data-k]').forEach(btn => {
    const key = btn.getAttribute('data-k');
    const trigger = (type) => {
        const ev = new KeyboardEvent(type, { key: key, bubbles: true });
        document.dispatchEvent(ev);
    };
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); trigger('keydown'); });
    btn.addEventListener('touchend', (e) => { e.preventDefault(); trigger('keyup'); });
});
