import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { Agence, User, Role } from '../models/relations.js';
import redisClient from '../config/redis.js';

dotenv.config();

// ==================== Helper function to generate passwords ====================
function generateRandomPassword(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

// ==================== GET All Users ====================
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            where: {bloquer: false},
            attributes: ['id', 'nom', 'prenom', 'email'],
            include: [
                {
                    model: Agence,
                    attributes : ['nom']    
                }
            ]
        });

        res.json(users);
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
};

// ==================== GET User ====================
export const getUserById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const user = await User.findOne({
        where: { id, bloquer: false },
        attributes: { exclude: ['id_role', 'id_agence', 'mdp', 'bloquer', 'createdAt', 'updatedAt']},
        include: [
            {
                model: Agence,
                attributes: ['type', 'nom']
            },
            {
                model: Role,
                attributes: ['nom']
            }
        ]
      });
  
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// ==================== CREATE User ====================
export const createUser = async (req, res) => {
    try {
        const {
            id,
            username,
            nom,
            prenom,
            id_role,
            date_naissance,
            email,
            id_agence
        } = req.body;

        // Verification de l'unicité du username et email
        const existingUser = await User.findOne({
            where: {
              [Op.or]: [
                { username },
                { email }
              ]
            }
          });

          if (existingUser){
            return res.status(400).json({message: "Nom d'utilisateur ou email déjà utilisé."})
          }

          const password = generateRandomPassword(8);
          const hashedPassword = await bcrypt.hash(password, 10); // Hasher le mdp

          // Insértion dans la base de données
          const newUser = await User.create({
            id,
            username,
            nom,
            prenom,
            id_role,
            date_naissance,
            email,
            id_agence,
            mdp: hashedPassword
          });

          // Retourne uniquement le mot de passe généré
          res.status(201).json({ mot_de_passe: password });

    } catch(error) {
        res.status(500).json({ message : error.message });
    }
};

// ==================== UPDATE User ====================
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Récupération des champs à mettre à jour
        const {
            username,
            nom,
            prenom,
            id_role,
            date_naissance,
            email,
            id_agence
        } = req.body;

        // Vérifie que l'utilisateur existe
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Vérifie si username ou email sont déjà utilisés par un autre utilisateur
        const existingUser = await User.findOne({
            where: {
                [Op.and]: [
                    {
                      [Op.or]: [
                        { username },
                        { email }
                      ]
                    },
                    { id: { [Op.ne]: id } },
                    { bloquer: false }
                  ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: "Nom d'utilisateur ou email déjà utilisé." });
        };

        // Mise à jour des champs
        await user.update({
            username,
            nom,
            prenom,
            id_role,
            date_naissance,
            email,
            id_agence
        });

        res.status(200).json({ message: "Utilisateur mis à jour avec succès." });

    } catch(error) {
        res.status(500).json({ message : error.message });
    }
};

// ==================== UPDATE this User's password ====================
export const updateThisUserPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        // 1. Validation
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({ message: 'Tous les champs sont requis.' });
        };

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: 'Les nouveaux mots de passe ne correspondent pas.' });
        };

        // 2. Avoir l'utilisateur actuel en utilisant le token
        const user = await User.findByPk(req.user.id);
        if (!user){
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        };

        // 3. Vérifier le mot de passe
        const isMatch = await bcrypt.compare(currentPassword, user.mdp);
        if (!isMatch){
            return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
        }

        // 4. Vérifier que le nouveau mot de passe est différent de l'ancien
        if (currentPassword === newPassword){
            return res.status(400).json({ message: "Le nouveau mot de passe doit être différent de l'ancien" });
        };

        // 5. Hashage et modification dans la base de données
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.mdp = hashedPassword;
        user.save();

        return res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });

    } catch(error) {
        res.status(500).json({ message : error.message });
    }
};

// ==================== DELETE User ====================
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (user.bloquer) {
      return res.status(400).json({ message: "Utilisateur déjà bloqué." });
    }

    user.bloquer = true;
    await user.save();

    // Supprime le token hash de la liste Redis (AllowList)
    await redisClient.del(`user:${id}:tokens`);

    res.status(200).json({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};