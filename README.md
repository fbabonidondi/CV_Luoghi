# Vue Luoghi App

Un'applicazione Vue.js che mostra una lista di luoghi visitati con la possibilità di visualizzare i dettagli di ciascun luogo in un popup.

## Funzionalità

- Visualizzazione della lista dei luoghi visitati
- Popup con dettagli completi del luogo selezionato
- Visualizzazione di informazioni specifiche in base alla categoria del luogo (ristorante, chiesa, museo, rifugio, lago, parco naturale)
- Design responsive con Bootstrap

## Setup del progetto

```bash
# Installazione delle dipendenze
npm install
```

# Avvio del server di sviluppo
npm run serve
```

# Compilazione per la produzione
npm run build
```

## Struttura del progetto

- `src/assets/data/luoghi.json`: Dati dei luoghi in formato JSON
- `src/components/LuoghiList.vue`: Componente per la visualizzazione della lista dei luoghi
- `src/components/LuogoDetails.vue`: Componente per il popup con i dettagli del luogo selezionato
- `src/App.vue`: Componente principale dell'applicazione