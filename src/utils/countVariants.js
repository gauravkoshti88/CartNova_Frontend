export const countVariants = (attributes) => {

    const validAttributes = attributes.filter(
        attr =>
            attr.name.trim() &&
            attr.values.length > 0
    );

    if (!validAttributes.length) return 0;

    return validAttributes.reduce(
        (total, attr) => total * attr.values.length,
        1
    );

};