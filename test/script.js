// Variáveis globais
let draggedElement = null
const dragOffset = { x: 0, y: 0 }
let zIndexCounter = 100
const openWindows = new Set()

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  initializeDesktop()
  updateClock()
  setInterval(updateClock, 1000)
})

function initializeDesktop() {
  // Adicionar event listeners para ícones
  const desktopIcons = document.querySelectorAll(".desktop-icon")
  desktopIcons.forEach((icon) => {
    icon.addEventListener("click", selectIcon)
    icon.addEventListener("dblclick", openIconWindow)
    icon.addEventListener("mousedown", startDragIcon)
  })

  // Adicionar event listeners para janelas
  const windows = document.querySelectorAll(".window")
  windows.forEach((window) => {
    const titleBar = window.querySelector(".title-bar")
    titleBar.addEventListener("mousedown", startDragWindow)
    window.addEventListener("mousedown", bringToFront)
  })

  // Clique no desktop para deselecionar ícones
  document.querySelector(".desktop").addEventListener("click", (e) => {
    if (e.target.classList.contains("desktop")) {
      deselectAllIcons()
    }
  })

  // Fechar menu iniciar ao clicar fora
  document.addEventListener("click", (e) => {
    const startMenu = document.getElementById("startMenu")
    const startButton = document.querySelector(".start-button")

    if (!startMenu.contains(e.target) && !startButton.contains(e.target)) {
      startMenu.classList.add("hidden")
    }
  })
}

// Funções dos ícones
function selectIcon(e) {
  e.stopPropagation()
  deselectAllIcons()
  this.classList.add("selected")
}

function deselectAllIcons() {
  const icons = document.querySelectorAll(".desktop-icon")
  icons.forEach((icon) => icon.classList.remove("selected"))
}

function openIconWindow(e) {
  e.stopPropagation()
  const windowId = this.dataset.window + "Window"
  openWindow(windowId)
}

// Funções das janelas
function openWindow(windowId) {
  const window = document.getElementById(windowId)
  if (window) {
    window.classList.remove("hidden", "minimized")
    bringToFront({ target: window })
    addToTaskbar(windowId)
    openWindows.add(windowId)
  }
}

function closeWindow(windowId) {
  const window = document.getElementById(windowId)
  if (window) {
    window.classList.add("hidden")
    removeFromTaskbar(windowId)
    openWindows.delete(windowId)
  }
}

function minimizeWindow(windowId) {
  const window = document.getElementById(windowId)
  if (window) {
    window.classList.add("minimized")
  }
}

function maximizeWindow(windowId) {
  const window = document.getElementById(windowId)
  if (window) {
    window.classList.toggle("maximized")
  }
}

function bringToFront(e) {
  const window = e.target.closest(".window")
  if (window) {
    window.style.zIndex = ++zIndexCounter
  }
}

// Funções da barra de tarefas
function addToTaskbar(windowId) {
  const taskbarPrograms = document.getElementById("taskbarPrograms")
  const window = document.getElementById(windowId)
  const title = window.querySelector(".title-bar-text").textContent

  // Verificar se já existe
  if (document.getElementById("taskbar-" + windowId)) {
    return
  }

  const taskbarItem = document.createElement("div")
  taskbarItem.className = "taskbar-program"
  taskbarItem.id = "taskbar-" + windowId
  taskbarItem.textContent = title
  taskbarItem.onclick = () => toggleWindow(windowId)

  taskbarPrograms.appendChild(taskbarItem)
}

function removeFromTaskbar(windowId) {
  const taskbarItem = document.getElementById("taskbar-" + windowId)
  if (taskbarItem) {
    taskbarItem.remove()
  }
}

function toggleWindow(windowId) {
  const window = document.getElementById(windowId)
  const taskbarItem = document.getElementById("taskbar-" + windowId)

  if (window.classList.contains("minimized") || window.classList.contains("hidden")) {
    window.classList.remove("minimized", "hidden")
    bringToFront({ target: window })
    taskbarItem.classList.add("active")
  } else {
    window.classList.add("minimized")
    taskbarItem.classList.remove("active")
  }
}

// Funções de arrastar
function startDragIcon(e) {
  if (e.button !== 0) return // Apenas botão esquerdo

  draggedElement = this
  const rect = this.getBoundingClientRect()
  dragOffset.x = e.clientX - rect.left
  dragOffset.y = e.clientY - rect.top

  document.addEventListener("mousemove", dragIcon)
  document.addEventListener("mouseup", stopDragIcon)

  e.preventDefault()
}

function dragIcon(e) {
  if (!draggedElement) return

  const desktop = document.querySelector(".desktop")
  const desktopRect = desktop.getBoundingClientRect()

  let newX = e.clientX - desktopRect.left - dragOffset.x
  let newY = e.clientY - desktopRect.top - dragOffset.y

  // Limitar às bordas da área de trabalho
  newX = Math.max(0, Math.min(newX, desktopRect.width - 80))
  newY = Math.max(0, Math.min(newY, desktopRect.height - 80))

  draggedElement.style.left = newX + "px"
  draggedElement.style.top = newY + "px"
}

function stopDragIcon() {
  draggedElement = null
  document.removeEventListener("mousemove", dragIcon)
  document.removeEventListener("mouseup", stopDragIcon)
}

function startDragWindow(e) {
  if (e.button !== 0) return // Apenas botão esquerdo

  const window = e.target.closest(".window")
  if (window.classList.contains("maximized")) return

  draggedElement = window
  const rect = window.getBoundingClientRect()
  dragOffset.x = e.clientX - rect.left
  dragOffset.y = e.clientY - rect.top

  document.addEventListener("mousemove", dragWindow)
  document.addEventListener("mouseup", stopDragWindow)

  e.preventDefault()
}

function dragWindow(e) {
  if (!draggedElement) return

  let newX = e.clientX - dragOffset.x
  let newY = e.clientY - dragOffset.y

  // Limitar às bordas da tela
  newX = Math.max(0, Math.min(newX, window.innerWidth - 200))
  newY = Math.max(0, Math.min(newY, window.innerHeight - 100))

  draggedElement.style.left = newX + "px"
  draggedElement.style.top = newY + "px"
}

function stopDragWindow() {
  draggedElement = null
  document.removeEventListener("mousemove", dragWindow)
  document.removeEventListener("mouseup", stopDragWindow)
}

// Funções do menu iniciar
function toggleStartMenu() {
  const startMenu = document.getElementById("startMenu")
  startMenu.classList.toggle("hidden")
}

// Função do relógio
function updateClock() {
  const now = new Date()
  const timeString = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
  document.getElementById("clock").textContent = timeString
}

// Atalhos de teclado
document.addEventListener("keydown", (e) => {
  // Ctrl + Alt + Del (simulado)
  if (e.ctrlKey && e.altKey && e.key === "Delete") {
    alert("Ctrl + Alt + Del pressionado!")
    e.preventDefault()
  }

  // Windows key (simulado com F1)
  if (e.key === "F1") {
    toggleStartMenu()
    e.preventDefault()
  }

  // Alt + Tab (simulado)
  if (e.altKey && e.key === "Tab") {
    // Implementar alternância entre janelas
    e.preventDefault()
  }
})
