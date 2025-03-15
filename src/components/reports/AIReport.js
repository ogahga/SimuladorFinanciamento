import React, { useState, useEffect } from 'react';
import './ReportStyles.css';

const AIReport = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState('');

  // Manipulação do upload de arquivo
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const fileTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!fileTypes.includes(selectedFile.type)) {
      setError('Formato de arquivo não suportado. Por favor, envie um arquivo PDF ou imagem (JPEG, PNG).');
      return;
    }

    setFile(selectedFile);
    setError('');
    
    // Criar preview para imagens
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // Para PDFs, mostrar um ícone ou texto indicativo
      setPreview(null);
    }
  };

  // Simular o envio e análise do arquivo
  const handleAnalyze = () => {
    if (!file) {
      setError('Por favor, selecione um arquivo para analisar.');
      return;
    }

    setIsLoading(true);
    
    // Simulando o tempo de processamento
    setTimeout(() => {
      setIsLoading(false);
      setShowReport(true);
      
      // Dados simulados do relatório - Em produção, viria da API
      setReportData({
        date: new Date().toLocaleDateString('pt-BR'),
        // Dados do relatório conforme exemplo fornecido
        progress: {
          completed: 105,
          total: 360,
          percentage: 29.2
        },
        insights: {
          product: "BB Crédito Imobiliário",
          program: "Minha Casa Minha Vida",
          interestRate: 5.116,
          indexer: "TR",
          remainingTerm: 255,
          originalTerm: 360,
          balance: 106248.33,
          system: "PRICE"
        }
      });
    }, 3000);
  };

  // Renderização do modal de upload
  const renderUploadForm = () => (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Relatório de Análise IA</h3>
      <p className="text-gray-600 mb-6">
        Envie um documento do seu financiamento (extrato, contrato, boleto) para que nossa IA faça uma análise detalhada e gere um relatório com insights personalizados.
      </p>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
        <input 
          type="file" 
          id="document-upload" 
          className="hidden" 
          accept="application/pdf,image/jpeg,image/png"
          onChange={handleFileChange}
        />
        
        {preview ? (
          <div className="mb-4">
            <img src={preview} alt="Preview" className="max-h-56 mx-auto rounded" />
            <p className="text-sm text-gray-500 mt-2">{file.name}</p>
          </div>
        ) : file ? (
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm text-gray-500 mt-2">{file.name}</p>
          </div>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-500 mt-2">Arraste seu arquivo aqui ou</p>
          </>
        )}

        <label htmlFor="document-upload" className="mt-4 inline-block btn btn-primary">
          {file ? 'Trocar arquivo' : 'Selecionar arquivo'}
        </label>
        
        <p className="text-xs text-gray-500 mt-2">
          Formatos aceitos: PDF, JPEG, PNG. Tamanho máximo: 10MB
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="btn btn-outline"
        >
          Cancelar
        </button>
        <button
          onClick={handleAnalyze}
          className="btn btn-primary"
          disabled={!file || isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analisando...
            </span>
          ) : 'Analisar documento'}
        </button>
      </div>
    </div>
  );

  // Renderização do relatório gerado
  const renderReport = () => (
    <div className="p-6 max-h-[80vh] overflow-y-auto report-container">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Relatório de Financiamento Imobiliário</h2>
        <h3 className="text-lg font-medium text-gray-600">Estratégia de Amortização e Investimento</h3>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
        <h3 className="font-semibold text-gray-700 mb-2">Resumo</h3>
        <p className="text-gray-600">
          Este relatório apresenta uma análise detalhada do seu financiamento imobiliário, com foco na estratégia de amortização e juros compostos. São abordados os principais insights, uma comparação entre amortizar ou investir o dinheiro disponível, e um plano passo a passo para a redução do prazo do financiamento.
        </p>
      </div>

      {/* Progresso do Financiamento */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Progresso do Financiamento</h3>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="mb-2">
            <div className="h-4 w-full bg-gray-200 rounded-full">
              <div 
                className="h-4 bg-primary-600 rounded-full report-graph-bar" 
                style={{ width: `${reportData.progress.percentage}%` }}
              ></div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600">
            {reportData.progress.completed} meses concluídos de {reportData.progress.total} meses ({reportData.progress.percentage}%)
          </p>
        </div>
      </div>

      {/* Insights do Financiamento */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Insights do Financiamento</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 report-card">
            <p className="text-sm text-gray-500">Produto</p>
            <p className="font-medium text-gray-800">{reportData.insights.product}</p>
            <p className="text-sm text-gray-600">{reportData.insights.program}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Taxa de Juros Efetiva</p>
            <p className="font-medium text-gray-800">{reportData.insights.interestRate}% a.a.</p>
            <p className="text-sm text-gray-600">{reportData.insights.indexer} como indexador</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Prazo</p>
            <p className="font-medium text-gray-800">{reportData.insights.remainingTerm} meses restantes</p>
            <p className="text-sm text-gray-600">de {reportData.insights.originalTerm} meses originais</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Saldo Devedor</p>
            <p className="font-medium text-gray-800">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(reportData.insights.balance)}
            </p>
            <p className="text-sm text-gray-600">Sistema {reportData.insights.system}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
          <h4 className="font-medium text-gray-700 mb-2">Composição das Parcelas</h4>
          <p className="text-sm text-gray-600">
            No sistema PRICE, as primeiras parcelas têm alta incidência de juros, mas, com o tempo, a parcela passa a concentrar mais amortização do saldo devedor.
          </p>
        </div>
      </div>

      {/* É Melhor Amortizar ou Investir? */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">É Melhor Amortizar ou Investir?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-2xl font-bold text-blue-700 text-center mb-2">5,12%</p>
            <h4 className="font-medium text-blue-700 text-center mb-2">Economia com Amortização</h4>
            <ul className="text-sm text-blue-600 space-y-1">
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 text-blue-500 mr-1">•</span>
                Redução garantida de juros
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 text-blue-500 mr-1">•</span>
                Diminuição do prazo
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 text-blue-500 mr-1">•</span>
                Segurança financeira
              </li>
            </ul>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <p className="text-2xl font-bold text-green-700 text-center mb-2">8,00%+</p>
            <h4 className="font-medium text-green-700 text-center mb-2">Potencial de Investimentos</h4>
            <ul className="text-sm text-green-600 space-y-1">
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 text-green-500 mr-1">•</span>
                Maior rentabilidade potencial
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 text-green-500 mr-1">•</span>
                Liquidez preservada
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 text-green-500 mr-1">•</span>
                Formação de patrimônio
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-2">Amortizar</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 text-green-500 mr-1">•</span>
                Reduz o saldo devedor imediatamente
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 text-green-500 mr-1">•</span>
                Diminui o total de juros futuros
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 text-green-500 mr-1">•</span>
                Encurta o prazo do financiamento
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 text-green-500 mr-1">•</span>
                Economia garantida de 5,116% a.a.
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 text-green-500 mr-1">•</span>
                Aumenta o patrimônio líquido no imóvel
              </li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-2">Investir</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 text-green-500 mr-1">•</span>
                Potencial de ganhos superiores a 8% a.a.
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 text-green-500 mr-1">•</span>
                Mantém reserva financeira com liquidez
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 text-green-500 mr-1">•</span>
                Possibilita diversificação patrimonial
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 text-green-500 mr-1">•</span>
                Permite aproveitar oportunidades de mercado
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 text-green-500 mr-1">•</span>
                Exige disciplina e conhecimento financeiro
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
          <p className="text-sm text-indigo-700">
            Se você conseguir investimentos com retorno líquido acima de 8% a.a., a estratégia de investir pode ser mais vantajosa. Entretanto, amortizar o financiamento reduz a dívida e os juros futuros, proporcionando segurança financeira. Uma abordagem híbrida – parte para amortização e parte para investimento – também é uma opção interessante.
          </p>
        </div>
      </div>

      {/* Plano de Amortização Passo a Passo */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Plano de Amortização Passo a Passo</h3>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 flex report-step">
            <div className="rounded-full h-8 w-8 flex items-center justify-center bg-primary-600 text-white font-bold mr-3 flex-shrink-0">1</div>
            <div>
              <h4 className="font-medium text-gray-800 mb-1">Avaliação Inicial</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-start">
                  <span className="inline-block h-5 w-5 text-gray-500 mr-1">•</span>
                  Saldo devedor atual: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(reportData.insights.balance)}
                </li>
                <li className="flex items-start">
                  <span className="inline-block h-5 w-5 text-gray-500 mr-1">•</span>
                  Prazo remanescente: {reportData.insights.remainingTerm} meses
                </li>
                <li className="flex items-start">
                  <span className="inline-block h-5 w-5 text-gray-500 mr-1">•</span>
                  Sistema de amortização: Tabela {reportData.insights.system}
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 flex">
            <div className="rounded-full h-8 w-8 flex items-center justify-center bg-primary-600 text-white font-bold mr-3 flex-shrink-0">2</div>
            <div>
              <h4 className="font-medium text-gray-800 mb-1">Definir o Valor de Amortização Extraordinária</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-start">
                  <span className="inline-block h-5 w-5 text-gray-500 mr-1">•</span>
                  Exemplo: Amortizar R$ 10.000 para reduzir o prazo.
                </li>
                <li className="flex items-start">
                  <span className="inline-block h-5 w-5 text-gray-500 mr-1">•</span>
                  Estimativa: Aproximadamente 35,7 parcelas eliminadas, correspondendo a cerca de 3 anos de redução.
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 flex">
            <div className="rounded-full h-8 w-8 flex items-center justify-center bg-primary-600 text-white font-bold mr-3 flex-shrink-0">3</div>
            <div>
              <h4 className="font-medium text-gray-800 mb-1">Cálculo para Redução de 15 Anos</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-start">
                  <span className="inline-block h-5 w-5 text-gray-500 mr-1">•</span>
                  Meta: Reduzir 180 parcelas (15 anos).
                </li>
                <li className="flex items-start">
                  <span className="inline-block h-5 w-5 text-gray-500 mr-1">•</span>
                  Método simplificado: Considerando que, em média, R$ 210 de cada parcela é destinado à amortização do capital, o valor necessário é:
                </li>
                <li className="flex items-start pl-6">
                  Valor necessário = 180 × R$ 210 = R$ 37.800
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 flex">
            <div className="rounded-full h-8 w-8 flex items-center justify-center bg-primary-600 text-white font-bold mr-3 flex-shrink-0">4</div>
            <div>
              <h4 className="font-medium text-gray-800 mb-1">Implementação</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-start">
                  <span className="inline-block h-5 w-5 text-gray-500 mr-1">•</span>
                  Verifique as condições para amortizações extraordinárias sem penalidades.
                </li>
                <li className="flex items-start">
                  <span className="inline-block h-5 w-5 text-gray-500 mr-1">•</span>
                  Planeje realizar amortizações periódicas ou utilizar recursos extras (como 13º salário, bônus ou saldo do FGTS) para abater o saldo devedor.
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 flex">
            <div className="rounded-full h-8 w-8 flex items-center justify-center bg-primary-600 text-white font-bold mr-3 flex-shrink-0">5</div>
            <div>
              <h4 className="font-medium text-gray-800 mb-1">Revisão e Acompanhamento</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-start">
                  <span className="inline-block h-5 w-5 text-gray-500 mr-1">•</span>
                  Monitore a evolução do saldo devedor e a redução dos juros.
                </li>
                <li className="flex items-start">
                  <span className="inline-block h-5 w-5 text-gray-500 mr-1">•</span>
                  Reavalie a estratégia conforme a performance dos investimentos e as condições do financiamento (como variações na TR).
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Conclusão */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Conclusão</h3>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">
            A escolha entre amortizar ou investir depende do equilíbrio entre a redução dos juros do financiamento e a potencial rentabilidade dos investimentos. Com um custo de dívida de 5,116% a.a. e a possibilidade de alcançar retornos superiores a 8% a.a. em investimentos, a estratégia de investir pode ser mais vantajosa, desde que você mantenha disciplina e liquidez. Por outro lado, a amortização garante a redução da dívida e dos encargos futuros, proporcionando maior segurança. Uma abordagem híbrida pode oferecer o melhor dos dois mundos.
          </p>
        </div>
      </div>

      <div className="text-right text-sm text-gray-500 border-t pt-4">
        Relatório gerado em: {reportData.date}
      </div>

      <div className="flex justify-end mt-4 report-no-print">
        <button
          onClick={onClose}
          className="btn btn-outline"
        >
          Fechar
        </button>
        <button
          onClick={() => window.print()}
          className="btn btn-primary ml-2"
        >
          Imprimir Relatório
        </button>
      </div>
    </div>
  );

  // Adicionar classe ao body quando o modal estiver aberto para desabilitar scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 report-modal-backdrop">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative report-modal-container">
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mb-4"></div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Analisando seu documento</h3>
            <p className="text-gray-500 text-center max-w-sm">
              Nossa IA está extraindo informações e gerando insights personalizados para seu financiamento...
            </p>
          </div>
        ) : showReport ? renderReport() : renderUploadForm()}
      </div>
    </div>
  );
};

export default AIReport;