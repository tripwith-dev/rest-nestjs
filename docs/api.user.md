# User API 문서

## Auth

<details>
  <summary>1. 회원가입: `/auth/register`</summary>
  
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
  <summary>2. 로그인: `/auth/login`</summary>
  
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
  <summary>1. 사용자 조회(테스트용): `verify-users/:userId`</summary>
  
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
  <summary>2. 로그인: `/auth/login`</summary>
  
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
