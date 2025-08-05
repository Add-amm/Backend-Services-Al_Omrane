import { sync } from '../config/database.js';
import { Agence } from '../models/relations.js';

async function seedAgences(){
    try{
        await sync();

        const exists = await Agence.findAll();

        if(exists.length === 0){

            await Agence.bulkCreate([
                { id: 1, type: 'Direction', nom: 'Direction Générale' },
                { id: 2, type: 'Direction', nom: 'Direction des Ressources Humaines' },
                { id: 3, type: 'Direction', nom: "Direction des Systèmes d'Information" },
                { id: 4, type: 'Direction', nom: 'Direction Financière' },
                { id: 5, type: 'Direction', nom: 'Direction Juridique' },
                { id: 6, type: 'Direction', nom: 'Direction Audit et Contrôle de Gestion' },
                { id: 7, type: 'Direction', nom: 'Direction Communication et Partenariats' },
                { id: 8, type: 'Direction', nom: "Direction de la Maîtrise d'Ouvrage" },
                { id: 9, type: 'Direction', nom: 'Direction du Développement' },
                { id: 10, type: 'Direction', nom: 'Direction des Achats et Logistique' },
                { id: 11, type: 'Agence', nom: 'Agence Rabat' },
                { id: 12, type: 'Agence', nom: 'Agence Casablanca' },
                { id: 13, type: 'Agence', nom: 'Agence Marrakech' },
                { id: 14, type: 'Agence', nom: 'Agence Fès' },
                { id: 15, type: 'Agence', nom: 'Agence Agadir' },
                { id: 16, type: 'Agence', nom: 'Agence Tanger' },
                { id: 17, type: 'Agence', nom: 'Agence Meknès' },
                { id: 18, type: 'Agence', nom: 'Agence Oujda' },
                { id: 19, type: 'Agence', nom: 'Agence Tétouan' },
                { id: 20, type: 'Agence', nom: 'Agence Safi' },
            ]);
        
        }

    } catch(error){
        console.error('Agence Seeding error:', error);
        process.exit(1);
    }
};

export default seedAgences;