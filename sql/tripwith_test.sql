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