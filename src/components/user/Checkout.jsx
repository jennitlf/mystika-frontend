import React, { useState, useContext, useEffect, useCallback } from "react";
import { API } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../../css/user/Checkout.css";
import CardPaymentForm from "./CardPaymentForm";

const PaymentInfoModal = ({ type, data, onClose }) => {
  return (
    <div className="payment-info-modal-overlay">
      <div className="payment-info-modal-content">
        <div className="container-close-button">
          <button className="close-button" onClick={onClose}>
            x
          </button>
        </div>
        {type === "pix" && data && (
          <>
            <h2>Pagamento PIX</h2>
            <p>
              <strong>Copie e Cole (Código PIX):</strong>
            </p>
            <p className="pix-code">{data.qr_code}</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(data.qr_code);
                toast.success("Código PIX copiado!");
              }}
            >
              Copiar Código PIX
            </button>
            {data.qr_code_base64 && (
              <>
                <p>
                  <strong>Ou escaneie o QR Code:</strong>
                </p>
                <img
                  src={`data:image/png;base64,${data.qr_code_base64}`}
                  alt="QR Code PIX"
                  className="qr-code-image"
                />
              </>
            )}
            <p className="payment-modal-info">Após o pagamento, o status da sua consulta será atualizado automaticamente.</p>
          </>
        )}
        {type === "boleto" && data && (
          <>
            <h2>Pagamento Boleto</h2>
            <p>
              Seu boleto foi gerado com sucesso! Clique no botão abaixo para
              visualizá-lo e imprimi-lo.
            </p>
            <button
              onClick={() => window.open(data.boleto_url, "_blank")}
              className="view-boleto-button"
            >
              Visualizar Boleto
            </button>
             <p className="payment-modal-info">Após o pagamento, o status da sua consulta será atualizado automaticamente.</p>
          </>
        )}
        {!data && <p>Nenhuma informação de pagamento disponível.</p>}
      </div>
    </div>
  );
};


const Checkout = ({ consultationDetails, onClose }) => {
  const { token, user, loading, checkTokenValidity, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentModalData, setPaymentModalData] = useState(null);
  const [paymentModalType, setPaymentModalType] = useState(null);
  const [boletoPayerAddress, setBoletoPayerAddress] = useState({
    zip_code: "",
    street_name: "",
    street_number: "",
    neighborhood: "",
    city: "",
    federal_unit: "",
  });

  const makeAuthenticatedRequest = useCallback(async (url, options) => {
    if (!checkTokenValidity()) {
      toast.error("Sua sessão expirou. Por favor, faça login novamente.");
      setLocalLoading(false);
      return null;
    }

    const authHeaders = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await fetch(url, { ...options, headers: authHeaders });

      if (response.status === 401) {
        console.error("Erro 401: Token inválido ou expirado pelo servidor.");
        toast.error("Sua sessão expirou. Faça login novamente.");
        logout();
        return null;
      }

      return response;
    } catch (error) {
      console.error("Erro na requisição autenticada:", error);
      toast.error("Erro de comunicação com o servidor. Tente novamente.");
      throw error;
    }
  }, [token, checkTokenValidity, logout]);


  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user || !token || !checkTokenValidity()) {
      toast.error("Sua sessão expirou ou não está ativa. Por favor, faça login novamente.");
      navigate("/login", { replace: true });
      return;
    }
  }, [user, token, loading, navigate, checkTokenValidity]);


  if (loading) {
    return <div>Carregando informações da sessão...</div>;
  }

  if (!user || !token) {
    return null;
  }

  if (!consultationDetails) {
    toast.error("Nenhum detalhe de consulta fornecido para o checkout.");
    onClose();
    navigate("/consultores");
    return null;
  }

  const {
    id_schedule_consultant,
    appoinment_date_time,
    appoinment_time,
    appoinment_date,
    consultantName,
    specialtyName,
    consultationValue: rawConsultationValue,
    duration,
  } = consultationDetails;

  const consultationValue = parseFloat(rawConsultationValue);
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const handleBoletoAddressChange = (e) => {
    const { name, value } = e.target;
    setBoletoPayerAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const onSubmitCard = async (mpResponse) => {
    const { token: mpToken } = mpResponse;

    const createConsultationDto = {
      id_schedule_consultant,
      appoinment_date_time,
      appoinment_time,
      appoinment_date,
    };

    const paymentPayload = {
      createConsultationDto,
      paymentDetails: {
        transaction_amount: consultationValue,
        description: `pagamento referente a serviços esotericos`,
        token: mpToken,
      },
    };

    setLocalLoading(true);
    try {
      const apiUrl = `${API}consultation/${encodeURIComponent(userTimeZone)}/card`;
      
      const response = await makeAuthenticatedRequest(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentPayload),
      });

      if (!response) {
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao processar pagamento com cartão.");
      }

      toast.success("Pagamento com cartão processado com sucesso! Acompanhe o status nos detalhes da sua consulta.");
      onClose();
      navigate("/consultas-agendadas");
    } catch (error) {
      console.error("Erro ao processar pagamento com cartão:", error);
      toast.error(error.message || "Erro ao processar pagamento com cartão.");
    } finally {
      setLocalLoading(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (paymentMethod === "card") {
      return;
    }

    setLocalLoading(true);

    const createConsultationDto = {
      id_schedule_consultant,
      appoinment_date_time,
      appoinment_time,
      appoinment_date,
    };

    let paymentPayload = {};
    let apiUrl = "";

    switch (paymentMethod) {
      case "pix":
        paymentPayload = {
          createConsultationDto,
          paymentDetails: {
            transaction_amount: consultationValue,
            description: `Consulta com ${consultantName} - ${specialtyName}`,
          },
        };
        apiUrl = `${API}consultation/${encodeURIComponent(userTimeZone)}/pix`;
        break;
      case "boleto":
        if (!boletoPayerAddress.zip_code || !boletoPayerAddress.street_name || !boletoPayerAddress.street_number || !boletoPayerAddress.neighborhood || !boletoPayerAddress.city || !boletoPayerAddress.federal_unit) {
          toast.error("Por favor, preencha todos os campos obrigatórios do endereço para Boleto.");
          setLocalLoading(false);
          return;
        }

        paymentPayload = {
          createConsultationDto,
          paymentDetails: {
            transaction_amount: consultationValue,
            description: `Consulta com ${consultantName} - ${specialtyName}`,
            payer: {
              address: {
                zip_code: boletoPayerAddress.zip_code,
                street_name: boletoPayerAddress.street_name,
                street_number: parseInt(boletoPayerAddress.street_number),
                neighborhood: boletoPayerAddress.neighborhood,
                city: boletoPayerAddress.city,
                federal_unit: boletoPayerAddress.federal_unit,
              },
            },
          },
        };
        apiUrl = `${API}consultation/${encodeURIComponent(userTimeZone)}/boleto`;
        break;
      default:
        toast.error("Método de pagamento não selecionado.");
        setLocalLoading(false);
        return;
    }

    try {
      const response = await makeAuthenticatedRequest(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentPayload),
      });

      if (!response) {
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao processar pagamento.");
      }

      const result = await response.json();
      const paymentDetails = result.payment; 
      
      if (paymentMethod === "pix" && paymentDetails.qr_code_base64 && paymentDetails.qr_code) {
        setPaymentModalData(paymentDetails);
        setPaymentModalType("pix");
        setShowPaymentModal(true);
      } else if (paymentMethod === "boleto" && paymentDetails.boleto_url) {
        setPaymentModalData(paymentDetails);
        setPaymentModalType("boleto");
        setShowPaymentModal(true);
      } else {
        toast.error("Erro: Informações de pagamento incompletas ou inválidas.");
      }

    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      toast.error(error.message || "Erro ao processar pagamento.");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentModalData(null);
    setPaymentModalType(null);
    onClose();
    navigate("/consultas-agendadas");
  };

  return (
    <div className="checkout-modal">
      <div className="checkout-modal-content">
        <div className="container-close-button">
          <button className="close-button" onClick={onClose}>
            x
          </button>
        </div>
        <h2>Finalizar Consulta</h2>
        <div className="consultation-summary">
          <p>
            <strong>Consultor:</strong> {consultantName}
          </p>
          <p>
            <strong>Especialidade:</strong> {specialtyName}
          </p>
          <p>
            <strong>Data:</strong>{" "}
            {new Date(appoinment_date).toLocaleDateString("pt-BR")}
          </p>
          <p>
            <strong>Horário:</strong> {appoinment_time}
          </p>
          <p>
            <strong>Duração:</strong> {duration} minutos
          </p>
          <p>
            <strong>Valor Total:</strong> R${consultationValue.toFixed(2)}
          </p>
        </div>

        <div className="payment-method-selection">
          <h3>Selecione o Método de Pagamento:</h3>
          <div className="options-payments">
            <button
              className={`payment-button ${
                paymentMethod === "pix" ? "selected" : ""
              }`}
              onClick={() => setPaymentMethod("pix")}
            >
              PIX
            </button>
            <button
              className={`payment-button ${
                paymentMethod === "boleto" ? "selected" : ""
              }`}
              onClick={() => setPaymentMethod("boleto")}
            >
              Boleto
            </button>
            <button
              className={`payment-button ${
                paymentMethod === "card" ? "selected" : ""
              }`}
              onClick={() => setPaymentMethod("card")}
            >
              Cartão de Crédito
            </button>
          </div>
        </div>

        {paymentMethod && (
          <div className="payer-details-form">
            {paymentMethod === "card" && consultationValue > 0 && (
              <>
                <h4>Detalhes do Cartão:</h4>
                <CardPaymentForm
                  consultationValue={consultationValue}
                  onSubmitCard={onSubmitCard}
                />
              </>
            )}

            {paymentMethod === "card" &&
              (typeof consultationValue !== "number" ||
                consultationValue <= 0) && (
                <p>
                  Carregando detalhes do pagamento ou valor da consulta inválido
                  para cartão...
                </p>
              )}

            {paymentMethod === "boleto" && (
              <>
                <h4>Endereço do Pagador para Boleto:</h4>
                <div className="boleto-address-fields">
                  <label>
                    CEP:
                    <input
                      type="text"
                      name="zip_code"
                      value={boletoPayerAddress.zip_code}
                      onChange={handleBoletoAddressChange}
                      placeholder="Ex: 00000000"
                      maxLength="8"
                      required
                    />
                  </label>
                  <label>
                    Rua:
                    <input
                      type="text"
                      name="street_name"
                      value={boletoPayerAddress.street_name}
                      onChange={handleBoletoAddressChange}
                      placeholder="Ex: Rua Exemplo"
                      required
                    />
                  </label>
                  <label>
                    Número:
                    <input
                      type="number"
                      name="street_number"
                      value={boletoPayerAddress.street_number}
                      onChange={handleBoletoAddressChange}
                      placeholder="Ex: 123"
                      required
                    />
                  </label>
                  <label>
                    Bairro:
                    <input
                      type="text"
                      name="neighborhood"
                      value={boletoPayerAddress.neighborhood}
                      onChange={handleBoletoAddressChange}
                      placeholder="Ex: Centro"
                      required
                    />
                  </label>
                  <label>
                    Cidade:
                    <input
                      type="text"
                      name="city"
                      value={boletoPayerAddress.city}
                      onChange={handleBoletoAddressChange}
                      placeholder="Ex: São Paulo"
                      required
                    />
                  </label>
                  <label>
                    Estado:
                    <input
                      type="text"
                      name="federal_unit"
                      value={boletoPayerAddress.federal_unit}
                      onChange={handleBoletoAddressChange}
                      placeholder="Ex: SP"
                      maxLength="2"
                      required
                    />
                  </label>
                </div>
              </>
            )}

            {paymentMethod !== "card" && (
              <button onClick={handlePaymentSubmit} disabled={localLoading}>
                {localLoading
                  ? "Processando..."
                  : paymentMethod === "pix"
                  ? "Gerar QR Code"
                  : "Gerar Boleto"}
              </button>
            )}
          </div>
        )}
      </div>

      {showPaymentModal && (
        <PaymentInfoModal
          type={paymentModalType}
          data={paymentModalData}
          onClose={handleClosePaymentModal}
        />
      )}
    </div>
  );
};

export default Checkout;