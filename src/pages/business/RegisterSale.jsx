import { useState, useEffect } from 'react';
import { ShoppingCart, User, Star, Award, AlertCircle, CheckCircle, Calculator, HelpCircle, QrCode, X, Camera } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../../services/api';
import { useBusinessAuth, NoBusinessMessage } from '../../hooks/useBusinessAuth.jsx';

export default function RegisterSale() {
  const { business, loading: businessLoading, error: businessError } = useBusinessAuth();
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [customerCards, setCustomerCards] = useState([]);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [calculatedPoints, setCalculatedPoints] = useState(0);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showScanner, setShowScanner] = useState(false);
  const [scanner, setScanner] = useState(null);
  const [lastScannedQR, setLastScannedQR] = useState(null);

  useEffect(() => {
    if (business) {
      loadPrograms();
    }
  }, [business]);

  useEffect(() => {
    if (selectedProgram?.type === 'POINTS' && purchaseAmount && selectedProgram.pointsConversionRate) {
      const points = Math.floor(parseFloat(purchaseAmount) / selectedProgram.pointsConversionRate);
      setCalculatedPoints(points);
    } else {
      setCalculatedPoints(0);
    }
  }, [purchaseAmount, selectedProgram]);

  useEffect(() => {
    if (showScanner && !scanner) {
      initializeScanner();
    }
    return () => {
      if (scanner) {
        scanner.clear().catch(err => console.error('Error clearing scanner:', err));
      }
    };
  }, [showScanner]);

  const loadPrograms = async () => {
    try {
      const res = await api.get('/loyalty/programs/my');
      const activePrograms = res.data.filter(p => p.isActive);
      setPrograms(activePrograms);
      if (activePrograms.length > 0) {
        setSelectedProgram(activePrograms[0]);
      }
    } catch (error) {
      // Si es 404, significa que no hay programas todavía
      if (error.response?.status === 404) {
        setPrograms([]);
      } else {
        console.error('Error loading programs:', error);
      }
    }
  };

  const initializeScanner = () => {
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      false
    );

    html5QrcodeScanner.render(onScanSuccess, onScanError);
    setScanner(html5QrcodeScanner);
  };

  const onScanSuccess = async (decodedText) => {
    console.log('QR escaneado:', decodedText);

    // Detener el escáner
    if (scanner) {
      scanner.clear();
      setScanner(null);
    }
    setShowScanner(false);

    // Cargar información del cliente
    await loadCustomerInfo(decodedText);
  };

  const onScanError = (error) => {
    // Ignorar errores de escaneo continuo
    // console.warn('QR scan error:', error);
  };

  const loadCustomerInfo = async (qrCode) => {
    try {
      setLoading(true);

      // Guardar el QR para recargas posteriores
      setLastScannedQR(qrCode);

      // Usar el nuevo endpoint de escaneo que retorna todo en una llamada
      const scanRes = await api.post('/loyalty/scan', { qrCode });

      const { customer: customerData, programs: customerPrograms } = scanRes.data;
      setCustomer(customerData);

      // Actualizar las tarjetas del cliente desde los programas escaneados
      const allCards = [];
      customerPrograms.forEach(program => {
        if (program.type === 'STAMPS' && program.stampCards) {
          allCards.push(...program.stampCards.map(card => ({
            ...card,
            programId: program.id,
            program: {
              id: program.id,
              name: program.name,
              stampsRequired: card.stampsRequired
            }
          })));
        }
      });
      setCustomerCards(allCards);

      setMessage({
        type: 'success',
        text: `Cliente ${customerData.firstName} ${customerData.lastName} identificado`
      });
    } catch (error) {
      console.error('Error loading customer:', error);
      setMessage({
        type: 'error',
        text: error.response?.status === 404
          ? 'Cliente no registrado en el sistema'
          : 'No se pudo cargar la información del cliente'
      });
      setCustomer(null);
      setCustomerCards([]);
      setLastScannedQR(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (selectedProgram.type === 'POINTS') {
        // Otorgar puntos
        const amount = parseFloat(purchaseAmount);

        if (selectedProgram.minimumPurchaseAmount && amount < selectedProgram.minimumPurchaseAmount) {
          setMessage({
            type: 'error',
            text: `El monto mínimo de compra es $${selectedProgram.minimumPurchaseAmount.toLocaleString('es-CL')}`
          });
          setLoading(false);
          return;
        }

        await api.post('/loyalty/points/earn', {
          customerId: customer.id,
          purchaseAmount: amount,
          description: description || `Compra de $${amount.toLocaleString('es-CL')}`
        });

        setMessage({
          type: 'success',
          text: `✅ ${calculatedPoints.toLocaleString('es-CL')} puntos otorgados a ${customer.firstName}`
        });
      } else {
        // Agregar sello
        const card = customerCards.find(c => c.programId === selectedProgram.id && !c.isCompleted);

        if (!card) {
          // Crear nueva tarjeta si no existe
          const newCardRes = await api.post('/loyalty/stamp-cards', {
            customerId: customer.id,
            programId: selectedProgram.id
          });

          // Agregar primer sello
          await api.post('/loyalty/stamp-cards/stamps', {
            stampCardId: newCardRes.data.id,
            customerId: customer.id
          });

          setMessage({
            type: 'success',
            text: `✅ Primera tarjeta creada y primer sello agregado a ${customer.firstName} (1/${selectedProgram.stampsRequired})`
          });
        } else {
          await api.post('/loyalty/stamp-cards/stamps', {
            stampCardId: card.id,
            customerId: customer.id
          });

          const newStampCount = card.stampsCollected + 1;
          const isComplete = newStampCount >= selectedProgram.stampsRequired;

          setMessage({
            type: 'success',
            text: isComplete
              ? `🎉 ¡Tarjeta completada! ${customer.firstName} ha obtenido su recompensa`
              : `✅ Sello agregado a ${customer.firstName} (${newStampCount}/${selectedProgram.stampsRequired})`
          });
        }

        // Recargar información del cliente para actualizar las tarjetas
        if (lastScannedQR) {
          await loadCustomerInfo(lastScannedQR);
        }
      }

      // Limpiar formulario
      setPurchaseAmount('');
      setDescription('');

      // Opcional: limpiar cliente después de unos segundos
      setTimeout(() => {
        setCustomer(null);
        setCustomerCards([]);
        setPurchaseAmount('');
        setCalculatedPoints(0);
      }, 3000);

    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error al procesar la venta'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetCustomer = () => {
    setCustomer(null);
    setCustomerCards([]);
    setPurchaseAmount('');
    setCalculatedPoints(0);
    setMessage({ type: '', text: '' });
    setLastScannedQR(null);
  };

  // Validación de negocio
  if (businessLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!business || businessError) {
    return <NoBusinessMessage icon={ShoppingCart} />;
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingCart className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Registrar Venta</h1>
        </div>
        <p className="text-gray-600">
          Escanea el QR del cliente para otorgar puntos o sellos
        </p>
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-100 rounded-xl">
            <HelpCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-3">¿Cómo funciona?</h3>
            <ol className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary-600">1.</span>
                <span>Selecciona el programa (puntos o sellos)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary-600">2.</span>
                <span>Haz clic en "Escanear QR" y el cliente muestra su código desde su wallet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary-600">3.</span>
                <span>Si es programa de puntos, ingresa el monto de la compra</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary-600">4.</span>
                <span>Confirma para otorgar puntos o agregar sello automáticamente</span>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {programs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No tienes programas activos
          </h3>
          <p className="text-gray-600 mb-6">
            Primero debes crear un programa de puntos o sellos en la sección "Programas"
          </p>
        </div>
      ) : (
        <>
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

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {/* Select Program */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Programa *
              </label>
              <select
                value={selectedProgram?.id || ''}
                onChange={(e) => {
                  const program = programs.find(p => p.id === e.target.value);
                  setSelectedProgram(program);
                  setPurchaseAmount('');
                  setCalculatedPoints(0);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                required
                disabled={!!customer}
              >
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name} ({program.type === 'POINTS' ? 'Puntos' : 'Sellos'})
                  </option>
                ))}
              </select>
            </div>

            {/* QR Scanner Section */}
            {!customer ? (
              <div className="text-center py-8">
                <div className="mb-6">
                  <div className="inline-flex p-6 bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl mb-4">
                    <QrCode className="w-16 h-16 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Escanear código QR del cliente
                  </h3>
                  <p className="text-gray-600">
                    El cliente debe mostrar su código QR desde Apple Wallet o Google Wallet
                  </p>
                </div>

                {!showScanner ? (
                  <button
                    type="button"
                    onClick={() => setShowScanner(true)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    <Camera className="w-6 h-6" />
                    Escanear QR
                  </button>
                ) : (
                  <div className="max-w-md mx-auto">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">Escaneando...</h4>
                      <button
                        type="button"
                        onClick={() => {
                          if (scanner) {
                            scanner.clear();
                            setScanner(null);
                          }
                          setShowScanner(false);
                        }}
                        className="text-gray-600 hover:text-red-600"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    <div id="qr-reader" className="rounded-lg overflow-hidden border-2 border-primary-300"></div>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Info */}
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Cliente identificado</p>
                        <p className="text-xl font-bold text-gray-900">
                          {customer.firstName} {customer.lastName}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={resetCustomer}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Cambiar cliente
                    </button>
                  </div>

                  {/* Show customer's cards for selected program */}
                  {selectedProgram?.type === 'STAMPS' && (
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      {(() => {
                        const card = customerCards.find(c => c.programId === selectedProgram.id && !c.isCompleted);
                        if (card) {
                          return (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">Tarjeta actual:</span>
                              <span className="font-bold text-gray-900">
                                {card.stampsCollected}/{selectedProgram.stampsRequired} sellos
                              </span>
                            </div>
                          );
                        } else {
                          return (
                            <p className="text-sm text-gray-600 italic">
                              No tiene tarjeta activa. Se creará automáticamente.
                            </p>
                          );
                        }
                      })()}
                    </div>
                  )}
                </div>

                {/* Purchase Amount Question (only for POINTS) */}
                {selectedProgram?.type === 'POINTS' && (
                  <>
                    <div>
                      <label className="block text-lg font-semibold text-gray-900 mb-3">
                        ¿Cuánto compró {customer.firstName}?
                      </label>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl text-gray-700 font-bold">$</span>
                        <input
                          type="number"
                          value={purchaseAmount}
                          onChange={(e) => setPurchaseAmount(e.target.value)}
                          className="flex-1 px-6 py-4 text-2xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                          placeholder="0"
                          min="0"
                          step="0.01"
                          required
                          autoFocus
                        />
                      </div>
                      {selectedProgram.minimumPurchaseAmount > 0 && (
                        <p className="text-sm text-gray-500 mt-2">
                          Monto mínimo: ${selectedProgram.minimumPurchaseAmount.toLocaleString('es-CL')}
                        </p>
                      )}
                    </div>

                    {/* Calculated Points */}
                    {purchaseAmount && (
                      <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-4 bg-white rounded-xl shadow-sm">
                              <Calculator className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Puntos a otorgar</p>
                              <p className="text-3xl font-bold text-gray-900">
                                {calculatedPoints.toLocaleString('es-CL')} puntos
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-600 mb-1">Cálculo</p>
                            <p className="text-sm font-mono text-gray-700 bg-white px-3 py-2 rounded-lg">
                              ${Number(purchaseAmount).toLocaleString('es-CL')} ÷ ${Number(selectedProgram.pointsConversionRate).toLocaleString('es-CL')} = {calculatedPoints.toLocaleString('es-CL')}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción (opcional)
                      </label>
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        placeholder="Ej: Compra de productos"
                      />
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetCustomer}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading || (selectedProgram?.type === 'POINTS' && calculatedPoints === 0)}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {selectedProgram?.type === 'POINTS' ? (
                      <>
                        <Award className="w-6 h-6" />
                        {loading ? 'Otorgando...' : `Otorgar ${calculatedPoints.toLocaleString('es-CL')} puntos`}
                      </>
                    ) : (
                      <>
                        <Star className="w-6 h-6" />
                        {loading ? 'Agregando...' : 'Agregar sello'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
}
