import { ref, watch } from 'vue'

const STORAGE_KEY = 'play-decider-places'
const REROLL_COUNT_KEY = 'play-decider-reroll-count'
const REROLL_DATE_KEY = 'play-decider-reroll-date'

const defaultPlaces = [
  { name: '小区楼下', emoji: '🏠', category: 'outdoor', free: true },
  { name: '附近公园', emoji: '🌳', category: 'outdoor', free: true },
  { name: '超市', emoji: '🛒', category: 'indoor', free: false }
]

const CATEGORIES = [
  { id: 'indoor', label: '室内', emoji: '🏠' },
  { id: 'outdoor', label: '室外', emoji: '🌳' },
  { id: 'both', label: '不限', emoji: '✨' }
]

const COST_TYPES = [
  { id: 'free', label: '免费', emoji: '🆓' },
  { id: 'paid', label: '付费', emoji: '💰' },
  { id: 'both', label: '不限', emoji: '✨' }
]

// 从 localStorage 读取地点
function loadPlaces() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // 兼容旧数据格式
      if (parsed.length > 0 && typeof parsed[0] === 'string') {
        return parsed.map(name => ({ name, emoji: '👣', category: 'both', free: 'both' }))
      }
      return parsed
    }
  } catch (e) {
    console.error('Failed to load places:', e)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPlaces))
  return [...defaultPlaces]
}

function getTodayString() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

function getRerollCount() {
  try {
    const today = getTodayString()
    const storedDate = localStorage.getItem(REROLL_DATE_KEY)
    const storedCount = localStorage.getItem(REROLL_COUNT_KEY)
    
    if (storedDate !== today) {
      localStorage.setItem(REROLL_DATE_KEY, today)
      localStorage.setItem(REROLL_COUNT_KEY, '3')
      return 3
    }
    
    return parseInt(storedCount) || 0
  } catch (e) {
    return 3
  }
}

function decreaseRerollCount() {
  const current = getRerollCount()
  if (current > 0) {
    localStorage.setItem(REROLL_COUNT_KEY, String(current - 1))
    return current - 1
  }
  return 0
}

function resetRerollCount() {
  localStorage.setItem(REROLL_COUNT_KEY, '3')
  return 3
}

export function usePlaces() {
  const places = ref(loadPlaces())
  const selectedCategory = ref('both')
  const selectedCost = ref('both')
  
  watch(places, (newPlaces) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPlaces))
  }, { deep: true })
  
  const addPlace = (name, emoji = '👣', category = 'both', free = 'both') => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      return { success: false, message: '请输入地点名称' }
    }
    if (places.value.some(p => p.name === trimmedName)) {
      return { success: false, message: '该地点已存在' }
    }
    places.value.push({ name: trimmedName, emoji, category, free })
    return { success: true, message: '添加成功' }
  }
  
  const removePlace = (index) => {
    places.value.splice(index, 1)
  }
  
  const getFilteredPlaces = () => {
    return places.value.filter(p => {
      const categoryMatch = selectedCategory.value === 'both' || p.category === selectedCategory.value || p.category === 'both'
      const costMatch = selectedCost.value === 'both' || p.free === selectedCost.value || p.free === 'both'
      return categoryMatch && costMatch
    })
  }
  
  const getRandomPlace = () => {
    const filtered = getFilteredPlaces()
    if (filtered.length === 0) {
      return null
    }
    if (filtered.length === 1) {
      return filtered[0]
    }
    const randomIndex = Math.floor(Math.random() * filtered.length)
    return filtered[randomIndex]
  }
  
  return {
    places,
    selectedCategory,
    selectedCost,
    CATEGORIES,
    COST_TYPES,
    addPlace,
    removePlace,
    getFilteredPlaces,
    getRandomPlace
  }
}

export function useRerollCount() {
  const count = ref(getRerollCount())
  
  const decrement = () => {
    const newCount = decreaseRerollCount()
    count.value = newCount
    return newCount
  }
  
  const reset = () => {
    const newCount = resetRerollCount()
    count.value = newCount
    return newCount
  }
  
  const canReroll = () => {
    return count.value > 0
  }
  
  return {
    count,
    decrement,
    reset,
    canReroll
  }
}
