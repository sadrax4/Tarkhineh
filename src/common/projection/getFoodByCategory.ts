export const getFoodByCategoryProjection = {
    data: {
        comments: 0,
        description: 0,
        category: 0,
        subCategory: 0,
        images: 0,
    }
}
export const groupAggregate = {
    _id: "$category",
    data: {
        $push: '$$ROOT'
    }
}
export const projectAggregate = {
    category: '$_id',
    _id: 0,
    data: 1,
}