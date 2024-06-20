import path from 'path';
import fs from 'fs/promises';
import {
	addResponseToThread,
	createThread,
	getOrCreateAssistant,
	getThreadMessages,
	runThreadAndWait,
} from "./openai.js";
import { FileManager } from "./file-manager.js";
import { getAiMessageContent, extractJsonCodeSnippet, handleNewLines } from "./parser.js";

console.log("Code assistant started!");
console.log("======================================");

const assitant = await getOrCreateAssistant("javascript");
if (!assitant) { throw new Error("Cannot find assistant!");}

var fm = new FileManager("./");
await fm.createDirectory('output');

const command = `Create a expressjs microservice with correlation id middleware, in memory cache, health routes, and swagger support. Please put the files in a nice folder structure.`;

console.log('Prompt: ', command, '...');
const thread = await createThread(command);
await runThreadAndWait(thread.id, assitant.id);

let messages = await getThreadMessages(thread.id);
var content = getAiMessageContent(messages);
await fm.createFile(`output/${thread.id}/_openaidump.txt`, content.value);
console.log('Parsing response...');

var jsonContents = extractJsonCodeSnippet(content.value);
var obj = JSON.parse(jsonContents);

for (let index = 0; index < obj.files.length; index++) {
	const element = obj.files[index];
	console.log('- Writing file: ', element.filePath);
	await fm.createFile(`output/${thread.id}/${element.filePath}`, handleNewLines(element.fileContents));
}

console.log('Asking for unit tests...');
await addResponseToThread(thread.id,
	"Can you write unit tests for those files? Include an updated the dependencies file."
);

await runThreadAndWait(thread.id, assitant.id);
messages = await getThreadMessages(thread.id);
var content = getAiMessageContent(messages);
await fm.createFile(`output/${thread.id}/_openaidumptests.txt`, content.value);
console.log('Parsing unit tests response...');

jsonContents = extractJsonCodeSnippet(content.value);
obj = JSON.parse(jsonContents);

for (let index = 0; index < obj.files.length; index++) {
	const element = obj.files[index];
	console.log('- Writing test file: ', element.filePath);
	await fm.createFile(`output/${thread.id}/${element.filePath}`, handleNewLines(element.fileContents));
}

console.log("======================================");
console.log("Complete.");