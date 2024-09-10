import mongoose from 'mongoose';

const userPreferencesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  theme: {
    type: String,
    default: 'default', // Possibili temi: default, dark, light
  },

  dashboardLayout: {
    type: String,
    default: 'default', // Layout della dashboard, può essere cambiato in base alle preferenze dell'utente
    // Possibili layout: default, grid, list
    
  },

  widgets: {
    type: [String], // Array di widget personalizzati (e.g. meteo, notizie)
    default: ['tasks', 'calendar'],
    // Aggiungi qui i widget che l'utente vuole visualizzare nella dashboard
    // Ad esempio: ['weather', 'news', 'tasks']
    // Ogni elemento dell'array rappresenta un widget personalizzato
  },

  integrations: {
    googleDrive: {
      type: Boolean,
      default: false,
      // Aggiungi qui eventuali altre opzioni di integrazione
      // Ad esempio: googleDrive, slack, etc.
      // Se l'utente ha abilitato l'integrazione con Google Drive,
      // può scegliere di visualizzare i file in una cartella specifica
      // oppure di visualizzare solo i file più recenti.
    },

    email: {
      type: Boolean,
      default: false,
      // Aggiungi qui eventuali altre opzioni di integrazione
      // Ad esempio: email, slack, etc.
      // Se l'utente ha abilitato l'integrazione con Google Drive,
      // può scegliere di visualizzare i file in una cartella specifica
      // oppure di visualizzare solo i file più recenti.
    },

    calendar: {
      type: Boolean,
      default: false,
      // Aggiungi qui eventuali altre opzioni di integrazione
      // Ad esempio: email, slack, etc.
      // Se l'utente ha abilitato l'integrazione con Google Drive,
      // può scegliere di visualizzare i file in una cartella specifica
      // oppure di visualizzare solo i file più recenti.
    },

  },
  
});

const UserPreferences = mongoose.model('UserPreferences', userPreferencesSchema);

export default UserPreferences;
