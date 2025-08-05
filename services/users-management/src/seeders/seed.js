import connectDB from "../config/database.js";
import seedAgences from "./seedAgences.js";
import seedRoles from "./seedRoles.js";
import seedUsers from "./seedUsers.js";

const seed = async() => {
    try{
        await connectDB.authenticate();
        await connectDB.sync();

        await seedRoles();
        await seedAgences();
        await seedUsers();

        console.log('Seeding complete');

    } catch(error){
        console.error('Error seeding:', error);
    } finally {
        await connectDB.close();
    }
};

seed();