// middlewares/errorHandler.js
import winston from 'winston';

const logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log' }),
        new winston.transports.Console()
    ]
});
const errorHandler = (err, req, res, next) => {
    // Log dell'errore per il debugging
    logger.error(err.stack);

    // Determina il codice di stato dell'errore
    const statusCode = err.statusCode || err.status || 500;

    // Crea un messaggio di errore standardizzato
    const message = err.message || 'Qualcosa è andato storto.';

    // Gestione degli errori specifici
    if (err.name === 'ValidationError' || err.status === 400) {
        return res.status(400).json({
            status: 'error',
            error: 'Richiesta non valida',
            message: message
        });
    }

    if (err.status === 401) {
        return res.status(401).json({
            status: 'error',
            error: 'Errore di autenticazione',
            message: message
        });
    }

    if (err.status === 403) {
        return res.status(403).json({
            status: 'error',
            error: 'Accesso negato',
            message: message
        });
    }

    if (err.status === 404) {
        return res.status(404).json({
            status: 'error',
            error: 'Risorsa non trovata',
            message: message
        });
    }

    // Errore generico
    res.status(statusCode).json({
        status: 'error',
        error: 'Errore Interno del Server',
        message: message
    });
};

export default errorHandler;
