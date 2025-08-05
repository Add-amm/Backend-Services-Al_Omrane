import { sync } from '../config/database.js';
import { Role } from '../models/relations.js';

async function seedRoles(){
    try{
        await sync();
        const exists = await Role.findAll();

        if(exists.length === 0){

            await Role.bulkCreate([
                {
                    id: 1,
                    nom: 'Responsable'
                },
                {
                    id: 2,
                    nom: 'Directeur'
                },
                {
                    id: 3,
                    nom: 'Employé'
                }
            ]);

        }

    } catch(error){
        console.error('Role Seeding error:', error);
        process.exit(1);
    }
}

export default seedRoles;