import { createLead } from "@/lib/actions/leads";

export function LeadForm({ propertyId }: { propertyId: string }) {
  return (
    <form action={createLead}>
      <input type="hidden" name="propertyId" value={propertyId} />
      <h3>Contacter l&apos;agent</h3>
      <div className="field">
        <label htmlFor="name">Nom complet</label>
        <input id="name" name="name" required />
      </div>
      <div className="field">
        <label htmlFor="phone">Téléphone</label>
        <input id="phone" name="phone" type="tel" required />
      </div>
      <div className="field">
        <label htmlFor="email">Email (optionnel)</label>
        <input id="email" name="email" type="email" />
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" placeholder="Je suis intéressé(e) par ce bien..." rows={3} />
      </div>
      <button type="submit" className="btn btn--primary btn--block">Envoyer</button>
    </form>
  );
}
