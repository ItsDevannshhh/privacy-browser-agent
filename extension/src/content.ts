interface ElementInfo {
    id: string;
    tag: string;
    text: string;
    type?: string;
    placeholder?: string;
    ariaLabel?: string;
}

function extractDom(): ElementInfo[] {
    const elements = document.querySelectorAll(
        "button, a, input, textarea, select"
    );

    const result: ElementInfo[] = [];

    elements.forEach((element, index) => {
        const htmlElement = element as HTMLElement;
        const input = element as HTMLInputElement;

        const id = `el_${index + 1}`;

        result.push({
            id,
            tag: element.tagName.toLowerCase(),
            text: htmlElement.innerText?.trim() || "",
            type: input.type || undefined,
            placeholder: input.placeholder || undefined,
            ariaLabel: element.getAttribute("aria-label") || undefined,
        });
    });

    return result;
}

const dom = extractDom();

console.log("Privacy Browser Agent DOM:", dom);