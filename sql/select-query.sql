select * from tripwith.user;
select * from tripwith.avatar;
select * from tripwith.category;
select * from tripwith.plan;
select * from tripwith.plan_tag_mapping;
select * from tripwith.plan_tag;
select * from tripwith.plan_comment;
select * from tripwith.avatar_like_plan;	
select * from tripwith.plan_detail;
select * from tripwith.location;
select * from tripwith.location_type;
select * from tripwith.location_type_mapping;

SET SQL_SAFE_UPDATES = 0;
update tripwith.plan_detail set price=null;