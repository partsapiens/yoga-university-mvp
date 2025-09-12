"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var gray_matter_1 = __importDefault(require("gray-matter"));
var PAGES_DIR = path_1.default.join(process.cwd(), "content/manual/pages");
var OUT_DIR = path_1.default.join(process.cwd(), "content/manual");
var TOC_PATH = path_1.default.join(process.cwd(), "content/manual/toc.json");
var BRAND_REPLACEMENTS = [
    [/CorePower University/gi, "Yoga Flow University"],
    [/CorePower/gi, "Yoga Flow"],
    [/CPYU/gi, "YFU"],
    [/CPY/gi, "YF"],
];
function kebab(s) { return s.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-"); }
function clean(s) {
    var t = s;
    t = t.replace(/\u00A0/g, " ").replace(/[ \t]+/g, " ").replace(/[ ]+\n/g, "\n");
    t = t.replace(/\b\d{1,2}:\d{2}\s*[-–]\s*\d{1,2}:\d{2}\b/g, ""); // remove timecodes like 1:05–1:10
    t = t.replace(/^\s*[A-Za-z]?\s*\d{1,3}\s*$/gm, ""); // lone page/line numbers
    t = t.replace(/([A-Z]{2,})([A-Z][a-z])/g, "$1 $2"); // smashed CAPSWORDS
    t = t.replace(/•\s*/g, "- "); // bullets
    for (var _i = 0, BRAND_REPLACEMENTS_1 = BRAND_REPLACEMENTS; _i < BRAND_REPLACEMENTS_1.length; _i++) {
        var _a = BRAND_REPLACEMENTS_1[_i], re = _a[0], repl = _a[1];
        t = t.replace(re, repl);
    }
    t = t.replace(/\n{3,}/g, "\n\n").trim();
    return t;
}
function readAllPages() {
    if (!fs_1.default.existsSync(PAGES_DIR)) {
        console.error("\u274C Not found: ".concat(PAGES_DIR));
        process.exit(1);
    }
    var files = fs_1.default.readdirSync(PAGES_DIR).filter(function (f) { return /\.md$/i.test(f); }).sort(function (a, b) { return a.localeCompare(b); });
    var parts = files.map(function (f) { return fs_1.default.readFileSync(path_1.default.join(PAGES_DIR, f), "utf8"); });
    return parts.join("\n\n");
}
function splitByTOC(full, toc) {
    var cleaned = clean(full);
    var lower = cleaned.toLowerCase();
    var idxs = [];
    var cursor = 0;
    for (var _i = 0, _a = toc.chapters; _i < _a.length; _i++) {
        var ch = _a[_i];
        var titleLower = ch.title.toLowerCase();
        var i = lower.indexOf(titleLower, cursor);
        if (i !== -1) {
            idxs.push({ title: ch.title, start: i });
            cursor = i;
        }
    }
    var chunks = [];
    for (var i = 0; i < idxs.length; i++) {
        var cur = idxs[i];
        var next = idxs[i + 1];
        var start = cur.start + cur.title.length;
        var slice = cleaned.slice(start, next ? next.start : undefined).trim();
        chunks.push({ title: cur.title, body: slice });
    }
    return chunks;
}
function writeChapters(chunks, toc) {
    fs_1.default.mkdirSync(OUT_DIR, { recursive: true });
    var backupDir = path_1.default.join(OUT_DIR, "_backup_".concat(Date.now()));
    var existing = fs_1.default.readdirSync(OUT_DIR).filter(function (d) { return d !== "pages" && d !== "toc.json" && d !== "manifest.json"; });
    if (existing.length) {
        fs_1.default.mkdirSync(backupDir, { recursive: true });
        for (var _i = 0, existing_1 = existing; _i < existing_1.length; _i++) {
            var d = existing_1[_i];
            fs_1.default.renameSync(path_1.default.join(OUT_DIR, d), path_1.default.join(backupDir, d));
        }
        console.log("\uD83D\uDDC4\uFE0F  Moved existing chapters to ".concat(path_1.default.basename(backupDir)));
    }
    var manifest = {
        title: toc.title || "Yoga Teacher Training Manual",
        version: "v1",
        chapters: []
    };
    chunks.forEach(function (ch, i) {
        var _a;
        var group = ((_a = toc.chapters.find(function (c) { return c.title === ch.title; })) === null || _a === void 0 ? void 0 : _a.group) || "Training";
        var slug = kebab(ch.title);
        var body = ch.body.trim();
        var plain = body.replace(/[#>*_`]/g, "").replace(/\s+/g, " ").trim();
        var summary = plain.slice(0, 180) + (plain.length > 180 ? "…" : "");
        var dir = path_1.default.join(OUT_DIR, slug);
        fs_1.default.mkdirSync(dir, { recursive: true });
        var md = gray_matter_1.default.stringify("# ".concat(ch.title, "\n\n").concat(body, "\n"), {
            title: ch.title,
            slug: slug,
            group: group,
            order: i + 1,
            summary: summary,
            tags: []
        });
        fs_1.default.writeFileSync(path_1.default.join(dir, "index.md"), md, "utf8");
        manifest.chapters.push({ slug: slug, title: ch.title, group: group, order: i + 1, summary: summary });
    });
    fs_1.default.writeFileSync(path_1.default.join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
    console.log("\u2705 Wrote ".concat(manifest.chapters.length, " chapters + manifest.json"));
}
(function main() {
    if (!fs_1.default.existsSync(TOC_PATH)) {
        console.error("\u274C Missing TOC file: ".concat(TOC_PATH));
        process.exit(1);
    }
    var toc = JSON.parse(fs_1.default.readFileSync(TOC_PATH, "utf8"));
    var full = readAllPages();
    var chunks = splitByTOC(full, toc);
    if (!chunks.length) {
        console.error("❌ No chapters found. Check toc titles match the text exactly.");
        process.exit(1);
    }
    writeChapters(chunks, toc);
})();
