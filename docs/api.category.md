# Category API 문서

<details>
  <summary>1. [인증 필요]카테고리 생성: POST `/category/create?avatarId=:avatarId`</summary>
  
**request**:

```
{
    "categoryTitle": "new category"
}
```

**response**:

- 성공:

```
{
    "createdAt": "2025-02-11T08:59:17.012Z",
    "updatedAt": "2025-02-11T08:59:17.012Z",
    "isUpdated": false,
    "categoryId": 1,
    "categoryTitle": "new category",
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
    "createdAt": "2025-02-11T08:59:17.012Z",
    "updatedAt": "2025-02-11T08:59:17.012Z",
    "isUpdated": false,
    "categoryId": 2,
    "categoryTitle": "new category",
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
  <summary>3. 카테고리 조회(플랜 포함): GET `/category/:categoryId/with-plan`</summary>

**response**:

- 성공:

```
{
    "createdAt": "2025-02-11T08:59:17.012Z",
    "updatedAt": "2025-02-11T08:59:17.012Z",
    "isUpdated": false,
    "categoryId": 2,
    "categoryTitle": "new category",
    "plans": [
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
            "totalExpenses": "0.00",
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
    ],
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
  <summary>4. [인증 필요]카테고리 업데이트: PATCH `/category/:categoryId/update`</summary>
  
**request**:

```
{
    "categoryTitle": "유럽 여행"
}
```

**response**:

- 성공:

```
{
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
  <summary>5. [인증 필요]카테고리 삭제: PATCH `/category/:categoryId/delete`</summary>

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
