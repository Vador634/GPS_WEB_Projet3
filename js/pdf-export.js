/**
 * PDF Export functionality for GPS trips
 * Uses a print-friendly popup window approach for reliable PDF generation
 */

// Store current trip data for PDF export
let currentTripForPDF = null;

function setTripForPDF(trip) {
    currentTripForPDF = trip;
}

// Echappe le texte saisi par l'utilisateur avant de l'inserer dans le rapport HTML.
function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[c]));
}

document.addEventListener('DOMContentLoaded', function() {
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', exportTripToPDF);
    }
});

async function exportTripToPDF() {
    let tripData;
    let mapImageData = null;
    
    // Check if we have trip data stored (from dashboard modal)
    if (currentTripForPDF) {
        // Get car info if available
        let carName = 'Non spécifié';
        let carImage = null;
        if (currentTripForPDF.carId && typeof getCarById === 'function') {
            const car = getCarById(currentTripForPDF.carId);
            if (car) {
                carName = car.name;
                carImage = car.image;
            }
        }
        
        tripData = {
            startCity: currentTripForPDF.startCity || 'N/A',
            endCity: currentTripForPDF.endCity || 'N/A',
            distance: typeof currentTripForPDF.distance === 'number' 
                ? currentTripForPDF.distance.toFixed(2) 
                : (currentTripForPDF.distance || 'N/A'),
            duration: currentTripForPDF.duration || 'N/A',
            startTime: currentTripForPDF.startTime 
                ? new Date(currentTripForPDF.startTime).toLocaleString('fr-FR') 
                : 'N/A',
            endTime: currentTripForPDF.endTime 
                ? new Date(currentTripForPDF.endTime).toLocaleString('fr-FR') 
                : 'N/A',
            toll: currentTripForPDF.toll || 0,
            firstname: currentTripForPDF.firstname || '',
            lastname: currentTripForPDF.lastname || '',
            remark: currentTripForPDF.remark || '',
            car: carName,
            carImage: carImage,
            exportDate: new Date().toLocaleDateString('fr-FR'),
            path: currentTripForPDF.path || null
        };
        
        // Try to capture map if available
        if (window.detailMap && typeof window.detailMap.getContainer === 'function') {
            try {
                const mapContainer = window.detailMap.getContainer();
                if (mapContainer && typeof html2canvas !== 'undefined') {
                    mapImageData = await html2canvas(mapContainer, { 
                        backgroundColor: '#fff',
                        scale: 1,
                        useCORS: true
                    }).then(canvas => canvas.toDataURL('image/png')).catch(e => {
                        console.warn('Map capture failed:', e);
                        return null;
                    });
                }
            } catch(e) {
                console.warn('Could not capture map image', e);
            }
        }
    } else {
        // Fallback: try to read from DOM (for index.html result section)
        const resultSection = document.getElementById('result');
        if (!resultSection || resultSection.classList.contains('hidden')) {
            alert('Aucun trajet à exporter');
            return;
        }
        
        tripData = {
            startCity: document.getElementById('startCity')?.textContent || 'N/A',
            endCity: document.getElementById('end')?.value || 'N/A',
            distance: document.getElementById('distance')?.textContent?.replace(/[^0-9.,]/g, '') || 'N/A',
            duration: document.getElementById('duration')?.textContent?.replace(/[^0-9]/g, '') || 'N/A',
            startTime: document.getElementById('startTime')?.textContent || 'N/A',
            endTime: document.getElementById('endTime')?.textContent || 'N/A',
            toll: document.getElementById('toll')?.value || '0',
            firstname: document.getElementById('firstname')?.value || '',
            lastname: document.getElementById('lastname')?.value || '',
            remark: document.getElementById('remark')?.value || '',
            car: document.getElementById('carSelectForSave')?.selectedOptions?.[0]?.text || 'Non spécifié',
            carImage: null,
            exportDate: new Date().toLocaleDateString('fr-FR'),
            path: null
        };
    }

    // Generate and open print window
    openPrintWindow(tripData, mapImageData);
}

function openPrintWindow(rawData, mapImageData) {
    // Tous les champs texte sont echappes (noms, villes, remarque...) ; les images ne
    // sont acceptees que si elles sont en data:image ou http(s).
    const data = {};
    Object.keys(rawData).forEach(k => { data[k] = typeof rawData[k] === 'string' ? escapeHTML(rawData[k]) : rawData[k]; });
    data.carImage = /^(https?:\/\/|data:image\/)/i.test(rawData.carImage || '') ? escapeHTML(rawData.carImage) : null;
    mapImageData = /^data:image\//.test(mapImageData || '') ? mapImageData : null;
    const tollValue = parseFloat(String(data.toll).replace(',', '.')) || 0;
    const driverName = [data.firstname, data.lastname].filter(Boolean).join(' ') || 'Non renseigné';
    
    const currentDate = new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const currentTime = new Date().toLocaleTimeString('fr-FR');

    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Rapport de trajet - ${data.startCity} → ${data.endCity}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, Helvetica, sans-serif;
            color: #1f2937;
            line-height: 1.5;
            padding: 30px;
            max-width: 800px;
            margin: 0 auto;
            background: white;
        }
        
        .header {
            text-align: center;
            border-bottom: 4px solid #0ea5e9;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .header h1 {
            color: #0ea5e9;
            font-size: 32px;
            margin-bottom: 5px;
        }
        
        .header .subtitle {
            color: #6b7280;
            font-size: 14px;
        }
        
        .route-banner {
            background: linear-gradient(135deg, #0ea5e9, #0284c7);
            color: white;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 30px;
        }
        
        .route-banner h2 {
            font-size: 28px;
            margin: 0;
        }
        
        .section {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #1f2937;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        
        .info-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .info-table tr {
            border-bottom: 1px solid #e2e8f0;
        }
        
        .info-table tr:last-child {
            border-bottom: none;
        }
        
        .info-table td {
            padding: 12px 0;
        }
        
        .info-table .label {
            color: #6b7280;
            font-weight: 600;
            width: 40%;
        }
        
        .info-table .value {
            color: #1f2937;
            font-weight: 500;
        }
        
        .info-table .value.highlight {
            font-size: 20px;
            font-weight: bold;
            color: #0ea5e9;
        }
        
        .costs-section {
            background: #e0f2fe;
            border: 2px solid #0ea5e9;
        }
        
        .costs-section .section-title {
            border-bottom-color: #0ea5e9;
        }
        
        .remarks-section {
            background: #fef9c3;
            border: 2px solid #eab308;
        }
        
        .remarks-section .section-title {
            border-bottom-color: #eab308;
        }
        
        .remarks-text {
            color: #1f2937;
            white-space: pre-wrap;
        }
        
        .vehicle-image {
            max-width: 200px;
            max-height: 120px;
            border-radius: 8px;
            margin-top: 10px;
        }
        
        .footer {
            text-align: center;
            border-top: 2px solid #e2e8f0;
            padding-top: 20px;
            margin-top: 40px;
            color: #9ca3af;
            font-size: 12px;
        }
        
        .print-btn {
            background: #0ea5e9;
            color: white;
            border: none;
            padding: 15px 40px;
            font-size: 16px;
            border-radius: 8px;
            cursor: pointer;
            display: block;
            margin: 30px auto;
        }
        
        .print-btn:hover {
            background: #0284c7;
        }
        
        @media print {
            .print-btn {
                display: none;
            }
            
            body {
                padding: 20px;
            }
            
            .section {
                break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Wipsee Mobile GPS</h1>
        <p class="subtitle">Rapport de trajet professionnel</p>
    </div>
    
    <div class="route-banner">
        <h2>${data.startCity} → ${data.endCity}</h2>
    </div>
    
    <div class="section">
        <div class="section-title">📍 Informations du trajet</div>
        <table class="info-table">
            <tr>
                <td class="label">Distance parcourue</td>
                <td class="value highlight">${data.distance} km</td>
            </tr>
            <tr>
                <td class="label">Durée du trajet</td>
                <td class="value highlight">${data.duration} min</td>
            </tr>
            <tr>
                <td class="label">Date et heure de départ</td>
                <td class="value">${data.startTime}</td>
            </tr>
            <tr>
                <td class="label">Date et heure d'arrivée</td>
                <td class="value">${data.endTime}</td>
            </tr>
        </table>
    </div>
    
    <div class="section">
        <div class="section-title">👤 Conducteur</div>
        <table class="info-table">
            <tr>
                <td class="label">Nom complet</td>
                <td class="value" style="font-weight: bold; font-size: 18px;">${driverName}</td>
            </tr>
            <tr>
                <td class="label">Véhicule utilisé</td>
                <td class="value">
                    <strong>${data.car}</strong>
                    ${data.carImage ? `<br><img src="${data.carImage}" alt="${data.car}" class="vehicle-image">` : ''}
                </td>
            </tr>
        </table>
    </div>
    
    <div class="section costs-section">
         <div class="section-title">💰 Frais de route</div>
         <table class="info-table">
             <tr>
                 <td class="label">Péages autoroutiers</td>
                 <td class="value highlight" style="font-size: 28px;">${tollValue.toFixed(2)} €</td>
             </tr>
         </table>
     </div>
     
     ${mapImageData ? `
     <div class="section">
         <div class="section-title">🗺️ Carte du trajet</div>
         <img src="${mapImageData}" alt="Carte du trajet" style="width: 100%; max-height: 400px; border-radius: 8px; display: block;">
     </div>
     ` : ''}
     
     ${data.remark && data.remark.trim() ? `
     <div class="section remarks-section">
         <div class="section-title">📝 Remarques</div>
         <p class="remarks-text">${data.remark}</p>
     </div>
     ` : ''}
    
    <div class="footer">
        <p>Document généré le ${currentDate} à ${currentTime}</p>
        <p>Wipsee Mobile GPS - Système de suivi de trajets professionnels</p>
    </div>
    
    <button class="print-btn" onclick="window.print()">🖨️ Imprimer / Enregistrer en PDF</button>
    
    <script>
        // Auto-focus the window
        window.focus();
    </script>
</body>
</html>
    `;

    // Open new window with the print content
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    
    if (!printWindow) {
        alert('Veuillez autoriser les popups pour exporter le PDF');
        return;
    }
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Show success message
    if (typeof showToast === 'function') {
        showToast('Fenêtre d\'impression ouverte - Utilisez "Enregistrer en PDF" dans les options d\'impression', {type: 'info', timeout: 5000});
    }
}
