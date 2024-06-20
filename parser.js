import os from 'os';

/** Extracts just the message content we want from openai response structures */
export const getAiMessageContent = (messages) => {
    return (messages.data.find((m) => m.role === "assistant")?.content[0]).text;
}

/** Regular expression to match the pattern ```json {your-code} ``` */
export const extractJsonCodeSnippet = (inputString) => {
    const regexPattern = /```json\s*([\s\S]*?)\s*```/;
    const match = inputString.match(regexPattern);
    return match ? match[1].trim() : inputString;
};

/** Handles newline replacement for specific operating systems */
export const handleNewLines = (inputString) => {
    const newline = os.platform() === 'win32' ? '\r\n' : '\n';
    var ns = inputString.replace(/\\n/g, '\n');
    ns = ns.replace(/\\"/g, '"');
    return ns.replace(/\n/g, newline);
}