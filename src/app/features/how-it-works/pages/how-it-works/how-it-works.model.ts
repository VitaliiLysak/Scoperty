import { SafeHtml } from '@angular/platform-browser';

export interface SellingStatusExplanation {
  sellingStatus: string;
  title: string;
  text: string | SafeHtml;
}

export const SELLING_STATUS_EXPLANATIONS: SellingStatusExplanation[] = [
  {
    sellingStatus: 'ForSale',
    title: `Vom Eigentümer zum Verkauf stehende gestellte Immobilien sind auf dem Scoperty
            Marktplatz als markiert mit „Zum Verkauf“.`,
    text: `Neben dem Kaufpreis zeigt Scoperty hier einen Schätzwert an, der auf Grundlage
          unseres Algorithmus berechnet wird. So kann der Kaufpreis direkt mit dem Schätzwert
          und ähnlichen Objekten der Umgebung verglichen werden. Der Algorithmus verarbeitet
          zur Berechnung des Schätzwerts sowohl Standortdaten als auch Merkmale der jeweiligen
          Immobilie und Merkmale von Vergleichsobjekten.`,
  },
  {
    sellingStatus: 'MakeMeMove',
    title: `Mit dem Status „Offen für Gebote“ kann der Eigentümer einer Immobilie potenziellen
            Käufern signalisieren, dass er zwar noch keinen Verkauf geplant hat, aber gerne Gebote erhält.`,
    text: `Eigentümer bekommen dadurch einen besseren Eindruck, was ihre Immobilie auf dem Markt
          wirklich wert ist. Kaufinteressenten wissen jetzt, dass der Eigentümer ihre Angebote
          zeitnah prüfen wird und möglicherweise seine Immobilie verkauft, wenn die Konditionen ihn überzeugen.`,
  },
  {
    sellingStatus: 'Active',
    title: `Alle Immobilien sind mit ihrem geschätzten Wert versehen.`,
    text: `<p>Wir berechnen diesen Wert mittels eines speziellen Algorithmus auf Basis öffentlich
          zugänglicher Daten zu allen 42 Millionen Immobilien in Deutschland. Genauere Informationen
          dazu findest du in den <a id="hiw-faq-link"
            class="default_link"
            href="howitworks#faq"
          >FAQs</a>.</p>
          <p>Nach der Registrierung und Verifizierung bei Scoperty können Eigentümer durch die
          Eingabe zusätzlicher Informationen den Schätzwert ihrer Immobilie verbessern.</p>`,
  },
  {
    sellingStatus: 'Idle',
    title: 'Deaktivierte Immobilien werden auf Wunsch des Eigentümers im Moment nicht angezeigt.',
    text: `Diese Immobilien sind auf der Karte nicht mehr aufzufinden und nicht erreichbar
          für Gebote von Interessenten.`,
  },
];
