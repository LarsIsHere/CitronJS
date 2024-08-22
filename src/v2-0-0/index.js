
/*
    CitronJS v2.0.0 
*/
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

let CitronJS = {};

CitronJS.DyCache = {}; // files
CitronJS.ObCache = {}; // samples

CitronJS.addEntry = function (file, src) {
    // generate entry number
    let entry = CitronJS.generateRand();
    while (CitronJS.DyCache.hasOwnProperty(entry)) {
        entry = CitronJS.generateRand();
    }
    const serializer = new XMLSerializer();
    xmlDocAsString = serializer.serializeToString(file);
    // cache the content
    CitronJS.DyCache[entry] = { file: xmlDocAsString, src: src };

    // save the sample names and their corresponding entriesS
    const exportSamples = file.getElementsByTagName('export');
    for (let i = 0; i < exportSamples.length; i++) {
        const exportSample = exportSamples[i];
        
        CitronJS.ObCache[exportSample.getAttribute('sample')] = entry;
        
    }
    

}

CitronJS.handleImports = async function (src) {
    const response = await fetch(src);
    if (!response.ok) {
        throw new Error('[CitronJS]: Error fetching a component. Received status ' + response.status);
    }
    const xmlContent = await response.text();
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');
    // verify syntax
    
    if (CitronJS.isSyntaxValid(xmlDoc)) {
        
        const exports = xmlDoc.getElementsByTagName('export');
        for (let i = 0; i < exports.length; i++) {
            const expElement = exports[i];
            const sampleName = expElement.getAttribute('sample');

            for (var key in CitronJS.ObCache) {
                if (key == sampleName) {
                    expElement.parentNode.removeChild(expElement);
                    const samples = xmlDoc.getElementsByTagName('sample');
                    for (let i = 0; i < samples.length; i++) {
                        const sample = samples[i];
                        if (sample.getAttribute('name') == sampleName) {
                            sample.parentNode.removeChild(sample);
                        }
                    }
                }
            }
        }
        if(xmlDoc.getElementsByTagName('export')) {
            // adds entry
            CitronJS.addEntry(xmlDoc, src);
        }

    }
}

CitronJS.isSyntaxValid = function (xml) {
    return true;
}

CitronJS.generateRand = function () {
    let randomNumber = Math.floor(Math.random() * 100000);
    let randomString = randomNumber.toString().padStart(5, '0');
    return randomString;
}

CitronJS.handleSample = async function (sampleNode) {
    const sampleName = sampleNode.getAttribute('name'); 
    if (CitronJS.ObCache.hasOwnProperty(sampleName)) {

        const entry = CitronJS.ObCache[sampleName];
        if (!CitronJS.DyCache[entry].hasOwnProperty('file')) {
            await CitronJS.updateFile(entry);
        }
    
        // here could go checks for keepskeleton, variables, etc.
        // samplename is the name of the sample, xmlDoc is the file which contains the sample
        // sampleNode is the element to be replaced
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(CitronJS.DyCache[entry].file, 'application/xml');
        

        
        const exportElements = xmlDoc.getElementsByTagName('export');
        let exportEl;
        for (let i = 0; i < exportElements.length; i++) {
            const exportElement = exportElements[i];
            if (exportElement.getAttribute('sample') == sampleName) {
                exportEl = exportElement;
            }
        }

        
        const samples = xmlDoc.getElementsByTagName('sample');
        let targetSample;
        for (let i = 0; i < samples.length; i++) {
            const sample = samples[i];
            if (sample.getAttribute('name') == sampleName) {
                targetSample = sample.innerHTML;
            }
        }
        let FinalString = targetSample;
        // variable check
        if (exportEl.getElementsByTagName('var')) {
            const ExportVars = exportEl.getElementsByTagName('var');
            for (let i = 0; i < ExportVars.length; i++) {
                const ExportVar = ExportVars[i];
                const varName = ExportVar.getAttribute('var');
                if (FinalString.includes("{ " + varName + " }")) {
                    // if a value was provided
                    if (sampleNode.hasAttribute(varName)) {
                        FinalString = FinalString.replace(new RegExp('\\{\\s*' + varName + '\\s*\\}', 'g'), sampleNode.getAttribute(varName));
                    } else if (ExportVar.hasAttribute('default')) {
                        FinalString = FinalString.replace(new RegExp('\\{\\s*' + varName + '\\s*\\}', 'g'), ExportVar.getAttribute('default'));
                    }
                    // new RegExp('\\{\\s*' + varName + '\\s*\\}', 'g')
                }
            }
        }

        if (sampleNode.hasAttribute('keepWrapper')) {
            sampleNode.innerHTML = FinalString;
        } else {
            sampleNode.outerHTML = FinalString;
        }
        
    }
}


CitronJS.lazyQueue = function () {}

CitronJS.updateFile = async function (entry) {
    const response = await fetch(CitronJS.DyCache[entry].src);

    const xmlContent = await response.text();
    CitronJS.DyCache[entry].file = xmlContent;

}

CitronJS.clearCache = function () {
    Object.keys(CitronJS.DyCache).forEach(key => {
        if (CitronJS.DyCache[key].hasOwnProperty('file')) {
            delete CitronJS.DyCache[key].file;
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const imports = document.head.getElementsByTagName('c-import');
    for (let i = 0; i < imports.length; i++) {
        const e = imports[i];
        if (e.hasAttribute('src')) {
            await CitronJS.handleImports(e.getAttribute('src'));
        }
    }

    const samples = document.getElementsByTagName('sample');
    for (let i = 0; i < samples.length; i++) {
        const b = samples[i];
        if (b.hasAttribute('name')) {
            await CitronJS.handleSample(b);
        }
    }
    const observer = new MutationObserver(callback);
    observer.observe(document.documentElement || document.body, { attributes: true, childList: true, subtree: true });
});

const callback = async function(mutationsList, observer) {
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            for(let node of mutation.addedNodes) {
                if (node.tagName == undefined) {} else {
                    if (node.tagName.toLowerCase() == 'c-import') {
                        // c import
                        if (node.hasAttribute('src')) {
                            CitronJS.handleImports(node.getAttribute('src'));
                        }
                    } else if (node.tagName.toLowerCase() == 'sample') {
                        if (node.hasAttribute('name')) {
                            CitronJS.handleSample(node);
                        }
                    }
                }

            }
        } else if (mutation.type === 'attributes') {
            const targetElement = mutation.target;
            if (targetElement.tagName.toLowerCase() === 'sample') {
                CitronJS.handleSample(mutation.target);
              }
        }
    }
}