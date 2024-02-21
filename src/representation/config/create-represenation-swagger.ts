export const representationSchema = {
    schema: {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            },
            phone: {
                type: 'string'
            },
            nationalCode: {
                type: 'string'
            },
            state: {
                type: 'string'
            },
            zone: {
                type: 'string'
            },
            city: {
                type: 'string'
            },
            ownership: {
                type: 'string'
            },
            buildAge: {
                type: 'string'
            },
            businessLicense: {
                type: 'boolean'
            },
            kitchen: {
                type: 'boolean'
            },
            parking: {
                type: 'boolean'
            },
            Warehouse: {
                type: 'boolean'
            },
            imagesUrl: {
                type: 'array',
                items: {
                    type: 'string',
                    format: 'binary'
                }
            }
        }
    }
}


