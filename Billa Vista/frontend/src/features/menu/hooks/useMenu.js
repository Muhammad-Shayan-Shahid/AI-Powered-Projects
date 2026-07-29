import { useDispatch, useSelector } from 'react-redux'
import { setActiveCategory } from '@/features/menu/state/menu.slice'
import { categories } from '@/lib/data'

export function useMenu() {
  const dispatch = useDispatch()
  const filteredItems = useSelector((state) => state.menu.filteredItems)
  const activeCategory = useSelector((state) => state.menu.activeCategory)
  const isLoading = useSelector((state) => state.menu.isLoading)

  const selectCategory = (category) => dispatch(setActiveCategory(category))

  return { categories, filteredItems, activeCategory, isLoading, selectCategory }
}
