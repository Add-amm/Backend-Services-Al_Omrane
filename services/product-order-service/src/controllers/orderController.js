import { Order, Product } from '../models/relations.js';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';
import { limitEntretien, limitBureautique, limitInformatique, responsableMail } from '../config/productLimits.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL || "http://notification-service:4000";

// ==================== HELPER FUNCTIONS ==================
async function checkStock(id_produit, quantite) {
    const wantedProduct = await Product.findByPk(id_produit);

    if (!wantedProduct) {
      throw new Error('Produit non trouvé');
    }
    if (quantite > wantedProduct.stock) {
      throw new Error('Stock insuffisant');
    }
};

async function sendAlert(nom) {
    try {
        await axios.post(`${notificationServiceUrl}/send`, {
            to: responsableMail,
            subject: "Stock alert",
            html: `<h1>Le stock du produit « ${nom} » est passé en dessous de la limite.</h1>`
        })
    } catch (error) {
        // do nothing
    }
};


// ==================== GET All Orders ====================
export const getAllOrders = async (req, res) => {
    try {
      const orders = await Order.findAll();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// ==================== GET All Orders for directeur ====================
export const getAllOrdersForDirecteur = async (req, res) => {
    try {
      // Récupérer l'id de l'agence de l'utilisateur connecté
      const userAgenceId = req.user.id_agence;
  
      const orders = await Order.findAll({
        include: [
          {
            model: User,
            attributes: ['id', 'id_agence'],
            where: {
              id_agence: userAgenceId,
            },
          },
        ],
        where: {
          statut: {
            [Op.in]: ['en_attente_directeur', 'accepte', 'rejete'],
          },
        },
        order: [
          [
            // ORDER BY CASE statut WHEN 'en_attente_directeur' THEN 0 ELSE 1 END
            sequelize.literal(`CASE WHEN statut = 'en_attente_directeur' THEN 0 ELSE 1 END`),
            'ASC',
          ],
          ['n_demande', 'DESC'], // ensuite tri par numéro de demande décroissant
        ],
      });
  
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // ==================== GET All Orders for responsable ====================
export const getAllOrdersForResponsable = async (req, res) => {
    try {
  
      const orders = await Order.findAll({
        where: {
          statut: {
            [Op.in]: ['en_attente_responsable', 'accepte', 'rejete'],
          },
        },
        order: [
          [
            // ORDER BY CASE statut WHEN 'en_attente_directeur' THEN 0 ELSE 1 END
            sequelize.literal(`CASE WHEN statut = 'en_attente_responssable' THEN 0 ELSE 1 END`),
            'ASC',
          ],
          ['n_demande', 'DESC'], // ensuite tri par numéro de demande décroissant
        ],
      });
  
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// ==================== GET All Orders by category ====================
export const getAllOrdersByStatut = async (req, res) => {
    try {
        let { statut } = req.query; // 3 possibilités : en_attente, accepte, rejete

        const id_role = req.user.id_role;

        const en_attente_mapper = {
            1: "en_attente_responsable",
            2: "en_attente_directeur"
        };

        if (statut === "en_attente"){
            statut = en_attente_mapper[id_role];
        }

        const orders = await Order.findAll({
            where: { statut }
        });

        res.json(orders);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==================== GET Order by ID ====================
export const getOrderById = async (req, res) => {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id);
  
      if (!order) {
        return res.status(404).json({ message: 'Demande non trouvée' });
      }
  
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// ==================== CREATE Order ====================
export const createOrder = async (req, res) => {
    try {
        // Check s'il existe une demande en attente
        const id_demandeur = req.user.id;
        const existingOrder = await Order.findOne({
            where: { id_demandeur,
              statut: {
                [Op.in]: ['en_attente_responsable', 'en_attente_directeur']
              }
            }
        });

        if (existingOrder) {
            return res.status(403).json({ message: "Vous avez déjà une demande en attente" });
        }

        const { id_produit, quantite } = req.body;

        // Check si le stock est suffisant
        await checkStock(id_produit, quantite);

        // Création de la demande
        const newOrder = await Order.create({
            id_demandeur,
            id_produit,
            quantite
        });

        res.status(201).json(newOrder);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==================== UPDATE Order ====================
export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const { id_produit, quantite } = req.body;

        // Check si la demande existe
        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ message: 'Demande non trouvée' });
        };

        // Check si la demande a déjà été accepté/refusé
        const status = order.statut;
        if (status !== 'en_attente_directeur') {
            return res.status(400).json({ message: 'Cette demande à déjà été traiter' })
        };

        // Check le stock
        await checkStock(id_produit, quantite);

        // Modifier la demande
        await order.update({
            id_produit,
            quantite
        });

        res.status(200).json({ message: 'Demande mise à jour avec succès.' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==================== DELETE Order ====================
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ message: "Demande non trouvé" });
        }

        await order.destroy();

        res.json({ message: "Demande supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==================== ACCEPT Order for director ====================
export const acceptOrderByDirector = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ message: "Demande non trouvée" });
        }

        order.statut = "en_attente_responsable";
        await order.save();

        return res.json({ message: "Demande acceptée par le directeur" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==================== ACCEPT Order for responsable ====================
export const acceptOrderByResponsable = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;

        const order = await Order.findByPk(id, { transaction: t });
        if (!order) {
            await t.rollback();
            return res.status(404).json({ message: "Demande non trouvée" });
        }

        if (order.statut !== "en_attente_responsable"){
            await t.rollback();
            return res.status(400).json({ message: "Cette demande ne peut pas être acceptée dans son état actuel." });
        }
        
        const wantedProduct = await Product.findByPk(order.id_produit, { transaction: t });
        if (!wantedProduct) {
            await t.rollback();
            return res.status(404).json({ message: "Produit non trouvé" });
        }

        if (wantedProduct.stock < order.quantite) {
            await t.rollback();
            return res.status(400).json({ message: `Stock insuffisant pour le produit ${wantedProduct.nom}.` });
        }

        order.statut = "accepte";
        await order.save({ transaction: t });
        
        wantedProduct.stock -= order.quantite;
        await wantedProduct.save({ transaction: t });

        await t.commit();

        // Send alert if stock < threshhold
        const limits = {
            Informatique: limitInformatique,
            Bureautique: limitBureautique,
            Entretien: limitEntretien,
        };

        if (limits[wantedProduct.type] !== undefined && wantedProduct.stock < limits[wantedProduct.type]) {
            await sendAlert(wantedProduct.nom);
        }

        return res.json({ message: "Demande acceptée" });

    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: error.message });
    }
};

// ==================== REJECT Order ====================
export const refuseOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const { motif_refus } = req.body;

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ message: "Demande non trouvée" });
        }

        if (order.statut === "accepte" || order.statut === "rejete") {
          return res.status(400).json({ message: "Cette demande à déjà été traitée." });
        }

        order.statut = "rejete";
        order.motif_refus = motif_refus;
        await order.save();

        return res.json({ message: "Demande refusée" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};