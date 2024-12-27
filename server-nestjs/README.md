### Settings

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
npm i --save @nestjs/typeorm typeorm
npm i --save class-validator class-transformer
npm i --save @nestjs/config
npm i @nestjs/schedule
npm i --save mysql2
npm i bcrypt
npm i --save @nestjs/passport passport
npm i --save @nestjs/jwt passport-jwt
npm i --save-dev @types/passport-jwt
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
