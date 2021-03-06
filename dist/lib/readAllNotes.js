"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const remark = require("remark");
const find = require("unist-util-find");
const getNoteLinks_1 = require("./getNoteLinks");
const processor_1 = require("./processor");
const missingTitleSentinel = { type: "missingTitle" };
const headingFinder = processor_1.default().use(() => tree => find(tree, { type: "heading", depth: 1 }) || missingTitleSentinel);
async function readNote(notePath) {
    const noteContents = await fs.promises.readFile(notePath, {
        encoding: "utf-8"
    });
    const parseTree = processor_1.default.parse(noteContents);
    const headingNode = await headingFinder.run(parseTree);
    if (headingNode.type === "missingTitle") {
        throw new Error(`${notePath} has no title`);
    }
    const title = remark()
        .stringify({
        type: "root",
        children: headingNode.children
    })
        .trimEnd();
    return { title, links: getNoteLinks_1.default(parseTree), parseTree, noteContents };
}
async function readAllNotes(noteFolderPath) {
    const noteDirectoryEntries = await fs.promises.readdir(noteFolderPath, {
        withFileTypes: true
    });
    const notePaths = noteDirectoryEntries
        .filter(entry => entry.isFile() && !entry.name.startsWith(".") && entry.name.endsWith(".md"))
        .map(entry => path.join(noteFolderPath, entry.name));
    const noteEntries = await Promise.all(notePaths.map(async (notePath) => [notePath, await readNote(notePath)]));
    return Object.fromEntries(noteEntries);
}
exports.default = readAllNotes;
//# sourceMappingURL=readAllNotes.js.map