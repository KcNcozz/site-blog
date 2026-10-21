# Mysql

## Review

DDL 管结构, 记成“建、改、删、清”：

```
建表 CREATE
改表 ALTER
删表 DROP
清空 TRUNCATE
```

DML 管数据, 记成“增、查、改、删”：

```
增加 INSERT
查询 SELECT
修改 UPDATE
删除 DELETE
```

常用模板只记这四个：

```sql
# 增
INSERT INTO 表名 (字段) VALUES (值);

# 查
SELECT 字段 FROM 表名 WHERE 条件;

# 改
UPDATE 表名 SET 字段 = 值 WHERE 条件;

# 删
DELETE FROM 表名 WHERE 条件;
```

最容易混淆的是：

| 语句                   | 删除什么               |
| ---------------------- | ---------------------- |
| `DELETE FROM users`    | 删除数据, 保留表       |
| `TRUNCATE TABLE users` | 快速清空整张表, 保留表 |
| `DROP TABLE users`     | 连表结构一起删除       |

## DDL (Data Definition Language)

```sql
# show database
show databases;

# create database
create database student;

create database if not exists student;

# set up charset
create database if not exists  student charset=utf8mb4;

# delete database
drop database student;

drop database if exists student;

# demonstrate how this database is created
show create database student;

# revise database chatset
alter database student charset=gbk
```

> 在 MySQL 中, `CREATE SCHEMA` 和 `CREATE DATABASE` **完全等价**, 执行效果一样. 一般选择:
>
> - 字符集: `utf8mb3`
> - 排序规则: `utf8mb3_general_ci`

## DQL (Data Quary Language)

```sql
# example
create database if not exists `frank_school` charset = gbk;

# select database
use frank_school;

# show how many tables this database has
show tables;

# create table
create table student(
    id int,
    name varchar(30),
    age int
);

# If a keyword is used, it must be enclosed in backticks(``).
create table if not exists teacher(
    # 自增 主键 注释
    id int auto_increment primary key comment '主键ID',
    name varchar(30) not null comment '教师名字',
    phone varchar(20) comment '电话号码',
    address varchar(100) default 'China Mainland' comment '住址'
) engine = innodb;

# show create table student;
# show create table teacher;

# describe table
desc teacher;


create table ooo(
    id int
);

# delete table
drop  table student;

drop table if exists stu;

# delete multiple tables at once
drop table if exists school, ooo;

# example
create table ttt(
    id int(4)
);

desc ttt;

# modify table --> add a field
alter table ttt add phone varchar(20);

# add a field after id
alter table ttt add name varchar(30) after id;

# add a field at the beginning
alter table ttt add main_id varchar(30) first;

# delete a field
alter table ttt drop main_id;

# modify a field name/type (Modify both the name and type simultaneously)
# Even if only the name is being modified, the type still needs to be specified.
alter table ttt change phone tel_phone int(11);

# modify a field type
alter table ttt modify tel_phone varchar(15);

# modify table name
alter table ttt rename to xxx
```

## DML (Data Manipulation Language)

```sql
desc teacher;

# insert data
insert into teacher (id, name, phone, address) values (1, 'Mike', '1888', 'China Mainland');

insert into teacher values (2, 'John', '1999', 'USA');

insert into teacher values (null, 'Tom', null, null);

insert into teacher   (name, phone, address) values ('zhangsan', '11111', default);

# select data
select * from student;

# insert multiple data at once
insert into teacher values (null, 'Tom', null, null),(null,'Jerry',null,null);

# delete data
delete from teacher where id=6;

delete from teacher where name='Tom';

# delete all data
# Using this command will reset the primary key counter.
truncate table teacher;

# example

select * from student;

insert into teacher (id, name, phone, address)
values (4,'tom', 20, 'China'), (5, 'jack', 21, 'China Taiwan'), (6,'zhangsan', 24, 'UK');

delete from student where  age>=24;

# update data
select * from teacher;

update teacher set name = 'frank' where id = 4;

update teacher set address = 'China Mainland' where id = 4;

update teacher set phone = '1111' where phone = 20 or phone = 21 or phone = 24;

update teacher set address = 'China Hongkong' where phone = '1111' and address = 'China Taiwan';

# Read
show tables;

desc teacher;

select phone, address from teacher;
```

## DCL (Database Control Language)

### 管理用户

```sql
use mysql;

# 查询用户
select * from user;

# 创建用户
create user 'test'@'localhost' identified by '654321';
# 通配主机
create user 'test'@'%' identified by '654321';

# 修改用户密码
ALTER USER 'test'@'localhost' IDENTIFIED BY '123456';

# 删除用户
drop user 'test'@'localhost';
```

### 权限控制

MySQL中定义了很多种权限, 但是常用的就以下几种:

| 权限                | 说明               |
| ------------------- | ------------------ |
| ALL, ALL PRIVILEGES | 所有权限           |
| SELECT              | 查询数据           |
| INSERT              | 插入数据           |
| UPDATE              | 修改数据           |
| DELETE              | 删除数据           |
| ALTER               | 修改表             |
| DROP                | 删除数据库/表/视图 |
| CREATE              | 创建数据库/表      |

```sql
# 查询权限
show grants for 'admin';

# 授予权限
grant all on itheima.* to 'admin'@'%';

# 撤销权限
revoke all on itheima.* from 'admin'@'%';
```

## Mysql Data types

### Character encoding

User can use:`show variables like 'character_set_%'` to show Data type, attention: `character_set_client`and `character_set_client`.And also use `set character_set_client=gbk` to reset it.

> **没有统一标准, 但是应该符合业务项目逻辑标准**

适用版本：**MySQL 8.0 / 8.4**.

MySQL 数据类型分为五大类：**数值类型、日期和时间类型、字符串类型、空间类型、JSON 类型**. 常说的“数值、日期时间、字符串三类”属于基础分类, 不是完整分类.

本文按五类分别整理一张对比表, 重点比较取值范围、存储大小、处理方式和使用场景.

统一说明：

- **B 表示字节, 1 B = 8 bit. ** 1 KiB = 1,024 B, 1 MiB = 1,024 KiB, 1 GiB = 1,024 MiB.
- 表中的存储大小指数据类型的基本存储需求, 不包括行头、索引等额外开销；实际磁盘占用还与存储引擎、行格式有关.
- 文中的“有符号”表示可存负数；“无符号”表示不能存负数.
- **类型名后的括号没有统一含义. ** 整数的旧式括号表示显示宽度, 字符串常用括号指定长度, `DECIMAL` 的括号指定精度, 时间类型的括号指定小数秒位数；必须结合类型判断.

官方参考：[数据类型分类](https://dev.mysql.com/doc/refman/8.4/en/data-types.html)、[存储需求](https://dev.mysql.com/doc/refman/8.4/en/storage-requirements.html).

### 1 数值类型

数值类型主要分为整数、定点数、浮点数和位类型. 比较时重点关注：**是否精确、取值范围、存储空间**.

| 类型                            | 存储大小              | 范围或精度                                                      | 主要区别与用途                                           |
| ------------------------------- | --------------------- | --------------------------------------------------------------- | -------------------------------------------------------- |
| `TINYINT`                       | 1 B                   | 有符号：−128～127；无符号：0～255                               | 最小整数类型；适合年龄、较少的状态编码                   |
| `SMALLINT`                      | 2 B                   | 有符号：−32,768～32,767；无符号：0～65,535                      | 比 `TINYINT` 范围大；适合较小的计数                      |
| `MEDIUMINT`                     | 3 B                   | 有符号：−8,388,608～8,388,607；无符号：0～16,777,215            | 范围介于 `SMALLINT` 和 `INT` 之间                        |
| `INT` / `INTEGER`               | 4 B                   | 有符号：−2,147,483,648～2,147,483,647；无符号：0～4,294,967,295 | 常用整数类型；两种名称完全等价                           |
| `BIGINT`                        | 8 B                   | 有符号：−2⁶³～2⁶³−1；无符号：0～2⁶⁴−1                           | 整数范围最大；适合大编号、大计数                         |
| `FLOAT`                         | 4 B                   | 单精度, 约 6～7 位十进制有效数字                                | 保存近似数值；空间较小, 但精度较低, 适合允许误差的测量值 |
| `DOUBLE`                        | 8 B                   | 双精度, 约 15～16 位十进制有效数字                              | 比 `FLOAT` 范围和精度更大, 但仍可能存在舍入误差          |
| `DECIMAL(M,D)` / `NUMERIC(M,D)` | 由 `M、D` 决定        | `M` 为总位数, 最多 65；`D` 为小数位数, 最多 30, 且 `D ≤ M`      | 保存指定精度的精确十进制数；适合金额；两种名称等价       |
| `BIT(M)`                        | 约为 `M/8` 向上取整 B | `M` 为二进制位数, 范围 1～64, 省略时为 1                        | 保存位串, 例如 `b'1010'`；适合多个开关状态               |
| `BOOL` / `BOOLEAN`              | 1 B                   | 实际范围与 `TINYINT` 相同                                       | 都是 `TINYINT(1)` 的别名；习惯用 0、1 表示假、真         |

#### 重点区别

- **整数默认有符号. ** 加 `UNSIGNED` 后不能保存负数, 但正数范围扩大, 占用字节数不变. 例如 `INT UNSIGNED` 的范围为 0～4,294,967,295.
- **有效数字不等于小数位数. ** 浮点数的精度描述针对整个数值的有效数字, 不是保证小数点后有这么多位.
- **金额通常使用 `DECIMAL`. ** `FLOAT`、`DOUBLE` 是近似值, 不适合要求十进制精确表示的金额字段.
- **`DECIMAL(10,2)` 是总共 10 位, 其中小数 2 位、整数最多 8 位. ** 不是“整数 10 位再加小数 2 位”；其有符号范围为 −99,999,999.99～99,999,999.99.
- **`DECIMAL` 的参数可省略, 但通常应明确填写. ** 裸写 `DECIMAL` 等价于 `DECIMAL(10,0)`；只写 `DECIMAL(6)` 等价于 `DECIMAL(6,0)`. 如果需要两位小数, 应明确写成 `DECIMAL(6,2)`, 此时整数部分最多 4 位, 范围为 −9,999.99～9,999.99.
- **`INT(11)` 不表示只能存 11 位数字, 也不表示占 11 字节. ** 括号曾表示显示宽度, 该属性已**弃用**；`INT` 仍占 4 B.
- **`INT(6)` 与 `INT` 的存储空间和取值范围相同. ** 两者都占 4 B；`INT(6)` 可以保存 `1234567`, 因为括号中的 6 不限制数字最多只能有 6 位, 也不会截断超出显示宽度的值. \*\*\*\*
- **`SMALLINT`、`TINYINT` 等整数类型也可以使用旧式显示宽度. ** 例如 `SMALLINT(6)`、`TINYINT(6)`, 但它们仍分别占 2 B、1 B. `TINYINT(6)` 不能因此准确保存 `123456`；有符号 `TINYINT` 的范围仍是 −128～127.
- **显示宽度不是自动补零规则. ** 普通 `INT(6)` 不会自动把 `123` 补成 `000123`, 客户端也可能忽略显示宽度. 旧写法 `INT(6) ZEROFILL` 才用于补零显示, 而且会隐含 `UNSIGNED`；显示宽度和 `ZEROFILL` 都已弃用, 新表建议直接写 `INT`、`SMALLINT`、`TINYINT` 等类型名.
- **业务范围应使用约束, 而不是整数后的括号. ** 如果要求非空且取值在 0～999999, 可以定义 `quantity INT NOT NULL CHECK (quantity BETWEEN 0 AND 999999)`；如果要求恰好六位正整数, 则使用 100000～999999. MySQL 从 8.0.16 开始执行 `CHECK` 约束；仅有 `CHECK` 并不会自动禁止 SQL `NULL`, 因此需要时应同时声明 `NOT NULL`.
- **`BOOLEAN` 不会自动限制只能存 0 和 1. ** 如需强制限制, 应增加约束；在布尔判断中, 0 为假, 非零值为真.
- **`TINYINT(1)` 的 1 也不限制只能存 0 或 1. ** 它仍能保存 `2`、`100`. 如需非空布尔值, 可定义 `enabled BOOLEAN NOT NULL CHECK (enabled IN (0,1))`.
- **`BIT(M)` 中的 `M` 则确实决定二进制位数. ** `BIT(6)` 可表示 0～63, `BIT` 默认等价于 `BIT(1)`, 不能套用整数显示宽度的解释.
- **`FLOAT`、`DOUBLE` 通常直接写类型名. ** 旧式 `FLOAT(M,D)`、`DOUBLE(M,D)` 已弃用, 不应用它们代替需要固定小数位的 `DECIMAL(M,D)`；另有 `FLOAT(p)` 精度语法, 其中的 `p` 也不是整数显示宽度.
- 其他常见别名：`DEC`、`FIXED` 也是 `DECIMAL` 的别名；`DOUBLE PRECISION` 等价于 `DOUBLE`. `REAL` 默认对应 `DOUBLE`, 但启用 `REAL_AS_FLOAT` 模式时对应 `FLOAT`.

官方参考：[整数范围](https://dev.mysql.com/doc/refman/8.4/en/integer-types.html)、[定点数](https://dev.mysql.com/doc/refman/8.4/en/fixed-point-types.html)、[浮点数](https://dev.mysql.com/doc/refman/8.4/en/floating-point-types.html)、[数值语法与别名](https://dev.mysql.com/doc/refman/8.4/en/numeric-type-syntax.html).
补充参考：[整数显示宽度与 ZEROFILL](https://dev.mysql.com/doc/refman/8.4/en/numeric-type-attributes.html)、[CHECK 约束及版本要求](https://dev.mysql.com/doc/refman/8.0/en/create-table-check-constraints.html).

### 2 日期和时间类型

这一类主要比较：**保存哪些时间信息、范围大小、是否进行时区转换**.

下表按**不带小数秒**列出大小和范围；不展开受 SQL 模式影响的零日期、无效日期等特殊情况.

| 类型        | 基本大小 | 保存内容与范围                                             | 主要区别                                                           | 常见用途                       |
| ----------- | -------- | ---------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------ |
| `YEAR`      | 1 B      | 年份；1901～2155, 另支持 `0000`                            | 只有年份；不能保存任意四位年份                                     | 毕业年份、生产年份             |
| `DATE`      | 3 B      | 年月日；`1000-01-01`～`9999-12-31`                         | 没有时分秒                                                         | 生日、业务日期                 |
| `TIME`      | 3 B      | 时分秒；`-838:59:59`～`838:59:59`                          | 可表示一天中的时间, 也可表示时长；允许负数和超过 24 小时           | 营业时间、累计耗时             |
| `DATETIME`  | 5 B      | 年月日时分秒；`1000-01-01 00:00:00`～`9999-12-31 23:59:59` | 范围较大；不会随着读取会话的时区自动换算                           | 预约日期时间、业务时间         |
| `TIMESTAMP` | 4 B      | UTC 范围：`1970-01-01 00:00:01`～`2038-01-19 03:14:07`     | 写入时按会话时区转成 UTC, 读取时再转回会话时区；有 2038 年范围限制 | 范围内的事件发生时刻、日志时间 |

#### 重点区别

- **`DATE` 只保存日期, `DATETIME` 同时保存日期和时间. ** 不需要时分秒时, 使用 `DATE` 更清楚.
- **`TIME` 不只是钟表上的时间. ** 例如 `36:00:00` 可以表示 36 小时, 负值可以表示负时长.
- **`DATETIME` 不带小数秒时占 5 B, 不是 8 B. ** 8 B 是旧版本资料中的常见说法.
- **`TIMESTAMP` 表示同一时刻时, 不同会话时区可以显示不同的当地时间. ** `DATETIME` 不会因读取会话的时区变化而自动换算；两者都不保存原始时区名称.
- **小数秒精度 `fsp` 为 0～6, 默认 0. ** `TIME(fsp)`、`DATETIME(fsp)`、`TIMESTAMP(fsp)` 均支持. 精度为 1～2、3～4、5～6 位时, 分别额外占 1、2、3 B；例如 `DATETIME(6)` 占 8 B.
- **时间类型不写括号时, 默认小数秒精度为 0. ** `DATETIME` 等价于 `DATETIME(0)`；`DATETIME(3)` 可记录到毫秒, 例如 `2026-09-16 12:30:45.123`；`DATETIME(6)` 可记录到微秒, 例如 `2026-09-16 12:30:45.123456`. 括号中的数字不表示整个日期字符串的长度.
- **小数秒参数只适用于 `TIME`、`DATETIME`、`TIMESTAMP`. ** `DATE` 不使用这种参数；年份字段推荐直接写 `YEAR`, 不要把旧写法 `YEAR(4)` 理解为可以自由设置年份位数.
- **自动记录创建时间、更新时间不是 `TIMESTAMP` 独有的能力. ** `DATETIME` 和 `TIMESTAMP` 都可以通过 `DEFAULT CURRENT_TIMESTAMP`、`ON UPDATE CURRENT_TIMESTAMP` 配置, 不能仅凭类型名判断是否自动更新.

官方参考：[DATE DATETIME TIMESTAMP](https://dev.mysql.com/doc/refman/8.4/en/datetime.html)、[TIME](https://dev.mysql.com/doc/refman/8.4/en/time.html)、[YEAR](https://dev.mysql.com/doc/refman/8.4/en/year.html)、[存储需求](https://dev.mysql.com/doc/refman/8.4/en/storage-requirements.html)、[自动初始化与更新](https://dev.mysql.com/doc/refman/8.4/en/timestamp-initialization.html).
补充参考：[小数秒精度](https://dev.mysql.com/doc/refman/8.4/en/fractional-seconds.html).

### 3 字符串类型

字符串类型既包括**字符字符串**, 也包括**二进制字节串**. 比较时主要关注：保存字符还是字节、定长还是变长、容量大小.

下表中 `L` 表示实际内容的字节数；`L + n B` 是数据加长度前缀的常用存储计算方式. `VARCHAR` 和 `VARBINARY` 的长度前缀使用 1 B 还是 2 B, 取决于列允许的最大字节长度, 而不是只看当前这条值的长度.

| 类型                  | 保存内容             | 长度或容量上限                                                 | 存储特点与主要区别                                                                             |
| --------------------- | -------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `CHAR(M)`             | 字符                 | `M` 为 0～255 个字符                                           | 定长；不足时补空格, 读取时通常移除尾随空格；适合长度固定的代码；实际字节数受字符集和行格式影响 |
| `VARCHAR(M)`          | 字符                 | `M` 按字符指定；实际最大值受字符集及整行 65,535 B 上限约束     | 变长；通常为 `L + 1/2 B`；不补空格, 保留尾随空格；适合姓名、地址                               |
| `TINYTEXT`            | 文本                 | 255 B                                                          | 变长, `L + 1 B`；TEXT 系列中容量最小                                                           |
| `TEXT`                | 文本                 | 65,535 B, 即 64 KiB − 1 B                                      | 变长, `L + 2 B`；适合一般文章、说明                                                            |
| `MEDIUMTEXT`          | 文本                 | 16,777,215 B, 即 16 MiB − 1 B                                  | 变长, `L + 3 B`；适合较长文本                                                                  |
| `LONGTEXT`            | 文本                 | 4,294,967,295 B, 即 4 GiB − 1 B                                | 变长, `L + 4 B`；TEXT 系列中容量最大                                                           |
| `BINARY(M)`           | 二进制字节           | `M` 为 0～255 B                                                | 定长, 占 `M B`；不足时补 `0x00`；适合固定长度二进制标识                                        |
| `VARBINARY(M)`        | 二进制字节           | `M` 按字节指定；受整行 65,535 B 上限约束, 需扣除其他字段及开销 | 变长, 通常为 `L + 1/2 B`；不补零；适合变长二进制数据                                           |
| `TINYBLOB`            | 二进制字节           | 255 B                                                          | 变长, `L + 1 B`；与 `TINYTEXT` 容量相同, 但按字节处理                                          |
| `BLOB`                | 二进制字节           | 65,535 B, 即 64 KiB − 1 B                                      | 变长, `L + 2 B`；与 `TEXT` 容量相同                                                            |
| `MEDIUMBLOB`          | 二进制字节           | 16,777,215 B, 即 16 MiB − 1 B                                  | 变长, `L + 3 B`；与 `MEDIUMTEXT` 容量相同                                                      |
| `LONGBLOB`            | 二进制字节           | 4,294,967,295 B, 即 4 GiB − 1 B                                | 变长, `L + 4 B`；与 `LONGTEXT` 容量相同                                                        |
| `ENUM('值1','值2',…)` | 预定义字符串中的一个 | 最多定义 65,535 个不同候选值                                   | 占 1 或 2 B；单选, 内部保存候选值的编号；适合有限且稳定的状态值                                |
| `SET('值1','值2',…)`  | 预定义字符串的组合   | 最多定义 64 个不同成员                                         | 占 1、2、3、4 或 8 B；可选零个、一个或多个, 内部按位记录                                       |

> 1. `enum`类型:每个值其实是按照编号存的, 从1开始, 以此类推...
> 2. 对于`set`类型, 插入的时候应该是: `insert into student values('IT, 经济学')` 要在同一个引号当中写.

#### 重点区别

- **字符数不等于字节数. ** `VARCHAR(100)` 最多存 100 个字符；`TEXT` 的 65,535 上限是字节数. `utf8mb4` 中一个字符最多占 4 B, 不能把容量上限直接当作汉字个数.
- **建表时, `VARCHAR(n)` 和 `VARBINARY(n)` 必须指定长度. ** 前者的 `n` 表示最多多少个字符, 后者表示最多多少个字节. 例如 `name VARCHAR(6)` 最多保存 6 个字符, `data VARBINARY(6)` 最多保存 6 个字节；这与 `INT(6)` 完全不同.
- **`CHAR(n)` 和 `BINARY(n)` 的长度可省略, 但通常应明确写出. ** 裸写 `CHAR` 等价于 `CHAR(1)`, 裸写 `BINARY` 等价于 `BINARY(1)`；前者按字符计, 后者按字节计.
- **不能把 `VARCHAR` 简单记成“最多 65,535 个字符”. ** 行大小限制以字节计算, 还要与其他字段共享空间, 实际可声明长度也受字符集影响.
- **`CHAR` 与 `VARCHAR` 的重点是定长和变长, 以及尾随空格行为. ** 不能简单记成“`CHAR` 一定比 `VARCHAR` 快”.
- **字符串长度上限不等于必须输入这么多字符. ** `CHAR(6)` 可以接收更短的字符串并补空格, `VARCHAR(6)` 可以保存 0～6 个字符；它们也不会自动要求内容全部为数字. 如果代码必须保留前导零, 例如 `000123`, 应使用字符类型, 并在需要时另加长度及格式校验.
- **`TEXT` 与 `BLOB` 的重点是处理方式. ** `TEXT` 按字符集、排序规则处理文本；`BLOB` 按原始字节比较. 两组同级类型的容量上限相同.
- **`BINARY` 补的是零字节 `0x00`, 不是字符 `'0'`. ** `VARBINARY` 不会自动补齐, `BINARY` 补入的零字节在读取时也不会自动删除.
- **`ENUM` 是单选, `SET` 是多选. ** 例如 `ENUM('未支付','已支付')` 选择一个状态；`SET('读','写','执行')` 可以保存 `'读,写'`, 也可以保存空集合 `''`.
- **`ENUM(...)` 和 `SET(...)` 的括号中填写候选字符串, 不是长度. ** 使用这两种类型时需要列出允许值, 例如 `ENUM('A','B')`, 不能把 `ENUM(2)` 当作“长度为 2”的字符串类型.
- **排序和去重要注意. ** `ENUM` 默认按内部编号排序, 不是按文字字典序；`SET` 会去重, 并按定义顺序返回成员.
- 表中的大容量是类型上限, 实际读写还受通信包大小、内存等限制.
- **`TEXT`、`BLOB` 系列通常直接按容量选择类型, 不需要写长度. ** 例如长文本使用 `TEXT` 或 `MEDIUMTEXT`. `TEXT(M)`、`BLOB(M)` 虽然存在可选长度语法, 但用于帮助 MySQL 选择足够容量的具体类型, 不能当成与 `VARCHAR(M)` 相同的精确长度限制.

官方参考：[字符串语法](https://dev.mysql.com/doc/refman/8.4/en/string-type-syntax.html)、[CHAR 与 VARCHAR](https://dev.mysql.com/doc/refman/8.4/en/char.html)、[BINARY 与 VARBINARY](https://dev.mysql.com/doc/refman/8.4/en/binary-varbinary.html)、[TEXT 与 BLOB](https://dev.mysql.com/doc/refman/8.4/en/blob.html)、[ENUM](https://dev.mysql.com/doc/refman/8.4/en/enum.html)、[SET](https://dev.mysql.com/doc/refman/8.4/en/set.html)、[存储需求](https://dev.mysql.com/doc/refman/8.4/en/storage-requirements.html).

### 4 空间类型

空间类型用于保存几何对象. 主要比较：**点、线、面, 以及是否保存集合**. 存储大小通常随坐标数量和对象复杂程度变化, 不是统一的固定字节数.

| 类型                 | 表示什么           | 与其他类型的区别                                 | 常见用途                       |
| -------------------- | ------------------ | ------------------------------------------------ | ------------------------------ |
| `GEOMETRY`           | 任意受支持的几何值 | 通用类型；可以保存点、线、面, 也可以保存几何集合 | 同一列可能出现不同几何类型     |
| `POINT`              | 一个点             | 单个位置, 没有长度和面积                         | 门店位置、设备位置             |
| `LINESTRING`         | 一条折线           | 由有顺序的多个点连接而成；不等于彼此独立的多个点 | 道路、行驶轨迹                 |
| `POLYGON`            | 一个多边形区域     | 有边界和面积；可以有内环, 即区域内部的孔洞       | 围栏、地块、行政区域           |
| `MULTIPOINT`         | 点的集合           | 集合中的成员只能是点, 点之间不自动连接           | 多个门店、多个采样点           |
| `MULTILINESTRING`    | 线的集合           | 集合中的成员只能是线, 每条线可独立存在           | 多条道路、多段轨迹             |
| `MULTIPOLYGON`       | 面的集合           | 集合中的成员只能是多边形                         | 多块地块、多个岛屿区域         |
| `GEOMETRYCOLLECTION` | 几何对象的集合     | 成员可以混合不同几何类型, 例如点、线、面         | 同时包含位置、路线和区域的数据 |

#### 重点区别

- **`GEOMETRY` 是通用列类型. ** 表示“这一列允许存任意受支持的几何值”, 包括集合.
- **`GEOMETRYCOLLECTION` 是集合类型. ** 表示“这一条值本身就是一个几何集合”, 集合成员可以混合类型.
- **`MULTI` 系列是同类集合. ** `MULTIPOINT` 只含点, `MULTILINESTRING` 只含线, `MULTIPOLYGON` 只含面.
- **`MULTIPOINT` 与 `LINESTRING` 都含多个点, 但含义不同. ** 前者是独立点集合, 后者按顺序把点连接成线.
- 地理坐标的实际含义还取决于空间参考系统, 不能只看数据类型名称.
- **空间列类型不通过长度括号声明. ** 例如字段定义为 `location POINT`；构造几何值时的 `POINT(120,30)` 是函数调用, 括号中的内容是坐标参数, 不是给 `POINT` 类型指定长度.

官方参考：[空间类型总览](https://dev.mysql.com/doc/refman/8.4/en/spatial-type-overview.html)、[几何模型](https://dev.mysql.com/doc/refman/8.4/en/opengis-geometry-model.html)、[空间参考系统](https://dev.mysql.com/doc/refman/8.4/en/spatial-reference-systems.html).

### 5 JSON 类型

**这一类只有 `JSON` 一种列类型**, 因此下表按关键特性整理.

对象、数组、字符串、数字、布尔值、JSON `null` 是 JSON 内部的值类型, 不是六种独立的 MySQL 列类型. `JSON` 与用 `TEXT` 保存 JSON 文本的主要差别, 在于自动校验和内部存储方式.

| 比较项目   | `JSON` 的特点                                             | 示例或需要区分的地方                                                  |
| ---------- | --------------------------------------------------------- | --------------------------------------------------------------------- |
| 列定义     | 使用 `JSON` 声明                                          | `info JSON`                                                           |
| 可保存内容 | 对象、数组、字符串、数字、布尔值、JSON `null`, 并允许嵌套 | `{"name":"张三","tags":["学生","会员"]}`                              |
| 格式校验   | 写入时自动检查 JSON 是否合法, 非法内容会报错              | `{"age":18}` 合法；`{age:18}` 不合法                                  |
| 业务校验   | 格式合法不代表符合业务要求                                | 即使缺少业务必需的 `name` 字段, 仍可能是合法 JSON                     |
| 存储方式   | 使用内部二进制格式, 便于访问内部元素                      | 不保证保留输入文本原来的空格、排版                                    |
| 查询内部值 | 支持按 JSON 路径提取                                      | `info->'$.name'` 提取 JSON 值；`info->>'$.name'` 提取并去除字符串引号 |
| 修改内部值 | 支持通过函数修改成员                                      | `JSON_SET(info, '$.age', 20)` 返回修改后的文档；配合 `UPDATE` 保存    |
| 索引       | 不能直接给整个 JSON 列建立普通索引；可以对提取值建立索引  | 例如把 `age` 提取到生成列, 再给该列建索引                             |
| 空值       | JSON `null` 与 SQL `NULL` 不同                            | JSON `null` 是文档中的合法值；SQL `NULL` 表示该列没有值               |
| 大小       | 随内容变化；存入文档受 `max_allowed_packet` 限制          | 可用 `JSON_STORAGE_SIZE(info)` 查看存储大小                           |
| 常见用途   | 结构可变、可嵌套的属性数据                                | 商品扩展属性、用户偏好、配置数据                                      |

#### 重点区别

- **JSON 不等于普通文本. ** 向 `TEXT` 写入内容不会自动要求它是合法 JSON；`JSON` 列会进行 JSON 格式校验.
- **`JSON` 不带长度参数. ** 字段定义写成 `info JSON`, 不是 `JSON(100)`；如果需要限制内容长度、字段是否存在或字段取值, 应另行定义业务校验或约束.
- **JSON 字符串与 JSON 数字不同. ** 文档中的 `"18"` 是字符串, `18` 是数字；`"true"` 是字符串, `true` 是布尔值.
- **JSON `null` 与 SQL `NULL` 不同. ** 向 JSON 列写入 `'null'` 会存入 JSON 空值；写入 SQL `NULL` 则表示该列没有值, 前提是列允许为空.
- **修改函数不等于自动保存. ** `JSON_SET()` 返回修改后的文档, 需配合 `UPDATE` 等写入操作才会持久化.
- JSON 可以容纳灵活属性, 但经常用于筛选、关联且结构稳定的核心字段, 通常仍适合建成独立列.

官方参考：[JSON 类型](https://dev.mysql.com/doc/refman/8.4/en/json.html)、[JSON 查询函数](https://dev.mysql.com/doc/refman/8.4/en/json-search-functions.html)、[JSON 修改函数](https://dev.mysql.com/doc/refman/8.4/en/json-modification-functions.html)、[JSON 属性函数](https://dev.mysql.com/doc/refman/8.4/en/json-attribute-functions.html).

## 约束 (列属性问题)

`Not Null`, `Default`, `auto_increment`这些列的属性需要根据实际业务来决定.

| 约束                        | 描述                                                     | 关键字        |
| --------------------------- | -------------------------------------------------------- | ------------- |
| 非空约束                    | 限制该字段的数据不能为 `null`                            | `NOT NULL`    |
| 唯一约束                    | 保证该字段的所有数据都是唯一、不重复的                   | `UNIQUE`      |
| 主键约束                    | 主键是一行数据的唯一标识, 要求非空且唯一                 | `PRIMARY KEY` |
| 默认约束                    | 保存数据时, 如果未指定该字段的值, 则采用默认值           | `DEFAULT`     |
| 检查约束（8.0.16 版本之后） | 保证字段值满足某一个条件                                 | `CHECK`       |
| 外键约束                    | 用来让两张表的数据之间建立连接, 保证数据的一致性和完整性 | `FOREIGN KEY` |

### Primary Key 主键

#### 主键的作用

1. 唯一标识记录（实体完整性）
   - 表中的每一行必须能被唯一区分
   - 主键值在整个表中不允许重复
   - 例如：`student_id = 20240001` 在学生表中只能出现一次

2. 非空约束（NOT NULL）

- 主键列不允许出现 `NULL` 值

- 因为"未知"的记录无法被唯一标识

- 理论来说主键不能为`Null`, 除非设置了自增

3. 一张表只能有一个主键

- 但主键可以是**单列**（如 `id INT PRIMARY KEY`）
- 也可以是**多列组合**（复合主键, 如 `(order_id, product_id)`）

4. 建立表与表之间的关联

主键通常被其他表作为**外键（Foreign Key）**引用, 形成参照完整性. 例如：

```sql
# orders 表中的 user_id 引用 users 表的主键
orders.user_id  →  users.id
```

5. 提升查询性能

- 在大多数数据库中（如 MySQL InnoDB、SQL Server）, 主键默认是**聚簇索引（Clustered Index）**

- 数据行物理上按主键顺序存储, 加快基于主键的 `SELECT`、范围查询、排序的速度

6. 数据复制的依据

- 主从复制、binlog 定位、Change Data Capture 等场景常以主键作为定位记录的基准

```sql
show databases;

create table t_8(
    id int,
    name varchar(20)
);

desc t_8;

# 设置ID为主键
alter table t_8 add primary key (id);

# 删除主键
alter table t_8 drop primary key;

# 设置为复合主键
alter table t_8 add primary key (id, name);

```

#### 复合主键: 场景

订单明细表, 一张订单包含多个商品, 所以需要一张"订单明细表"：

| 订单号 | 商品编号 | 数量 |
| ------ | -------- | ---- |
| O001   | P100     | 2    |
| O001   | P200     | 1    |
| O002   | P100     | 5    |
| O003   | P100     | 1    |

分析：

- 只看"订单号"：`O001` 出现两次, **不能唯一标识**
- 只看"商品编号"：`P100` 出现三次, **不能唯一标识**
- **但"订单号 + 商品编号"组合起来**, 每一行都唯一

所以这张表的主键是 **`(订单号, 商品编号)` 这两列一起**——这就是**复合主键**.

> 1. 复合主键是多个字段但是仍然属于一个主键.
> 2. 现在用的比较少, 但是确实是可以用的.

### Unique Key 唯一键

作用: 唯一键是数据库中用于确保某列（或列组合）的值**不允许重复**的约束. 它和主键很像, 但定位不同.

#### 核心作用

1. 保证值的唯一性

- 该列（或列组合）中的值**不能出现重复**
- 和主键一样具有唯一性

2. 允许 NULL 值（关键区别）

- 主键：`NOT NULL`, 必须有值
- 唯一键：**允许 NULL**, 且允许多个 NULL 存在（因为 NULL 不等于 NULL）

3. 一张表可以有多个唯一键

- 主键：一表只有一个
- 唯一键：一表可以有多个

#### 与主键的对比

| 特性         | Primary Key | Unique Key                          |
| ------------ | ----------- | ----------------------------------- |
| 唯一性       | 是          | 是                                  |
| 允许 NULL    | 不允许      | 允许（多个 NULL）                   |
| 每张表数量   | 只能 1 个   | 可以有多个                          |
| 是否聚簇索引 | 默认是      | 默认不是（InnoDB 中其实是辅助索引） |
| 用途         | 标识记录    | 业务唯一性约束                      |

#### 实际例子

```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,   -- 主键：物理标识
    email VARCHAR(100) UNIQUE,              -- 唯一键：邮箱不能重复
    phone VARCHAR(20) UNIQUE,               -- 唯一键：手机号不能重复
    name VARCHAR(50)
);
```

这里的意图很清晰：

- `id`：数据库内部用来唯一标识一行（无业务意义）, 适合做主键
- `email`：业务上要求不能重复, 注册时必须校验
- `phone`：业务上也不能重复

#### 复合唯一键

```sql
-- 同一用户不能重复收藏同一篇文章
CREATE TABLE user_article_favorite (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    article_id BIGINT,
    # uk_user_article是这个唯一索引的名称
    UNIQUE KEY uk_user_article (user_id, article_id)
);
```

1. 提升查询性能

- 唯一键会自动创建索引
- `SELECT * FROM users WHERE email = 'xxx@xx.com'` 会走唯一索引, 查询极快

2. 作为外键被引用

- 其他表的外键不一定非要引用主键, 也可以引用唯一键
- 例如：`orders` 表可以引用 `users.email` 作为关联字段（虽然不推荐）

3. 实现业务唯一性约束

- 业务上"身份证号唯一"、"用户名唯一"、"工号唯一"等, 都用唯一键实现

> 唯一键只在当前表里表现, 不会和其他的表关联.

```sql
show databases;

create table t_10(
    id int ,
    phone varchar(20)
    );

desc t_10;

# add unique key
alter table t_10 add unique(phone);

# delete
alter table t_10 drop index phone;

show create table t_10;
```

### 注释

- SQL内注释 `commit` 关键字
- 代码注释 这种注释可以不用管

### 外键

> 学生表和食堂订单数据表, 应该存在某种关联. 那么这种关联是什么? 主表? 从表?

外键（`Foreign Key`）用于保证表之间的数据关系有效.

```sql
show databases;

# 学生表
create table stu(
    stu_id int primary key ,
    name varchar(20)
    );

# 食堂订单表 在创建时直接创建外键
create table eatery(
    id int primary key ,
    price decimal(10, 4),
    stuId int ,
    foreign key (stuId) references stu(stu_id)
);

# 食堂表2
create table eatery2(
        id int primary key ,
        price decimal(10, 4),
        stuId int
);

# 后期添加外键
alter table eatery2 add foreign key (stuId) references stu (stu_id);

# 先查看外键名 查外键也是这个方法
show create table eatery2;

# 删除外键 注意外键的名字
alter table eatery2 drop foreign key eatery2_ibfk_1;

desc eatery2;
```

#### 外键的三种操作

- 严格操作 (上面的就是外键的严格操作)
- 置空操作
- 级联操作

这几个是什么意思? 比如学生表 (主表) 和学生食堂消费表 (从表) , 现在学生表中删除一名学生, 那么学生食堂消费表该怎么操作? 有两种操作方式: 置空和级联. 如果是**置空**: 那么当学生表中的数据被删除了, 那么默认与它绑定外键的值改为**NULL**, 如果是**级联**: 那么就是当学生表被删除或者修改的时候, 关联表中的数据也会被删除或者跟着被修改. 因此在删除的时候, 我们一般都使用**置空**.

```sql
show tables;

create table stu(
    stuId int primary key,
    name varchar(20)
);


create table eatery(
    id int primary key,
    price decimal(10, 4),
    stuId int,
    # 命名外键
    constraint fk_1
        # 删除时置空
        # 更新时级联
        foreign key (stuId) references stu(stuId) on DELETE set null on update cascade
);

insert into stu (stuId, name)
values (1, 'Frank');

insert into stu (stuId, name)
values (2, 'Jack');

select stuId, name from stu;

insert into eatery values (5, 43.29, 1);

select * from eatery;

# 此时更新的时候 eatery中的关联字段会跟着变化(级联)
update stu set stuId = '4' where name = 'Frank'

# 此时删除eatery中的关联字段会被置空
delete from stu where name = 'Jack';
```

## 数据库设计思维

### 第一范式(1NF)

第一范式是指数据库的每一列都是不可分割的基本数据项, 保证字段的原子性.

### 第二范式(2NF)

第二范式要求表中必须存在主键, 且其他的属性必须完全依赖于主键. 别没事儿找事儿!

### 第三范式(3NF)

在满足第二范式的情况下, 所有的属性都不传递依赖于主键, 满足第三范式.

> 比如高考总分: 理论来说有了每一科目成绩了, 就不需要总分字段了. 但是实际上由于总分查询的次数过于频繁, 如果每次都通过计算则会过分浪费性能, 因此具体还需要看实际需求! (按照标准是不应该有总分字段)

## 单表查询 DQL

### select

```sql
select 2*7;

select '你好';

select 'Hello world' as hw;
select 'Hello world' hw;

select 2*7 as res;
```

### from

```sql
 create table t1(
     id int,
     name varchar(20)
 );

 create table t2(
    score1 int,
    score2 int
 );

insert into t1 values (1,'frank');
insert into t1 values (2,'Jack');

select * from t1;

insert into t2 values (98,99);
insert into t2 values (93,91);
insert into t2 values (88,75);

select * from t2;

# 返回笛卡尔积
select * from t1,t2;
```

### dual

```sql
select 2*7 as res from dual;
```

### where

```sql
select * from teacher;
select * from teacher where id > 4;
select * from teacher where id < 4;
select * from teacher where id = 4;
select * from teacher where id != 4;

select * from teacher where id != 4 and phone = '1111';
select * from teacher where id != 4 or phone = '1111';
```

### in

```sql
select * from teacher where address in('China Mainland', 'China Hongkong'); # 包含

select * from teacher where address not in('China Mainland', 'China Hongkong'); # 不包含
```

### exists

`EXISTS` 用于判断子查询是否存在结果, 返回布尔值（`TRUE / FALSE`）. 它不关心子查询返回的具体内容, 只关心有没有行返回.

```sql
# 查询有员工的部门
SELECT * FROM departments d
WHERE EXISTS (SELECT 1 FROM employees e WHERE e.dept_id = d.id);

# 使用 NOT EXISTS（查询没有员工的部门）
SELECT * FROM departments d
WHERE NOT EXISTS (SELECT 1 FROM employees e WHERE e.dept_id = d.id);

# 经典场景——找出所有选修了课程的学生
SELECT s.* FROM student s
WHERE EXISTS (
    SELECT 1 FROM score sc WHERE sc.student_id = s.id
);
```

### between...and...

```sql
create table t3(
    id int,
    age int
);

insert into t3 values (1, 17);

insert into t3 values (2, 18);

insert into t3 values (3, 19);

insert into t3 values (4, 20);

insert into t3 values (5, 22);


select * from t3 where age between 18 and 20;

select * from t3 where age not between 18 and 20;
```

`BETWEEN a AND b` 是闭区间, 等价于 `age >= 18 AND age <= 20`, 即 **同时包含 18 和 20 两个边界值**.

`NOT BETWEEN a AND b` 则等价于 `age < 18 OR age > 20`, **两个边界值都不命中**.

### is null

```sql
select * from t3 where age is null;

select * from t3 where age is not null;
```

### 聚合函数

```sql
create table score(
    id int,
    chinese int,
    english int,
    math int
);

desc score;

insert into score (id, chinese, english, math)
values (1, 88, 90,60);

insert into score (id, chinese, english, math)
values (2, 93, 94,80);

select * from score;

# 求字段和
select sum(chinese) from score;
# 求平均值
select avg(chinese)from score;
# Max
select max(chinese)from score;
# Min
select min(chinese)from score;
# count
select count(chinese)from score;
```

### 模糊查询

```sql
# % 代表一个字符或者多个字符
select * from student where name like '张%';

# _ 代表一个字符
select * from student where name like '张_';
```

### 分组查询

```sql
# 分组查询 按照性别分组
select avg(age) as '年龄' , gender as '性别' from info group by gender;

# 分组查询 按地区分组
select avg(age) as '年龄', address as '地区' from info group by address;
```

### 排序查询

注意: 如果是多字段排序, 当第一个字段值相同时, 才会根据第二个字段进行排序.

```sql
# asc 升序
# desc 降序

select * from emp order by age desc;

# 默认就是升序
select * from emp order by age;
```

### 分页查询

- 起始索引从 0 开始, `起始索引 = (查询页码 - 1) * 每页显示记录数`.

- 分页查询是数据库的方言, 不同的数据库有不同的实现, MySQL中是`LIMIT`.

- 如果查询的是第一页数据, 起始索引可以省略, 直接简写为`limit 10`.

```sql
select * from info limit 2; # 从0开始, 查询2个
select * from info limit 1, 3; # 从1开始, 查询3个

select * from info order by age desc limit 3;
```

### group_concat

```sql
# 聚合 name
select group_concat(name), gender from student group by gender;
```

### having

```sql
# 分组查询 按地区分组 后 平均年龄大于24的
# 已经查过的得到的结果表(虚拟表) 再次筛选
select avg(age) as 'age', address as '地区' from info group by address having age > 24;
```

### distinct all

```sql
# 去重后展示
select distinct address from info;

# 统计去重后的选项个数
select count(distinct address) from info;

# 默认 一般忽略all
select all address from info;
```

### 执行顺序

```sql
# 编写顺序
SELECT
    字段列表
FROM
    表名列表
WHERE
    条件列表
GROUP BY
    分组字段列表
HAVING
    分组后条件列表
ORDER BY
    排序字段列表
LIMIT
    分页参数;


# 执行顺序
SELECT		# ---> 4
    字段列表
FROM		# ---> 1
    表名列表
WHERE		# ---> 2
    条件列表
GROUP BY	# ---> 3
    分组字段列表
HAVING
    分组后条件列表
ORDER BY	# ---> 5
    排序字段列表
LIMIT		# ---> 6
    分页参数;
```

## 多表查询

### 多表关系

#### 一对多(多对一)

- 案例: 部门与员工的关系.

- 关系: 一个部门对应多个员工, 一个员工对应一个部门.

- 实现: 在多的一方建立外键, 指向一的一方的主键.

#### 多对多

- 案例: 学生与课程的关系.

- 关系: 一个学生可以选修多门课程, 一门课程也可以供多个学生选择.

- 实现: 建立**第三张中间表**, 中间表至少包含两个外键, 分别关联两方主键.

```sql
create table student(
    id int auto_increment primary key comment '主键 ID',
    name varchar(10) comment '姓名',
    no varchar(10) comment '学号'
) comment '学生表';

insert into student values (null, '黛绮丝', '2000100101'),(null, '谢逊',
                                                           '2000100102'),(null, '殷天正', '2000100103'),(null, '韦一笑', '2000100104');


create table course(
                       id int auto_increment primary key comment '主键ID',
                       name varchar(10) comment '课程名称'
) comment '课程表';
insert into course values (null, 'Java'), (null, 'PHP'), (null , 'MySQL') ,
                          (null, 'Hadoop');

create table student_course(id int auto_increment comment '主键' primary key,
                            studentid int not null comment '学生ID',
                            courseid int not null comment '课程ID',
                            constraint fk_courseid foreign key (courseid) references course (id),
                            constraint fk_studentid foreign key (studentid) references student (id)
)comment '学生课程中间表';

insert into student_course values (null,1,1),(null,1,2),(null,1,3),(null,2,2),
                                  (null,2,3),(null,3,4);
```

#### 一对一

- 案例: **用户** 与 **用户详情** 的关系.
- 关系: 一对一关系, 多用于单表拆分, 将一张表的基础字段放在一张表中, 其他详情字段放在另一张表中, 以提升操作效率.
- 实现: 在任意一方加入**外键**, 关联另外一方的**主键**, 并且设置外键为唯一的(**UNIQUE**).

```sql
create table tb_user(
                        id int auto_increment primary key comment '主键ID',
                        name varchar(10) comment '姓名',
                        age int comment '年龄',
                        gender char(1) comment '1: 男 , 2: 女',
                        phone char(11) comment '手机号'
) comment '用户基本信息表';
create table tb_user_edu(
                            id int auto_increment primary key comment '主键ID',
                            degree varchar(20) comment '学历',
                            major varchar(50) comment '专业',
                            primaryschool varchar(50) comment '小学',
                            middleschool varchar(50) comment '中学',university varchar(50) comment '大学',
                            userid int unique comment '用户ID',
                            constraint fk_userid foreign key (userid) references tb_user(id)
) comment '用户教育信息表';
insert into tb_user(id, name, age, gender, phone) values
                                                      (null,'黄渤',45,'1','18800001111'),
                                                      (null,'冰冰',35,'2','18800002222'),
                                                      (null,'码云',55,'1','18800008888'),
                                                      (null,'李彦宏',50,'1','18800009999');
insert into tb_user_edu(id, degree, major, primaryschool, middleschool,
                        university, userid) values
                                      (null,'本科','舞蹈','静安区第一小学','静安区第一中学','北京舞蹈学院',1),
                                      (null,'硕士','表演','朝阳区第一小学','朝阳区第一中学','北京电影学院',2),
                                      (null,'本科','英语','杭州市第一小学','杭州市第一中学','杭州师范大学',3),
                                      (null,'本科','应用数学','阳泉第一小学','阳泉区第一中学','清华大学',4);
```

### 连接查询

#### 内连接

> - 在多表查询的时候, 我们需要消除无效的笛卡尔积.
> - 内连接查询的是两张表交集的部分.

```sql
 create table dept(
                     id int auto_increment comment 'ID' primary key,
                     name varchar(50) not null comment '部门名称'
)comment '部门表';
INSERT INTO dept (id, name) VALUES (1, '研发部'), (2, '市场部'),(3, '财务部'), (4,
                                                                                '销售部'), (5, '总经办'), (6, '人事部');


create table emp(
                    id int auto_increment comment 'ID' primary key,name varchar(50) not null comment '姓名',
                    age int comment '年龄',
                    job varchar(20) comment '职位',
                    salary int comment '薪资',
                    entrydate date comment '入职时间',
                    managerid int comment '直属领导ID',
                    dept_id int comment '部门ID'
)comment '员工表';
# 添加外键
alter table emp add constraint fk_emp_dept_id foreign key (dept_id) references
    dept(id);
INSERT INTO emp (id, name, age, job,salary, entrydate, managerid, dept_id)
VALUES
    (1, '金庸', 66, '总裁',20000, '2000-01-01', null,5),
    (2, '张无忌', 20, '项目经理',12500, '2005-12-05', 1,1),
    (3, '杨逍', 33, '开发', 8400,'2000-11-03', 2,1),
    (4, '韦一笑', 48, '开发',11000, '2002-02-05', 2,1),
    (5, '常遇春', 43, '开发',10500, '2004-09-07', 3,1),
    (6, '小昭', 19, '程序员鼓励师',6600, '2004-10-12', 2,1),
    (7, '灭绝', 60, '财务总监',8500, '2002-09-12', 1,3),
    (8, '周芷若', 19, '会计',48000, '2006-06-02', 7,3),
    (9, '丁敏君', 23, '出纳',5250, '2009-05-13', 7,3),
    (10, '赵敏', 20, '市场部总监',12500, '2004-10-12', 1,2),
    (11, '鹿杖客', 56, '职员',3750, '2006-10-03', 10,2),
    (12, '鹤笔翁', 19, '职员',3750, '2007-05-09', 10,2),
    (13, '方东白', 19, '职员',5500, '2009-02-12', 10,2),
    (14, '张三丰', 88, '销售总监',14000, '2004-10-12', 1,4),
    (15, '俞莲舟', 38, '销售',4600, '2004-10-12', 14,4),
    (16, '宋远桥', 40, '销售',4600, '2004-10-12', 14,4),
    (17, '陈友谅', 42, null,2000, '2011-10-12', 1,null);


# 多表查询 添加查询条件 消除笛卡尔积
select * from emp, dept where emp.dept_id = dept.id;

# 内连接 查询每一个员工的姓名, 及关联的部门的名称(隐式内连接实现)
select emp.name, dept.name from emp, dept where emp.dept_id = dept.id;

# 起别名
select e.name, d.name from emp e, dept d where e.dept_id = d.id;

# 查询每一个员工的姓名, 及关联的部门的名称 (显式内连接实现)
select e.name, d.name from emp e inner join dept d on e.dept_id = d.id;
# 可以省略inner
select e.name, d.name from emp e join dept d on e.dept_id = d.id;
```

#### 外连接

- 外连接分为左外连接和右外连接.

- 左外连接相当于查询表1(左表)的所有数据包含表1和表2交集部分的数据.
- 右外连接相当于查询表2(右表)的所有数据包含表1和表2交集部分的数据.

```sql
# 左外连接
# 查询emp表的所有数据, 和对应的部门信息(左外连接)
select e.*, d.name from emp e left outer join dept d on e.dept_id = d.id;
select e.*, d.name from emp e left join dept d on e.dept_id = d.id;

# 右外连接
# 查询dept表的所有数据, 和对应的员工信息(右外连接)
select d.*, e.* from emp e right join dept d on e.dept_id = d.id;
```

#### 自连接

- 自连接查询, 顾名思义, 就是自己连接自己, 也就是把一张表连接查询多次.

- 自连接查询, 可以是内连接查询, 也可以是外连接查询.
- 自连接查询的时候, 一定要给表起别名.

```sql
# 查询员工 及其 所属领导的名字
select e.name, m.name from emp e join emp m on e.managerid = m.id;

# 查询所有员工 emp 及其领导的名字 emp,  如果员工没有领导, 也需要查询出来
# 此时应该需要用外连接
select a.name '员工', b.name '领导' from emp a left join emp b on a.managerid = b.id;
```

### 联合查询 union / union-all

对于union查询, 就是把多次查询的结果合并起来, 形成一个新的查询结果集.

```sql
# 1.将薪资低于 5000的员, 和年龄大于 50 岁的员工全部查询出来.

# 注意: 对于同时满足两个条件的, 使用or 每条记录最多命中一次 "满足任一"
select * from emp where salary < 5000 or age > 50;

# 分两次查, 再合并. 可能会出现在两次, UNION ALL 不去重 "两次查询的并集"
select * from emp where salary < 5000 union all select * from emp where  age > 50;

# UNION 会去重, 等价于 OR 的效果, 但会进行排序去重操作, 性能较差. 一般不推荐用 UNION 替代 OR.
select * from emp where salary < 5000 union select * from emp where  age > 50;
```

- 对于联合查询的多张表的列数必须保持一致, 字段类型也需要保持一致.
- `union all` 会将全部的数据直接合并在一起, `union` 会对合并之后的数据去重.

### 子查询

概念: SQL语句中嵌套 `SELECT` 语句, 称为`嵌套查询` , 又称`子查询`.

#### 标量子查询

```sql
# 1.查询"销售部"的所有员工信息
# a. 查询销售部的ID
select id from dept where name = '销售部';
# b. 用ID查询所用员工
select * from emp where dept_id = 4;
# 合并后
select * from emp where dept_id = (select id from dept where name = '销售部');

# 2.查询在“方东白”入职之后的员工信息
select emp.entrydate from emp where name = '方东白';

select * from emp where entrydate > '2009-02-12';

select * from emp where entrydate > (select emp.entrydate from emp where name = '方东白');
```

#### 列子查询

- `IN` 在指定的集合范围之内, 多选一
- `NOT IN` 不在指定的集合范围之内
- `ANY` 子查询返回列表中, 有任意一个满足即可
- `SOME` 与ANY等同, 使用SOME的地方都可以使用ANY
- `ALL` 子查询返回列表的所有值都必须满

```sql
# 列子查询

# 1. 查询 "销售部" 和 "市场部" 的所有员工信息
# a. 查询 "销售部" 和 "市场部" 的部门ID
SELECT id from dept where name = '销售部' or name = '市场部';

# b. 根据部门ID, 查询员工信息
select * from emp where dept_id in (2, 4);

# 合并
select * from emp where dept_id in (SELECT id from dept where name = '销售部' or name = '市场部');


# 2. 查询比财务部所有人工资都高的员工信息
select id from dept where name = '财务部';

select salary from emp where dept_id = 3;

select max(salary) from emp where dept_id = 3;

select * from emp where salary > 4800;

# 合并
select * from emp where salary > all (select salary from emp where dept_id in (select id from dept where name = '财务部'));

# 3. 查询比研发部其中任意一人工资高的员工信息
select id from dept where name = '研发部';

select min(salary) from emp where dept_id = 1;

select * from emp where salary > 6600;

select * from emp where salary > any (select salary from emp where dept_id in (select id from dept where name = '研发部'));
```

#### 行子查询

```sql
# 行子查询

# 1.查询与"张无忌"的薪资及直属领导相同的员工信息;
select * from emp where name = '张无忌';

select salary from emp where name = '张无忌';
select managerid from emp where name = '张无忌';

select emp.name from emp where id = (select managerid from emp where name = '张无忌');

# 这几个应该都行
select * from emp where salary = (select salary from emp where name = '张无忌') and managerid = (select managerid from emp where name = '张无忌');

select * from emp where (salary, managerid) = ((select salary from emp where name = '张无忌'),  (select managerid from emp where name = '张无忌'));

select * from emp where (salary, managerid) = (select salary, managerid from emp where name = '张无忌');
```

#### 表子查询

子查询返回的结果是**多行多列**, 这种子查询称为表子查询.

```sql
# 表子查询

# 1.查询与“鹿杖客", “宋远桥"的职位和薪资相同的员工信息

# 自己写的
select job, salary from emp where name = '鹿杖客' union select job, salary from emp where name = '宋远桥';

# 推荐
select job, salary from emp where name = '鹿杖客' or name = '宋远桥';

# 汇总
select * from emp where (job, salary) in (select job, salary from emp where name = '鹿杖客' or name = '宋远桥');


# 2.查询入职日期是"2006-01-01”之后的员工信息, 及其部门信息

select * from emp where entrydate > '2006-01-01';

select e.*, d.* from (select * from emp where entrydate > '2006-01-01') e left join dept d on e.dept_id = d.id;
```

## 事务(面试)

事务是一组操作的集合, 它是一个不可分割的工作单位事务会把所有的操作作为一个整体一起向系统提交或撤销操作

请求, 即这些操作要么同时成功, 要么同时失败.

### 事务的基本操作

```sql
# 创建表
drop table if exists account;

create table account(
id int primary key AUTO_INCREMENT comment 'ID',
name varchar(10) comment '姓名',
money double(10,2) comment '余额'
) comment '账户表';

insert into account(name, money) VALUES ('张三',2000), ('李四',2000);
```

正常情况:

```sql
# 转账操作(张三给李四转账1000)

# 1. 查询张三账户余额

select *
from account
where name = '张三';

# 2. 将张三账户余额 - 1000

update account
set money = money - 1000
where name = '张三';

# 3.将李四账户余额 + 1000

update account
set money = money + 1000
where name = '李四';
```

但是可能会在转账中途出现问题, 因此需要通过事务保证一致性:

```sql
# 方式1
# 查看/设置事务提交方式
SELECT @@autocommit;

# 关闭自动提交（0=手动提交, 1=自动提交）
SET@@autocommit = 0;

# 提交事务
COMMIT;

# 回滚事务
ROLLBACK;

# 回滚到指定保存点
ROLLBACK TO SAVEPOINT point_name;
```

还有一种方式, 具体操作如下:

```sql
# 方式2

# 不修改事务的提交方式

# 这两个都可以 有细微差别
start transaction; # 使用这个
begin;

# 1. 查询张三账户余额
select * from account where name = '张三';

# 2.将张三账户余额 - 1000
update account set money = money - 1000 where name = '张三';

# 3.将李四账户余额 + 1000
update account set money = money + 1000 where name ='李四';

# commit 执行成功则提交
commit;

# rollback 执行失败则回滚
rollback;
```

### 特性

- **原子性(Atomicity)**: 事务是**不可分割**的最小操作单元, 要么全部成功, 要么全部失败.
- **一致性(Consistency)**: 事务完成时, 必须使**所有的数据都保持一致**状态.
- **隔离性(Isolation)**: 数据库系统提供的隔离机制, 保证事务在不受外部并发操作影响的独立环境下运行.
- **持久性(Durability)**: 事务一旦提交或回滚, 它对数据库中的数据的改变就是永久的.

### 并发事务问题

- **脏读**: 一个事务读到另外一个事务还没有提交的数据.

- **不可重复读**: 一个事务先后读取同一条记录, 但两次读取的数据不同, 称之为不可重复读.

- **幻读**: 一个事务按照条件查询数据时, 没有对应的数据行, 但是在插入数据时, 又发现这行数据已经存在, 好像出现了"幻影".

### 事务的隔离级别

| 隔离级别                    | 脏读 | 不可重复读 | 幻读 |
| --------------------------- | :--: | :--------: | :--: |
| Read uncommitted            |  √   |     √      |  √   |
| Read committed              |  ×   |     √      |  √   |
| Repeatable Read (Mysql默认) |  ×   |     ×      |  √   |
| Serializable                |  ×   |     ×      |  ×   |

```sql
# 查看事务隔离级别
SELECT @@TRANSACTION_ISOLATION;

# 设置事务隔离级别
SET [SESSION|GLOBAL] TRANSACTION ISOLATION LEVEL {READ UNCOMMITTED | READ COMMITTED | REPEATABLE READ | SERIALIZABLE}
```

## 存储引擎

存储引擎就是存储数据、建立索引、更新/查询数据等技术的实现方式. 存储引擎是基于表的, 而不是基于库的, 所以存储引擎也可被称为表类型. Mysql默认存储引擎是: `InnoDB`.

```sql
# 查询当前数据库支持的存储引擎

show engines;
```

### innoDB

InnoDB是一种兼顾高可靠性和高性能的通用存储引擎, 在MySQL5.5之后, InnoDB是默认的MySQL存储引擎.

- DML操作遵循 `ACID` 模型, 支持事务
- `行级锁` , 提高并发访问性能
- 支持外键 `FOREIGNKEY` 约束, 保证数据的完整性和正确性

### MyISAM and Memory

略...

| 特点         | InnoDB               | MyISAM | Memory |
| ------------ | -------------------- | ------ | ------ |
| 存储限制     | 64TB                 | 有     | 有     |
| 事务安全     | 支持                 | -      | -      |
| 锁机制       | 行锁                 | 表锁   | 表锁   |
| B+tree 索引  | 支持                 | 支持   | 支持   |
| Hash 索引    | -                    | -      | 支持   |
| 全文索引     | 支持（5.6 版本之后） | 支持   | -      |
| 空间使用     | 高                   | 低     | N/A    |
| 内存使用     | 高                   | 低     | 中等   |
| 批量插入速度 | 低                   | 高     | 高     |
| 支持外键     | 支持                 | -      | -      |

## \*索引

索引 (`index`) 是帮助MySQL`高效获取数据`的 `数据结构(有序)`. 在数据之外, 数据库系统还维护着满足特定查找算法的数据结构, 这些数据结构以某种方式 `引用(指向)` 数据, 这样就可以在这些数抓居结构上实现高级查找算法, 这种数据结构就是索引.

> 索引是一种数据结构, 用于高效的获取数据.

| 优势                                                          | 劣势                                                                                               |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 提高数据检索的效率, 降低数据库的 IO 成本                      | 索引列也是要占用空间的                                                                             |
| 通过索引列对数据进行排序, 降低数据排序的成本, 降低 CPU 的消耗 | 索引大大提高了查询效率, 同时却也降低更新表的速度, 如对表进行 `INSERT、UPDATE、DELETE` 时, 效率降低 |

> 实际上应用中这两点劣势都可以忽略: 首先磁盘成本不高, 其次在真实业务中增删改的业务比例较小, 更多的是查询.

### 索引结构

MySQL的索引是在存储引擎层实现的, 不同的存储引擎有不同的结构, 主要包含以下几种:

| 索引结构                | 描述                                                                               |
| ----------------------- | ---------------------------------------------------------------------------------- |
| `B+Tree` 索引           | 最常见的索引类型, 大部分引擎都支持 `B+ 树`索引                                     |
| `Hash` 索引             | 底层数据结构是用`哈希表`实现的, 只有精确匹配索引列的查询才有效, 不支持范围查询     |
| `R-tree`（空间索引）    | 空间索引是 `MyISAM` 引擎的一个特殊索引类型, 主要用于地理空间数据类型, 通常使用较少 |
| `Full-text`（全文索引） | 是一种通过建立倒排索引, 快速匹配文档的方式. 类似于 Lucene、Solr、ES                |

#### 结构 Btree/B+tree

- 二叉树缺点: 顺序插入时, 会形成一个链表, 查询性能大大降低. 大数据量情况下, 层级较深, **检索速度慢**.

- 红黑树: 大数据量情况下, 层级较深, 检索速度慢.

> ### 二叉树
>
> #### 1. 基本定义
>
> 二叉树是每个节点最多只有两个子节点的树, 左子节点、右子节点. 每个节点包含一个值（或者键和值）, 以及两个指针指向左右孩子. 两个子节点区分左右, 顺序不能颠倒.
>
> #### 2. 特殊类型：二叉搜索树
>
> 二叉搜索树, 简称BST, 是一种有序二叉树. 它规定：
>
> - 左子树上所有节点的值都小于当前节点
> - 右子树上所有节点的值都大于当前节点
> - 左右子树也各自满足这个规则
>
> 在这个树里查数字7时：从根8开始, 7<8去左；到3, 7>3去右；到6, 7>6去右；到7, 找到了. 每次比较大小, 舍弃一半或一部分子树, 查找效率高.
>
> #### 3. 效率和问题
>
> 如果二叉搜索树长得“平衡”, 高度约为log₂n, 那查找、插入、删除都能O(log n). 但是如果没有约束, 按顺序插入数据时, 树会变成一条直的链表, 高度变成n, 查找变成O(n). 所以必须控制树的高度, 让它保持平衡, 红黑树就是其中一个解决办法.
>
> ### 红黑树
>
> 红黑树是一种自平衡的二叉搜索树, 也就是说它在普通二叉搜索树基础上加了"自动调整形状"的规则, 让树始终保持大致平衡, 不会退化成链表. 它由鲁道夫·贝尔发明, "红黑"是因为节点被标记为红色或黑色（这只是逻辑标记, 不是物理颜色）, 其他自平衡树还有AVL树, 但红黑树应用更广.
>
> #### 五条关键规则
>
> 红黑树必须满足以下5条：
>
> 1. 每个节点要么是红色, 要么是黑色；
> 2. 根节点是黑色；
> 3. 所有叶子节点（这里的叶子指空节点null）都是黑色；
> 4. 红色节点的两个子节点必须是黑色（也就是说不能有两个连续的红节点, 红节点的孩子不为红）；
> 5. 从任意节点到其每个后代叶子节点的所有路径上, 包含相同数目的黑色节点.
>
> 这几条规则保证了：从根到叶子最长的路径不会超过最短路径的两倍. 因为每条路径黑色节点数一样, 红色不能连续, 所以最长路径就是“黑红黑红……红黑”, 最短路径全是黑, 长度最多差一倍, 因此树的高度保持在O(log n).
>
> #### 插入和删除后的修复
>
> 插入一个节点时, 先按普通二叉搜索树规则把它放到叶子位置, 然后把它默认涂成红色（这样做更容易不破坏黑色数量规则）. 之后可能违反规则, 比如出现连续红节点, 于是需要“变色”和“旋转”来修复：
>
> - 变色：把某个节点从红变黑或从黑变红；
> - 左旋：把某个节点的右子节点提上来, 自己变成其左子节点（对局部调整）；
> - 右旋：对称操作.
>
> 通过一系列变色和旋转, 最终满足五条规则. 删除操作更复杂, 需要处理的情况也多, 但同样靠少量旋转变色恢复平衡. 注意：红黑树不是严格平衡（左右子树高度差可以超过1, 但整体高度有界）, 它“牺牲了一点平衡性, 换来插入删除时更少的旋转操作” .
>
> #### 性能和特点
>
> - 查找、插入、删除的时间复杂度都是O(log n)；
> - 相比AVL树（严格平衡）, 红黑树插入删除时旋转次数更少, 因为它的平衡条件更松；
> - 在内存中应用极广, 像C++ STL里的map、set, Java的TreeMap, Linux内核的进程调度器, 都用红黑树.
>
> ### B树
>
> - 数据结构可视化网站: https://www.cs.usfca.edu/~galles/visualization/BTree.html
> - 以一颗最大度数(max-degree)为5 (`5阶`) 的b-tree为例, 则每个节点最多存储`4个key`, 有`5个指针` (树的度数指的是一个节点的子节点个数)
> - 裂变方式: 中间元素向上分裂
>
> ### B+树
>
> #### B+树和B树的差异
>
> B+树是B树的一种变形, 规则与B树相似, 但有几个重要差别：
>
> - 所有的数据都会出现在叶子节点
> - 叶子节点形成一个单向链表
> - B+树只有叶子节点才会存放数据, 上面的节点都只是数据索引的作用. B树的叶子节点和非叶子节点都会存放数据
>
> ### 直观比喻
>
> - 二叉树像一本只有左右两栏的目录, 条目很容易堆高；
> - 红黑树像一本会自动分栏排版的书, 保证查找快；
> - B树像一份多栏目录, 一页能容纳很多条目, 翻页次数少；
> - B+树像一份多栏目录, 而且每栏底部有“下栏地址”连成串, 要找连续内容时顺着串走就行.

##### Mysql中的B+树

MySQL索引数据结构对经典的`B+Tree`进行了优化. 在原`B+Tree`的基础上, 增加一个`指向相邻叶子节点的链表指针`, 就形成了带有顺序

指针的`B+Tree`, 提高区间访问的性能(形成双向链表).

#### Hash

哈希索引就是采用一定的hash算法, 将键值换算成新的hash值, 映射到对应的槽位上, 然后存储在hash表中. 如果两个(或多个)键值, 映射到一个相同的槽位上, 他们就产生了hash冲突, 可以通过`链表`来解决.

##### Hash索引特点

- Hash索引只能用于对等比较`(=, in)`, 不支持范围查询`(between, >, <, ...)`

- 无法利用索引完成排序操作

- 查询效率高, 通常只需要一次检索就可以了, 效率通常要`高于B+tree`索引

在Mysql中, 支持hash索引的是`Memory引擎`, 而InnoDB中具有`自适应hash功能`, hash索引是存储引擎根据B+Tree索引在指定条件下自动构建的.

### 索引分类

| 分类                 | 含义                                                 | 特点                     | 关键字   |
| -------------------- | ---------------------------------------------------- | ------------------------ | -------- |
| **主键索引**         | 针对于表中主键创建的索引                             | 默认自动创建, 只能有一个 | PRIMARY  |
| **唯一索引**         | 避免同一个表中某数据列中的值重复                     | 可以有多个               | UNIQUE   |
| **常规索引**         | 快速定位特定数据                                     | 可以有多个               |          |
| **全文索引(用得少)** | 全文索引查找的是文本中的关键词, 而不是比较索引中的值 | 可以有多个               | FULLTEXT |

在InnoDB存储引擎中, 根据索引的存储形式, 又可以分为以下两种:

| 分类                          | 含义                                                         | 特点                 |
| ----------------------------- | ------------------------------------------------------------ | -------------------- |
| **聚集索引**(Clustered Index) | 将数据存储与索引放到了一块, 索引结构的`叶子节点`保存了行数据 | 必须有, 而且只有一个 |
| **二级索引**(Secondary Index) | 将数据与索引分开存储, 索引结构的叶子节点关联的是对应的主键   | 可以存在多个         |

聚集索引选取规则:

- 如果存在主键, `主键索引`就是聚集索引.
- 如果不存在主键, 将使用第一个`唯一(UNIQUE)`索引作为聚集索引.
- 如果表没有主键, 或没有合适的唯一索引, 则InnoDB会`自动生成`一个`rowid`作为隐藏的聚集索引.

> 对于`select * from user where name = 'a'`的查询过程, 叫做回表查询.
>
> 回表查询: 先走二级索引找到对应的主键值, 再根据主键值到聚集索引中拿到这一行的数据.

> 面试题: InnoDB主键索引的B+tree高度为多高呢?

### 索引语法

建表语句:

```sql
# 创建一张表
create table tb_user(
                        id int primary key auto_increment comment '主键',
                        name varchar(50) not null comment '用户名',
                        phone varchar(11) not null comment '手机号',
                        email varchar(100) comment '邮箱',
                        profession varchar(11) comment '专业',
                        age tinyint unsigned comment '年龄',
                        gender char(1) comment '性别 , 1: 男, 2: 女',
                        status char(1) comment '状态',
                        createtime datetime comment '创建时间'
) comment '系统用户表';
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
                     createtime) VALUES ('吕布', '17799990000', 'lvbu666@163.com', '软件工程', 23, '1',
                                         '6', '2001-02-02 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
                     createtime) VALUES ('曹操', '17799990001', 'caocao666@qq.com', '通讯工程', 33,
                                         '1', '0', '2001-03-05 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
                     createtime) VALUES ('赵云', '17799990002', '17799990@139.com', '英语', 34, '1',
                                         '2', '2002-03-02 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
                     createtime) VALUES ('孙悟空', '17799990003', '17799990@sina.com', '工程造价', 54,
                                         '1', '0', '2001-07-02 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
                     createtime) VALUES ('花木兰', '17799990004', '19980729@sina.com', '软件工程', 23,
                                         '2', '1', '2001-04-22 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
                     createtime) VALUES ('大乔', '17799990005', 'daqiao666@sina.com', '舞蹈', 22, '2',
                                         '0', '2001-02-07 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
                     createtime) VALUES ('露娜', '17799990006', 'luna_love@sina.com', '应用数学', 24,
                                         '2', '0', '2001-02-08 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
                     createtime) VALUES ('程咬金', '17799990007', 'chengyaojin@163.com', '化工', 38,
                                         '1', '5', '2001-05-23 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
                     createtime) VALUES ('项羽', '17799990008', 'xiaoyu666@qq.com', '金属材料', 43,
                                         '1', '0', '2001-09-18 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
                     createtime) VALUES ('白起', '17799990009', 'baiqi666@sina.com', '机械工程及其自动
化', 27, '1', '2', '2001-08-16 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
                     createtime) VALUES ('韩信', '17799990010', 'hanxin520@163.com', '无机非金属材料工
程', 27, '1', '0', '2001-06-12 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
                     createtime) VALUES ('荆轲', '17799990011', 'jingke123@163.com', '会计', 29, '1',
                                         '0', '2001-05-11 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
                     createtime) VALUES ('兰陵王', '17799990012', 'lanlinwang666@126.com', '工程造价',
                                         44, '1', '1', '2001-04-09 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
                     createtime) VALUES ('狂铁', '17799990013', 'kuangtie@sina.com', '应用数学', 43,
                                         '1', '2', '2001-04-10 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
                     createtime) VALUES ('貂蝉', '17799990014', '84958948374@qq.com', '软件工程', 40,
                                         '2', '3', '2001-02-12 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
                     createtime) VALUES ('妲己', '17799990015', '2783238293@qq.com', '软件工程', 31,
                                         '2', '0', '2001-01-30 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
                     createtime) VALUES ('芈月', '17799990016', 'xiaomin2001@sina.com', '工业经济', 35,
                                         '2', '0', '2000-05-03 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
                     createtime) VALUES ('嬴政', '17799990017', '8839434342@qq.com', '化工', 38, '1',
                                         '1', '2001-08-08 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
                     createtime) VALUES ('狄仁杰', '17799990018', 'jujiamlm8166@163.com', '国际贸易',
                                         30, '1', '0', '2007-03-12 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
                     createtime) VALUES ('安琪拉', '17799990019', 'jdodm1h@126.com', '城市规划', 51,
                                         '2', '0', '2001-08-15 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
                     createtime) VALUES ('典韦', '17799990020', 'ycaunanjian@163.com', '城市规划', 52,
                                         '1', '2', '2000-04-12 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
                     createtime) VALUES ('廉颇', '17799990021', 'lianpo321@126.com', '土木工程', 19,
                                         '1', '3', '2002-07-18 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
                     createtime) VALUES ('后羿', '17799990022', 'altycj2000@139.com', '城市园林', 20,
                                         '1', '0', '2002-03-10 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
                     createtime) VALUES ('姜子牙', '17799990023', '37483844@qq.com', '工程造价', 29,
                                         '1', '4', '2003-05-26 00:00:00');
```

实现需求:

```sql
# 查询指定表的索引
show index from tb_user;

# 创建索引
# 1.name字段为姓名字段, 该字段的值可能会重复, 为该字段创建索引
# 给tb_user表中的name字段创建一个名为idx_user_name常规索引
create index idx_user_name on tb_user(name);

# 2.phone手机号字段的值, 是非空, 且唯一的, 为该字段创建唯一索引
# 创建唯一索引
create index idx_user_phone on tb_user(phone);

# 3.为profession、age、status创建联合索引.
# 创建联合索引
create index idx_user_profession_age_status on tb_user(profession, age, status);

# 4.为email建立合适的索引来提升查询效率
create index idx_user_email on tb_user(email);

# 删除索引
drop index idx_user_email on tb_user;
```

### SQL性能分析

#### 查看执行频次

```sql
# 查看数据库性能信息
# 查看SQL执行频次
# 查看全局
show global status like 'Com_______';

# 查看当前会话
show session status  like 'Com_______';
```

#### 慢查询日志

慢查询日志记录了所有执行时间超过指定参数(`long_query_time`, 单位:秒, 默认10秒)的所有SQL语句的日志. MySQL的慢查询日志默认没有开启, 需要在MySQL的配置文件(`/etc/my.cnf`)中配置如下信息:

```txt
# 开启MySQL慢日志查询开关
slow_query_log=1

# 设置慢日志的时间为2秒, SQL语句执行时间超过2秒, 就会视为慢查询, 记录慢查询日志
long_query_time=2
```

```sql
# 查询是否开启
show variables like 'slow_query_log';
```

#### profile 详情

```sql
# 查看是否支持查看profile详情
select @@have_profiling;

# 查看是否开启
select @@profiling;

# 开启
set profiling = 1;
set session profiling = 1;
set global profiling = 1;


# 在 MySQL 8.0 中已经被移除

#查看每一条SQL的耗时基本情况
show profiles;

#查看指定query_id的SQL语句各个阶段的耗时情况
show profile for query 16;
#查看指定query_id的SQL语句CPU的使用情况
show profile cpu for query 16;

# 新版本: 在要分析的 SELECT 语句前加上 EXPLAIN ANALYZE
EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 123;

# 首先确认 Performance Schema 已开启（默认开启）
SHOW VARIABLES LIKE 'performance_schema';

# 查看最近执行的语句及其耗时
SELECT
    event_id,
    event_name,
    sql_text,
    ROUND(TIMER_WAIT/1e12,6) AS execution_sec,
    ROUND(LOCK_TIME/1e12,6) AS lock_sec
FROM performance_schema.events_statements_history_long
WHERE sql_text IS NOT NULL
ORDER BY event_id DESC
LIMIT 5;

# 要查看某个特定 event_id（相当于之前的 Query_ID）在语句内各阶段的耗时
SELECT
    event_id AS stage_event_id,
    event_name AS stage,
    ROUND(TIMER_WAIT/1e12,6) AS stage_sec
FROM performance_schema.events_stages_history_long
WHERE NESTING_EVENT_ID =16
ORDER BY event_id;

# MySQL 8.0 自带 sys schema, 里面已经帮你做了单位转换和格式化, 直接使用更简单．
SELECT * FROM sys.statement_analysis ORDER BY last_seen DESC LIMIT 5;
```

#### explain 执行计划

```sql
desc select * from tb_user where id = 1;
# Mysql 8.0+
# Mysql 8.0+ 做了优化
# 执行前已经获取到结果行, 无需再扫描表或索引, 代价为 0, 预期返回 1 行.
explain select * from tb_user where id = 1;
# 强制得到传统表格
explain FORMAT=TRADITIONAL select * from tb_user where id = 1;
```

### 使用规则

```sql
# 创建索引
# 给tb_sku表的sn字段创建名为idx_sku_sn的索引
# 耗时较长 构建B+树
create index idx_sku_sn on tb_sku(sn);
```

#### 最左前置法则 (Mysql8+做了优化)

如果索引了多列(联合索引), 要遵守最左前缀法则. 最左前缀法则指的是查询从索引的最左列开始, 并且不跳过索引中的列.

如果跳跃某一列, **索引将部分失效(后面的字段索引失效)**. 注意:**和放的位置没关系, 符合上面两个条件即全部生效**.

#### 范围查询

联合索引中, 出现范围查询`(>, <)`, **范围查询右侧的列索引失效**.

```sql
# 此时 status = '0' 不生效
explain selectfrom tb_user where profession = '软件工程' and age > 30 and status = '0'
```

但是`>=, <=`就可以规避这个问题.

#### 索引失效情况

- **索引列运算**: 不要在索引列上进行运算操作, 索引将失效.
- **字符串不加引号**: 字符串类型字段使用时, 不加引号, 索引将失效.
- **模糊查询**: 如果仅仅是尾部模糊匹配, 索引不会失效. 如果是头部模糊匹配, 索引失效.
- **`or`连接的条件**: 用`or`分割开的条件, 如果`or`前的条件中的列有索引, 而后面的列中没有索引, 那么涉及的索引都不会被用到.
- **数据分布影响**: 如果**Mysql评估**使用索引比全表更慢, 则不使用索引.

```sql
# 生效
select * from tb_user where phone = '17799990015';

# 1. 索引列运算 索引失效
select * from tb_user where substring(phone, 10, 2) = '15';

# 2. 字符串不加引号 索引失效
select * from tb_user where phone = 17799990015;

# 3. 头部模糊查询 索引生效
select * from tb_user where profession like '软件%';
# 尾部模糊查询 索引失效
select * from tb_user where profession like '%工程';
# 索引失效
select * from tb_user where profession like '%工%';

# 4. or 连接的条件 不生效
select * from tb_user where id = 10 or age = 23;
# 不生效
select * from tb_user where phone = '17799990000' or age = 23;
# 由于age没有索引, 所以即使id、phone有索引, 索引也会失效. 所以需要针对于age也要建立索引
```

#### SQL提示

SQL提示是优化数据库的一个重要手段, 简单来说, 就是在SQL语句中加入一些人为的提示来达到优化操作的目的. 比如有单列索引和联合索引, 到底用哪个? 你告诉Mysql, 需要用哪个索引.

```sql
# use index 使用哪个索引
explain select * from tb_user use index (idx_user_name) where profession = '软件工程';

# ignore index 忽略哪个索引
explain select * from tb_user ignore index (idx_user_name) where profession = '软件工程';

# force index 强制使用哪个索引
explain select * from tb_user force index (idx_user_name) where profession = '软件工程';
```

#### 覆盖索引

尽量使用覆盖索引(查询使用了索引, 并且需要返回的列, 在该索引中已经全部能够找到), 减少`select *`.

- `using index condition`: 查找使用了索引, 但是需要回表查询数据.
- `using where; using index`: 查找使用了索引, 但是需要的数据都在索引列中能找到, 所以不需要回表查询数据.

> 实际场景:
>
> 一张表,有四个字段(`id, username, password, status`),由于数据量大, 需要对以下SQL语句进行优化, 该如何进行才是最优方案:`select id, username, password from tb user where username = 'itcast';`.
>
> 优化方案:
>
> 建立`username, password`两个字段的联合索引

#### 前缀索引

当字段类型为字符串`(varchar, text...)`时, 有时候需要索引**很长的字符串**, 这会让索引变得很大, 查询时, 浪费大量的磁盘IO, 影响查

询效率. 此时可以只将字符串的一部分前缀, 建立索引, 这样可以大大节约索引空间, 从而提高索引效率.

- **前缀长度**: 可以根据索引的选择性来决定, 而选择性是指不重复的索引值(基数)和数据表的记录总数的比值, 索引选择性越高则查询效率越高, 比如`唯一索引`的选择性是`1`, 这是最好的索引选择性, 性能也是最好的.

```sql
# 选择性
select count(distinct email)/count(*) from tb_user;

# 查询前缀选择性
select count(distinct substring(email, 1, 5))/count(*) from tb_user; # 0.9583
select count(distinct substring(email, 1, 4))/count(*) from tb_user; # 0.9167

# 创建前缀索引
create index idx_email_5 on tb_user(email(5));
```

#### 单列 / 联合索引

- 单列索引:即一个索引只包含单个列.
- 联合索引:即一个索引包含了多个列.

在业务场景中, 如果存在多个查询条件, 考虑针对于查询字段建立索引时, 建议建立联合索引, 而非单列素引. 多条件联合查询时, MySQL优化器会评估哪个字段的索引效率更高, 会选择该索引完成本次查询.

- **联合索引的索引结构**: 比如说`name`和`phone`, B+树中的节点会存入键值对的组合: `张三 111222`.
- 对于创建联合索引, 哪个字段在前面, 哪个字段在后面对查询结果有影响 (最左前缀法则), 因此需要考虑顺序.

### 设计原则

1. 针对于**数据量较大**, 且**查询比较频繁**的表建立索引.
2. 针对于常作为查询条件(`where`)、排序(`order by`)、分组(`group by`)操作的字段建立索引.
3. 尽量选择**区分度高**的列作为索引, 尽量建立**唯一索引**, 区分度越高, 使用索引的效率越高.

4. 如果是字符串类型的字段, 字段的长度较长, 可以针对于字段的特点, 建立**前缀索引**.
5. 尽量使用**联合索引**, 减少单列索引, 查询时, 联合索引很多时候可以**覆盖索引**, 节省存储空间, 避免回表, 提高查询效率.
6. 要**控制索引的数量**, 索引并不是多多益善, 索引越多, 维护索引结构的代价也就越大, **会影响增删改的效率**.
7. 如果索引列不能存储`NULL`值, 请在创建表时使用`NOT NULL`约束它. 当优化器知道每列是否包含`NULL`值时, 它可以更好地确定哪个

索引最有效地用于查询.

## SQL优化

### 插入数据

#### insert优化

- 批量插入 (一次500~1000条)

- 手动事务提交
- 主键顺序插入

#### 插入数据

- 大批量插入数据: 如果一次性需要插入大批量数据, 使用`insert`语句插入性能较低, 此时可以使用MySQL数据库提供的`load`指令进行插入.

```shell
# 客户端连接服务端时, 加上参数--local-ipfile
mysql --local-infile -u root -p

# 设置全局参数local_infile为 1, 开启从本地加载文件导入数据的开关

set global local infile = 1;

# 执行load指令将准备好的数据, 加载到表结构中
# 从/root/sall.log加载数据到tb_user, 每一列数据使用','分隔, 每一行数据使用'\n'分隔
load data local infile '/root/sall.log' into table `tb_user` fields terminated by '1' lines terminated by '\n';
```

### 主键优化

- **数据组织方式**: 在InnoDB存储引擎中, 表数据都是根据主键顺序组织存放的, 这种存储方式的表称为索引组织表(`index organized table`, 即`IOT`).

- **页分裂**: 页可以为空, 也可以填充一半, 也可以填充100%. 每个页包含了2-N行数据(如果一行数据多大, 会行溢出), 根据主键排列. 主键乱序插入就可能发生页分裂.
- **页合并**: 当删除一行记录时, 实际上记录并没有被物理删除, 只是记录被标记(`flaged`)为删除并且它的空间变得允许被其他记录声明使用. 当页中删除的记录达到`MERGE THRESHOLD`(合并页的阈值, 可以自己设置, 在创建表或者创建索引时指定, 默认为页的50%), InnODB会开始寻找最靠近的页(前或后)看看是否可以将两个页合并以优化空间使用.
- **主键设计原则**:
  1. 满足业务需求的情况下, 尽量降低主键的长度.
  2. 插入数据时, 尽量选择顺序插入, 选择使用`AUTO_INCREMENT`自增主键.
  3. 尽量不要使用`UUID`做主键或者是其他自然主键, 如身份证号.
  4. 业务操作时, 避免对主键的修改.

### order by优化

1. `Using filesort`: 通过表的索引或全表扫描, 读取满足条件的数据行, 然后在排序缓冲区`sort buffer`中完成排序操作, 所有不是通过索引直接返回排序结果的排序都叫**FileSort排序**.
2. `Using index`: 通过有序索引顺序扫描直接返回有序数据, 这种情况即为`using index`, 不需要额外排序, 操作**效率高**.

```sql
#没有创建索引时, 根据age, phone进行排序
explain select id,age,phone from tb_user order by age, phone;

#创建联合索引
create index idx_user_age_phone_aa on tb_user(age, phone);

#创建索引后, 根据age, phone进行升序排序
explain select id,age,phone from tb_user order by age, phone;

#创建索引后, 根据age, phone进行降序排序
explain select id,age,phone from tb_user order by age desc, phone desc;


#根据age, phone进行降序一个升序, 一个降序
explain select id, age, phone from tb_user order by age asc, phone desc;

# 如果需要一个升序一个降序
# 可以根据这两个字段再次建立索引
#创建联合索引
create index idx_user_age_phone_ad on tb_user(age asc,phone desc);

# 根据age, phone进行降序一个升序, 一个降序
explain select id, age, phone from tb_user order by age asc, phone desc;

# 默认是age asc, phone asc
```

- 根据排序字段建立合适的索引, 多字段排序时, 也遵循最左前缀法则.
- 尽量使用覆盖索引.
- 多字段排序, 一个升序一个降序, 此时需要注意联合索引在创建时的规则`(ASC/DESC)`.
- 如果不可避免的出现`filesort`, 大数据量排序时, 可以适当增大排序缓冲区大小`sort_buffer_size`(默认256k).

### group by优化

```sql
# 删除掉目前的联合索引idx_user_pro_age_sta
drop index idx_user_pro_age_sta on tb_user;

# 执行分组操作, 根据profession字段分组
explain select profession, count(*) from tb_user group by profession;

# 创建索引
create index idx_user_pro_age_sta on tb_user(profession, age, status);

# 执行分组操作, 根据profession字段分组
explain select profession, count(*) from tb_user group by profession;

# 执行分组操作, 根据profession字段分组
explain select profession, count(*) from tb_user group by profession, age;
```

- 在分组操作时, 可以通过索引来提高效率.
- 分组操作时, 索引的使用也是满足**最左前缀法则**的.

### limit优化

一个常见又非常头疼的问题就是`limit 2000000, 10`, 此时需要MySQL排序前2000010记录, 仅仅返回2000000-2000010的记录, 其他记录丢弃, 查询排序的代价非常大.

优化思路: 一般分页查询时, 通过创建覆盖索引能够比较好地提高性能, 可以通过覆盖索引加子查询形式进行优化.

```sql
# 覆盖索引+子查询
explain select * from tb_sku t, (select id from tb_sku order by id limit 2000000, 10) a where t.id = a.id;
```

### count优化

```sql
explain select count(*) from tb_user;
```

- MyISAM引擎把一个表的总行数存在了磁盘上, 因此执行`count(*)`的时候会直接返回这个数, 效率很高.
- InnoDB引擎就麻烦了, 它执行`count(*)`的时候, 需要报把数据一行一行地从引擎里面读出来, 然后累积计数.

优化方案: 自己计数

```sql
# 自己计数

```

#### count的几种用法

- `count()`是一个聚合函数, 对于返回的结果集, 一行行地判断, 如果count函数的参数`不是NULL`, 累计值就加1, 否则不加, 最后返回累计值.
- 用法: `count(*)`、`count(主键)`、`count(字段)`、`count(1)`
- 按照效率排序的话, `count(字段) < count(主键id) < count(1) ≈ count(*)`, 所以尽量使用`count(*)`.

### update优化

InnoDB的行锁是针对索引加的锁, 不是针对记录加的锁, 并且该索引不能失效, 否则会从行锁升级为表锁.

## 视图

视图(View)是一种虚拟存在的表. 视图中的数据并不在数据库中实际存在, 行和列数据来自定义视图的查询中使用的表, 并且是在使用视图时动态生成的. 通俗的讲, 视图只保存了查询的SQL逻辑, 不保存查询结果. 所以我们在创建视图的时候, 主要的工作就落在创建这条SQL查询语句上.

```sql
# 创建视图
create or replace view stu_v_1 as select id, name from student where id <= 10;

# 查询视图
# 创建视图的时候执行的sql语句
show create view stu_v_1;
# 查询视图当中的数据
select * from stu_v_1;

select * from stu_v_1 where id < 3;

# 修改视图
# 1. 语句1
create or replace view stu_v_1 as select id, name, no from student where id <= 10;
# 2. 语句2
alter view stu_v_1 as select id, name from student where id <= 10;

# 删除视图
drop view if exists stu_v_1;
```

### 视图检查选项

当使用`WITHCHECK OPTION`子句创建视图时，MySQL会通过视图检查正在更改的每个行，例如插入，更新，删除，以使其符合视图的定义. MySQL允许基于另一个视图创建视图，它还会检查依赖视图中的规则以保持一致性. 为了确定检查的范围，mysql提供了两个选项: `CASCADED` 和 `LOCAL`, 默认值为 `CASCADED`.

```sql
create or replace view stu_v_1 as select id, name from student where id <= 20;

select * from stu_v_1;
# 视图并不存储数据
# 因此插入的数据在基表中
insert into stu_v_1 values (6, 'Tom');

# 因为创建视图的时候有条件 id <= 20
# 因此这个插入在视图中无法看到
insert into stu_v_1 values (30, 'To1m');

# 为了避免这个情况
# 在创建视图的时候加上检查选项
create or replace view stu_v_1 as select id, name from student where id <= 20 with cascaded check option;

# 此时这个语句报错
insert into stu_v_1 values (30, 'To1m');
```

- `CASCADED`: 检查所有依赖视图的规则以保持一致性
- `LOCAL`: 只检查当前视图的规则

```sql
# cascaded 级联
create or replace view stu_v_1 as select id, name from student where id <= 20;

insert into stu_v_1 values (5, 'Tom');

insert into stu_v_1 values (25, 'Tom');

create or replace view stu_v_2 as select id, name from stu_v_1 where id >= 10 with cascaded check option;

# 这个不执行
insert into stu_v_2 values (7,'Tom');

# 这个不执行
insert into stu_v_2 values (26, 'Tom');

insert into stu_v_2 values (15, 'Tom');

create or replace view stu_v_3 as select id, name from stu_v_2 where id <= 15;

# 成功 因为条件全部通过
insert into stu_v_3 values (11, 'Tom');

# 成功 因为没有加v3检查 v2检查通过
insert into stu_v_3 values (17, 'Tom');

# 失败
insert into stu_v_3 values (28, 'Tom');


# local Mysql 8.0+
create or replace view stu_v_4 as select id, name from student where id <= 15 with local check option;

insert into stu_v_4 values (5, 'Tom');

insert into stu_v_1 values (16, 'Tom');

create or replace view stu_v_5 as select id, name from stu_v_4 where id >= 10 with local check option;

insert into stu_v_5 values (13,'Tom');

insert into stu_v_5 values (17,'Tom');

# 不执行
insert into stu_v_5 values (18,'Tom');

create or replace view stu_v_6 as select id, name from stu_v_5 where id <= 20;

insert into stu_v_6 values (14, 'Tom');
```

### 视图的更新

要使视图可更新，视图中的行与基础表中的行之间必须存在一对一的关系。如果视图包含以下任何一项，则该视图不可更新:

1. 聚合函数或窗口函数(`SUM()`, `COUNT()`,` MAX()`, `MIN()`等)
2. `DISTINCT`
3. `GROUP BY`
4. `HAVING`
5. `UNION`或`UNION ALL`

视图当中的行必须和基表当中的行一一对应, 视图才可以进行更新.

### 视图的作用

1. **简单**: 视图不仅可以简化用户对数据的理解, 也可以简化他们的操作. 那些被经常使用的查询可以被定义为视图, 从而使得用户不必为以后的操作每次指定全部的条件.
2. **安全**: 数据库可以授权, 但不能授权到数据库特定行和特定的列上. 通过视图用户只能查询和修改他们所能见到的数据.
3. **数据独立**: 视图可帮助用户屏蔽真实表结构变化带来的影响.

### 案例

```sql
# 案例
# 1. 为了保证数据库表的安全性，开发人员在操作tb_user表时，只能看到的用户的基本字段，屏蔽手机号和邮箱两个字段
create or replace view tb_user_view as select id, name, profession, age, gender, status, createtime from tb_user;

select * from tb_user_view;


# 2. 查询每个学生所选修的课程(三张表联查)，这个功能在很多的业务中都有使用到，为了简化操作，定义一个视图
# 查询语句
select s.name, s.no, c.name from student s, student_course sc, course c where s.id = sc.studentid and sc.courseid = c.id;

# 设计视图
create view tb_stu_course_view as select s.name student_name, s.no student_number, c.name course_name from student s, student_course sc, course c where s.id = sc.studentid and sc.courseid = c.id;


# 下次不需要写三表联查 只需要查询视图
select * from tb_stu_course_view;
```

## 锁

## 表优化
