const main = document.querySelector('main');
const url = location.pathname;
document.addEventListener('DOMContentLoaded',async () => {
    await LoadHeader_Footer();
    await LoadPage(main,url);
    await InitAccessbility['header']();
    if(InitAccessbility[url]){
        await InitAccessbility[url]();
    }
})
async function LoadHeader_Footer(){
    try{
        let response = await fetch('/api/theme',{
            method:"GET"
        })
        let jsonData = await response.json();
        let header = jsonData.header;
        let footer = jsonData.footer;
        let root = jsonData.root;
        await LoadHeader_FooterContent(header,footer,root);
    }catch(err){
        console.log(err);
    }
}
async function LoadHeader_FooterContent(headerData,footerData,root){
    LoadRootData(JSON.parse(root));
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    header.innerHTML = headerData.data;
    footer.innerHTML = footerData.data;
    const header_data = headerData.content;
    const footer_data = footerData.content;
    await LoadPageContent(header,header_data)
    await LoadPageContent(footer,footer_data)
    
}
async function LoadPage(container,url){
    try{
        let response = await fetch("api",{
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({url:url})
        })
        let json = await response.json();
        LoadPageContent(container,json.data);
    }catch(err){
        console.log(err);
        Load404Page();
    }
}
function LoadPageContent(container,json){
    let data = JSON.parse(json);
    const elements = container.querySelectorAll('[data-content]');  
    elements.forEach(element => {
        let jsonData = data[element.getAttribute('data-content')]
        if(jsonData)
            LoadElement(element,jsonData);
    })
}
function LoadRootData(root){
    for(const [key,value] of Object.entries(root))
        document.documentElement.style.setProperty(key,value)
}
function LoadElement(element,json){
    const type = json.type || 'none';
    switch(type){
        case 'text':
            let textContent = json.textContent || "Demo";
            element.innerHTML = textContent;
        break;
        case 'image':
            element.src = json.src || '/';
            element.width = json.width || 100;
            element.height = json.height || 100;
            element.alt = json.alt || 'Demo';
            element.title = json.alt || 'Demo';
        break
        case 'none':

        break;
        default:

        break;
    }
    const attrs = json.attrs || {};
    for(const [key,value] of Object.entries(attrs)){
        if(key === 'class')
        {
            const classElements = value.split(' ');
            classElements.forEach(classElement => element.classList.add(classElement))
        }
        else
        {
            element.setAttribute(key,value);
        }
    }
}
function Load404Page(){
  window.location.href = '/404';
}
const InitAccessbility = {
    "header":async function(){
        const header_nav_links = document.getElementById('header_nav_links');
        document.querySelectorAll('.header-toggle').forEach(header_toggle => {
            header_toggle.addEventListener('click',() => {
                header_nav_links.classList.toggle('show');
            })
        });
    },
    "/":async function(){
        
    }
}