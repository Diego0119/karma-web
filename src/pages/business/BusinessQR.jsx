import { useEffect, useState, useRef } from 'react';
import { QrCode, Download, Copy, CheckCircle, AlertCircle, Printer, Share2, Gift, Star, Zap } from 'lucide-react';
import html2canvas from 'html2canvas';
import api from '../../services/api';
import { useBusinessAuth, NoBusinessMessage } from '../../hooks/useBusinessAuth.jsx';
import PageLoader from '../../components/common/PageLoader';

export default function BusinessQR() {
  const { business, loading: businessLoading, error: businessError } = useBusinessAuth();
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [qrBase64, setQrBase64] = useState('');
  const templateRef = useRef(null);

  const joinUrl = business?.businessQrCode
    ? `${window.location.origin}/join/${business.businessQrCode}`
    : '';

  const qrImageUrl = business?.businessQrCode
    ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(joinUrl)}&size=500x500&margin=20`
    : '';

  // Convertir QR a base64 cuando cambia
  useEffect(() => {
    if (!qrImageUrl) return;

    const convertToBase64 = async () => {
      try {
        const response = await fetch(qrImageUrl);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setQrBase64(reader.result);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        
      }
    };

    convertToBase64();
  }, [qrImageUrl]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setMessage({ type: 'success', text: 'Link copiado al portapapeles' });
      setTimeout(() => {
        setCopied(false);
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al copiar el link' });
    }
  };

  const handleDownloadQR = async () => {
    try {
      setMessage({ type: 'success', text: 'Descargando QR...' });

      // Fetch the image and convert to blob
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();

      // Create a blob URL
      const blobUrl = URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `karma-qr-${business.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up blob URL
      URL.revokeObjectURL(blobUrl);

      setMessage({ type: 'success', text: 'QR descargado exitosamente' });
    } catch (error) {
      
      setMessage({ type: 'error', text: 'Error al descargar el QR' });
    }
  };

  const handleDownloadTemplate = async () => {
    if (!templateRef.current) return;

    if (!qrBase64) {
      setMessage({ type: 'error', text: 'Esperando que el QR se cargue...' });
      return;
    }

    try {
      setMessage({ type: 'success', text: 'Generando template...' });

      // Esperar un momento para que el DOM se actualice
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(templateRef.current, {
        scale: 3, // Mayor resolución
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `karma-template-${business.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0); // Máxima calidad
      link.click();

      setMessage({ type: 'success', text: 'Template descargado exitosamente' });
    } catch (error) {
      
      setMessage({ type: 'error', text: 'Error al descargar el template' });
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${business.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 40px;
              text-align: center;
            }
            h1 { color: #333; margin-bottom: 10px; }
            p { color: #666; margin-bottom: 30px; }
            img { border: 2px solid #333; padding: 20px; }
            .footer { margin-top: 30px; font-size: 14px; color: #999; }
          </style>
        </head>
        <body>
          <h1>${business.name}</h1>
          <p>Escanea este código para unirte a nuestro programa de fidelización</p>
          <img src="${qrImageUrl}" alt="QR Code" />
          <div class="footer">Powered by Karma</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (businessLoading) {
    return <PageLoader message="Cargando código QR..." />;
  }

  if (!business || businessError) {
    return <NoBusinessMessage icon={QrCode} />;
  }

  return (
    <div className="max-w-4xl mx-auto overflow-x-hidden">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <QrCode className="w-8 h-8 text-primary-600 flex-shrink-0" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">QR de Inscripción</h1>
        </div>
        <p className="text-gray-600 text-sm sm:text-base">
          Comparte este QR para que los clientes se inscriban en tus programas
        </p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Share2 className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-3">¿Cómo funciona?</h3>
            <ol className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary-600">1.</span>
                <span>Descarga o imprime el código QR</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary-600">2.</span>
                <span>Colócalo en un lugar visible en tu negocio (entrada, caja, mesa, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary-600">3.</span>
                <span>Los clientes lo escanean con su celular</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary-600">4.</span>
                <span>Se registran automáticamente en todos tus programas activos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary-600">5.</span>
                <span>Reciben su tarjeta digital en Apple Wallet o Google Wallet</span>
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Professional Template Preview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Vista Previa del Template</h3>

          {/* Scrollable Container */}
          <div className="overflow-x-auto max-h-[800px]">
            {/* Template Component - Minimalist Design */}
            <div
              ref={templateRef}
              className="mx-auto"
              style={{
                width: '100%',
                maxWidth: '600px',
                minWidth: '320px',
                background: '#ffffff',
                padding: '40px 30px',
                fontFamily: 'Arial, Helvetica, sans-serif',
                position: 'relative',
              }}
            >
              {/* Logo Karma - Simple */}
              <div style={{
                textAlign: 'center',
                marginBottom: '50px'
              }}>
                <span style={{
                  fontSize: '18px',
                  fontWeight: '400',
                  color: '#000000',
                  letterSpacing: '6px',
                  textTransform: 'uppercase',
                }}>
                  KARMA
                </span>
              </div>

              {/* Main Title - Clean */}
              <div style={{
                textAlign: 'center',
                marginBottom: '60px'
              }}>
                <h1 style={{
                  fontSize: '28px',
                  fontWeight: '300',
                  color: '#000000',
                  margin: '0 0 15px 0',
                  lineHeight: '1.3',
                  letterSpacing: '-0.5px',
                }}>
                  Únete a nuestro<br />programa de lealtad
                </h1>
                <p style={{
                  fontSize: '13px',
                  color: '#737373',
                  margin: '0',
                  fontWeight: '300',
                }}>
                  Escanea el código con tu celular
                </p>
              </div>

              {/* QR Code - Minimal */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '60px'
              }}>
                <div style={{
                  padding: '0',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}>
                  <img
                    src={qrBase64 || qrImageUrl}
                    alt="QR Code"
                    style={{
                      width: '260px',
                      height: '260px',
                      display: 'block',
                    }}
                  />
                </div>
              </div>

              {/* Business Name - Elegant */}
              <div style={{
                textAlign: 'center',
                marginBottom: '50px',
              }}>
                <p style={{
                  fontSize: '22px',
                  fontWeight: '500',
                  color: '#000000',
                  margin: '0',
                  letterSpacing: '1px',
                }}>
                  {business.name}
                </p>
              </div>

              {/* Divider Line */}
              <div style={{
                width: '60px',
                height: '1px',
                backgroundColor: '#d4d4d4',
                margin: '0 auto 20px',
              }} />

              {/* Footer - Subtle */}
              <div style={{
                textAlign: 'center',
              }}>
                <p style={{
                  fontSize: '10px',
                  color: '#a3a3a3',
                  margin: '0',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}>
                  Powered by Karma
                </p>
              </div>
            </div>
          </div>

          {/* Download Buttons for Template */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handleDownloadTemplate}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <Download className="w-5 h-5" />
              Descargar Template Completo
            </button>
            <p className="text-xs text-center text-gray-500">
              Listo para imprimir • Alta resolución • Diseño profesional
            </p>
          </div>
        </div>

        {/* QR Only & Sharing Options */}
        <div className="space-y-6">
          {/* Simple QR Download */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Solo Código QR</h3>
            <div className="text-center">
              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 inline-block mb-4">
                <img
                  src={qrImageUrl}
                  alt="Business QR Code"
                  className="w-48 h-48"
                />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                500x500px • Ideal para usar en redes sociales o sitio web
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleDownloadQR}
                  className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  <Download className="w-5 h-5" />
                  Descargar solo QR
                </button>

                <button
                  onClick={handlePrint}
                  className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  <Printer className="w-5 h-5" />
                  Imprimir
                </button>
              </div>
            </div>
          </div>

        {/* Link Sharing */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Compartir Link Directo</h3>
          <p className="text-sm text-gray-600 mb-4">
            También puedes compartir este link directamente por WhatsApp, email o redes sociales
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de inscripción
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={joinUrl}
                readOnly
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono truncate min-w-0"
              />
              <button
                onClick={handleCopyUrl}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all w-full sm:w-auto ${
                  copied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copiar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-3">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`¡Únete a nuestro programa de fidelización! ${joinUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Compartir por WhatsApp
            </a>

            <a
              href={`mailto:?subject=${encodeURIComponent(`Únete a ${business.name}`)}&body=${encodeURIComponent(`¡Hola! Te invito a unirte a nuestro programa de fidelización. \n\n${joinUrl}`)}`}
              className="w-full flex items-center justify-center gap-2 bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Enviar por Email
            </a>
          </div>

          {/* Tips */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Tip:</strong> Imprime el QR en un tamaño A4 y colócalo en tu mostrador o entrada para que sea fácil de escanear
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
