import React, { useState, useEffect } from 'react';

const AmortizationTable = ({ 
  schedule, 
  showAmortizationColumn = false, 
  formatCurrency, 
  formatMonthDate,
  onAddAmort,
  onEditAmort,
  onRemoveAmort
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [expandedRow, setExpandedRow] = useState(null);

  // Calculate paginated data and total pages
  useEffect(() => {
    let result = [...schedule];
    
    // Apply search term filter if present
    if (searchTerm.trim()) {
      result = result.filter(row => {
        const searchTermNum = parseInt(searchTerm);
        if (!isNaN(searchTermNum)) {
          return row.month === searchTermNum || 
                 Math.abs(row.parcela - searchTermNum) < 10 ||
                 Math.abs(row.saldoDevedor - searchTermNum) < 100;
        }
        return false;
      });
    }
    
    setFilteredSchedule(result);
    
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [schedule, searchTerm]);

  const totalPages = Math.ceil(filteredSchedule.length / itemsPerPage);
  
  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSchedule.slice(startIndex, endIndex);
  };

  const handleRowExpand = (month) => {
    if (expandedRow === month) {
      setExpandedRow(null);
    } else {
      setExpandedRow(month);
    }
  };

  // Pagination controls
  const handlePrevPage = () => {
    setCurrentPage(currentPage => Math.max(1, currentPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage => Math.min(totalPages, currentPage + 1));
  };

  const handleJumpToStart = () => {
    setCurrentPage(1);
  };

  const handleJumpToEnd = () => {
    setCurrentPage(totalPages);
  };
  
  const handleJumpToMonth = (e) => {
    e.preventDefault();
    const month = parseInt(searchTerm.trim());
    if (!isNaN(month) && month > 0 && month <= schedule.length) {
      // Calculate page containing this month
      const pageNum = Math.ceil(month / itemsPerPage);
      setCurrentPage(pageNum);
    }
  };

  return (
    <div className="w-full">
      {/* Search and Export Controls */}
      <div className="flex flex-wrap justify-between mb-4 gap-2">
        <div className="flex items-center">
          <form onSubmit={handleJumpToMonth} className="flex">
            <input
              type="text"
              placeholder="Mês específico"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              type="submit"
              className="bg-blue-500 text-white px-2 py-2 rounded-r-md hover:bg-blue-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
          </form>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
            className="border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="12">12 por página</option>
            <option value="24">24 por página</option>
            <option value="36">36 por página</option>
            <option value="120">120 por página</option>
          </select>
          
          <div className="flex items-center border rounded-md">
            <button
              onClick={handleJumpToStart}
              disabled={currentPage === 1}
              className={`px-3 py-1 ${currentPage === 1 ? 'text-gray-300' : 'text-blue-600 hover:bg-blue-50'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 ${currentPage === 1 ? 'text-gray-300' : 'text-blue-600 hover:bg-blue-50'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <span className="px-3 py-1 text-sm">
              Página {currentPage} de {totalPages || 1}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 py-1 ${currentPage === totalPages || totalPages === 0 ? 'text-gray-300' : 'text-blue-600 hover:bg-blue-50'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={handleJumpToEnd}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 py-1 ${currentPage === totalPages || totalPages === 0 ? 'text-gray-300' : 'text-blue-600 hover:bg-blue-50'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 6.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0zm12 0a1 1 0 010-1.414L12.586 10l3.707-3.707a1 1 0 00-1.414-1.414l-5 5a1 1 0 000 1.414l5 5a1 1 0 001.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Amortization Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mês
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Saldo Devedor
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Correção
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Saldo Corrigido
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Juros
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Taxas/Seguro
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amortização
              </th>
              {showAmortizationColumn && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amort. Extra
                </th>
              )}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parcela
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {getCurrentPageData().map((row) => (
              <React.Fragment key={row.month}>
                <tr className={row.tipoAmortizacao === 'prazo' ? 'bg-green-50' : (row.tipoAmortizacao === 'parcela' ? 'bg-blue-50' : '')}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      <button 
                        onClick={() => handleRowExpand(row.month)}
                        className="mr-2 text-gray-400 hover:text-gray-600"
                      >
                        {expandedRow === row.month ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      {row.month}
                      <span className="ml-2 text-xs text-gray-500">
                        {formatMonthDate(row.month)}
                      </span>
                      {row.tipoAmortizacao && (
                        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.tipoAmortizacao === 'prazo' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {row.tipoAmortizacao === 'prazo' ? 'Prazo' : 'Parcela'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                    {formatCurrency(row.saldoDevedor)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                    {formatCurrency(row.correction)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                    {formatCurrency(row.dividaCorrigida)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                    {formatCurrency(row.juros)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                    {formatCurrency(row.seguro)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                    {formatCurrency(row.amortizacaoMensal)}
                  </td>
                  {showAmortizationColumn && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-medium">
                      {row.amortizacaoExtra > 0 ? formatCurrency(row.amortizacaoExtra) : '-'}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                    {formatCurrency(row.parcela)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <div className="flex justify-center space-x-2">
                      {onAddAmort && (
                        <button
                          onClick={() => onAddAmort(row.month)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Adicionar Amortização"
                          aria-label="Adicionar Amortização"
                          type="button"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                      {onEditAmort && row.amortizacaoExtra > 0 && (
                        <button
                          onClick={() => onEditAmort(row.month)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar Amortização"
                          aria-label="Editar Amortização"
                          type="button"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                      )}
                      {onRemoveAmort && row.amortizacaoExtra > 0 && (
                        <button
                          onClick={() => onRemoveAmort(row.month)}
                          className="text-red-600 hover:text-red-900"
                          title="Remover Amortização"
                          aria-label="Remover Amortização"
                          type="button"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {expandedRow === row.month && (
                  <tr className="bg-gray-50">
                    <td colSpan={showAmortizationColumn ? 7 : 6} className="px-6 py-4 text-sm text-gray-700">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Valores Detalhados</p>
                          <div className="grid grid-cols-2 gap-1 text-sm">
                            <span className="text-gray-500">Correção:</span>
                            <span className="text-right">{formatCurrency(row.correction)}</span>
                            
                            <span className="text-gray-500">Dívida Corrigida:</span>
                            <span className="text-right">{formatCurrency(row.dividaCorrigida)}</span>
                            
                            <span className="text-gray-500">Seguro:</span>
                            <span className="text-right">{formatCurrency(row.seguro)}</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Composição da Parcela</p>
                          <div className="grid grid-cols-2 gap-1 text-sm">
                            <span className="text-gray-500">Juros:</span>
                            <span className="text-right">{formatCurrency(row.juros)}</span>
                            
                            <span className="text-gray-500">Amortização:</span>
                            <span className="text-right">{formatCurrency(row.amortizacaoMensal)}</span>
                            
                            <span className="text-gray-500">Seguro:</span>
                            <span className="text-right">{formatCurrency(row.seguro)}</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Após o Pagamento</p>
                          <div className="grid grid-cols-2 gap-1 text-sm">
                            <span className="text-gray-500">Novo Saldo:</span>
                            <span className="text-right">{formatCurrency(row.novoSaldo)}</span>
                            
                            <span className="text-gray-500">Prazo Restante:</span>
                            <span className="text-right">{row.prazoRemanescente} meses</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AmortizationTable;