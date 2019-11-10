CREATE TABLE children (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    childname TEXT not null
);

CREATE TYPE category  AS ENUM ('school');

CREATE TABLE IF NOT EXISTS flyers (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    title TEXT not null,
    flyerimage BYTEA not null,
    eventlocation TEXT not null,
    eventstartdate TIMESTAMP not null,
    eventenddate TIMESTAMP not null,
    actiondate TIMESTAMP,
    flyeraction TEXT,
    flyercategory category
    
);

CREATE TABLE flyers_children (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    flyerid INTEGER REFERENCES flyers (id) ON DELETE CASCADE,
    childid INTEGER REFERENCES children (id) ON DELETE CASCADE
);


