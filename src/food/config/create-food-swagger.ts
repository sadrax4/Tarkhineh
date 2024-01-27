export const foodSchema = {
    schema: {
        type: 'object',
        properties: {
            title: {
                type: 'string'
            },
            ingredients: {
                type: 'array',
                items: {
                    type: 'string'
                }
            },
            description: {
                type: 'string'
            },
            price: {
                type: 'number'
            },
            rate: {
                type: 'number'
            },
            discount: {
                type: 'number',
                default: 0
            },
            quantity: {
                type: 'number'
            },
            category: {
                type: 'array',
                items: {
                    type: 'string'
                }
            },
            subCategory: {
                type: 'array',
                items: {
                    type: 'string'
                }
            },
            images: {
                type: 'array',
                items: {
                    type: 'string',
                    format: 'binary'
                }
            },
        },
    },
}