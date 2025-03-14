# Instruções para Atualização da Interface do Simulador

## Alterações Solicitadas

1. **Adicionar máscara de R$ nos campos de valor monetário**:
   - Campo "Valor do Financiamento (R$)"
   - Campo "Taxas/seguro mensal (R$)" (anteriormente "Seguro Mensal")

2. **Adicionar máscara de % nos campos de percentual**:
   - Campo "Taxa de Juros (% a.a.)"
   - Campo "Taxa de Correção (% a.a.)"

3. **Renomear campo**:
   - Mudar "Seguro Mensal (R$)" para "Taxas/seguro mensal (R$)"

4. **Ajustar layout da tabela de amortização**:
   - Diminuir a largura da coluna "Ação"
   - Substituir o botão "Cancelar" por um ícone X
   - Trocar a palavra "Adicionar" por "Incluir"
   - Diminuir a largura da coluna "Mês/Range"

## Como Implementar

Criamos um arquivo de referência `LoanSimulatorNewUI.js` que contém as modificações para os campos de entrada. Para implementar todas as alterações:

1. Copie o código dos campos de entrada do arquivo `LoanSimulatorNewUI.js` para o arquivo original `LoanSimulator.js`, substituindo os campos correspondentes.

2. As funções necessárias para formatação e parsing de valores já foram implementadas no topo do arquivo `LoanSimulatorNewUI.js`:
   ```javascript
   // Para formatar valores monetários com máscara R$ 00,00
   const formatCurrencyMask = (value) => {
     return new Intl.NumberFormat('pt-BR', {
       style: 'currency',
       currency: 'BRL',
       minimumFractionDigits: 2,
       maximumFractionDigits: 2
     }).format(value || 0);
   };

   // Função para extrair valores numéricos de campos com máscara
   const parseCurrencyValue = (formattedValue) => {
     if (!formattedValue) return 0;
     
     // Remove todos os caracteres não numéricos exceto vírgula
     const cleanValue = formattedValue.replace(/[^0-9,]/g, '');
     
     // Substitui vírgula por ponto para conversão em número
     const numericValue = parseFloat(cleanValue.replace(',', '.'));
     
     return isNaN(numericValue) ? 0 : numericValue;
   };
   ```

3. Para as alterações na tabela de amortização, já foram implementadas em atualizações anteriores:
   - A largura da coluna "Mês/Range" foi modificada de `w-1/4` para `w-1/5`
   - A largura da coluna "Ação" foi definida como `w-1/6`
   - O botão "Cancelar" foi substituído por um ícone "✕"
   - A palavra "Adicionar" foi trocada por "Incluir"

## Arquivos Modificados

- `LoanSimulator.js`: Arquivo principal do simulador
- `LoanSimulatorNewUI.js`: Arquivo de referência com as modificações implementadas (pode ser excluído após aplicar as alterações)

## Após a Implementação

Depois de implementar estas alterações, a interface deve exibir:

1. Valores monetários formatados com o símbolo R$
2. Valores percentuais formatados com o símbolo %
3. Nome atualizado do campo de seguro
4. Layout da tabela de amortização com as colunas ajustadas e os botões atualizados