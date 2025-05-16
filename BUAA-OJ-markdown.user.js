// ==UserScript==
// @name         BUAA OJ Markdown Bundle Downloader
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Extracts the BUAA OJ contest data and downloads it as a Markdown bundle in a zip file.
// @author       eWloYW8
// @match        *://accoding.buaa.edu.cn/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 加载 JSZip 库
    function loadJSZip(callback) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
        script.onload = callback;
        document.head.appendChild(script);
    }

    async function fetchData() {
        const contestId = window.location.href.split('#/')[1]?.split('/')[0];
        if (!contestId) {
            console.error("Failed to get contest ID from URL.");
            return null;
        }
        try {
            const response = await fetch(`https://accoding.buaa.edu.cn/api/contests/${contestId}`);
            return response.json();
        } catch (error) {
            console.error("Failed to fetch data:", error);
            return null;
        }
    }

    async function generateZip(data) {
        const JSZip = window.JSZip || null;
        if (!JSZip) {
            console.error("JSZip not loaded.");
            return null;
        }
        const zip = new JSZip();
        const baseDir = data.title.trim();
        const readmeContent = data.description.replace(/\\_/g, "_").replace(/\\\\/g, "\\")
            .replace(/\\\*/g, "*").replace(/\$/g, " $ ")
            .replace(/\r\n/g, "\n").replace(/# #/g, "##");
        zip.file(`${baseDir}/README.md`, readmeContent);

        data.problems.forEach(problem => {
            const problemDir = `${baseDir}/${problem.contest_problem_list.order + 1} ${problem.title}.md`;
            const testSetting = JSON.parse(problem.test_setting);
            const problemContent = `# ${problem.title}\n\n` +
                `- 题库编号：${data.id}\n\n` +
                `- 题目编号：${problem.id}\n\n` +
                `## 题目限制\n\n` +
                `- 时间限制：${testSetting.time_limit} ms\n` +
                `- 空间限制：${testSetting.memory_limit} KB\n` +
                `- 可用语言：${testSetting.supported_languages}\n\n` +
                problem.description.replace(/\\_/g, "_").replace(/\\\\/g, "\\")
                    .replace(/\\\*/g, "*").replace(/\$/g, " $ ")
                    .replace(/\r\n/g, "\n") +
                `\n\n> Extracted at ${new Date().toISOString()}\n\n`;
            zip.file(problemDir, problemContent);
        });

        return zip.generateAsync({ type: "uint8array" }); // 返回字节数组
    }

    function toHexString(uint8Array) {
        return Array.from(uint8Array)
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    }

    async function copyHexToClipboard(data) {
        try {
            const hexData = toHexString(data);
            await navigator.clipboard.writeText(hexData);
            alert("Hex data copied to clipboard successfully!");
        } catch (error) {
            console.error("Failed to copy to clipboard:", error);
            alert("Failed to copy hex data to clipboard.");
        }
    }

    function createButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.bottom = '10px';
        buttonContainer.style.right = '10px';
        buttonContainer.style.zIndex = '9999';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';

        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download Markdown Bundle';
        downloadButton.style.padding = '10px 20px';
        downloadButton.style.backgroundColor = '#007BFF';
        downloadButton.style.color = '#FFFFFF';
        downloadButton.style.border = 'none';
        downloadButton.style.borderRadius = '5px';
        downloadButton.style.cursor = 'pointer';

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy Hex Data to Clipboard';
        copyButton.style.padding = '10px 20px';
        copyButton.style.backgroundColor = '#28A745';
        copyButton.style.color = '#FFFFFF';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '5px';
        copyButton.style.cursor = 'pointer';

        downloadButton.onclick = async () => {
            const data = await fetchData();
            if (data) {
                const blob = await generateZip(data);
                if (blob) {
                    const url = URL.createObjectURL(new Blob([blob], { type: "application/zip" }));
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${data.title.trim()}.zip`;
                    document.body.appendChild(a);
                    a.click();
                    URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                }
            } else {
                alert("Failed to fetch contest data.");
            }
        };

        copyButton.onclick = async () => {
            const data = await fetchData();
            if (data) {
                const uint8Array = await generateZip(data);
                if (uint8Array) {
                    await copyHexToClipboard(uint8Array);
                }
            } else {
                alert("Failed to fetch contest data.");
            }
        };

        buttonContainer.appendChild(downloadButton);
        buttonContainer.appendChild(copyButton);
        document.body.appendChild(buttonContainer);
    }

    loadJSZip(() => {
        createButtons();
    });
})();
