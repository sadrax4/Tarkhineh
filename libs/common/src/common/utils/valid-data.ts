export function deleteInvalidValue(data = {}, blackList = []) {
    Object.keys(data).forEach(key => {
        if (blackList?.includes(key)) delete data[key];
        if (typeof data[key] === 'string') data[key] = data[key].trim();
        if (Array.isArray(data[key]) && data[key].length > 0) data[key] = data[key].map(item => item.trim());
        if (Array.isArray(data[key]) && data[key].length < 1) delete data[key];;
        if (process.env.NULL_DATA.includes(data[key])) delete data[key]
    })
}
export function pagination(array: any, page_size: number, page_number: number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size)
}
