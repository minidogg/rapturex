//load tab contents
async function loadTab(tab){
    let url = await getDomainIp(tab.url)

    let index = await fetchData(url)

    tab.iframe.contentWindow.document.write(index) 
}