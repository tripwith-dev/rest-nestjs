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
    "username": "username"
  },
  "avatar": {
    "nickname": "user_nickname"
  }
}


```

**response**:

- 성공했을 경우:

```
{
    "createdAt": "2025-02-11T08:54:42.775Z",
    "updatedAt": "2025-02-11T08:54:42.000Z",
    "isUpdated": false,
    "id": 1,
    "email": "test@example.com",
    "username": "username",
    "avatar": {
        "createdAt": "2025-02-11T08:54:42.813Z",
        "updatedAt": "2025-02-11T08:54:42.813Z",
        "isUpdated": false,
        "avatarId": 1,
        "nickname": "user_nickname",
        "introduce": null,
        "profileImage": "uploads/profileImages/default.png"
    }
}

```

- 이메일 중복:

```
{
    "success": false,
    "message": "이미 존재하는 이메일입니다.",
    "error": "Unauthorized",
    "statusCode": 401
}
```

- 닉네임 중복:

```
{
    "success": false,
    "message": "이미 존재하는 닉네임입니다.",
    "error": "Unauthorized",
    "statusCode": 401
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

- 로그인 성공:

```
{
    "loginUser": {
        "createdAt": "2025-02-11T08:54:42.775Z",
        "updatedAt": "2025-02-11T08:54:42.000Z",
        "isUpdated": false,
        "id": 1,
        "email": "test@example.com",
        "username": "username",
        "avatar": {
            "createdAt": "2025-02-11T08:54:42.813Z",
            "updatedAt": "2025-02-11T08:54:42.813Z",
            "isUpdated": false,
            "avatarId": 1,
            "nickname": "user_nickname",
            "introduce": null,
            "profileImage": "uploads/profileImages/default.png"
        }
    },
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

- 아이디 잘못 입력:

```
{
    "success": false,
    "message": "해당하는 사용자를 찾을 수 없습니다.",
    "error": "Not Found",
    "statusCode": 404
}
```

- 패스워드 잘못 입력:

```
{
    "success": false,
    "message": "로그인에 실패하였습니다.",
    "error": "Unauthorized",
    "statusCode": 401
}
```

</details>

## User

<details>
  <summary>1. [인증 필요]사용자 계정 정보 조회: GET `/users/:userId`</summary>

**response**:

- 성공 했을 경우:

```
{
    "createdAt": "2025-02-11T08:54:42.775Z",
    "updatedAt": "2025-02-11T08:54:42.000Z",
    "isUpdated": false,
    "id": 1,
    "email": "test@example.com",
    "username": "username"
}
```

- jwt 토큰은 있지만, 다른 사용자의 정보를 조회했을 경우:

```
{
    "success": false,
    "message": "다른 사용자의 정보를 조회할 수 없습니다.",
    "error": "Bad Request",
    "statusCode": 400
}
```

- 인증이 안되었을 경우:

```
{
    "success": false,
    "message": "Unauthorized",
    "statusCode": 401
}
```

</details>

<details>
  <summary>3. [인증 필요]사용자 이름 변경: PATCH `/users/:userId/username`</summary>

**request**:

```
{
    "username": "newuser"
}
```

**response**:

- 성공 했을 경우:

```
{
    "createdAt": "2025-02-11T08:54:42.775Z",
    "updatedAt": "2025-02-11T08:56:40.293Z",
    "isUpdated": true,
    "id": 1,
    "email": "test@example.com",
    "username": "newuser"
}
```

- 변경 전 이름과 동일하게 변경할 경우:

```
{
    "success": false,
    "message": "동일한 이름으로 변경할 수 없습니다.",
    "error": "Bad Request",
    "statusCode": 400
}
```

- 이름 변경 조건과 맞지 않을 경우:

```
{
    "success": false,
    "message": "이름은 2~30자 이내여야 하며, 숫자와 특수기호를 포함할 수 없습니다.",
    "error": "Bad Request",
    "statusCode": 400
}
```

</details>

## Avatar

<details>
  <summary>1. 프로필 정보 조회(카테고리 포함): GET `/avatars/:avatarId`</summary>

**response**:

```
{
    "createdAt": "2025-02-11T08:54:42.813Z",
    "updatedAt": "2025-02-11T08:54:42.813Z",
    "isUpdated": false,
    "avatarId": 1,
    "nickname": "user_nickname",
    "introduce": null,
    "profileImage": "uploads/profileImages/default.png",
    "categories": [
        {
            "createdAt": "2025-02-11T08:57:09.494Z",
            "updatedAt": "2025-02-11T08:57:09.494Z",
            "isUpdated": false,
            "categoryId": 1,
            "categoryTitle": "new category"
        }
    ]
}
```

</details>

<details>
  <summary>2. [인증 필요]프로필 정보 조회(카테고리 제외): GET `/avatars/:avatarId/profile`</summary>

- 사용자 프로필 설정 페이지에서 사용되기에 인증 필요

- GET `/avatars/:avatarId` 로 어차피 조회되는데, 만들 필요가 있나 생각이 들긴 함. 카테고리를 안가져오니 전송 데이터를 줄일 수는 있겠지만, 큰 차이는 없을 듯...

**response**:

```
{
    "createdAt": "2025-02-11T08:54:42.813Z",
    "updatedAt": "2025-02-11T08:54:42.813Z",
    "isUpdated": false,
    "avatarId": 1,
    "nickname": "user_nickname",
    "introduce": null,
    "profileImage": "uploads/profileImages/default.png"
}
```

</details>

<details>
  <summary>3. [인증 필요]프로필 닉네임 변경: PATCH `/avatars/:avatarId/nickname`</summary>

**request**:

```
{
    "nickname": "new_nickname"
}
```

**response**:

- 성공 했을 경우:

```
{
    "createdAt": "2025-02-11T08:54:42.813Z",
    "updatedAt": "2025-02-11T08:57:53.699Z",
    "isUpdated": true,
    "avatarId": 1,
    "nickname": "new_nickname",
    "introduce": null,
    "profileImage": "uploads/profileImages/default.png"
}
```

- 변경 전 닉네임과 동일하게 변경할 경우:

```
{
    "success": false,
    "message": "동일한 닉네임으로 변경할 수 없습니다.",
    "error": "Bad Request",
    "statusCode": 400
}
```

- 이름 변경 조건과 맞지 않을 경우:

```
{
    "success": false,
    "message": "닉네임은 4~20자 이내여야 하며, 한글, 영어, 숫자, _, - 만 허용됩니다.",
    "error": "Bad Request",
    "statusCode": 400
}
```

</details>
<details>
  <summary>4. [인증 필요]프로필 소개글 변경: PATCH `/avatars/:avatarId/introduce`</summary>

**request**:

```
{
    "introduce": "HELLO WORLD!"
}
```

**response**:

- 성공 했을 경우:

```
{
    "createdAt": "2025-02-11T08:54:42.813Z",
    "updatedAt": "2025-02-11T08:58:07.737Z",
    "isUpdated": true,
    "avatarId": 1,
    "nickname": "new_nickname",
    "introduce": "HELLO WORLD!",
    "profileImage": "uploads/profileImages/default.png"
}
```

- 소개글 조건에 맞지 않아 실패할 경우(150자 이상):

```
{
    "statusCode": 500,
    "message": "Internal server error"
}
```

- 에러 메시지 수정 필요

</details>
<details>
  <summary>5. [인증 필요] 좋아요 누른 플랜 목록: GET `/avatars/:avatarId/like-plans`</summary>

**response**:

- 성공 했을 경우:

```
{
    "createdAt": "2025-02-11T08:54:42.813Z",
    "updatedAt": "2025-02-11T08:58:07.737Z",
    "isUpdated": true,
    "avatarId": 1,
    "nickname": "new_nickname",
    "introduce": "HELLO WORLD!",
    "profileImage": "uploads/profileImages/default.png",
    "likePlans": [
        {
            "createdAt": "2025-02-11T10:06:55.709Z",
            "updatedAt": "2025-02-11T10:06:55.709Z",
            "isUpdated": false,
            "likeId": 1,
            "avatarId": 1,
            "planId": 1
        },
        {
            "createdAt": "2025-02-11T10:07:10.523Z",
            "updatedAt": "2025-02-11T10:07:10.523Z",
            "isUpdated": false,
            "likeId": 2,
            "avatarId": 1,
            "planId": 2
        }
    ]
}
```

</details>
