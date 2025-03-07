select * from tripwith_test.user;
select * from tripwith_test.avatar;
select * from tripwith_test.category;
select * from tripwith_test.plan;
select * from tripwith_test.plan_tag_mapping;
select * from tripwith_test.plan_tag;
select * from tripwith_test.plan_comment;
select * from tripwith_test.avatar_like_plan;	
select * from tripwith_test.plan_detail;
select * from tripwith_test.location;
select * from tripwith_test.location_type;
select * from tripwith_test.location_type_mapping;

SET SQL_SAFE_UPDATES = 0;
update tripwith.plan_detail set price=null;

-- USE tripwith
-- USE tripwith_test
-- SHOW TABLES;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE article;
TRUNCATE TABLE article_comment;
TRUNCATE TABLE avatar;
TRUNCATE TABLE avatar_like_plan;
TRUNCATE TABLE category;
TRUNCATE TABLE location;
TRUNCATE TABLE location_type;
TRUNCATE TABLE location_type_mapping;
TRUNCATE TABLE plan;
TRUNCATE TABLE plan_comment;
TRUNCATE TABLE plan_detail;
TRUNCATE TABLE plan_tag;
TRUNCATE TABLE plan_tag_mapping;
TRUNCATE TABLE user;

SET FOREIGN_KEY_CHECKS = 1;
