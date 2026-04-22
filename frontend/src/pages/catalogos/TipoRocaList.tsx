import { useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface TipoRoca {
  id: number;
  nombre: string;
  colorBg: string; 
  descripcion: string;
  aplicacion: string;
}

const ROCAS_DATA: TipoRoca[] = [
  { id: 1, nombre: 'Aluvión', colorBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', descripcion: 'Sedimentos transportados por agua (gravas, arenas, limos)', aplicacion: 'Prospección de placeres auríferos' },
  { id: 2, nombre: 'Grava', colorBg: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)', descripcion: 'Fragmentos de roca 2-64mm, material granular', aplicacion: 'Clasificación de material de transporte' },
  { id: 3, nombre: 'Arena', colorBg: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', descripcion: 'Partículas 0.063-2mm, depósitos aluviales', aplicacion: 'Separación granulométrica, procesamiento' },
  { id: 4, nombre: 'Arcilla', colorBg: 'linear-gradient(135deg, #b45309 0%, #92400e 100%)', descripcion: 'Material fino <0.002mm, alta plasticidad', aplicacion: 'Identificación de zonas de alteración' },
  { id: 5, nombre: 'Roca Madre', colorBg: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', descripcion: 'Roca original no alterada con mineralización', aplicacion: 'Prospección primaria, muestreo de vetas' },
  { id: 6, nombre: 'Saprolita', colorBg: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)', descripcion: 'Roca alterada que mantiene estructura original', aplicacion: 'Identificación de zonas oxidadas' },
  { id: 7, nombre: 'Mezcla', colorBg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', descripcion: 'Combinación heterogénea de materiales diversos', aplicacion: 'Clasificación de material compuesto' },
];

export default function TipoRocaList() {
  const [busqueda, setBusqueda] = useState('');

  const rocasFiltradas = ROCAS_DATA.filter((roca) => {
    const termino = busqueda.toLowerCase();
    return (
      roca.nombre.toLowerCase().includes(termino) ||
      roca.descripcion.toLowerCase().includes(termino) ||
      roca.aplicacion.toLowerCase().includes(termino)
    );
  });

  const exportarAExcel = () => {
    const datosParaExcel = rocasFiltradas.map(r => ({
      'ID Tipo Roca': r.id,
      'Tipo de Roca': r.nombre,
      'Descripción': r.descripcion,
      'Aplicación en Sistema': r.aplicacion
    }));

    const worksheet = XLSX.utils.json_to_sheet(datosParaExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tipos_de_Roca");
    XLSX.writeFile(workbook, "Catalogo_Rocas_SistemaMine.xlsx");
  };

  const exportarAPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Catálogo de Tipo de Roca/Material", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableData = rocasFiltradas.map(r => [
      r.id.toString(),
      r.nombre,
      r.descripcion,
      r.aplicacion
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['ID', 'Tipo de Roca', 'Descripción', 'Aplicación en Sistema']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      columnStyles: { 0: { cellWidth: 20 } }
    });

    doc.save("Catalogo_Rocas_SistemaMine.pdf");
  };

  return (
    <div style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderRadius: '8px', background: 'white' }}>
      
      <div className="page-header">
        <h1 className="page-title">Catálogo de Tipo de Roca / Material</h1>
        <p className="page-subtitle">Vista de tabla completa del catálogo</p>
      </div>

      <div className="page-content">
        
        <div className="toolbar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="search-box" style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
            <span className="search-icon" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Filtrar por tipo de roca o aplicación..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '2px solid var(--gray-200)', borderRadius: '8px' }}
            />
          </div>
          <div className="toolbar-actions" style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={exportarAExcel} style={{ color: '#047857', borderColor: '#10b981' }}>
              <span>📊</span> Exportar Excel
            </button>
            <button className="btn btn-secondary btn-sm" onClick={exportarAPDF} style={{ color: '#b91c1c', borderColor: '#ef4444' }}>
              <span>📄</span> Exportar PDF
            </button>
          </div>
        </div>

        <div className="table-container" style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '12px', overflow: 'hidden' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--gray-50)' }}>
              <tr>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)', color: 'var(--gray-700)', width: '120px' }}>ID Tipo Roca</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)', width: '80px' }}></th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)', color: 'var(--gray-700)' }}>Tipo de Roca</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)', color: 'var(--gray-700)' }}>Descripción</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)', color: 'var(--gray-700)' }}>Aplicación en Sistema</th>
              </tr>
            </thead>
            <tbody>
              {rocasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-500)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></div>
                    No se encontró ningún material que coincida con "{busqueda}".
                  </td>
                </tr>
              ) : (
                rocasFiltradas.map((roca, index) => (
                  <tr key={roca.id} style={{ borderBottom: index === rocasFiltradas.length - 1 ? 'none' : '1px solid var(--gray-200)' }}>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'var(--gray-100)', borderRadius: '6px', fontWeight: 600, color: 'var(--gray-700)' }}>
                        {roca.id}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ 
                        width: '40px', height: '40px', borderRadius: '8px', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        fontSize: '1.25rem', color: 'white',
                      }}>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}><strong>{roca.nombre}</strong></td>
                    <td style={{ padding: '1rem', color: 'var(--gray-600)' }}>{roca.descripcion}</td>
                    <td style={{ padding: '1rem', color: 'var(--gray-600)' }}>{roca.aplicacion}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}