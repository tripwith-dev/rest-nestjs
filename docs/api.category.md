# Category API 문서

## Category

<details>
  <summary>1. [인증 필요]카테고리 생성: POST `/category/create`</summary>
  
**request**:

```
{
    "categoryTitle": "카테고리 타이틀"
}

```

**response**:

```
{
    "createdAt": "2025-02-05T14:32:54.043Z",
    "createdTimeSince": "0초 전",
    "updatedAt": "2025-02-05T14:32:54.043Z",
    "isUpdated": false,
    "deletedAt": null,
    "isDeleted": false,
    "categoryId": 2,
    "categoryTitle": "카테고리 타이틀",
    "avatar": {
        "createdAt": "2025-02-05T12:33:05.115Z",
        "createdTimeSince": "2025-02-05T12:33:05.115Z",
        "updatedAt": "2025-02-05T12:33:05.115Z",
        "isUpdated": false,
        "deletedAt": null,
        "isDeleted": false,
        "avatarId": 1,
        "nickname": "user_nickname",
        "introduce": null,
        "profileImage": null
    }
}

```

</details>

<details>
  <summary>2. 카테고리 조회: POST `/category/:categoryId`</summary>

**response**:

```
{
    "createdAt": "2025-02-05T14:32:54.043Z",
    "createdTimeSince": "1시간 전",
    "updatedAt": "2025-02-05T14:32:54.043Z",
    "isUpdated": false,
    "deletedAt": null,
    "isDeleted": false,
    "categoryId": 2,
    "categoryTitle": "카테고리 타이틀",
    "plans": [],
    "avatar": {
        "createdAt": "2025-02-05T12:33:05.115Z",
        "createdTimeSince": "2025-02-05T12:33:05.115Z",
        "updatedAt": "2025-02-05T12:33:05.115Z",
        "isUpdated": false,
        "deletedAt": null,
        "isDeleted": false,
        "avatarId": 1,
        "nickname": "user_nickname",
        "introduce": null,
        "profileImage": null
    }
}

```

</details>
