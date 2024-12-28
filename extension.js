const dotenv = require('dotenv');
dotenv.config()
// The module 'vscode' contains the VS Code extensibility API
const vscode = require('vscode');
const axios = require('axios');

const API_URL = 'https://tenor.googleapis.com/v2/search';
const API_KEY = 'AIzaSyCUFqm4Ku9KTxFPvR7N0LBNDy9LVeWfiU8';
if (!API_KEY) console.log("NO API KEY OMG!!!!!!!!!!!!!!!!!!")
const CLIENT_KEY = "my_test_app";

const topics = ["cat meme", "dog meme", "funny animals", "cute kittens", "puppy gifs", "funny pets"];

// Fetch a random GIF from Tenor API
async function fetchRandomGif() {
    try {
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        const response = await axios.get(API_URL, {
            params: {
                q: randomTopic,
                key: API_KEY,
                client_key: CLIENT_KEY,
                limit: 1
            }
        });

        const data = response.data;
        if (data.results && data.results.length > 0) {
            const gifUrl = data.results[0].media_formats.gif.url;
            console.log(`Random GIF for topic "${randomTopic}":`, gifUrl);
            return gifUrl;
        } else {
            console.error("No results found for the topic:", randomTopic);
            return null;
        }
    } catch (error) {
        console.error("Error fetching GIF:", error);
        return null;
    }
}

// Global variable to store the WebviewPanel
let panel;

async function activate(context) {
    console.log('Congratulations, your extension "zon" is now active!');

    const disposable = vscode.commands.registerCommand('zon.giggle', async function () {
        const url = await fetchRandomGif();
        console.log("URL HERE", url);

        if (!url) {
            vscode.window.showErrorMessage('Failed to fetch a random GIF!');
            return;
        }

        vscode.window.showInformationMessage('Behold! The extension has risen! 💣🚀');

        // Reuse existing panel or create a new one
        if (!panel) {
            panel = vscode.window.createWebviewPanel(
                'gifPreview',
                'Random GIF',
                vscode.ViewColumn.One,
                {}
            );

            // Handle panel disposal
            panel.onDidDispose(() => {
                panel = null; // Reset panel reference when it is closed
            });
        }

        // Update the panel's content
        panel.webview.html = `<html>
            <body style="text-align: center; margin-top: 20px;">
                <h1>Random GIF</h1>
                <img src="${url}" alt="Random GIF" style="max-width: 100%; height: auto;" />
            </body>
        </html>`;
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate
};
