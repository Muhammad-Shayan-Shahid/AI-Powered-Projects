import { createSlice } from '@reduxjs/toolkit'
import { menuItems } from '@/lib/data'

const initialState = {
  items: menuItems,
  filteredItems: menuItems,
  activeCategory: 'All',
  isLoading: false,
}

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setActiveCategory(state, action) {
      const category = action.payload
      state.activeCategory = category
      state.filteredItems =
        category === 'All' ? state.items : state.items.filter((item) => item.category === category)
    },
  },
})

export const { setActiveCategory } = menuSlice.actions
export default menuSlice.reducer
