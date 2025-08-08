import React, { useEffect } from "react"; // Removido useState
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react";
import { PUBLIC_KEY } from "../../config";
import { toast } from "react-toastify";

const CardPaymentForm = ({
  consultationValue,
  onSubmitCard,
}) => {

  useEffect(() => {
    if (!PUBLIC_KEY) {
      console.error("Erro de configuração: Chave de pagamento não encontrada. PUBLIC_KEY não está definida para o Mercado Pago.");
      toast.error("Erro ao carregar formulario de pagamento.");
      return;
    }

    if (typeof consultationValue !== 'number' || consultationValue <= 0) {
      console.warn("CardPaymentForm: Valor da consulta inválido ou não definido. O SDK do Mercado Pago só será inicializado quando o valor for válido.");
      return;
    }

    initMercadoPago(PUBLIC_KEY, {
      locale: "pt-BR",
    });
  }, [PUBLIC_KEY, consultationValue]);

  const customization = {
    //implementar customização do formulário
  };

  const onReady = () => { console.log("SDK de cartão pronto no CardPaymentForm!"); };

  const onError = async (error) => {
    console.error("Erro no formulário de cartão do Mercado Pago:", error);
    toast.error("Ocorreu um erro ao preencher os dados do cartão. Verifique e tente novamente.");
  };

  // Se consultationValue for 0 ou inválido, não renderize o CardPayment
  if (typeof consultationValue !== 'number' || consultationValue <= 0) {
    return null;
  }

  return (
    <div id="form-mercadopago">
      <CardPayment
        initialization={{
          amount: consultationValue,
          preferenceId: undefined,
          currency: 'BRL',
        }}
        customization={customization}
        onSubmit={(mpResponse) => onSubmitCard(mpResponse)}
        onReady={onReady}
        onError={onError}
        locale="pt-BR"
      />
    </div>
  );
};

export default CardPaymentForm;