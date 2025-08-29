import { Request, Response, NextFunction } from 'express';
import { supabase } from '../supabaseClient';
import { User } from '@supabase/supabase-js';

// 1. Extender la interfaz Request de Express para añadir la propiedad 'user'
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 2. Extraer el Bearer Token de la cabecera
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: Missing or invalid token format.' });
    }
    const token = authHeader.split(' ')[1];

    // 3. Validar el token con Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    // 4. Si el token es inválido, devolver error
    if (userError || !user) {
      return res.status(401).json({ message: 'Unauthorized: Invalid or expired token.', error: userError?.message });
    }

    // 5. Si el token es válido, adjuntar el usuario a la request
    req.user = user;

    // 6. Pasar al siguiente middleware
    next();
  } catch (error) {
    return res.status(500).json({ message: 'An internal error occurred during authentication.' });
  }
};
