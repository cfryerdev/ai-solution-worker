// @ts-ignore
import OpenAI from "openai";

import dotenv from 'dotenv';
dotenv.config();

export const instance = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const getPrompt = (language) => {
    return `You are an expert software engineer. Your goal is to help me write an entire solution in ${language}.
    I want you to list out all the files I will need to build a new solution, include folder structure.
    Your response should only ever be in the following JSON format:

    {
        "description": "Your explanation here",
        "commands": [
            {
                "command": "the command here",
                "description": "a description of the command"
            }
        ],
        "files": [
            {
                "filePath": "filepath/filename.extension",
                "fileContents": "file contents here as json parsable string"
            }
        ]
    }`;
};

export const getModel = () => "gpt-4-turbo";

export const getAssistantName = () => "solution-writing-assistant";

export const getTools = () => [{ type: "code_interpreter" }];

export async function getOrCreateAssistant(language) {
    const assistants = await instance.beta.assistants.list();
    const codeWriterAssistant = assistants.data.find(
        (assistant) => assistant.name === getAssistantName()
    );
    return (
        codeWriterAssistant ??
        instance.beta.assistants.create({
            name: getAssistantName(),
            description: "Solution Writing Assistant",
            temperature: 0,
            model: getModel(),
            instructions: getPrompt(language),
            tools: getTools()
        })
    );
}

export async function createThread(input) {
    return instance.beta.threads.create({
        messages: [
            {
                role: "user",
                content: input,
            },
        ],
    });
}

export async function runThreadAndWait(threadId, assistantId) {
    return instance.beta.threads.runs.createAndPoll(threadId, {
        assistant_id: assistantId,
    });
}

export async function addResponseToThread(threadId, content) {
    return instance.beta.threads.messages.create(threadId, {
        role: "user",
        content,
    });
}

export async function getThreadMessages(threadId) {
    return instance.beta.threads.messages.list(threadId);
}