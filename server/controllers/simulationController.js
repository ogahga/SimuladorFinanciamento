const SimulationModel = require('../models/simulationModel');

/**
 * Controlador para gerenciar as operações relacionadas às simulações
 */
const SimulationController = {
  /**
   * Criar uma nova simulação
   */
  async create(req, res) {
    try {
      const { simulationData, amortizations } = req.body;
      
      // Validar dados essenciais
      if (!simulationData || !simulationData.name || !simulationData.principal) {
        return res.status(400).json({ 
          success: false, 
          message: 'Dados incompletos para a simulação' 
        });
      }
      
      const simulation = await SimulationModel.create(simulationData, amortizations);
      
      return res.status(201).json({
        success: true,
        message: 'Simulação criada com sucesso',
        data: simulation
      });
    } catch (error) {
      console.error('Erro ao criar simulação:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao criar simulação',
        error: error.message
      });
    }
  },

  /**
   * Buscar uma simulação por ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      
      const simulation = await SimulationModel.getById(id);
      
      if (!simulation) {
        return res.status(404).json({ 
          success: false, 
          message: 'Simulação não encontrada' 
        });
      }
      
      return res.status(200).json({
        success: true,
        data: simulation
      });
    } catch (error) {
      console.error('Erro ao buscar simulação:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao buscar simulação',
        error: error.message
      });
    }
  },

  /**
   * Listar todas as simulações
   */
  async list(req, res) {
    try {
      const { userId } = req.query;
      
      const simulations = await SimulationModel.list(userId);
      
      return res.status(200).json({
        success: true,
        data: simulations
      });
    } catch (error) {
      console.error('Erro ao listar simulações:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao listar simulações',
        error: error.message
      });
    }
  },

  /**
   * Atualizar uma simulação existente
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const { simulationData, amortizations } = req.body;
      
      // Verificar se a simulação existe
      const existingSimulation = await SimulationModel.getById(id);
      
      if (!existingSimulation) {
        return res.status(404).json({ 
          success: false, 
          message: 'Simulação não encontrada' 
        });
      }
      
      // Atualizar a simulação
      const updatedSimulation = await SimulationModel.update(
        id, 
        simulationData, 
        amortizations
      );
      
      return res.status(200).json({
        success: true,
        message: 'Simulação atualizada com sucesso',
        data: updatedSimulation
      });
    } catch (error) {
      console.error('Erro ao atualizar simulação:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao atualizar simulação',
        error: error.message
      });
    }
  },

  /**
   * Excluir uma simulação
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      // Verificar se a simulação existe
      const existingSimulation = await SimulationModel.getById(id);
      
      if (!existingSimulation) {
        return res.status(404).json({ 
          success: false, 
          message: 'Simulação não encontrada' 
        });
      }
      
      // Excluir a simulação
      const result = await SimulationModel.delete(id);
      
      return res.status(200).json({
        success: true,
        message: 'Simulação excluída com sucesso'
      });
    } catch (error) {
      console.error('Erro ao excluir simulação:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao excluir simulação',
        error: error.message
      });
    }
  }
};

module.exports = SimulationController;