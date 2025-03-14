// Este é um arquivo de cópia para implementação

// No componente TargetTermSimulation, dentro do input "Prazo Alvo (meses)", modifique o onChange da seguinte forma:

onChange={(e) => {
  // Guarda o valor original do input
  const inputEl = e.target;
  const cursorPosition = inputEl.selectionStart;
  const value = e.target.value;
  
  // Atualiza o valor no estado, mantendo como número
  setTargetTerm(value ? parseInt(value) : 0);
  
  // Restaura o foco e a posição do cursor após a atualização do estado
  setTimeout(() => {
    inputEl.focus();
    inputEl.setSelectionRange(cursorPosition, cursorPosition);
  }, 0);
}}