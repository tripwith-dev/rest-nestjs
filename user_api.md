## 사용자 관련 RestfulAPI

1. 회원가입: `POST auth/register/`

   - req

   ```
    {
        "email": "test@test.com",
        "password": "TEST12345^",
        "username": "테스트계정이름",
        "nickname": "테스트_계정_닉네임"
    }
   ```

   - res1: 회원가입이 성공적으로 완료된 경우

   ```
    {
        "success": true,
        "message": "회원가입에 성공하였습니다."
    }
   ```

   - res2: 회원가입에 실패한 경우

   ```
    {
        "success": false,
        "message": "회원가입에 실패하였습니다."
    }
   ```

2. 로그인: `POST auth/login/`

   - req

   ```
    {
        "email": "test@test.com",
        "password": "TEST12345^",
    }
   ```

   - res1: 로그인이 성공적으로 완료된 경우

   ```
    {
        "success": true,
        "message": "로그인에 성공하였습니다."
    }
   ```

   - res2: 로그인에 실패한 경우

   ```
    {
        "success": false,
        "message": "로그인에 실패하였습니다."
    }
   ```

3. 로그아웃: `POST auth/logout/`

4. 특정 사용자 페이지에 접근할 때(다른 사람도 접근 가능): `GET user/:userId/`

   - req

   ```
    없음
   ```

   - res

   ```
    {
        "id": 1,
        "profileImage": "xxx/xxx/xxx.png",
        "nickname": "테스트_계정_닉네임",
        "introduce": "한줄 소개",
        "createdAt": 2024-12-12,
        "categories": [
            {
                "categoryId": 1,
                "categoryTitle": "유럽 여행"
            },
            {
                "categoryId": 2,
                "categoryTitle": "미국 여행"
            }
        ]
    }
   ```

5. 계정 정보에 접근(자기 자신만 가능): `GET setting/my/account`

   - req

   ```
   없음
   ```

   - res

   ```
    "email": "test@test.com"
   ```

6. 프로필 정보에 접근(자기 자신만 가능): `GET setting/my/profile`

   - req

   ```
   없음
   ```

   - res

   ```
        "id": 1,
        "profileImage": "xxx/xxx/xxx.png",
        "nickname": "테스트_계정_닉네임",
        "username": "테스트계정이름",
        "introduce": "한줄 소개"
   ```

7. 패스워드 변경
   PATCH setting/my/account/password

8. ID(email)찾기
   -> 사용자가 맞는지 인증: POST setting/my/account/findEmail
   -> 맞다면 email 반환: 4번에서 만든 GET setting/my/account/

9. 닉네임 변경
   -> PATCH setting/my/profile/nickname

10. 이름 변경
    -> PATCH setting/my/profile/username

11. 회원 탈퇴
    -> PATCH setting/my/account -> isDeleted = 1

---

### 카테고리
