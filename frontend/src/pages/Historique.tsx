import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { format, addMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Appointment } from '../types';

export default function Historique() {
  const { appointments, updateAppointment } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [compteRendu, setCompteRendu] = useState('');

  const now = new Date();
  const passedAppointments = appointments
    .filter(apt => {
      const endTime = addMinutes(apt.date, 20);
      return endTime < now;
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const handleSaveCompteRendu = (appointment: Appointment) => {
    updateAppointment(appointment.id, {
      ...appointment,
      compteRendu: {
        contenu: compteRendu,
        dateAjout: new Date()
      }
    });
    setEditingId(null);
    setCompteRendu('');
  };

  return (
    <div className="historique-page">
      <h1>Historique des Rendez-vous</h1>

      <div className="appointments-history">
        {passedAppointments.map(appointment => (
          <div key={appointment.id} className="history-card">
            <div className="history-header">
              <div className="history-date">
                {format(appointment.date, 'dd MMMM yyyy à HH:mm', { locale: fr })}
              </div>
              <div className="history-type">
                {appointment.type === 'physical' && '🏢'}
                {appointment.type === 'phone' && '📞'}
                {appointment.type === 'video' && '🎥'}
                {appointment.type === 'physical' ? 'Rendez-vous physique' : 
                 appointment.type === 'phone' ? 'Appel téléphonique' : 
                 'Visioconférence'}
              </div>
            </div>

            <div className="history-client">
              <h3>{appointment.nom} {appointment.prenom}</h3>
              <div className="client-contact">
                <a href={`mailto:${appointment.email}`} className="contact-link">
                  📧 {appointment.email}
                </a>
                <a href={`tel:${appointment.telephone}`} className="contact-link">
                  📱 {appointment.telephone}
                </a>
              </div>
            </div>

            {appointment.notes && (
              <div className="history-notes">
                <strong>Notes du rendez-vous:</strong>
                <p>{appointment.notes}</p>
              </div>
            )}

            {editingId === appointment.id ? (
              <div className="compte-rendu-form">
                <textarea
                  value={compteRendu}
                  onChange={(e) => setCompteRendu(e.target.value)}
                  placeholder="Saisissez le compte rendu du rendez-vous..."
                  rows={4}
                />
                <div className="form-buttons">
                  <button 
                    onClick={() => handleSaveCompteRendu(appointment)}
                    className="save-button"
                  >
                    Enregistrer
                  </button>
                  <button 
                    onClick={() => {
                      setEditingId(null);
                      setCompteRendu('');
                    }}
                    className="cancel-button"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : appointment.compteRendu ? (
              <div className="compte-rendu">
                <div className="compte-rendu-header">
                  <strong>Compte rendu</strong>
                  <span className="compte-rendu-date">
                    {format(appointment.compteRendu.dateAjout, 'dd/MM/yyyy HH:mm')}
                  </span>
                </div>
                <p>{appointment.compteRendu.contenu}</p>
              </div>
            ) : (
              <button 
                onClick={() => setEditingId(appointment.id)}
                className="add-compte-rendu-button"
              >
                ✍️ Ajouter un compte rendu
              </button>
            )}
          </div>
        ))}

        {passedAppointments.length === 0 && (
          <p className="no-data">Aucun rendez-vous passé</p>
        )}
      </div>
    </div>
  );
}
