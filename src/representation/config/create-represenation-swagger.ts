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
                type: 'number'
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
            points: {
                type: 'number',
                default: 0
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