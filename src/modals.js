// Este arquivo contém os modais que devem ser adicionados ao componente LoanSimulator

// Adicione estes modais ao final do componente LoanSimulator, logo antes do último </div> de fechamento:

{/* Modais */}
<Modal isOpen={targetTermModalOpen} onClose={() => setTargetTermModalOpen(false)} title="Planejamento de Quitação">
  <TargetTermSimulation />
</Modal>

<Modal isOpen={comparisonModalOpen} onClose={() => setComparisonModalOpen(false)} title="Comparação SAC vs PRICE">
  <SystemComparison />
</Modal>