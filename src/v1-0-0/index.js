class CImport extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        if (this.parentElement.tagName !== 'HEAD') {
            document.head.appendChild(this);
        }
    }
}
customElements.define('c-import', CImport);

let CitronJSDynamicCache = [];
// Main
document.addEventListener('DOMContentLoaded', async () => {

    const imports = document.head.getElementsByTagName('c-import');
    for (let i = 0; i < imports.length; i++) {
        const e = imports[i];
        try {
            const response = await fetch(e.getAttribute('src'));
            if (!response.ok) {
                throw new Error('[CitronJS]: Error fetching a component. Status: ' + response.status);
            }

            const xmlContent = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlContent, 'text/html');
            
            var parserErrors = xmlDoc.getElementsByTagName('parsererror');
            for (var j = parserErrors.length - 1; j >= 0; j--) {
                parserErrors[j].parentNode.removeChild(parserErrors[j]);
            }
            
            // xmlDoc is the imported citronjs file
            //xmlChecklist
            xmlChecklist(xmlDoc, e.getAttribute('src'));
            const samples = document.getElementsByTagName('sample');
            for (let i = samples.length - 1; i >= 0; i--) {
                const sample = samples[i];

                const sampleName = sample.getAttribute('c-name');
                
                const exports = xmlDoc.getElementsByTagName('export');
                let export_names = [];
                for (let i = exports.length - 1; i >= 0; i--) {
                    console.log(exports[i].getAttribute('sample'));
                    export_names.push(exports[i].getAttribute('sample'));
                }
                if (export_names.includes(sampleName)) {
                    const FileSamples = xmlDoc.getElementsByTagName('sample');
                    let FileSampleNames = [];
                    for (let i = FileSamples.length - 1; i >= 0; i--) {
                        const FileSample = FileSamples[i];
                        FileSampleNames.push(FileSample.getAttribute('name'));
                        if (FileSampleNames.includes(sampleName)) {
                            const FinalSampleElement = FileSample;
                            if (FinalSampleElement !== undefined) {
                                const parser = new DOMParser();
                                let htmlString = FinalSampleElement.innerHTML;
                                // ready
                                // if (sample)
                                let targetElement = [...exports].find(element => element.hasAttribute('sample') && element.getAttribute('sample') === sampleName);
                                if (targetElement !== undefined && targetElement.hasChildNodes()) {
                                    const children = targetElement.childNodes;
                                    for (let i = 0; i < children.length; i++) {
                                        child = children[i];
                                        if (child.tagName === "VAR") {
                                            const variable = child.getAttribute('var');
                                            if (htmlString.includes('{ ' + variable + ' }')) {
                                                if (sample.hasAttribute(variable)) {
                                                    htmlString = htmlString.replace(new RegExp('\\{\\s*' + variable + '\\s*\\}', 'g'), sample.getAttribute(variable));
                                                } else {
                                                    if (child.hasAttribute('default')) {
                                                        htmlString = htmlString.replace(new RegExp('\\{\\s*' + variable + '\\s*\\}', 'g'), child.getAttribute('default'));
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                const doc = parser.parseFromString(htmlString, 'text/html');
                                sample.replaceWith(doc.body.firstChild);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('[CitronJS]: ' + error.message);
        }
    }
});


const config = { childList: true };
/*
// Callback function to execute when mutations occur
const callback = async function(mutationsList, observer) {
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            for(let node of mutation.addedNodes) {
                if (node.tagName.toLowerCase() === 'c-import') {

                    console.log('Element with tag "sample" added:', node);
                    const response = await fetch(node.getAttribute('src'));
                    if (!response.ok) {
                        throw new Error('[CitronJS]: Error fetching a component. Status: ' + response.status);
                    }

                    const xmlContent = await response.text();
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(xmlContent, 'text/html');
            
                    var parserErrors = xmlDoc.getElementsByTagName('parsererror');
                    for (var j = parserErrors.length - 1; j >= 0; j--) {
                        parserErrors[j].parentNode.removeChild(parserErrors[j]);
                    }

                    const serializer = new XMLSerializer();
                    const xmlDocAsString = serializer.serializeToString(xmlDoc);
                    CitronJSDynamicCache.push(xmlDocAsString);
                    xmlChecklist(xmlDoc, node.getAttribute('src'));

                } else if (node.tagName.toLowerCase() === 'sample') {
                    // handle dynamically added sample elements
                    const sample = node;
                    const sampleName = sample.getAttribute('c-name');
                    const xmlDoc = '';
                    
                }
            }
        }
    }
};

const observer = new MutationObserver(callback);
observer.observe(document, config);
*/
// checklist
function xmlChecklist(xmlDoc, fileName) {
    // Check for duplicate sample names across multiple files
    const seenSampleNames = new Map(); // Use a Map to track seen sample names

    // Iterate through all <sample> elements
    const samples = xmlDoc.getElementsByTagName('sample');
    for (let i = samples.length - 1; i >= 0; i--) {
        const sample = samples[i];
        const sampleName = sample.getAttribute('name'); // Use 'name' attribute for comparison

        // Check if the sample name has already been seen
        if (seenSampleNames.has(sampleName)) {
            console.error(`[Citron]: Syntax Error in "${fileName}" -> Duplicate sample name "${sampleName}" found.`);
        } else {
            seenSampleNames.set(sampleName, true);
        }
    }

    // Check for multiple same sample names in one file
    const uniqueSampleNames = new Set();
    const FileSamples = xmlDoc.getElementsByTagName('sample');
    for (let i = FileSamples.length - 1; i >= 0; i--) {
        const FileSample = FileSamples[i];
        const sampleName = FileSample.getAttribute('name');
        if (!uniqueSampleNames.has(sampleName)) {
            uniqueSampleNames.add(sampleName);
        } else {
            console.error(`[Citron]: Syntax Error in "${fileName}" -> Multiple occurrences of sample name "${sampleName}" in one file.`);
        }
    }

    // Check for "export" element without "sample" elements
    const exports = xmlDoc.getElementsByTagName('export');
    for (let i = exports.length - 1; i >= 0; i--) {
        const exportElement = exports[i];
        const sampleElements = xmlDoc.getElementsByTagName('sample');
        let hasSample = false;
        for (let j = sampleElements.length - 1; j >= 0; j--) {
            if (sampleElements[j].getAttribute('name') === exportElement.getAttribute('sample')) {
                hasSample = true;
                break;
            }
        }
        if (!hasSample) {
            console.error(`[Citron]: Syntax Error in "${fileName}" -> "export" element "${exportElement.getAttribute('sample')}" does not correspond to any "sample" element.`);
        }
    }

    // Check if content isn't enclosed in a "citron" tag -> SOON

        // Check for 'var' attribute presence when 'default' attribute exists
        const exports2 = xmlDoc.getElementsByTagName('export');
        for (let i = exports2.length - 1; i >= 0; i--) {
            const exportElement = exports2[i];
            if (exportElement.hasAttribute('default') && !exportElement.hasAttribute('var')) {
                console.error(`[Citron]: Syntax Error in "${fileName}" -> "export" element "${exportElement.getAttribute('sample')}" has a "default" attribute but lacks a "var" attribute.`);
            }
        }
    
        // Validate 'var' attributes against existing HTML attributes

}

