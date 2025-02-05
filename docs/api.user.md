# User API 문서

## Auth

<details>
  <summary>1. 회원가입: POST `/auth/register`</summary>
  
**request**:

```
{
  "user": {
    "email": "test@example.com",
    "password": "Password123@",
    "username": "user123"
  },
  "avatar": {
    "nickname": "user_nickname"
  }
}

```

**response**:

```
{
    "createdAt": "2025-02-05T12:33:05.094Z",
    "createdTimeSince": "0초 전",
    "updatedAt": "2025-02-05T12:33:05.000Z",
    "isUpdated": false,
    "deletedAt": null,
    "isDeleted": false,
    "id": 1,
    "email": "test@example.com",
    "username": "user123",
    "avatar": {
        "createdAt": "2025-02-05T12:33:05.115Z",
        "createdTimeSince": "0초 전",
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
  <summary>2. 로그인: POST `/auth/login`</summary>
  
**request**:

```
{
    "email": "test@example.com",
    "password": "Password123@"
}

```

**response**:

```
{
    "loginUser": {
        "createdAt": "2025-02-05T12:33:05.094Z",
        "createdTimeSince": "2분 전",
        "updatedAt": "2025-02-05T12:33:05.000Z",
        "isUpdated": false,
        "deletedAt": null,
        "isDeleted": false,
        "id": 1,
        "email": "test@example.com",
        "username": "user123",
        "avatar": {
            "createdAt": "2025-02-05T12:33:05.115Z",
            "createdTimeSince": "2분 전",
            "updatedAt": "2025-02-05T12:33:05.115Z",
            "isUpdated": false,
            "deletedAt": null,
            "isDeleted": false,
            "avatarId": 1,
            "nickname": "user_nickname",
            "introduce": null,
            "profileImage": null
        }
    },
    "jwt": "eyJhbGciOiJI..."
}
```

</details>

## User

<details>
  <summary>1. 사용자 조회(테스트용): GET `users/verify-users/:userId` </summary>

**response**:

```
{
    "createdAt": "2025-02-05T12:33:05.094Z",
    "createdTimeSince": "0초 전",
    "updatedAt": "2025-02-05T12:33:05.000Z",
    "isUpdated": false,
    "deletedAt": null,
    "isDeleted": false,
    "id": 1,
    "email": "test@example.com",
    "username": "user123",
    "avatar": {
        "createdAt": "2025-02-05T12:33:05.115Z",
        "createdTimeSince": "0초 전",
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
  <summary>2. [인증 필요]사용자 계정 정보 조회: GET `/users/:userId`</summary>

**response**:

```
{
    "createdAt": "2025-02-05T12:33:05.094Z",
    "createdTimeSince": "1시간 전",
    "updatedAt": "2025-02-05T12:33:05.000Z",
    "isUpdated": false,
    "deletedAt": null,
    "isDeleted": false,
    "id": 1,
    "email": "test@example.com",
    "username": "user123"
}
```

</details>

## Avatar

<details>
  <summary>1. 프로필 정보 조회(카테고리 포함): GET `/avatars/:avatarId`</summary>

**response**:

```
{
    "createdAt": "2025-02-05T12:33:05.115Z",
    "createdTimeSince": "1시간 전",
    "avatarId": 1,
    "nickname": "user_nickname",
    "introduce": null,
    "profileImage": null,
    "categories": [
        {
            "categoryId": 2,
            "categoryTitle": "카테고리 타이틀"
        }
    ]
}
```

</details>

<details>
  <summary>2. [인증 필요]프로필 정보 조회(카테고리 제외): GET `/avatars/:avatarId/profile`</summary>
- 사용자 프로필 설정 페이지에서 사용되기에 인증 필요

**response**:

```
{
    "createdAt": "2025-02-05T12:33:05.115Z",
    "createdTimeSince": "1시간 전",
    "updatedAt": "2025-02-05T12:33:05.115Z",
    "isUpdated": false,
    "deletedAt": null,
    "isDeleted": false,
    "avatarId": 1,
    "nickname": "user_nickname",
    "introduce": null,
    "profileImage": null
}
```

</details>
