import { useEffect, useState, useRef } from 'react';
import { Save, AlertCircle, CheckCircle, Palette, CreditCard, Upload, X, QrCode, Smartphone, Eye } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../services/api';

export default function CardCustomization() {
  const [business, setBusiness] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    address: '',
    phone: '',
    logo: '',
    cardPrimaryColor: '#6366f1',
    cardSecondaryColor: '#ec4899',
    cardTextColor: '#ffffff'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [cardView, setCardView] = useState('front'); // 'front' or 'back'
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadBusiness();
  }, []);

  const loadBusiness = async () => {
    try {
      const res = await api.get('/business/me');
      if (res.data && res.data.id) {
        const businessData = res.data;
        setBusiness(businessData);
        setFormData({
          name: businessData.name || '',
          category: businessData.category || '',
          address: businessData.address || '',
          phone: businessData.phone || '',
          logo: businessData.logo || '',
          cardPrimaryColor: businessData.cardPrimaryColor || '#6366f1',
          cardSecondaryColor: businessData.cardSecondaryColor || '#ec4899',
          cardTextColor: businessData.cardTextColor || '#ffffff'
        });
        if (businessData.logo) {
          setLogoPreview(businessData.logo);
        }
      }
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  // Templates premium predefinidos
  const premiumTemplates = [
    {
      name: 'Elegante Negro',
      description: 'Sofisticado y premium',
      cardPrimaryColor: '#1a1a1a',
      cardSecondaryColor: '#d4af37',
      cardTextColor: '#ffffff'
    },
    {
      name: 'Azul Profesional',
      description: 'Confianza y seriedad',
      cardPrimaryColor: '#1e3a8a',
      cardSecondaryColor: '#3b82f6',
      cardTextColor: '#ffffff'
    },
    {
      name: 'Verde Fresco',
      description: 'Natural y acogedor',
      cardPrimaryColor: '#065f46',
      cardSecondaryColor: '#10b981',
      cardTextColor: '#ffffff'
    },
    {
      name: 'Morado Moderno',
      description: 'Innovador y creativo',
      cardPrimaryColor: '#6b21a8',
      cardSecondaryColor: '#a855f7',
      cardTextColor: '#ffffff'
    },
    {
      name: 'Rojo Energético',
      description: 'Dinámico y vibrante',
      cardPrimaryColor: '#991b1b',
      cardSecondaryColor: '#f87171',
      cardTextColor: '#ffffff'
    },
    {
      name: 'Coral Cálido',
      description: 'Amigable y acogedor',
      cardPrimaryColor: '#9f1239',
      cardSecondaryColor: '#fb7185',
      cardTextColor: '#ffffff'
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const applyTemplate = (template) => {
    setFormData({
      ...formData,
      cardPrimaryColor: template.cardPrimaryColor,
      cardSecondaryColor: template.cardSecondaryColor,
      cardTextColor: template.cardTextColor
    });
    setMessage({
      type: 'success',
      text: `Template "${template.name}" aplicado. No olvides guardar los cambios.`
    });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Por favor selecciona una imagen válida' });
        return;
      }

      // Validar tamaño (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'La imagen debe ser menor a 2MB' });
        return;
      }

      setLogoFile(file);

      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setFormData({ ...formData, logo: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadLogo = async () => {
    if (!logoFile) return;

    setUploadingLogo(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('logo', logoFile);

      const { data } = await api.post(`/business/${business.id}/logo`, formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setFormData({ ...formData, logo: data.logoUrl });
      setMessage({ type: 'success', text: 'Logo subido exitosamente' });
      setLogoFile(null);
      await loadBusiness();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error al subir el logo'
      });
    } finally {
      setUploadingLogo(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      if (business) {
        const payload = {
          cardPrimaryColor: formData.cardPrimaryColor,
          cardSecondaryColor: formData.cardSecondaryColor,
          cardTextColor: formData.cardTextColor
        };
        await api.patch(`/business/${business.id}`, payload);
        setMessage({ type: 'success', text: 'Personalización guardada exitosamente' });

        // Si hay logo pendiente de subir, subirlo
        if (logoFile) {
          await handleUploadLogo();
        }
      }
      await loadBusiness();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error al guardar la personalización'
      });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const getQRCodeUrl = () => {
    if (!business?.qrCode) return 'https://karma.cl/join/demo';
    return `${window.location.origin}/join/${business.qrCode}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Palette className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Personalización de Tarjeta</h1>
        </div>
        <p className="text-gray-600">
          Diseña tu tarjeta de fidelización digital para Apple Wallet y Google Wallet
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

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Panel de controles */}
            <div className="space-y-6">
              {/* Upload de Logo */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary-600" />
                  Logo de tu Negocio
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Sube el logo que aparecerá en las tarjetas de tus clientes
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-500 transition-colors">
                  {logoPreview ? (
                    <div className="space-y-4">
                      <div className="relative inline-block">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="h-32 w-32 object-contain rounded-lg mx-auto bg-gray-50 p-2"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        {logoFile ? 'Logo seleccionado. Haz clic en "Guardar" para aplicar' : 'Logo actual'}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-2">
                        Arrastra tu logo aquí o haz clic para seleccionar
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG o SVG (máx. 2MB)
                      </p>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="inline-block mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors text-sm font-medium"
                  >
                    {logoPreview ? 'Cambiar logo' : 'Seleccionar archivo'}
                  </label>
                </div>
              </div>

              {/* Templates Premium */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary-600" />
                  Templates Profesionales
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Aplica un diseño profesional con un solo clic
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {premiumTemplates.map((template, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyTemplate(template)}
                      className="group relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-primary-500 transition-all duration-200 hover:shadow-lg"
                    >
                      <div
                        className="h-20 transition-transform duration-200 group-hover:scale-105"
                        style={{
                          background: `linear-gradient(135deg, ${template.cardPrimaryColor} 0%, ${template.cardSecondaryColor} 100%)`
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20">
                          <span className="text-white text-sm font-semibold">Aplicar</span>
                        </div>
                      </div>
                      <div className="p-3 bg-white">
                        <p className="text-sm font-semibold text-gray-900">{template.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{template.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Colores personalizados */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Colores Personalizados</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color principal
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        name="cardPrimaryColor"
                        value={formData.cardPrimaryColor}
                        onChange={handleChange}
                        className="h-12 w-20 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        name="cardPrimaryColor"
                        value={formData.cardPrimaryColor}
                        onChange={handleChange}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color secundario
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        name="cardSecondaryColor"
                        value={formData.cardSecondaryColor}
                        onChange={handleChange}
                        className="h-12 w-20 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        name="cardSecondaryColor"
                        value={formData.cardSecondaryColor}
                        onChange={handleChange}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color del texto
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        name="cardTextColor"
                        value={formData.cardTextColor}
                        onChange={handleChange}
                        className="h-12 w-20 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        name="cardTextColor"
                        value={formData.cardTextColor}
                        onChange={handleChange}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={saving || uploadingLogo}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>

            {/* Vista Previa */}
            <div>
              <div className="sticky top-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Smartphone className="w-5 h-5" />
                      Vista Previa
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Así verán tus clientes la tarjeta
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCardView('front')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        cardView === 'front'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Frente
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardView('back')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        cardView === 'back'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Atrás
                    </button>
                  </div>
                </div>

                {/* Card Preview */}
                <div className="relative">
                  {/* Phone Frame */}
                  <div className="bg-gray-900 rounded-3xl p-4 shadow-2xl">
                    <div className="bg-white rounded-2xl overflow-hidden">
                      {cardView === 'front' ? (
                        // Front of card - Vertical style
                        <div
                          className="p-6 relative overflow-hidden"
                          style={{
                            minHeight: '600px',
                            background: `linear-gradient(135deg, ${formData.cardPrimaryColor} 0%, ${formData.cardSecondaryColor} 100%)`
                          }}
                        >
                          {/* Logo de fondo como marca de agua */}
                          {logoPreview && (
                            <div
                              className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none"
                              style={{ transform: 'scale(2)' }}
                            >
                              <img
                                src={logoPreview}
                                alt="Background"
                                className="w-64 h-64 object-contain"
                              />
                            </div>
                          )}

                          {/* Header con logo prominente */}
                          <div className="relative z-10 text-center mb-6">
                            {logoPreview ? (
                              <div className="inline-block mb-4">
                                <img
                                  src={logoPreview}
                                  alt="Logo"
                                  className="h-24 w-24 rounded-2xl object-contain bg-white/30 backdrop-blur-md p-3 shadow-lg mx-auto"
                                />
                              </div>
                            ) : (
                              <div
                                className="inline-block h-24 w-24 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg mb-4"
                                style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                              >
                                <CreditCard className="w-12 h-12" style={{ color: formData.cardTextColor }} />
                              </div>
                            )}

                            {/* Business Name */}
                            <h3 className="text-3xl font-bold mb-2" style={{ color: formData.cardTextColor }}>
                              {formData.name || 'Tu Negocio'}
                            </h3>
                            <p className="text-sm opacity-90 mb-1" style={{ color: formData.cardTextColor }}>
                              Tarjeta de Fidelización
                            </p>
                            <p className="text-xs opacity-75" style={{ color: formData.cardTextColor }}>
                              {formData.category || 'Categoría'}
                            </p>
                          </div>

                          {/* Programa de Puntos */}
                          <div
                            className="relative z-10 rounded-2xl p-5 mb-4 backdrop-blur-md shadow-lg"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: formData.cardTextColor }}
                              >
                                <CreditCard
                                  className="w-4 h-4"
                                  style={{ color: formData.cardPrimaryColor }}
                                />
                              </div>
                              <span className="text-base font-bold" style={{ color: formData.cardTextColor }}>
                                Programa de Puntos
                              </span>
                            </div>
                            <div className="flex items-end justify-between">
                              <div>
                                <p className="text-4xl font-bold mb-1" style={{ color: formData.cardTextColor }}>
                                  1,250
                                </p>
                                <p className="text-sm opacity-80" style={{ color: formData.cardTextColor }}>
                                  puntos acumulados
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold" style={{ color: formData.cardTextColor }}>
                                  70%
                                </p>
                                <p className="text-xs opacity-80" style={{ color: formData.cardTextColor }}>
                                  al próximo nivel
                                </p>
                              </div>
                            </div>
                            <div className="w-full bg-white/30 rounded-full h-2.5 mt-4">
                              <div
                                className="h-2.5 rounded-full shadow-sm"
                                style={{ width: '70%', backgroundColor: formData.cardTextColor }}
                              />
                            </div>
                          </div>

                          {/* Programa de Sellos */}
                          <div
                            className="relative z-10 rounded-2xl p-5 backdrop-blur-md shadow-lg mb-4"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                          >
                            <div className="flex items-center gap-2 mb-4">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: formData.cardTextColor }}
                              >
                                <CheckCircle
                                  className="w-4 h-4"
                                  style={{ color: formData.cardPrimaryColor }}
                                />
                              </div>
                              <div className="flex-1">
                                <span className="text-base font-bold" style={{ color: formData.cardTextColor }}>
                                  Programa de Sellos
                                </span>
                              </div>
                              <span className="text-sm font-semibold opacity-90" style={{ color: formData.cardTextColor }}>
                                7/10
                              </span>
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                              {[...Array(10)].map((_, i) => (
                                <div
                                  key={i}
                                  className="aspect-square rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm"
                                  style={{
                                    backgroundColor: i < 7 ? formData.cardTextColor : 'rgba(255, 255, 255, 0.3)'
                                  }}
                                >
                                  {i < 7 && (
                                    <CheckCircle
                                      className="w-5 h-5"
                                      style={{ color: formData.cardPrimaryColor }}
                                      fill={formData.cardPrimaryColor}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-center mt-3 opacity-80" style={{ color: formData.cardTextColor }}>
                              ¡Solo 3 sellos más para tu recompensa!
                            </p>
                          </div>

                          {/* QR Code de ejemplo (solo en preview) */}
                          <div
                            className="relative z-10 rounded-2xl p-4 backdrop-blur-md shadow-lg mb-4"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex-shrink-0">
                                <div className="bg-white p-2 rounded-xl">
                                  <QRCodeSVG
                                    value={getQRCodeUrl()}
                                    size={80}
                                    level="H"
                                    includeMargin={false}
                                  />
                                </div>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold mb-1" style={{ color: formData.cardTextColor }}>
                                  Código de Cliente
                                </p>
                                <p className="text-xs opacity-80" style={{ color: formData.cardTextColor }}>
                                  El vendedor escanea este código en cada compra
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Footer con info */}
                          <div className="relative z-10 text-center">
                            <p className="text-xs opacity-70 mb-1" style={{ color: formData.cardTextColor }}>
                              {formData.address || 'Dirección de tu negocio'}
                            </p>
                            {formData.phone && (
                              <p className="text-xs opacity-70" style={{ color: formData.cardTextColor }}>
                                {formData.phone}
                              </p>
                            )}
                          </div>

                          {/* Wallet Badge */}
                          <div className="absolute top-4 right-4 z-20">
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
                              <p className="text-[10px] font-bold tracking-wider" style={{ color: formData.cardTextColor }}>
                                WALLET
                              </p>
                            </div>
                          </div>

                          {/* Powered by badge */}
                          <div className="absolute bottom-4 left-6 right-6 z-10">
                            <div className="text-center pt-3 border-t border-white/20">
                              <p className="text-[10px] opacity-60 font-medium" style={{ color: formData.cardTextColor }}>
                                Powered by <span className="font-bold">Karma</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Back of card with QR
                        <div
                          className="p-6 relative flex flex-col items-center justify-center"
                          style={{
                            minHeight: '600px',
                            background: `linear-gradient(135deg, ${formData.cardPrimaryColor} 0%, ${formData.cardSecondaryColor} 100%)`
                          }}
                        >
                          <div className="text-center mb-8">
                            <QrCode className="w-12 h-12 mx-auto mb-4" style={{ color: formData.cardTextColor }} />
                            <h3 className="text-2xl font-bold mb-2" style={{ color: formData.cardTextColor }}>
                              Tu Código de Identificación
                            </h3>
                            <p className="text-base opacity-90" style={{ color: formData.cardTextColor }}>
                              {formData.name || 'Tu Negocio'}
                            </p>
                          </div>

                          {/* QR Code grande */}
                          <div className="bg-white p-6 rounded-3xl shadow-2xl">
                            <QRCodeSVG
                              value={getQRCodeUrl()}
                              size={220}
                              level="H"
                              includeMargin={false}
                            />
                          </div>

                          <div className="mt-8 text-center max-w-xs">
                            <p className="text-sm opacity-90 mb-6" style={{ color: formData.cardTextColor }}>
                              Muestra este código al vendedor para acumular puntos y sellos en cada compra
                            </p>

                            <div
                              className="rounded-2xl p-4 backdrop-blur-md"
                              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                            >
                              <p className="text-xs font-semibold mb-1" style={{ color: formData.cardTextColor }}>
                                Beneficios del programa:
                              </p>
                              <p className="text-xs opacity-80" style={{ color: formData.cardTextColor }}>
                                • Acumula puntos en cada compra<br />
                                • Obtén recompensas exclusivas<br />
                                • Recibe ofertas personalizadas
                              </p>
                            </div>
                          </div>

                          <div className="absolute bottom-6 text-center">
                            <p className="text-xs opacity-70" style={{ color: formData.cardTextColor }}>
                              Powered by <span className="font-bold">Karma</span>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Eye className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-900">
                        <span className="font-semibold">Vista previa en tiempo real.</span>
                        {cardView === 'back' && ' El código QR es único para cada cliente y se escanea en el punto de venta.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
