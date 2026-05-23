const sidebarFooter = document.getElementById("sidebarfooter")
const userMenuFooter = document.getElementById("usermenufooter")
const userMenu = document.getElementById("usermenu")

if (!sidebarFooter || !userMenuFooter || !userMenu) {
    console.warn("Menu elements not found")
} else {
    sidebarFooter.addEventListener("click", (e) => {
        e.preventDefault()
        userMenu.style.opacity = "1"
        userMenu.classList.add("open")
    })

    userMenuFooter.addEventListener("click", (e) => {
        e.preventDefault()
        userMenu.style.opacity = "0"
        userMenu.classList.remove("open")
    })
}