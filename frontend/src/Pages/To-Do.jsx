//To-Do.jsx
import React from "react";
import cron from 'node-cron';
import { sendPushNotification } from '../utils/pushNotification';
import Task from '../models/Task';
import User from '../models/User';

export default function ToDo() {
    cron.schedule('0 8 * * *', async () => { // Ogni giorno alle 8 del mattino
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
      
        try {
          const tasks = await Task.find({ dueDate: { $lte: tomorrow }, status: 'pending' });
          tasks.forEach(async (task) => {
            const user = await User.findById(task.user);
            if (user.token) {
              sendPushNotification(user.token, {
                title: 'Attività in scadenza',
                body: `La tua attività "${task.title}" scade domani!`,
              });
            }
          });
          console.log('Notifiche push inviate per le attività in scadenza.');
        } catch (err) {
          console.error('Errore nell\'invio delle notifiche per le attività in scadenza:', err);
        }
      });
      
    return(
        
        <h1>TO-DO</h1>

    )
};