## Settings

**1. NestJS 설치**

```
npm i -g @nestjs/cli
```

**2. dependency**

```
cd server-nestjs
```

우선 위와 같이 `server-nestjs` 디렉토리에 접근 후 아래 디펜던시를 설치합니다.

```
npm i
```

그 다음 위 명령어를 통해 node module을 설치해줍니다.

```
# swagger
npm i --save @nestjs/swagger swagger-ui-express
npm install @nestjs/cli
npm i --save @nestjs/typeorm typeorm
npm i --save class-validator class-transformer
npm i --save @nestjs/config
npm i @nestjs/schedule
npm i --save mysql2
npm i bcrypt
npm i --save @nestjs/passport passport
npm i --save @nestjs/jwt passport-jwt
npm i --save-dev @types/passport-jwt
npm i @nestjs/serve-static
npm i --save-dev @types/multer
```

**3. `.eslintrc.js/prettier rule`**

```
'prettier/prettier': [
    'error',
    {
        endOfLine: 'auto',
    },
],
```

## commit rules

```
init: 코드 파일(or 함수) 생성
feat(add): 기능 추가
style: 기능 변화는 없지만 코드 스타일 수정
chore: 간단한 기능 변경
fix: 에러 수정
refactor: 코드 리팩토링
test: 테스트 코드 작성 및 테스트
docs: 문서 작업
delete: 코드 파일(or 함수 등) 삭제
```
