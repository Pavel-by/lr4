class Utils {
    static toNumber(newValue, defaultValue) {
        if (typeof newValue === 'string')
            newValue = parseFloat(newValue);

        if (typeof newValue === 'number')
            return newValue;

        return defaultValue;
    }

    static toBoolean(newValue, defaultValue) {
        if (typeof newValue === 'boolean')
            return newValue;

        return defaultValue;
    }

    static toDate(newValue, defaultValue) {
        if (typeof newValue === 'string')
            newValue = new Date(newValue);

        return newValue || defaultValue;
    }
}

export default Utils;