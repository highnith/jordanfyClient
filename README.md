# Jordanfy Client

App mobile per la ricerca e l'ascolto di musica, sviluppata in **React Native** con **Expo**. È il client del progetto [JordanfyServer](https://github.com/highnith/JordanfyServer), il backend Python/FastAPI che gestisce ricerca, download e streaming audio.

## Funzionalità

- **Ricerca canzoni**: ricerca brani tramite il backend Jordanfy e visualizzazione dei risultati
- **Riproduzione**: streaming diretto dei brani selezionati
- **Playlist**: creazione e gestione di playlist personali
- **Salvataggio locale**: le playlist possono essere salvate direttamente sul telefono, per essere consultate anche senza dover rieffettuare la ricerca

## Stack tecnico

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- Backend: [JordanfyServer](https://github.com/highnith/JordanfyServer) (Python, FastAPI)

## Requisiti

- [Node.js](https://nodejs.org/) (LTS consigliata)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`, oppure uso diretto tramite `npx`)
- App **Expo Go** sul telefono (per testare su dispositivo fisico), oppure un emulatore Android/iOS
- Un'istanza attiva di [JordanfyServer](https://github.com/highnith/JordanfyServer) raggiungibile dal client



## Struttura del progetto

```
jordanfyClient/
├── app/                # Schermate principali (ricerca, playlist, player)
├── components/         # Componenti riutilizzabili dell'interfaccia
├── assets/             # Icone e risorse statiche
└── app.json            # Configurazione Expo
```

> La struttura sopra è indicativa: aggiornala in base all'organizzazione reale delle cartelle del progetto.

## Backend richiesto

L'app necessita di un'istanza attiva di **JordanfyServer** per funzionare: la ricerca, il download e lo streaming dei brani avvengono tramite chiamate REST al backend. Vedi il [repository del server](https://github.com/highnith/JordanfyServer) per le istruzioni di avvio.

## Roadmap / possibili sviluppi futuri

- [ ] Sincronizzazione playlist su più dispositivi
- [ ] Modalità offline per i brani scaricati
- [ ] Miglioramenti UI/UX

## Licenza

Progetto personale a scopo di apprendimento.
