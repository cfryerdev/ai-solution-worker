# OpenAI Solution Generation

This is a proof of concept for programmatically creating a code assistant to create full solutions, writing the files to disk, and adding more context to the thread for example adding unit tests. 

The output is placed in an output folder, each execution gets its own thread id and puts it in a folder. OpenAI Response dumps are included as `_openaidump.txt` and `_openaidumptests.txt` for debug purposes.

Enjoy!

## Getting started

First you need to update the `OPENAI_API_KEY` key in the `.env` file with your OpenAI API Key. Then you can run the following:

```sh
npm install
npm start
```

### Todo Items

- Sometimes OpenAI gives us garbage responses, we need to catch this, and re-attempt the question.
- Clean up the code a bit, pretty messy
- Add more comments for educational purposes
- create constants for each language we want to support
- Include expected folder structures for each language we want to support