import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const registerController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await authService.registerUser(email, password);
    return res.status(201).json({ message: 'User created successfully', user });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const data = await authService.loginUser(email, password);
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(401).json({ message: 'Invalid credentials', error: error.message });
  }
};