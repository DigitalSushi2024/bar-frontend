export function normalizeData(data) {
    // Als het een array is, loop erdoor en normaliseer elk item
    if (Array.isArray(data)) {
        return data.map(normalizeData);
    }

    // Als het een object is, verwerk het
    if (data && typeof data === 'object') {
        const normalized = {};

        // Verwijder onnodige '$id'-velden en verwerk geneste '$values'
        for (const key in data) {
            if (key === '$id') continue; // Sla '$id' over
            if (key === '$values') {
                return normalizeData(data[key]); // Verwerk '$values' als array
            }
            normalized[key] = normalizeData(data[key]); // Recursief normaliseren
        }
        return normalized;
    }

    // Als het geen array of object is (primitieve waarde), retourneer het direct
    return data;
}
