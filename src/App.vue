<template>
  <div class="min-h-screen bg-gradient-warm relative">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-20 -left-20 w-48 h-48 bg-accent/10 rounded-full blur-3xl"></div>
    </div>

    <Transition name="page" mode="out-in">
      <!-- 决策页面 -->
      <div v-if="currentPage === 'home'" :key="'home'" class="relative">
        <!-- Header -->
        <header class="glass sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center">
              <span class="text-white text-sm">🎯</span>
            </div>
            <h1 class="text-xl font-extrabold text-gradient">遛娃决定器</h1>
          </div>
          <button 
            @click="currentPage = 'manage'"
            class="p-2.5 rounded-xl bg-white/60 hover:bg-primary/10 transition-all btn-active shadow-soft"
            aria-label="管理地点"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>

        <!-- 筛选器 -->
        <div v-if="!result && !isRolling" class="px-6 pt-4">
          <div class="flex gap-3 justify-center flex-wrap">
            <!-- 室内外筛选 -->
            <div class="flex bg-white/60 rounded-xl p-1 shadow-soft">
              <button 
                v-for="cat in CATEGORIES" 
                :key="cat.id"
                @click="selectedCategory = cat.id"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                :class="selectedCategory === cat.id ? 'bg-primary text-white' : 'text-text-lighter hover:text-primary'"
              >
                {{ cat.emoji }} {{ cat.label }}
              </button>
            </div>
            <!-- 费用筛选 -->
            <div class="flex bg-white/60 rounded-xl p-1 shadow-soft">
              <button 
                v-for="cost in COST_TYPES" 
                :key="cost.id"
                @click="selectedCost = cost.id"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                :class="selectedCost === cost.id ? 'bg-accent text-white' : 'text-text-lighter hover:text-accent'"
              >
                {{ cost.emoji }} {{ cost.label }}
              </button>
            </div>
          </div>
          <p class="text-center text-xs text-text-lighter/60 mt-2" v-if="filteredCount !== places.length">
            筛选出 {{ filteredCount }} 个地点
          </p>
        </div>

        <!-- Main Content -->
        <main class="flex flex-col items-center justify-center px-6 py-8 min-h-[calc(100vh-72px)]">
          <!-- 初始状态 -->
          <div v-if="!result && !isRolling" class="text-center w-full max-w-sm">
            <div class="mb-10">
              <div class="relative mb-8">
                <div class="w-36 h-36 mx-auto bg-white rounded-3xl shadow-medium flex items-center justify-center animate-float">
                  <span class="text-7xl">🎯</span>
                </div>
                <div class="absolute inset-0 w-36 h-36 mx-auto bg-primary/20 rounded-3xl blur-xl -z-10 animate-pulse"></div>
              </div>
              
              <h2 class="text-2xl font-bold text-text mb-3">今天带孩子去哪玩？</h2>
              <p class="text-text-lighter text-base">点击按钮，帮你做决定！</p>
            </div>
            
            <button 
              @click="startRandom" 
              :disabled="filteredCount === 0"
              class="relative w-60 h-60 mx-auto rounded-3xl bg-gradient-primary text-white text-xl font-extrabold shadow-large hover:shadow-glow-primary transform hover:scale-105 transition-all duration-300 btn-active flex items-center justify-center flex-col overflow-hidden"
              :class="{ 'opacity-50 cursor-not-allowed': filteredCount === 0 }"
            >
              <div class="absolute inset-0 bg-white/20 rounded-3xl"></div>
              <div class="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              
              <span class="text-5xl mb-3 relative z-10">🎲</span>
              <span class="relative z-10">去哪玩？</span>
            </button>
            
            <p v-if="filteredCount === 0" class="mt-6 text-danger text-sm font-medium">
              没有符合条件的地点
            </p>
            <p v-else class="mt-6 text-text-lighter text-sm">
              共 <span class="text-primary font-semibold">{{ filteredCount }}</span> 个地点可选
            </p>
          </div>

          <!-- 骰子动画状态 -->
          <div v-else-if="isRolling" class="text-center w-full max-w-sm">
            <div class="dice-container">
              <div class="dice" :class="diceClass">
                <div class="face face-1"><span class="dot center"></span></div>
                <div class="face face-2"><span class="dot top-right"></span><span class="dot bottom-left"></span></div>
                <div class="face face-3"><span class="dot top-right"></span><span class="dot center"></span><span class="dot bottom-left"></span></div>
                <div class="face face-4"><span class="dot top-left"></span><span class="dot top-right"></span><span class="dot bottom-left"></span><span class="dot bottom-right"></span></div>
                <div class="face face-5"><span class="dot top-left"></span><span class="dot top-right"></span><span class="dot center"></span><span class="dot bottom-left"></span><span class="dot bottom-right"></span></div>
                <div class="face face-6"><span class="dot top-left"></span><span class="dot top-right"></span><span class="dot middle-left"></span><span class="dot middle-right"></span><span class="dot bottom-left"></span><span class="dot bottom-right"></span></div>
              </div>
            </div>
            <p class="text-text-lighter mt-12 animate-pulse text-lg">🎲 正在投掷中...</p>
          </div>          <!-- 结果展示状态 -->
          <div v-else class="text-center w-full max-w-sm">
            <div class="mb-10">
              <p class="text-text-lighter mb-5 font-medium">今天去这里：</p>
              
              <!-- 结果卡片 -->
              <div class="bg-white rounded-3xl shadow-medium p-8 mb-6 animate-celebrate relative overflow-hidden">
                <div class="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div class="absolute bottom-0 left-0 w-16 h-16 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                
                <span class="text-6xl mb-5 block relative z-10 animate-bounce-subtle">{{ result.emoji }}</span>
                <h2 class="text-3xl font-extrabold text-gradient break-words leading-tight relative z-10">{{ result.name }}</h2>
              </div>
              
              <!-- 分享按钮 -->
              <button 
                @click="shareResult"
                class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-wechat text-white font-bold shadow-medium hover:shadow-glow-primary transition-all btn-active mb-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00 .14.045c.134 0 .24-.11.24-.246 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.03-.406-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/>
                </svg>
                分享到微信
              </button>
              
              <p v-if="places.length === 1" class="text-accent text-sm font-medium">只有一个选项哦</p>
            </div>

            <!-- 换选按钮 -->
            <button 
              @click="startRandom" 
              :disabled="!canReroll"
              class="px-10 py-4 rounded-2xl border-2 border-accent/30 text-accent-dark font-bold transition-all btn-active relative overflow-hidden"
              :class="{ 
                'opacity-40 cursor-not-allowed': !canReroll,
                'hover:bg-gradient-accent hover:text-white hover:border-accent hover:shadow-glow-accent': canReroll 
              }"
            >
              <span class="relative z-10">{{ canReroll ? `换一个 (${rerollCount}次)` : '今天换选次数已用完' }}</span>
            </button>

            <button 
              @click="resetResult"
              class="mt-5 text-text-lighter text-sm hover:text-primary transition-colors font-medium"
            >
              重新选择
            </button>
          </div>
        </main>

        <!-- Footer -->
        <footer v-if="!isRolling" class="px-6 py-5 text-center">
          <p class="text-xs text-text-lighter/60">每天帮你快速做出选择</p>
        </footer>
      </div>

      <!-- 管理页面 -->
      <PlaceList v-else-if="currentPage === 'manage'" :key="'manage'" @back="currentPage = 'home'" />
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import confetti from 'canvas-confetti'
import { usePlaces, useRerollCount } from './composables/usePlaces'
import PlaceList from './components/PlaceList.vue'

const { places, selectedCategory, selectedCost, CATEGORIES, COST_TYPES, getRandomPlace, getFilteredPlaces } = usePlaces()
const { count: rerollCount, decrement, canReroll } = useRerollCount()

const currentPage = ref('home')
const result = ref(null)
const diceClass = ref("");
const isRolling = ref(false)
const visiblePlaces = ref([])

const filteredCount = computed(() => getFilteredPlaces().length)

const handleHashChange = () => {
  const hash = window.location.hash.slice(1)
  currentPage.value = hash === 'manage' ? 'manage' : 'home'
}

onMounted(() => {
  handleHashChange()
  window.addEventListener('hashchange', handleHashChange)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', handleHashChange)
})

const startRandom = () => {
  const filtered = getFilteredPlaces()
  
  if (filtered.length === 0) {
    alert("没有符合条件的地点！")
    return
  }

  if (filtered.length === 1) {
    result.value = filtered[0]
    triggerConfetti()
    return
  }

  result.value = null
  isRolling.value = true
  diceClass.value = "rolling"
  
  // 骰子随机旋转
  const randomRotations = [
    "show-1", "show-2", "show-3", "show-4", "show-5", "show-6"
  ]
  let currentIndex = 0
  
  const rollDice = () => {
    currentIndex = Math.floor(Math.random() * 6)
    diceClass.value = randomRotations[currentIndex]
  }
  
  // 快速切换骰子面
  let count = 0
  const interval = setInterval(() => {
    rollDice()
    count++
    if (count >= 15) {
      clearInterval(interval)
      setTimeout(() => {
        isRolling.value = false
        result.value = getRandomPlace()
        triggerConfetti()
        decrement()
      }, 300)
    }
  }, 100)
}
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#FF8C66', '#4ECDC4', '#FFE66D', '#FF6B6B']
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#FF8C66', '#4ECDC4', '#FFE66D', '#FF6B6B']
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}

const shareResult = () => {
  if (navigator.share) {
    navigator.share({
      title: '遛娃决定器',
      text: `今天带孩子去：${result.value.name} ${result.value.emoji}`,
    })
  } else {
    // 复制到剪贴板
    const text = `今天带孩子去：${result.value.name} ${result.value.emoji}`
    navigator.clipboard.writeText(text).then(() => {
      alert('已复制到剪贴板！')
    })
  }
}

const resetResult = () => {
  result.value = null
}
</script>

<style scoped>
.slot-machine-container {
  perspective: 1000px;
  position: relative;
  height: 120px;
}

.slot-machine-container > div {
  position: absolute;
  width: 100%;
  left: 0;
  backface-visibility: hidden;
  will-change: transform, opacity;
}

.page-enter-active, .page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.bg-wechat {
  background-color: #07C160;
}

.bg-wechat:hover {
  background-color: #06ad56;
}
/* 骰子动画样式 */
.dice-container {
  width: 120px;
  height: 120px;
  margin: 40px auto;
  perspective: 1000px;
}

.dice {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
}

.dice.rolling {
  animation: dice-roll 0.1s linear infinite;
}

@keyframes dice-roll {
  0% { transform: rotateX(0deg) rotateY(0deg); }
  25% { transform: rotateX(90deg) rotateY(90deg); }
  50% { transform: rotateX(180deg) rotateY(180deg); }
  75% { transform: rotateX(270deg) rotateY(270deg); }
  100% { transform: rotateX(360deg) rotateY(360deg); }
}

.face {
  position: absolute;
  width: 120px;
  height: 120px;
  background: linear-gradient(145deg, #ffffff, #e6e6e6);
  border-radius: 20px;
  box-shadow: inset 0 0 15px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding: 15px;
}

.dot {
  width: 20px;
  height: 20px;
  background: linear-gradient(145deg, #333, #666);
  border-radius: 50%;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.3);
  position: absolute;
}

.center { top: 50%; left: 50%; transform: translate(-50%, -50%); }
.top-left { top: 20px; left: 20px; }
.top-right { top: 20px; right: 20px; }
.bottom-left { bottom: 20px; left: 20px; }
.bottom-right { bottom: 20px; right: 20px; }
.middle-left { top: 50%; left: 20px; transform: translateY(-50%); }
.middle-right { top: 50%; right: 20px; transform: translateY(-50%); }

.face-1 { transform: rotateY(0deg) translateZ(60px); }
.face-2 { transform: rotateY(90deg) translateZ(60px); }
.face-3 { transform: rotateY(180deg) translateZ(60px); }
.face-4 { transform: rotateY(-90deg) translateZ(60px); }
.face-5 { transform: rotateX(90deg) translateZ(60px); }
.face-6 { transform: rotateX(-90deg) translateZ(60px); }

.dice.show-1 { transform: rotateX(0deg) rotateY(0deg); }
.dice.show-2 { transform: rotateX(0deg) rotateY(-90deg); }
.dice.show-3 { transform: rotateX(0deg) rotateY(-180deg); }
.dice.show-4 { transform: rotateX(0deg) rotateY(90deg); }
.dice.show-5 { transform: rotateX(-90deg) rotateY(0deg); }
.dice.show-6 { transform: rotateX(90deg) rotateY(0deg); }</style>
