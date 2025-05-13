// MenuAdminPage.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminPageLayout from '../../layout/AdminPageLayout';
import './adminPanel.css';


export default function AdminHome() {
  return (
    <AdminPageLayout title="Menu Administration">
      {/* Aucun contenu propre : le seul “visuel” sera le menu latéral */}
    </AdminPageLayout>
  );
}