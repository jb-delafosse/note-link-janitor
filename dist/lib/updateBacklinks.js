"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getBacklinksBlock_1 = require("./getBacklinksBlock");
const processor_1 = require("./processor");
function updateBacklinks(tree, noteContents, backlinks) {
    let insertionOffset;
    let oldEndOffset = -1;
    const backlinksInfo = getBacklinksBlock_1.default(tree);
    if (backlinksInfo.isPresent) {
        insertionOffset = backlinksInfo.start.position.start.offset;
        oldEndOffset = backlinksInfo.until
            ? backlinksInfo.until.position.start.offset
            : noteContents.length;
    }
    else {
        insertionOffset = backlinksInfo.insertionPoint
            ? backlinksInfo.insertionPoint.position.start.offset
            : noteContents.length;
    }
    if (oldEndOffset === -1) {
        oldEndOffset = insertionOffset;
    }
    let backlinksString = "";
    if (backlinks.length > 0) {
        const backlinkNodes = backlinks.map(entry => ({
            type: "listItem",
            spread: false,
            children: [
                {
                    type: "paragraph",
                    children: [
                        {
                            type: "wikiLink",
                            value: entry.sourceTitle,
                            data: { alias: entry.sourceTitle }
                        }
                    ]
                },
                {
                    type: "list",
                    ordered: false,
                    spread: false,
                    children: entry.context.map(block => ({
                        type: "listItem",
                        spread: false,
                        children: [block]
                    }))
                }
            ]
        }));
        const backlinkContainer = {
            type: "root",
            children: [
                {
                    type: "list",
                    ordered: false,
                    spread: false,
                    children: backlinkNodes
                }
            ]
        };
        var optionalNewLine = ((backlinksInfo.isPresent) ? "" : "\n");
        backlinksString = `${optionalNewLine}## Linked References\n\n${backlinks
            .map(entry => `* [[${entry.sourceTitle}]]\n${entry.context
            .map(block => `    * ${processor_1.default.stringify(block).replace(/\n.+/, "")}\n`)
            .join("")}`)
            .join("")}`;
    }
    const newNoteContents = noteContents.slice(0, insertionOffset) +
        backlinksString +
        noteContents.slice(oldEndOffset);
    return newNoteContents;
}
exports.default = updateBacklinks;
//# sourceMappingURL=updateBacklinks.js.map