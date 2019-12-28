CREATE TABLE IF NOT EXISTS flyer_categories (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    category TEXT not null,
    parentuserid INTEGER REFERENCES users (userid) ON DELETE CASCADE
    
);

ALTER TABLE flyers 
ADD COLUMN categoryid INTEGER REFERENCES flyer_categories ON DELETE RESTRICT ;


--FIRST ADD CATEGORIES FROM FLYERS INTO NEW CATEGORIES TABLE
--THEN UPDATE THE FLYERS TABLE TO USE THE NEW CATEGORY ID

INSERT INTO flyer_categories (category, parentuserid)
SELECT DISTINCT(flyercategory), parentuserid from flyers;

UPDATE flyers
 SET categoryid = flyer_categories.id
 FROM flyer_categories
 WHERE flyers.flyercategory::text = flyer_categories.category AND flyers.parentuserid = flyer_categories.parentuserid;

--remove the existing flyercategory column - wait to implement until service is updated


