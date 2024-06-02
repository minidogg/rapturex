const pagesEl = q("#pages");

//load tab contents
async function loadTab(tab){
    //regenerate iframe
    tab.iframe.remove()
    tab.iframe = document.createElement("iframe")
    tab.iframe.classList.add("page")
    pagesEl.appendChild(tab.iframe)

    //get the pages actual ip
    let url = await getDomainIp(tab.url)

    //get the pages data
    let index = await fetchData(url)

    //turn the html into a good boy.
    index = convertHtmlToGood(index)
    console.log(index)

    tab.iframe.contentWindow.document.write(index) 
}

//convert bad html to good html
function convertHtmlToGood(html){
    let newLineReplacer = "new_line_replacer_"+qquery.random.hex(16)
    html = html.replaceAll("\n",newLineReplacer)  

    

    return html.replaceAll(newLineReplacer,"\n")
}