export type ZarinPallResponse = {
    "requestResult": {
        "data": {
            "authority": string,
            "fee": number,
            "fee_type": string,
            "code": number,
            "message": string
        },
        "errors": []
    },
    "statusCode": 200
}

// {
//     "requestResult": {
//       "data": {
//         "authority": "A0000000000000000000000000000EBj3RdL",
//         "fee": 1555,
//         "fee_type": "Payer",
//         "code": 100,
//         "message": "Success"
//       },
//       "errors": []
//     },
//     "statusCode": 200
//   }