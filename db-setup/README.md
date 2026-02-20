Folder will contain set up for database
Will be using postgresql

To use
run ./build.sh

to Query to check if working
run ./query.sh

When finished remove container and image 
run ./clean.sh

To remove the volume for the database (deleting all its contents), [needed when updating schema]
run ./remove_volume.sh