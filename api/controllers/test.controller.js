import jwt from 'jsonwebtoken';

export const shouldBeLoggedIn = async (req, res) => {
    //console.log(req.userId);
    res.status(200).json({message: 'Usuário autenticado!'}); 
}

export const shouldBeAdmin = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({message: 'Usuário não autenticado!'});
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (error, payload) => {
        if (error) {
            res.status(403).json({message: 'Token inválido!'});
        }

        if (!payload.isAdmin) {
            return res.status(403).json({message: 'Usuário não autorizado!'});
        }

        res.status(200).json({message: 'é admin'});
    });

    
}