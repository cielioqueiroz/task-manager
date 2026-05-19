import { supabase } from './supabase'

const TABLE_NAME = 'tasks'

export const taskService = {
  async getTasks() {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async addTask(text, priority) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([
        {
          text: text.trim(),
          priority,
          completed: false,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) throw error
    return data?.[0]
  },

  async toggleTask(id, completed) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({ completed })
      .eq('id', id)
      .select()

    if (error) throw error
    return data?.[0]
  },

  async deleteTask(id) {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async editTask(id, text, priority) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({ text: text.trim(), priority })
      .eq('id', id)
      .select()

    if (error) throw error
    return data?.[0]
  }
}
