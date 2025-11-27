const TEMPLATE_FILE = './src/templates/card-template.html';
const TOTAL_CARDS = 30;

// Funktion 1/9: Startpunkt, initialisiert Modal, lädt Template
const initializeApp = () => {
    // 1. Materialize Modal initialisieren
    $('.modal').modal();
    loadTemplateAndRender();
};

// Funktion 2/9: Lädt das Template asynchron
const loadTemplateAndRender = () => {
    $.get(TEMPLATE_FILE)
        .done(handleTemplateSuccess)
        .fail(handleTemplateFailure);
};

// Funktion 3/9: Erfolgs-Handler für den Template-Ladevorgang
const handleTemplateSuccess = (rawTemplate) => {
    const templateMarkup = rawTemplate.trim();
    const generatedHtml = generateGridHtml(templateMarkup);
    
    $('#cardGrid').html(generatedHtml);
    bindEventListeners();
};

// Funktion 4/9: Generiert das gesamte HTML-Markup
const generateGridHtml = (templateMarkup) => {
    let h = '';
    
    for (let i = 1; i <= TOTAL_CARDS; i++) {
        h += renderSingleCard(templateMarkup, i);
    }
    
    return h;
};

// Funktion 5/9: Rendert eine einzelne Karte
const renderSingleCard = (templateMarkup, id) => {
    // Ersetze Platzhalter {{ID}} durch den aktuellen Schleifenwert
    return templateMarkup.replace(/{{ID}}/g, id);
};

// Funktion 6/9: Fehler-Handler für den Template-Ladevorgang
const handleTemplateFailure = () => {
    console.error(`Fehler beim Laden des Templates von ${TEMPLATE_FILE}.`);
    $('#cardGrid').html('<p class="red-text">Laden des Karten-Templates fehlgeschlagen.</p>');
};

// Funktion 7/9: Bindet alle Event-Handler (Delegation)
const bindEventListeners = () => {
    // 2. Event Delegation: Open Modal
    $('#cardGrid').on('click', '.card', handleCardClick);
    // 3. Close Modal
    $('#modalCloseButton').on('click', handleModalClose);
};

// Funktion 8/9: Click-Handler für eine einzelne Karte (Öffnet Modal)
const handleCardClick = (e) => {
    const d = $(e.currentTarget).data(); // Datenattribute abrufen
    
    // Modal-Inhalt füllen
    $('#modalTitle').text(d.t);
    $('#modalSubtitle').text(`ID: ${d.id} | ${d.sub}`);
    $('#modalBody').text(d.body || 'Kein weiterer Text verfügbar.');
    
    // Modal öffnen (Materialize/jQuery API)
    $('#cardModal').modal('open');
};

// Funktion 9/9: Close-Handler für das Modal
const handleModalClose = () => {
    $('#cardModal').modal('close');
};

// Gesamte Logik starten, sobald das DOM vollständig geladen ist
$(document).ready(initializeApp);