# Plan API 문서

<details>
  <summary>1. [인증 필요] 플랜 생성: POST `/plans/create?categoryId=:categoryId`</summary>
  
**request**:

```
{
    "planTitle": "유럽 여행",
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
                "destinationName": "파리"
            }
        }
    ]
}
```

**response**:

- 성공:

```
{
    "createdAt": "2025-02-11T05:55:11.799Z",
    "createdTimeSince": "0초 전",
    "updatedAt": "2025-02-11T05:55:11.799Z",
    "isUpdated": false,
    "planId": 2,
    "planTitle": "내 여행 계획",
    "planMainImage": "uploads/planImages/default.png",
    "status": "PUBLIC",
    "travelStartDate": "20250620",
    "travelEndDate": "20250627",
    "likesCount": 0,
    "totalExpenses": 0,
    "destinations": [
        {
            "createdAt": "2025-02-11T05:55:11.825Z",
            "createdTimeSince": "2025-02-11T05:55:11.825Z",
            "updatedAt": "2025-02-11T05:55:11.825Z",
            "isUpdated": false,
            "destinationId": 1,
            "planId": 2,
            "destination": {
                "destinationId": 1,
                "destinationName": "프랑스"
            }
        },
        {
            "createdAt": "2025-02-11T05:55:11.843Z",
            "createdTimeSince": "2025-02-11T05:55:11.843Z",
            "updatedAt": "2025-02-11T05:55:11.843Z",
            "isUpdated": false,
            "destinationId": 2,
            "planId": 2,
            "destination": {
                "destinationId": 2,
                "destinationName": "파리"
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
    "createdAt": "2025-02-11T05:55:11.799Z",
    "createdTimeSince": "13분 전",
    "updatedAt": "2025-02-11T06:06:45.186Z",
    "isUpdated": true,
    "planId": 2,
    "planTitle": "내 여행 계획",
    "planMainImage": "uploads/planImages/default.png",
    "status": "PUBLIC",
    "travelStartDate": "20250620",
    "travelEndDate": "20250627",
    "likesCount": 0,
    "totalExpenses": 0,
    "category": {
        "createdAt": "2025-02-10T10:59:16.728Z",
        "createdTimeSince": "2025-02-10T10:59:16.728Z",
        "updatedAt": "2025-02-10T10:59:50.602Z",
        "isUpdated": true,
        "categoryId": 1,
        "categoryTitle": "카테고리 업데이트"
    },
    "destinations": [
        {
            "createdAt": "2025-02-11T05:55:11.825Z",
            "createdTimeSince": "2025-02-11T05:55:11.825Z",
            "updatedAt": "2025-02-11T05:55:11.825Z",
            "isUpdated": false,
            "destinationId": 1,
            "planId": 2,
            "destination": {
                "destinationId": 1,
                "destinationName": "프랑스"
            }
        },
        {
            "createdAt": "2025-02-11T05:55:11.843Z",
            "createdTimeSince": "2025-02-11T05:55:11.843Z",
            "updatedAt": "2025-02-11T05:55:11.843Z",
            "isUpdated": false,
            "destinationId": 2,
            "planId": 2,
            "destination": {
                "destinationId": 2,
                "destinationName": "파리"
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
  <summary>3. [인증 필요]카테고리 업데이트: PATCH `/category/:categoryId/update`</summary>
  
**request**:

```
{
    "categoryTitle": "카테고리 업데이트"
}

```

**response**:

- 성공:

```
{
    "createdAt": "2025-02-10T10:59:16.728Z",
    "createdTimeSince": "33초 전",
    "updatedAt": "2025-02-10T10:59:50.602Z",
    "isUpdated": true,
    "categoryId": 1,
    "categoryTitle": "카테고리 업데이트",
    "avatar": {
        "createdAt": "2025-02-10T04:54:59.136Z",
        "createdTimeSince": "2025-02-10T04:54:59.136Z",
        "updatedAt": "2025-02-10T05:04:00.866Z",
        "isUpdated": true,
        "avatarId": 1,
        "nickname": "new_nickname",
        "introduce": "HELLO WORLD!",
        "profileImage": "uploads/profileImages/default.png"
    }
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

</details>
<details>
  <summary>4. [인증 필요]카테고리 삭제: PATCH `/category/:categoryId/delete`</summary>

**response**:

- 성공:

```
{
    "message": "성공적으로 삭제되었습니다."
}
```

- 실패:

```
{
    "success": false,
    "message": "12에 해당하는 카테고리를 찾을 수 없습니다.",
    "error": "Not Found",
    "statusCode": 404
}
```

</details>
