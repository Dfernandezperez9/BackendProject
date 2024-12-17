
// PROJECT TITLE

Web application with CRUD (Create, Read, Update, Delete) functionality, connected to a MongoDB database, tested with Jest and Supertest, implementing route controllers, validation for administrators, hosted on an Express server, deployed on Render, and focused entirely on user comfort.



// DESCRIPTION

Application focused entirely on user comfort, allowing CRUD operations to be performed 100% from the browser via forms, without the need for tools like Postman. However, if the administrator wishes to use tools like Postman, they can do so (see USAGE METHOD).

Forms have been implemented for the CREATE and UPDATE methods, with INPUTS that use the REQUIRE attribute to validate content and prevent empty fields. For the PRICE field, an INPUT with TYPE NUMBER has been used, which does not allow letters. For fields like SIZE and CATEGORY, INPUTS with TYPE SELECT have been used, with limited options.

However, the necessary logic has been implemented within the endpoint code using CONDITIONALS to include validation, so that if the administrator wishes to use a tool like Postman, they can do so, and if they make a mistake, the terminal will return a CUSTOMIZED ERROR.

If the user is not validated, access to the administration areas is COMPLETELY RESTRICTED.

Given the nature of the application, both the UPDATE and DELETE methods have been implemented using the POST method, since the use of FORMS does not accept the PUT or DELETE methods. An attempt was made to use dependencies like METHOD-OVERRIDE, but the result was not satisfactory.

If testing is desired, it is recommended to do so as a last resort, since running the tests DELETES ALL ELEMENTS from the database.



// USAGE METHOD

Using the application is simple:

If you are an UNVALIDATED USER: Access is limited, ONLY the views /products and products/:_id will be available, which allow the visualization of products in detail, but DO NOT ALLOW modification of the same. The user can only access the endpoint "/products" through the "ENTER AS GUEST" link and the endpoint "/products/:_id" through the link in the product container that they wish to view. The first endpoint allows visualization of all products in detail, while the second endpoint allows visualization of the selected product in a CLOSER perspective. However, neither endpoint allows MODIFICATION of the products. The user can navigate, VIEW all products, and return to the beginning when desired.

If you are a VALIDATED ADMINISTRATOR: Access is complete, the VALIDATED ADMINISTRATOR can navigate freely through all endpoints, access the visualization areas, and also access the creation, editing, and deletion areas of products, which are displayed with a SIMILAR interface to the visualization area but contain BUTTONS that allow the administrator to access the editing view or simply DELETE THE SELECTED PRODUCT. If the administrator wishes to ADD a new product, they have a BUTTON with POSITION FIXED in the top left corner that will REDIRECT them immediately to the CREATION FORM. (To access as an administrator, enter User: admin1, Password: password1).

After LOGGING IN, LOGGING OUT, CREATING, EDITING, or DELETING a product, the administrator will be immediately REDIRECTED to a SUCCESS view related to the process.

If the showcase is EMPTY, the server will display the EMPTY DASHBOARD view, which contains links to RETURN TO THE BEGINNING, LOG OUT, and CREATE A PRODUCT.

If the administrator wishes to use a tool like Postman, they must use the POST method, not only to execute a POST method but also to execute a PUT or DELETE method (example: Select the POST method, write the endpoint /dashboard/delete/"+ corresponding _id" will delete the desired product), given the nature of the application (BASED ON FORMS), and must send both POST and PUT requests using the FORM-DATA function of Postman due to the use of the MULTER dependency, which allows selecting local files in BINARY FORMAT.



// DEPENDENCIES USED

BCRYPT, COOKIE-PARSER, CRYPTO, AND JSONWEBTOKEN: Dependencies used for administrator registration and validation in the different endpoints that require it.

DOTENV: Dependency used to collect private development data, such as the MONGO_URI in this case.

EJS: Dependency used to render individual HTML responses with variable interpolation and custom CSS.

EXPRESS: Dependency used for server generation.

MONGOOSE: Dependency used for connecting the server to the MongoDB database.

MULTER: Dependency used to allow uploading local files like .jpg in binary format.

CORS: Dependency used to allow access from external domains.