# Plan API 문서

<details>
  <summary>1. [인증 필요] 플랜 생성: POST `/plans/create?categoryId=:categoryId`</summary>
  
**request**:

```
{
    "planTitle": "내 여행 계획",
    "status": "PUBLIC",
    "travelStartDate": "20250620",
    "travelEndDate": "20250627",
    "destinations": [
        {
            "destination": {
                "destinationName": "프랑스"
            }
        },
        {
            "destination": {
                "destinationName": "스위스"
            }
        }
    ]
}
```

**response**:

- 성공:

```
{
    "createdAt": "2025-02-11T09:04:44.153Z",
    "updatedAt": "2025-02-11T09:04:44.153Z",
    "isUpdated": false,
    "planId": 1,
    "planTitle": "내 여행 계획",
    "planMainImage": "uploads/planImages/default.png",
    "status": "PUBLIC",
    "travelStartDate": "20250620",
    "travelEndDate": "20250627",
    "likesCount": 0,
    "totalExpenses": 0,
    "destinations": [
        {
            "createdAt": "2025-02-11T09:04:44.193Z",
            "updatedAt": "2025-02-11T09:04:44.193Z",
            "isUpdated": false,
            "destinationId": 1,
            "planId": 1,
            "destination": {
                "destinationId": 1,
                "destinationName": "프랑스"
            }
        },
        {
            "createdAt": "2025-02-11T09:04:44.221Z",
            "updatedAt": "2025-02-11T09:04:44.221Z",
            "isUpdated": false,
            "destinationId": 2,
            "planId": 1,
            "destination": {
                "destinationId": 2,
                "destinationName": "스위스"
            }
        }
    ]
}
```

- 실패:

```
{
    "success": false,
    "message": "카테고리 제목은 20자 내여야 합니다.",
    "error": "Bad Request",
    "statusCode": 400
}
```

- 실패(동일 카테고리 이름):

```
{
    "success": false,
    "message": "동일한 제목의 카테고리가 이미 존재합니다.",
    "error": "Conflict",
    "statusCode": 409
}
```

</details>

<details>
  <summary>2. 플랜 조회: GET `/plans/:planId`</summary>

**response**:

- 성공:

```
{
    "createdAt": "2025-02-11T09:04:44.153Z",
    "updatedAt": "2025-02-11T09:04:44.153Z",
    "isUpdated": false,
    "planId": 1,
    "planTitle": "내 여행 계획",
    "planMainImage": "uploads/planImages/default.png",
    "status": "PUBLIC",
    "travelStartDate": "20250620",
    "travelEndDate": "20250627",
    "likesCount": 0,
    "totalExpenses": 0,
    "category": {
        "createdAt": "2025-02-11T08:59:17.012Z",
        "updatedAt": "2025-02-11T09:06:09.981Z",
        "isUpdated": true,
        "categoryId": 2,
        "categoryTitle": "유럽 여행"
    },
    "destinations": [
        {
            "createdAt": "2025-02-11T09:04:44.193Z",
            "updatedAt": "2025-02-11T09:04:44.193Z",
            "isUpdated": false,
            "destinationId": 1,
            "planId": 1,
            "destination": {
                "destinationId": 1,
                "destinationName": "프랑스"
            }
        },
        {
            "createdAt": "2025-02-11T09:04:44.221Z",
            "updatedAt": "2025-02-11T09:04:44.221Z",
            "isUpdated": false,
            "destinationId": 2,
            "planId": 1,
            "destination": {
                "destinationId": 2,
                "destinationName": "스위스"
            }
        }
    ]
}
```

- 실패:

```
{
    "success": false,
    "message": "2에 해당하는 카테고리를 찾을 수 없습니다.",
    "error": "Not Found",
    "statusCode": 404
}
```

</details>

<details>
  <summary>3. 플랜 디테일 조회: GET `/plans/:planId/details`</summary>

**response**:

- 성공:

```
{
    "createdAt": "2025-02-11T09:04:44.153Z",
    "updatedAt": "2025-02-11T09:24:08.536Z",
    "isUpdated": true,
    "planId": 1,
    "planTitle": "내 여행 계획",
    "planMainImage": "uploads/planImages/default.png",
    "status": "PUBLIC",
    "travelStartDate": "20250620",
    "travelEndDate": "20250627",
    "likesCount": 0,
    "totalExpenses": "0.00",
    "details": [
        {
            "createdAt": "2025-02-11T09:24:08.510Z",
            "updatedAt": "2025-02-11T09:24:08.510Z",
            "isUpdated": false,
            "detailId": 1,
            "startTime": "202506200600",
            "endTime": "202506200800",
            "detailTitle": "서울역 도착",
            "price": null,
            "currency": "KRW",
            "location": "대한민국 서울특별시 중구 소공동 세종대로18길 2",
            "latitude": "37.555946",
            "longitude": "126.972317",
            "notes": null
        }
    ],
    "category": {
        "createdAt": "2025-02-11T08:59:17.012Z",
        "updatedAt": "2025-02-11T09:06:09.981Z",
        "isUpdated": true,
        "categoryId": 2,
        "categoryTitle": "유럽 여행",
        "avatar": {
            "createdAt": "2025-02-11T08:54:42.813Z",
            "updatedAt": "2025-02-11T08:58:07.737Z",
            "isUpdated": true,
            "avatarId": 1,
            "nickname": "new_nickname",
            "introduce": "HELLO WORLD!",
            "profileImage": "uploads/profileImages/default.png"
        }
    }
}
```

- 실패:

```
{
    "success": false,
    "message": "2에 해당하는 여행 계획 목록을 찾을 수 없습니다.",
    "error": "Not Found",
    "statusCode": 404
}
```

</details>

<details>
  <summary>4. [인증 필요]플랜 업데이트: PATCH `/plans/:planId/update`</summary>
  
**request**:

```
{
    "planTitle": "프랑스, 스위스 여행",
    "status": "PUBLIC",
    "travelStartDate": "20250620",
    "travelEndDate": "20250627",
    "destinations": [
        {
            "destination": {
                "destinationName": "프랑스"
            }
        },
        {
            "destination": {
                "destinationName": "스위스"
            }
        }
    ]
}
```

**response**:

- 성공:

```
{
    "createdAt": "2025-02-11T09:04:44.153Z",
    "updatedAt": "2025-02-11T09:28:38.330Z",
    "isUpdated": true,
    "planId": 1,
    "planTitle": "프랑스, 스위스 여행",
    "planMainImage": "uploads/planImages/default.png",
    "status": "PUBLIC",
    "travelStartDate": "20250620",
    "travelEndDate": "20250627",
    "likesCount": 0,
    "totalExpenses": 0,
    "destinations": [
        {
            "createdAt": "2025-02-11T09:04:44.193Z",
            "updatedAt": "2025-02-11T09:04:44.193Z",
            "isUpdated": false,
            "destinationId": 1,
            "planId": 1,
            "destination": {
                "destinationId": 1,
                "destinationName": "프랑스"
            }
        },
        {
            "createdAt": "2025-02-11T09:04:44.221Z",
            "updatedAt": "2025-02-11T09:04:44.221Z",
            "isUpdated": false,
            "destinationId": 2,
            "planId": 1,
            "destination": {
                "destinationId": 2,
                "destinationName": "스위스"
            }
        }
    ]
}
```

- 실패:

```
{
    "success": false,
    "message": "계획 제목은 30자 이내입니다.",
    "error": "Bad Request",
    "statusCode": 400
}
```

</details>
<details>
  <summary>5. [인증 필요] 플랜 삭제: PATCH `/plan/:planId/delete`</summary>

**response**:

- 성공:

```
{
    "message": "성공적으로 삭제되었습니다.",
    "plan": {
        "createdAt": "2025-02-11T09:04:44.153Z",
        "updatedAt": "2025-02-11T09:28:38.330Z",
        "isUpdated": true,
        "planId": 1,
        "planTitle": "프랑스, 스위스 여행",
        "planMainImage": "uploads/planImages/default.png",
        "status": "PUBLIC",
        "travelStartDate": "20250620",
        "travelEndDate": "20250627",
        "likesCount": 0,
        "totalExpenses": 0,
        "destinations": [
            {
                "createdAt": "2025-02-11T09:04:44.193Z",
                "updatedAt": "2025-02-11T09:04:44.193Z",
                "isUpdated": false,
                "destinationId": 1,
                "planId": 1,
                "destination": {
                    "destinationId": 1,
                    "destinationName": "프랑스"
                }
            },
            {
                "createdAt": "2025-02-11T09:04:44.221Z",
                "updatedAt": "2025-02-11T09:04:44.221Z",
                "isUpdated": false,
                "destinationId": 2,
                "planId": 1,
                "destination": {
                    "destinationId": 2,
                    "destinationName": "스위스"
                }
            }
        ]
    }
}
```

- 실패:

```
{
    "success": false,
    "message": "2에 해당하는 여행 계획 목록을 찾을 수 없습니다.",
    "error": "Not Found",
    "statusCode": 404
}
```

</details>
