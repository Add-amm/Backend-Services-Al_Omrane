export const validateLogin = (req, res, next) => {
  const { username, mdp } = req.body;
  if (!username || !mdp) {
    return res.status(400).json({ message: "Nom d'utilisateur ou mot de passe manquant" });
  }
  next();
};