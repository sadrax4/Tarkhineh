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
    _id: "$subCategory",
    data: {
        $push: '$$ROOT'
    }
}
export const projectAggregate = {
    subCategory: '$_id',
    _id: 0,
    data: 1,
}

export const groupAggregateFavoriteFood = {
    _id: "$category",
    data: {
        $push: '$$ROOT'
    }
}
export const projectAggregateFavoriteFood = {
    category: '$_id',
    _id: 0,
    data: 1,
}
export const getFavoriteFoodProjection = {
    comments: 0,
    description: 0,
    category: 0,
    subCategory: 0,
    images: 0,
}