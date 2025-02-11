# Category API 문서

<details>
  <summary>1. [인증 필요]카테고리 생성: POST `/category/create?avatarId=:avatarId`</summary>
  
**request**:

```
{
    "categoryTitle": "카테고리 타이틀"
}

```

**response**:

- 성공:

```
{
    "createdAt": "2025-02-10T10:59:16.728Z",
    "createdTimeSince": "0초 전",
    "updatedAt": "2025-02-10T10:59:16.728Z",
    "isUpdated": false,
    "categoryId": 1,
    "categoryTitle": "카테고리 타이틀",
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
  <summary>2. 카테고리 조회: GET `/category/:categoryId`</summary>

**response**:

- 성공:

```
{
    "createdAt": "2025-02-10T10:59:16.728Z",
    "createdTimeSince": "1분 전",
    "updatedAt": "2025-02-10T10:59:50.602Z",
    "isUpdated": true,
    "categoryId": 1,
    "categoryTitle": "카테고리 업데이트",
    "plans": [
        {
            "createdAt": "2025-02-10T11:00:25.637Z",
            "createdTimeSince": "2025-02-10T11:00:25.637Z",
            "updatedAt": "2025-02-10T11:00:25.637Z",
            "isUpdated": false,
            "planId": 1,
            "planTitle": "유럽 여행",
            "planMainImage": "uploads/planImages/default.png",
            "status": "PUBLIC",
            "travelStartDate": "20250620",
            "travelEndDate": "20250627",
            "likesCount": 0,
            "totalExpenses": "0.00",
            "destinations": [
                {
                    "createdAt": "2025-02-10T11:00:25.685Z",
                    "createdTimeSince": "2025-02-10T11:00:25.685Z",
                    "updatedAt": "2025-02-10T11:00:25.685Z",
                    "isUpdated": false,
                    "destinationId": 1,
                    "planId": 1,
                    "destination": {
                        "destinationId": 1,
                        "destinationName": "프랑스"
                    }
                },
                {
                    "createdAt": "2025-02-10T11:00:25.716Z",
                    "createdTimeSince": "2025-02-10T11:00:25.716Z",
                    "updatedAt": "2025-02-10T11:00:25.716Z",
                    "isUpdated": false,
                    "destinationId": 2,
                    "planId": 1,
                    "destination": {
                        "destinationId": 2,
                        "destinationName": "파리"
                    }
                }
            ]
        }
    ],
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
