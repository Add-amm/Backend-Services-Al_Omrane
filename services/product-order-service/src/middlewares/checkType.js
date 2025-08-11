async function checkType(req, res, next) {
    const { type } = req.body;

    if (!['Entretien', 'Informatique', 'Bureautique'].includes(type)){
        return res.status(400).json({ message: "Type invalide" })
    };
    next();
}

export default checkType;