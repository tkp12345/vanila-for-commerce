export const _customEvent = (eventType: string, detail?: object) => {
    document.dispatchEvent(
        new CustomEvent(eventType, {
            detail,
        }),
    );
};