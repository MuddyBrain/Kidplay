<template>
  <div class="min-h-screen bg-gradient-warm flex flex-col relative">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-20 -left-20 w-48 h-48 bg-accent/10 rounded-full blur-3xl"></div>
    </div>

    <!-- Header -->
    <header class="glass sticky top-0 z-10 px-5 py-4 flex items-center justify-between">
      <div class="flex items-center">
        <button 
          @click="$emit('back')"
          class="p-2.5 -ml-2 rounded-xl bg-white/60 hover:bg-primary/10 transition-all btn-active shadow-soft"
          aria-label="返回"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-xl font-extrabold text-gradient ml-2">我的地点</h1>
      </div>
      <button 
        @click="showAddModal = true"
        class="px-5 py-2.5 bg-gradient-primary text-white rounded-xl font-bold text-sm shadow-medium hover:shadow-glow-primary transition-all btn-active flex items-center gap-1.5"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        添加
      </button>
    </header>

    <!-- 换选次数管理 -->
    <div class="px-6 pt-4">
      <div class="bg-white/60 rounded-xl p-4 shadow-soft flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-lg">🔄</span>
          <span class="text-text font-medium">今日换选次数</span>
          <span class="text-primary font-bold text-lg">{{ rerollCount }}</span>
          <span class="text-text-lighter text-sm">/ 3</span>
        </div>
        <button 
          @click="resetReroll"
          class="text-sm text-accent hover:text-accent-dark font-medium"
        >
          重置次数
        </button>
      </div>
    </div>

    <!-- Content -->
    <main class="flex-1 px-6 py-5 relative z-10">
      <!-- 统计 -->
      <div class="mb-5 flex items-center justify-between">
        <p class="text-text-lighter text-sm font-medium">共 <span class="text-primary font-bold">{{ places.length }}</span> 个地点</p>
        <p class="text-text-lighter/60 text-xs" v-if="places.length > 0">点击删除按钮移除</p>
      </div>

      <!-- 地点列表 -->
      <TransitionGroup 
        name="list" 
        tag="div" 
        v-if="places.length > 0" 
        class="space-y-3"
      >
        <div 
          v-for="(place, index) in places" 
          :key="place.name"
          class="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-soft flex items-center justify-between group card-hover"
        >
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <span class="text-2xl">{{ place.emoji }}</span>
            </div>
            <div>
              <span class="font-bold text-text text-lg block">{{ place.name }}</span>
              <span class="text-xs text-text-lighter">
                {{ getCategoryLabel(place.category) }} · {{ place.free === 'free' ? '🆓免费' : place.free === 'paid' ? '💰付费' : '💰🆓不限' }}
              </span>
            </div>
          </div>
          <button 
            @click="confirmDelete(index)"
            class="p-2.5 rounded-xl text-text-lighter/40 hover:text-danger hover:bg-danger/10 transition-all opacity-0 group-hover:opacity-100 btn-active"
            aria-label="删除"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </TransitionGroup>

      <!-- 空状态 -->
      <div v-else class="flex flex-col items-center justify-center py-16">
        <div class="relative mb-6">
          <div class="w-32 h-32 bg-white rounded-3xl shadow-medium flex items-center justify-center">
            <span class="text-5xl">📍</span>
          </div>
          <div class="absolute inset-0 w-32 h-32 bg-primary/10 rounded-3xl blur-xl -z-10"></div>
        </div>
        <h3 class="text-lg font-bold text-text mb-2">还没有添加地点</h3>
        <p class="text-text-lighter text-center mb-6">添加一些你常带孩子去的地方吧</p>
        <button 
          @click="showAddModal = true"
          class="px-8 py-3.5 bg-gradient-primary text-white rounded-2xl font-bold shadow-medium hover:shadow-glow-primary transition-all btn-active"
        >
          添加第一个地点
        </button>
      </div>
    </main>

    <!-- 添加弹窗 -->
    <Teleport to="body">
      <Transition name="modal">
        <div 
          v-if="showAddModal" 
          class="fixed inset-0 z-50 flex items-end justify-center"
          @click.self="showAddModal = false"
        >
          <div class="absolute inset-0 bg-black/20 backdrop-blur-sm" @click="showAddModal = false"></div>
          <div class="relative bg-white rounded-t-3xl w-full max-w-md p-6 animate-slide-up shadow-large max-h-[90vh] overflow-y-auto">
            <!-- 装饰条 -->
            <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div class="w-12 h-1.5 bg-text-lighter/20 rounded-full"></div>
            </div>
            
            <h3 class="text-xl font-bold text-text mb-5 mt-2">添加新地点</h3>
            
            <!-- 地点名称 -->
            <input 
              v-model="newPlaceName"
              ref="inputRef"
              type="text"
              placeholder="例如：小区游乐场、图书馆..."
              class="w-full px-5 py-4 rounded-2xl border-2 border-primary/20 focus:border-primary focus:outline-none text-lg bg-primary-soft/30 transition-all"
              @keyup.enter="addPlace"
              maxlength="20"
            />
            
            <!-- Emoji 选择 -->
            <div class="mt-4">
              <p class="text-sm text-text-lighter mb-2">选择图标</p>
              <div class="flex flex-wrap gap-2">
                <button 
                  v-for="emoji in emojiOptions" 
                  :key="emoji"
                  @click="selectedEmoji = emoji"
                  class="w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all"
                  :class="selectedEmoji === emoji ? 'bg-primary text-white' : 'bg-primary/10 text-text hover:bg-primary/20'"
                >
                  {{ emoji }}
                </button>
              </div>
            </div>
            
            <!-- 室内外选择 -->
            <div class="mt-4">
              <p class="text-sm text-text-lighter mb-2">场地类型</p>
              <div class="flex gap-2">
                <button 
                  v-for="cat in CATEGORIES" 
                  :key="cat.id"
                  @click="selectedCategory = cat.id"
                  class="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
                  :class="selectedCategory === cat.id ? 'bg-primary text-white' : 'bg-primary/10 text-text-lighter hover:bg-primary/20'"
                >
                  {{ cat.emoji }} {{ cat.label }}
                </button>
              </div>
            </div>
            
            <!-- 费用选择 -->
            <div class="mt-4">
              <p class="text-sm text-text-lighter mb-2">费用</p>
              <div class="flex gap-2">
                <button 
                  v-for="cost in COST_TYPES" 
                  :key="cost.id"
                  @click="selectedCost = cost.id"
                  class="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
                  :class="selectedCost === cost.id ? 'bg-accent text-white' : 'bg-accent/10 text-text-lighter hover:bg-accent/20'"
                >
                  {{ cost.emoji }} {{ cost.label }}
                </button>
              </div>
            </div>
            
            <p v-if="errorMessage" class="text-danger text-sm mt-3 font-medium">{{ errorMessage }}</p>
            
            <div class="flex gap-3 mt-6">
              <button 
                @click="showAddModal = false"
                class="flex-1 py-4 rounded-2xl border-2 border-text-lighter/20 text-text-lighter font-bold hover:bg-text-lighter/5 transition-colors btn-active"
              >
                取消
              </button>
              <button 
                @click="addPlace"
                class="flex-1 py-4 rounded-2xl bg-gradient-primary text-white font-bold shadow-medium hover:shadow-glow-primary transition-all btn-active"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 删除确认弹窗 -->
    <Teleport to="body">
      <Transition name="modal">
        <div 
          v-if="showDeleteConfirm" 
          class="fixed inset-0 z-50 flex items-center justify-center p-6"
          @click.self="showDeleteConfirm = false"
        >
          <div class="absolute inset-0 bg-black/20 backdrop-blur-sm" @click="showDeleteConfirm = false"></div>
          <div class="relative bg-white rounded-3xl w-full max-w-sm p-6 text-center shadow-large">
            <div class="w-18 h-18 mx-auto mb-5 bg-danger-soft rounded-2xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-9 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-text mb-3">确认删除？</h3>
            <p class="text-text-lighter mb-6">删除后无法恢复，确定要删除 "{{ deleteTarget }}" 吗？</p>
            
            <div class="flex gap-3">
              <button 
                @click="showDeleteConfirm = false"
                class="flex-1 py-4 rounded-2xl border-2 border-text-lighter/20 text-text-lighter font-bold hover:bg-text-lighter/5 transition-colors btn-active"
              >
                取消
              </button>
              <button 
                @click="deletePlace"
                class="flex-1 py-4 rounded-2xl bg-danger text-white font-bold shadow-medium hover:bg-danger-light transition-all btn-active"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { usePlaces, useRerollCount } from '../composables/usePlaces'

const emit = defineEmits(['back'])

const { places, addPlace: addPlaceToStore, removePlace, CATEGORIES, COST_TYPES } = usePlaces()
const { count: rerollCount, reset: resetRerollCount } = useRerollCount()

const showAddModal = ref(false)
const showDeleteConfirm = ref(false)
const newPlaceName = ref('')
const errorMessage = ref('')
const inputRef = ref(null)
const deleteTarget = ref('')
const deleteIndex = ref(-1)

// 新建地点时的选项
const selectedEmoji = ref('👣')
const selectedCategory = ref('both')
const selectedCost = ref('both')

const emojiOptions = ['👣', '🏠', '🌳', '🎠', '📚', '🛒', '🍽️', '🏊', '⚽', '🔬', '🏖️', '🎪', '⛺', '🎨', '🎭']

const getCategoryLabel = (category) => {
  const cat = CATEGORIES.find(c => c.id === category)
  return cat ? `${cat.emoji} ${cat.label}` : '✨不限'
}

watch(showAddModal, async (val) => {
  if (val) {
    newPlaceName.value = ''
    selectedEmoji.value = '👣'
    selectedCategory.value = 'both'
    selectedCost.value = 'both'
    errorMessage.value = ''
    await nextTick()
    inputRef.value?.focus()
  }
})

const addPlace = () => {
  errorMessage.value = ''
  const result = addPlaceToStore(newPlaceName.value, selectedEmoji.value, selectedCategory.value, selectedCost.value)
  
  if (!result.success) {
    errorMessage.value = result.message
    return
  }
  
  showAddModal.value = false
}

const confirmDelete = (index) => {
  deleteIndex.value = index
  deleteTarget.value = places.value[index].name
  showDeleteConfirm.value = true
}

const deletePlace = () => {
  if (deleteIndex.value >= 0) {
    removePlace(deleteIndex.value)
  }
  showDeleteConfirm.value = false
  deleteIndex.value = -1
}

const resetReroll = () => {
  resetRerollCount()
}
</script>

<style scoped>
@keyframes slide-up {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative, .modal-leave-to .relative {
  transform: translateY(100%);
}

.list-enter-active, .list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>
