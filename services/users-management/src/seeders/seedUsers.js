import { sync } from '../config/database.js';
import { User } from '../models/relations.js';
import bcrypt from 'bcrypt';



async function seedUsers(){
    try{
        await sync();
        const exists = await User.findAll();

        if(exists.length === 0){
            const hashedPassword = await bcrypt.hash('password123', 10);

            await User.bulkCreate([
                {
                    id: 'U000001',
                    username: 'ahmed_bensalem',
                    nom: 'Bensalem',
                    prenom: 'Ahmed',
                    id_role: 2,
                    date_naissance: '1990-04-12',
                    email: 'ahmed.bensalem@al-omrane.ma',
                    id_agence: 5,
                    mdp: hashedPassword
                },
                {
                    id: 'U100002',
                    username: 'fatima_belaidi',
                    nom: 'Belaidi',
                    prenom: 'Fatima',
                    id_role: 2,
                    date_naissance: '1990-12-22',
                    email: 'fatima_belaidi@al-omrane.com',
                    id_agence: 8,
                    mdp: hashedPassword
                },
                {
                    id: 'U100003',
                    username: 'youssef_chekroun',
                    nom: 'Chekroun',
                    prenom: 'Youssef',
                    id_role: 3,
                    date_naissance: '1978-03-10',
                    email: 'youssef_chekroun@al-omrane.com',
                    id_agence: 3,
                    mdp: hashedPassword
                },
                {
                    id: 'U100004',
                    username: 'salma_dahbi',
                    nom: 'Dahbi',
                    prenom: 'Salma',
                    id_role: 1,
                    date_naissance: '1982-09-05',
                    email: 'salma_dahbi@al-omrane.com',
                    id_agence: 14,
                    mdp: hashedPassword
                },
                {
                    id: 'U100005',
                    username: 'mohamed_eihassani',
                    nom: 'El Hassani',
                    prenom: 'Mohamed',
                    id_role: 2,
                    date_naissance: '1995-04-28',
                    email: 'mohamed_eihassani@al-omrane.com',
                    id_agence: 11,
                    mdp: hashedPassword
                },
                {
                    id: 'U100006',
                    username: 'khadija_fassi',
                    nom: 'Fassi',
                    prenom: 'Khadija',
                    id_role: 3,
                    date_naissance: '1987-11-17',
                    email: 'khadija_fassi@al-omrane.com',
                    id_agence: 7,
                    mdp: hashedPassword
                },
                {
                    id: 'U100007',
                    username: 'hicham_ghouati',
                    nom: 'Ghouati',
                    prenom: 'Hicham',
                    id_role: 1,
                    date_naissance: '1992-01-23',
                    email: 'hicham_ghouati@al-omrane.com',
                    id_agence: 7,
                    mdp: hashedPassword
                },
                {
                    id: 'U100008',
                    username: 'imane_hamdani',
                    nom: 'Hamdani',
                    prenom: 'Imane',
                    id_role: 2,
                    date_naissance: '1980-07-30',
                    email: 'imane_hamdani@al-omrane.com',
                    id_agence: 12,
                    mdp: hashedPassword
                },
                {
                    id: 'U100009',
                    username: 'karim_idrissi',
                    nom: 'Idrissi',
                    prenom: 'Karim',
                    id_role: 3,
                    date_naissance: '1984-05-14',
                    email: 'karim_idrissi@al-omrane.com',
                    id_agence: 12,
                    mdp: hashedPassword
                },
                {
                    id: 'U100010',
                    username: 'leila_jilali',
                    nom: 'Jilali',
                    prenom: 'Leila',
                    id_role: 1,
                    date_naissance: '1975-10-09',
                    email: 'leila_jilali@al-omrane.com',
                    id_agence: 12,
                    mdp: hashedPassword
                },
                {
                    id: 'U100011',
                    username: 'mouna_kabbaj',
                    nom: 'Kabbaj',
                    prenom: 'Mouna',
                    id_role: 2,
                    date_naissance: '1991-02-21',
                    email: 'mouna_kabbaj@al-omrane.com',
                    id_agence: 20,
                    mdp: hashedPassword
                },
                {
                    id: 'U100012',
                    username: 'nabii_laassai',
                    nom: 'Laassai',
                    prenom: 'Nabil',
                    id_role: 3,
                    date_naissance: '1989-08-11',
                    email: 'nabii_laassai@al-omrane.com',
                    id_agence: 20,
                    mdp: hashedPassword
                },
                {
                    id: 'U100013',
                    username: 'omar_mouhoub',
                    nom: 'Mouhoub',
                    prenom: 'Omar',
                    id_role: 1,
                    date_naissance: '1977-06-01',
                    email: 'omar_mouhoub@al-omrane.com',
                    id_agence: 20,
                    mdp: hashedPassword
                },
                {
                    id: 'U100014',
                    username: 'patricia_naimi',
                    nom: 'Naimi',
                    prenom: 'Patricia',
                    id_role: 2,
                    date_naissance: '1986-12-25',
                    email: 'patricia_naimi@al-omrane.com',
                    id_agence: 20,
                    mdp: hashedPassword
                },
                {
                    id: 'U100015',
                    username: 'rachid_ouhaddou',
                    nom: 'Ouhaddou',
                    prenom: 'Rachid',
                    id_role: 3,
                    date_naissance: '1993-09-13',
                    email: 'rachid_ouhaddou@al-omrane.com',
                    id_agence: 20,
                    mdp: hashedPassword
                },
                {
                    id: 'U100016',
                    username: 'sanae_rharbi',
                    nom: 'Rharbi',
                    prenom: 'Sanae',
                    id_role: 1,
                    date_naissance: '1981-04-07',
                    email: 'sanae_rharbi@al-omrane.com',
                    id_agence: 10,
                    mdp: hashedPassword
                },
                {
                    id: 'U100017',
                    username: 'tarik_sbihi',
                    nom: 'Sbihi',
                    prenom: 'Tarik',
                    id_role: 2,
                    date_naissance: '1979-11-29',
                    email: 'tarik_sbihi@al-omrane.com',
                    id_agence: 12,
                    mdp: hashedPassword
                },
                {
                    id: 'U100018',
                    username: 'valerie_tazi',
                    nom: 'Tazi',
                    prenom: 'Valérie',
                    id_role: 3,
                    date_naissance: '1983-03-19',
                    email: 'valerie_tazi@al-omrane.com',
                    id_agence: 6,
                    mdp: hashedPassword
                },
                {
                    id: 'U100019',
                    username: 'walid_zerhouni',
                    nom: 'Zerhouni',
                    prenom: 'Walid',
                    id_role: 1,
                    date_naissance: '1994-07-05',
                    email: 'walid_zerhouni@al-omrane.com',
                    id_agence: 15,
                    mdp: hashedPassword
                },
                {
                    id: 'U100020',
                    username: 'yasmine_ziani',
                    nom: 'Ziani',
                    prenom: 'Yasmine',
                    id_role: 2,
                    date_naissance: '1976-01-16',
                    email: 'yasmine_ziani@al-omrane.com',
                    id_agence: 4,
                    mdp: hashedPassword
                }
            ]);
        }

    } catch(error){
        console.error('User Seeding error:', error);
        process.exit(1);
    }
};

export default seedUsers;