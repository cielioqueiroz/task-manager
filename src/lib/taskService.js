import { supabase } from './supabase'

const TABLE_NAME = 'tasks'

export const taskService = {
  // ✅ getTasks agora recebe user_id e filtra por usuário
  async getTasks(userId) {
    if (!userId) {
      throw new Error('userId é obrigatório')
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // ✅ addTask recebe user_id e associa à tarefa
  async addTask(text, priority, userId) {
    if (!userId) {
      throw new Error('userId é obrigatório')
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([
        {
          text: text.trim(),
          priority,
          completed: false,
          user_id: userId,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) throw error
    return data?.[0]
  },

  // ✅ toggleTask - RLS protege acesso
  async toggleTask(id, completed) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({ completed })
      .eq('id', id)
      .select()

    if (error) throw error
    return data?.[0]
  },

  // ✅ deleteTask - RLS protege acesso
  async deleteTask(id) {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // ✅ editTask - RLS protege acesso
  async editTask(id, text, priority, userId) {
    if (!userId) {
      throw new Error('userId é obrigatório')
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({ text: text.trim(), priority })
      .eq('id', id)
      .select()

    if (error) throw error
    return data?.[0]
  }
}
