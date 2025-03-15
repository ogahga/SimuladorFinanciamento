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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [hoveredRow, setHoveredRow] = useState(null);
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [editingAmort, setEditingAmort] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    if (highlightedRow !== null) {
      const timer = setTimeout(() => {
        setHighlightedRow(null);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [highlightedRow]);

  // Função para filtrar o cronograma com base na pesquisa
  const filteredSchedule = schedule.filter(row => {
    if (!searchValue) return true;
    
    const searchTerm = searchValue.toLowerCase();
    const monthStr = formatMonthDate(row.month);
    
    return (
      row.month.toString().includes(searchTerm) ||
      monthStr.toLowerCase().includes(searchTerm) ||
      formatCurrency(row.parcela).toLowerCase().includes(searchTerm) ||
      formatCurrency(row.amortizacaoMensal).toLowerCase().includes(searchTerm) ||
      formatCurrency(row.juros).toLowerCase().includes(searchTerm)
    );
  });

  // Paginação
  const totalPages = Math.ceil(filteredSchedule.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedSchedule = filteredSchedule.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // Função para destacar uma linha
  const highlightRow = (index) => {
    setHighlightedRow(index);
  };

  // Função para iniciar edição
  const startEditing = (row) => {
    setEditingAmort(row.month);
    setEditValue(row.amortizacaoExtra.toString());
  };

  // Função para salvar edição
  const saveEdit = () => {
    const value = parseFloat(editValue);
    if (!value || value <= 0) {
      setEditValue('');
      return;
    }
    
    // Check if value exceeds outstanding debt
    const monthData = schedule.find(item => item.month === editingAmort);
    if (value > monthData.saldoDevedor) {
      setEditValue('');
      return;
    }

    onEditAmort(editingAmort, value);
    setEditingAmort(null);
    setEditValue('');
  };

  // Função para cancelar edição
  const cancelEdit = () => {
    setEditingAmort(null);
    setEditValue('');
  };

  // Botões de navegação para paginação
  const renderPagination = () => (
    <div className="flex items-center justify-between py-3 border-t">
      <div className="flex items-center">
        <span className="text-sm text-gray-700">
          Exibindo <span className="font-medium">{startIndex + 1}</span> a{' '}
          <span className="font-medium">{Math.min(startIndex + rowsPerPage, filteredSchedule.length)}</span> de{' '}
          <span className="font-medium">{filteredSchedule.length}</span> registros
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <select
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          className="p-1.5 text-sm border rounded-md"
        >
          <option value={10}>10 por página</option>
          <option value={25}>25 por página</option>
          <option value={50}>50 por página</option>
          <option value={100}>100 por página</option>
        </select>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={`p-1.5 rounded-md ${
              currentPage === 1
                ? 'text-gray-400 cursor-default'
                : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M8.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L4.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-1.5 rounded-md ${
              currentPage === 1
                ? 'text-gray-400 cursor-default'
                : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => (
              page === 1 || 
              page === totalPages || 
              (page >= currentPage - 1 && page <= currentPage + 1)
            ))
            .map((page, index, array) => {
              // Adicionar reticências
              if (index > 0 && page - array[index - 1] > 1) {
                return (
                  <React.Fragment key={`ellipsis-${page}`}>
                    <span className="px-3 py-1.5 text-gray-500">...</span>
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1.5 rounded-md ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              }
              
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1.5 rounded-md ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-1.5 rounded-md ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-default'
                : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`p-1.5 rounded-md ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-default'
                : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 6.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M11.293 15.707a1 1 0 010-1.414L15.586 10l-4.293-3.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Barra de pesquisa e filtros */}
      <div className="mb-4 flex items-center justify-between">
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Pesquisar..."
          />
        </div>
        
        {filteredSchedule.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <span>Ir para mês:</span>
            <input
              type="number"
              min="1"
              max={schedule.length}
              className="w-16 py-1.5 px-2 border border-gray-300 rounded-md"
              placeholder="Mês"
              onChange={(e) => {
                const month = parseInt(e.target.value);
                if (month && month > 0 && month <= schedule.length) {
                  const pageIndex = Math.ceil(month / rowsPerPage);
                  setCurrentPage(pageIndex);
                  // Destacar a linha por alguns segundos
                  highlightRow(month - 1);
                }
              }}
            />
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mês
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dívida Inicial
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Correção
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dívida Corrigida
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Juros
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amort. Mensal
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seguro
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parcela
              </th>
              {showAmortizationColumn && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amort. Extra
                </th>
              )}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Saldo Final
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedSchedule.map((row, i) => {
              const rowIndex = startIndex + i;
              const isHighlighted = rowIndex === highlightedRow;
              
              return (
                <tr 
                  key={rowIndex}
                  className={`
                    ${isHighlighted ? 'highlight-pulse' : ''} 
                    ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    ${hoveredRow === rowIndex ? 'bg-blue-50' : ''}
                    transition-colors duration-150
                  `}
                  onMouseEnter={() => setHoveredRow(rowIndex)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{row.month}</div>
                      <div className="ml-2 text-xs text-gray-500">{formatMonthDate(row.month)}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                    {formatCurrency(row.saldoDevedor)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatCurrency(row.correction)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                    {formatCurrency(row.dividaCorrigida)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatCurrency(row.juros)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatCurrency(row.amortizacaoMensal)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatCurrency(row.seguro)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                    {formatCurrency(row.parcela)}
                  </td>
                  {showAmortizationColumn && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      {row.amortizacaoExtra > 0 ? (
                        <div className="flex items-center justify-end">
                          {editingAmort === row.month ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="w-24 px-2 py-1 text-sm border rounded"
                                autoFocus
                              />
                              <button 
                                onClick={saveEdit}
                                className="text-green-500 hover:text-green-700 hover:scale-125 hover:bg-green-100 transition-all cursor-pointer p-1 rounded"
                                title="Salvar"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </button>
                              <button 
                                onClick={cancelEdit}
                                className="text-red-500 hover:text-red-700 hover:scale-125 hover:bg-red-100 transition-all cursor-pointer p-1 rounded"
                                title="Cancelar"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <span className="text-blue-600 font-medium mr-2 text-sm">
                              {formatCurrency(row.amortizacaoExtra)}
                              {row.tipoAmortizacao === "prazo" && (
                                <span className="ml-1 text-xs text-gray-500">(prazo)</span>
                              )}
                              {row.tipoAmortizacao === "parcela" && (
                                <span className="ml-1 text-xs text-gray-500">(parcela)</span>
                              )}
                            </span>
                          )}
                          <div className="flex gap-1">
                            {!editingAmort && (
                              <>
                                <button 
                                  onClick={() => startEditing(row)}
                                  className="text-blue-500 hover:text-blue-700 hover:scale-125 hover:bg-blue-100 transition-all cursor-pointer p-1 rounded"
                                  title="Editar Amortização"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={() => onRemoveAmort && onRemoveAmort(row.month)}
                                  className="text-red-500 hover:text-red-700 hover:scale-125 hover:bg-red-100 transition-all cursor-pointer p-1 rounded"
                                  title="Remover Amortização"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-end">
                          <button 
                            className="text-gray-400 hover:text-yellow-500 hover:scale-125 hover:bg-yellow-50 transition-all cursor-pointer p-1 rounded flex items-center"
                            onClick={() => onAddAmort && onAddAmort(row.month)}
                            title="Adicionar Amortização"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs ml-1">Incluir</span>
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                    {formatCurrency(row.novoSaldo)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {/* Paginação */}
        {renderPagination()}
      </div>
    </div>
  );
};

export default AmortizationTable;