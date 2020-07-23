# online-store-api
Online store api using NodeJS

I used express to create server and express-validation to validate data
By default it will work for xampp mysql database

database template:
Stock:
Contains id,nazwa(name) of device and typ(type) which representing the name of database which contains more
specific information about the device. Last column is img (can be Null or "")

Typ:
database in which you can add specific for a given device .You can as much columns as you want
but id must be a foreign key referened to stock.id


This api:
Firstly- specify a content which is a filtered or not filtered columns from database typ
Secoundly - return a filter list which is based on the Typ database columns names and only distinced values of them

 first and secound functions are same but it specified whether it 's defined filters or not
