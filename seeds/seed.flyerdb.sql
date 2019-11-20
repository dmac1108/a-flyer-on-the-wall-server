INSERT INTO users (firstname, lastname, email, username, user_password)
VALUES
('Jane', 'Smith', 'jane.smith@test.com', 'jsmith', 'apassword'),
('Anita', 'Jones', 'anita.jones@test.com', 'ajones', 'apassword');

INSERT INTO children (childname, parentid) 
VALUES
('Fred', 1),
('Sally', 2),
('Jane', 2);

INSERT INTO flyers (title, flyerimage, eventlocation, eventstartdate, eventenddate, actiondate, flyeraction, flyercategory, parentuserid)
VALUES
('Corn Maze', 'data:image/jpeg;base64,' || pg_read_binary_file('/Volumes/External19/bloc/a-flyer-on-the-wall-server/src/cornmazebase64.bin'), 'Best Corn Maze', '10/15/19 15:30','10/15/19 17:00','10/10/19','RSVP','school',1 ),
('Field Trip', 'data:image/jpeg;base64,' || pg_read_binary_file('/Volumes/External19/bloc/a-flyer-on-the-wall-server/src/afterschoolbase64.bin'), 'Washington D.C.', '11/13/19 13:00','11/13/19 15:00','9/5/19','Send Permission Slip','school',1 ),
('Camping', 'data:image/jpeg;base64,' || pg_read_binary_file('/Volumes/External19/bloc/a-flyer-on-the-wall-server/src/campingbase64.bin'), 'Camp Lost In the Woods', '9/3/19 9:30','9/4/19 10:30','10/20/19','Pay','school',2);

INSERT INTO flyers_children (flyerid, childid)    
VALUES 
(1,1),
(2,1),
(3,2),
(3,3);

