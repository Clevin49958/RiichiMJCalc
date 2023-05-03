- [RichiiMJCalc](#richiimjcalc)
  - [Local development](#local-development)
- [立直麻将计算器](#立直麻将计算器)

# RichiiMJCalc
Point calculator for Japanese Richii Mahjong. This calculator ignores specific hand shape and only records the Han and Fu of each win.

## Local development

Requirement: 
- `NodeJs >= 16.0.0`
- Connection to a postgres database (Optional)

1. Step into the project folder, install all the required packages and generate database connection client.
```{shell}
cd .\mj-calc\
npm install
npx prisma generate
```

2. (Optional) To develop with a local database and experiment with IO from database
   1. Set up a local postgres database. 
   2. Copy and rename [`mj-calc\.env.sample`](mj-calc\.env.sample) to `mj-calc\.env` and fill in with the database connection string
   3. Run `npx prisma migrate dev` to apply all migrations to local database

3. Start the server with
```
npm start
```
For more instructions on development with a Create-React-App, refer to [`mj-calc\README.md`](mj-calc\README.md)

# 立直麻将计算器
日本立直麻将的点数计算器。该计算器忽略了指定手牌型，而只记录每次获胜的番数和符数。
