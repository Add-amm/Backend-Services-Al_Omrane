export const validateFields = (req, res, next) => {
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

    if(!id || !username || !nom || !prenom || !id_role || !date_naissance || !email || !id_agence){
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }
    next();
}