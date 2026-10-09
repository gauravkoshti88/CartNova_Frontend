export const searchFilter = (data = [], searchTerm = "", fields = []) => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return data.filter(Boolean);

    return data
        .filter(Boolean)
        .filter(item =>
            fields
                .map(field => field(item))
                .filter(Boolean)
                .some(value =>
                    String(value)
                        .toLowerCase()
                        .includes(search)
                )
        );
};