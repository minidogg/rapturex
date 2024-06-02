let defaultCss = ""
async function getDefaultCss(){
    if(defaultCss!="")return defaultCss
}

//elements
const urlForm = q("#urlForm");
const urlEl = q("#url");
const tabsEl = q("#tabs");

//variables
let tabs = [];
let currentTab = 0;



//select tab
function selectTab(id){
    tabs[currentTab].iframe.style.display = "none"
    currentTab = id
    tabs[currentTab].iframe.style.display = "block"
    urlEl.value = tabs[currentTab].url
}




//add tab function
async function addTab(url="dingle.it"){
    let tab = {url:url}
    tab.iframe = document.createElement("iframe")
    tab.iframe.classList.add("page")

    tab.tab = document.createElement("div")
    tab.tab.classList.add("tab")
    tab.tab.innerHTML = '<img class="favicon" src="/loading.gif"><span></span>'
    tab.tab.querySelector("span").textContent = url

    pagesEl.appendChild(tab.iframe)
    tabsEl.appendChild(tab.tab)

    tabs.push(tab)
    await loadTab(tab)
    selectTab(tabs.length-1)
}
addTab()

//change url
urlForm.onsubmit = (ev)=>{
    ev.preventDefault()

}