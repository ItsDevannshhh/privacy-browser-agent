
type ElementInfo = {
    id: string;
    tag: string;
    text: string;
    type?: string;
    placeholder?: string;
    ariaLabel?: string;
};

const elements: Record<string, HTMLElement> = {};
let elementCounter = 0;

function getElementText(element: HTMLElement): string {
    return (element.innerText || element.textContent || "")
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 200);
}

function extractDOM(): ElementInfo[] {
    const result: ElementInfo[] = [];

    const selectors = [
        "button",
        "a",
        "input",
        "textarea",
        "select",
        "h1",
        "h2",
        "h3"
    ];

    document.querySelectorAll<HTMLElement>(selectors.join(",")).forEach((element) => {
        const id = `el_${++elementCounter}`;

        elements[id] = element;

        const info: ElementInfo = {
            id,
            tag: element.tagName.toLowerCase(),
            text: getElementText(element),
        };

        if (element instanceof HTMLInputElement) {
            info.type = element.type;
            info.placeholder = element.placeholder;
        }

        if (element instanceof HTMLTextAreaElement) {
            info.placeholder = element.placeholder;
        }

        const ariaLabel = element.getAttribute("aria-label");

        if (ariaLabel) {
            info.ariaLabel = ariaLabel;
        }

        result.push(info);
    });

    return result;
}

const dom = extractDOM();

console.log("Privacy Browser Agent content script loaded");
console.log("Extracted DOM:", dom);